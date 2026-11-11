/*
 * ux_probe.js: measure a rendered web page for the Laws of UX and Laws of UI audit.
 *
 * Read-only. Runs in the page, changes nothing, sends nothing anywhere.
 * The whole file is one expression that evaluates to a plain object, so it works with:
 *   - Playwright / Puppeteer:  await page.evaluate(fs.readFileSync('ux_probe.js', 'utf8'))
 *   - Selenium:                driver.execute_script('return ' + source)
 *   - Browser console:         paste it, or wrap in copy(JSON.stringify(<paste>, null, 2))
 *   - Any agent browser tool that evaluates JavaScript in the page
 *
 * Run it once per viewport (desktop, then about 375 x 812) and once per screen or state.
 * Field meanings are documented in references/web.md. If your tool takes only a string of JavaScript,
 * run scripts/serve.py and load this file by URL instead of pasting it.
 */
(() => {
  const CAP = 25;            // max rows per list, to keep the output small
  const MAX_NODES = 6000;    // stop scanning very large pages
  // Layout viewport. On phones, innerWidth grows when the browser zooms out to fit overflowing content,
  // so clientWidth is the honest measure of the intended width.
  const vw = document.documentElement.clientWidth || window.innerWidth || 0;
  const vh = document.documentElement.clientHeight || window.innerHeight || 0;
  const warnings = [];
  if (!vw || !vh) warnings.push('Viewport reported as 0x0 (hidden tab, or headless browser with no window size). ' +
    'Sizes are still valid, but touchLayout, screensTall, horizontalOverflowPx and the aboveFold flags are not. ' +
    'Show the tab or set a viewport size, then run again.');
  const touchLayout = (window.matchMedia && matchMedia('(pointer: coarse)').matches) || (vw > 0 && vw < 768);

  const round = n => Math.round(n * 10) / 10;
  const style = el => getComputedStyle(el);
  const rectOf = el => el.getBoundingClientRect();
  const isVisible = el => {
    const r = rectOf(el), s = style(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && parseFloat(s.opacity) > 0.05;
  };
  const textOf = el => {
    const toggle = el.tagName === 'INPUT' && /^(checkbox|radio)$/.test(el.type);
    const viaLabel = () => {
      const l = el.closest('label') || (el.id && document.querySelector('label[for="' + CSS.escape(el.id) + '"]'));
      return l ? l.innerText : '';
    };
    const own = el.getAttribute('aria-label') ||
      (toggle || el.tagName === 'SELECT' ? (viaLabel() || el.getAttribute('name')) : el.innerText || el.value) ||
      el.getAttribute('title') || el.getAttribute('alt') || el.getAttribute('placeholder') || '';
    return own.trim().replace(/\s+/g, ' ').slice(0, 50);
  };
  const selectorOf = el => {
    const parts = [];
    for (let n = el; n && n.nodeType === 1 && parts.length < 3; n = n.parentElement) {
      let p = n.tagName.toLowerCase();
      if (n.id) { parts.unshift(p + '#' + n.id); break; }
      const cls = (n.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.');
      if (cls) p += '.' + cls;
      if (n === el) {   // make the leaf unambiguous among its siblings
        const name = n.getAttribute('name');
        const twins = n.parentElement ? Array.from(n.parentElement.children).filter(c => c.tagName === n.tagName) : [];
        if (name) p += '[name="' + name + '"]';
        else if (twins.length > 1) p += ':nth-of-type(' + (twins.indexOf(n) + 1) + ')';
      }
      parts.unshift(p);
    }
    return parts.join(' > ');
  };

  // ---- color helpers (canvas normalizes any CSS color syntax to RGBA) ----
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const colorCache = new Map();
  const rgba = css => {
    if (colorCache.has(css)) return colorCache.get(css);
    let out = [0, 0, 0, 0];
    if (ctx) {
      ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#000'; ctx.fillStyle = css; ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      out = [d[0], d[1], d[2], d[3] / 255];
    }
    colorCache.set(css, out); return out;
  };
  const over = (top, bottom) => {
    const a = top[3] + bottom[3] * (1 - top[3]);
    if (a === 0) return [0, 0, 0, 0];
    return [0, 1, 2].map(i => (top[i] * top[3] + bottom[i] * bottom[3] * (1 - top[3])) / a).concat(a);
  };
  const luminance = c => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const contrast = (a, b) => { const l1 = luminance(a), l2 = luminance(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const hex = c => '#' + [0, 1, 2].map(i => Math.round(c[i]).toString(16).padStart(2, '0')).join('');
  const backgroundOf = el => {
    let acc = [0, 0, 0, 0], uncertain = false;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const s = style(n);
      if (s.backgroundImage && s.backgroundImage !== 'none') uncertain = true;
      acc = over(acc, rgba(s.backgroundColor));
      if (acc[3] >= 0.99) break;
    }
    return { color: over(acc, [255, 255, 255, 1]), uncertain };
  };

  const tally = () => ({ n: {}, ex: {} });
  const add = (t, k, el) => { t.n[k] = (t.n[k] || 0) + 1; if (!(k in t.ex) && el) t.ex[k] = selectorOf(el); };
  const topOf = (t, n) => Object.entries(t.n).sort((a, b) => b[1] - a[1]).slice(0, n)
    .map(([value, count]) => ({ value, count, example: t.ex[value] || null }));
  const scrollY0 = window.scrollY || 0;
  const pageBg = over(rgba(style(document.body).backgroundColor), rgba(style(document.documentElement).backgroundColor));
  const pageBackgroundSet = pageBg[3] >= 0.99;
  if (!pageBackgroundSet) warnings.push('The page sets no background color. Contrast was computed against white, which is what a ' +
    'normal browser shows; in a dark webview or embedded pane the text may be unreadable.');

  // ---- 1. interactive targets (Fitts) ----
  const INTERACTIVE = 'a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],' +
    '[role=tab],[role=menuitem],[role=checkbox],[role=radio],[role=switch],[onclick],[tabindex]:not([tabindex="-1"])';
  const targets = Array.from(document.querySelectorAll(INTERACTIVE)).filter(isVisible).slice(0, 600).map(el => {
    const r = rectOf(el), s = style(el);
    // Exempt only links that sit inside a sentence: the parent must carry text of its own, and never in navigation.
    const ownText = p => Array.from(p.childNodes).filter(n => n.nodeType === 3).map(n => n.nodeValue.trim()).join('').length;
    const inlineLink = el.tagName === 'A' && s.display === 'inline' && !!el.parentElement &&
      !el.closest('nav,[role=navigation],[role=menu],[role=menubar],[role=tablist]') && ownText(el.parentElement) >= 15;
    const wrappedByLabel = !!el.closest('label') || !!(el.id && document.querySelector('label[for="' + CSS.escape(el.id) + '"]'));
    return { el, r, w: round(r.width), h: round(r.height), minSide: round(Math.min(r.width, r.height)), inlineLink, wrappedByLabel };
  });
  const gap = (a, b) => {
    const dx = Math.max(0, Math.max(a.left, b.left) - Math.min(a.right, b.right));
    const dy = Math.max(0, Math.max(a.top, b.top) - Math.min(a.bottom, b.bottom));
    return Math.sqrt(dx * dx + dy * dy);
  };
  const nearest = t => {
    let best = Infinity;
    for (const o of targets) {
      if (o === t || o.el.contains(t.el) || t.el.contains(o.el)) continue;
      const g = gap(t.r, o.r); if (g < best) best = g;
    }
    return best === Infinity ? null : round(best);
  };
  const below44 = targets.filter(t => !t.inlineLink && t.minSide < 44);
  const sizeIssues = below44.filter(t => t.minSide < (touchLayout ? 44 : 24)).map(t => ({
    t, level: t.minSide < 24 ? 'fail (<24px)' : 'warn (<44px)', nearestTargetGapPx: nearest(t)
  }));
  // Siblings of the same kind (14 nav links, 12 text inputs) become one row with a count.
  const range = a => { const lo = Math.min(...a), hi = Math.max(...a); return lo === hi ? lo : lo + '-' + hi; };
  const groups = new Map();
  sizeIssues.forEach(i => {
    const el = i.t.el, cls = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.');
    const sel = (el.parentElement ? selectorOf(el.parentElement) + ' > ' : '') + el.tagName.toLowerCase() + (cls ? '.' + cls : '');
    const key = sel + '|' + i.level;
    if (!groups.has(key)) groups.set(key, { selector: sel, level: i.level, items: [] });
    groups.get(key).items.push(i);
  });
  const smallTargetGroups = Array.from(groups.values()).map(g => {
    const gaps = g.items.map(i => i.nearestTargetGapPx).filter(v => v !== null);
    return { selector: g.items.length === 1 ? selectorOf(g.items[0].t.el) : g.selector, count: g.items.length,
      examples: g.items.slice(0, 4).map(i => textOf(i.t.el)), width: range(g.items.map(i => i.t.w)), height: range(g.items.map(i => i.t.h)),
      level: g.level, smallestGapPx: gaps.length ? Math.min(...gaps) : null,
      labelExtendsHitArea: g.items.some(i => i.t.wrappedByLabel) };
  }).sort((a, b) => (a.level > b.level ? 1 : a.level < b.level ? -1 : b.count - a.count));

  // ---- 2. choices per decision point (Hick, Choice Overload, Serial Position) ----
  const navs = Array.from(document.querySelectorAll('nav,[role=navigation],[role=tablist],[role=menu],[role=menubar]'))
    .filter(isVisible).map(n => {
      const items = Array.from(n.querySelectorAll('a[href],button,[role=tab],[role=menuitem]')).filter(isVisible);
      return { selector: selectorOf(n), itemCount: items.length, first: items[0] ? textOf(items[0]) : null,
        last: items.length ? textOf(items[items.length - 1]) : null };
    }).filter(n => n.itemCount > 0).slice(0, CAP);
  const selects = Array.from(document.querySelectorAll('select')).filter(isVisible)
    .map(s => ({ selector: selectorOf(s), optionCount: s.options.length })).slice(0, CAP);
  const radioGroups = {};
  document.querySelectorAll('input[type=radio]').forEach(r => { if (isVisible(r)) radioGroups[r.name || '(unnamed)'] = (radioGroups[r.name || '(unnamed)'] || 0) + 1; });

  // ---- 3. buttons: style consistency and competing emphasis (Similarity, Von Restorff) ----
  const buttons = targets.filter(t => t.el.matches('button,[role=button],input[type=submit],input[type=button],a[class*="btn" i],a[class*="button" i]'));
  const styleGroups = {};
  buttons.forEach(t => {
    const s = style(t.el), bg = rgba(s.backgroundColor);
    const key = [bg[3] < 0.05 ? 'transparent' : hex(bg), hex(rgba(s.color)), s.borderRadius, s.fontSize, s.fontWeight,
      parseFloat(s.borderTopWidth) > 0 ? 'border' : 'noborder'].join(' | ');
    (styleGroups[key] = styleGroups[key] || []).push(textOf(t.el));
  });
  const buttonStyles = Object.entries(styleGroups).map(([k, v]) => ({ style: 'bg | text | radius | size | weight | border = ' + k, count: v.length, examples: v.slice(0, 3) }))
    .sort((a, b) => b.count - a.count).slice(0, CAP);
  const standsOut = el => {   // solid background that contrasts with what is behind the button
    const bg = rgba(style(el).backgroundColor);
    return bg[3] > 0.5 && el.parentElement && contrast(bg, backgroundOf(el.parentElement).color) >= 1.5;
  };
  const emphasized = buttons.filter(t => standsOut(t.el))
    .map(t => ({ label: textOf(t.el), aboveFold: vh ? (t.r.top + scrollY0 < vh) : null }));

  // ---- 4. forms (Postel, Parkinson, Proximity, Chunking, Tesler) ----
  const hasLabel = el => !!(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.closest('label') ||
    (el.id && document.querySelector('label[for="' + CSS.escape(el.id) + '"]')));
  const fieldSel = 'input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=reset]):not([type=image]),select,textarea';
  const allFields = Array.from(document.querySelectorAll(fieldSel)).filter(isVisible);
  const fieldIssues = allFields.map(f => {
    const issues = [];
    const type = (f.getAttribute('type') || f.tagName).toLowerCase();
    if (!hasLabel(f)) issues.push(f.getAttribute('placeholder') ? 'no associated label (placeholder only)' : 'no associated label');
    if (['text', 'email', 'tel', 'password', 'input', 'url', 'number'].includes(type) && !f.getAttribute('autocomplete')) issues.push('no autocomplete attribute');
    const hint = ((f.name || '') + ' ' + (f.id || '') + ' ' + (f.getAttribute('placeholder') || '')).toLowerCase();
    if (type === 'text' || type === 'input') {
      if (/e-?mail/.test(hint)) issues.push('email field uses type=text');
      if (/phone|tel|mobile|hp|whatsapp/.test(hint)) issues.push('phone field uses type=text');
      if (/zip|postal|otp|code|card|cvv|kode/.test(hint) && !f.getAttribute('inputmode')) issues.push('numeric field has no inputmode');
    }
    return { selector: selectorOf(f), type, issues };
  }).filter(f => f.issues.length);
  const forms = Array.from(document.querySelectorAll('form')).filter(isVisible).map(f => {
    const fields = Array.from(f.querySelectorAll(fieldSel)).filter(isVisible);
    const method = (f.getAttribute('method') || 'get').toLowerCase();
    return { selector: selectorOf(f), method, fieldCount: fields.length, requiredCount: fields.filter(x => x.required).length,
      sections: f.querySelectorAll('fieldset,h2,h3,h4,legend').length,
      submitButtons: f.querySelectorAll('button:not([type=button]):not([type=reset]),input[type=submit]').length,
      resetButtons: f.querySelectorAll('button[type=reset],input[type=reset]').length,
      passwordSentInUrl: method === 'get' && !!f.querySelector('input[type=password]') };
  }).slice(0, CAP);
  // Boxes ticked before the user touched anything: check each for a pre-selected cost or consent (dark pattern).
  const preChecked = Array.from(document.querySelectorAll('input[type=checkbox]')).filter(c => c.defaultChecked && isVisible(c))
    .map(c => ({ selector: selectorOf(c), label: textOf(c) })).slice(0, CAP);

  // ---- 5. text: contrast, size, line length, walls of text (Cognitive Load, Chunking) ----
  const contrastFails = new Map(), smallText = new Map(), longLines = [], walls = [];
  const fontSizes = {}, fontFamilies = {}, textColors = tally(), edges = tally(), tightLines = [];
  let scanned = 0, minInset = Infinity, minInsetEl = null;
  const edgeBlocks = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seenEl = new Set();
  for (let node = walker.nextNode(); node && scanned < MAX_NODES; node = walker.nextNode()) {
    const txt = node.nodeValue.trim();
    const el = node.parentElement;
    if (!txt || !el || seenEl.has(el) || /^(SCRIPT|STYLE|NOSCRIPT|OPTION)$/.test(el.tagName) || !isVisible(el)) continue;
    seenEl.add(el); scanned++;
    const s = style(el), size = parseFloat(s.fontSize), bold = parseInt(s.fontWeight, 10) >= 700;
    fontSizes[size] = (fontSizes[size] || 0) + 1;
    const fam = s.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    fontFamilies[fam] = (fontFamilies[fam] || 0) + 1;
    if (size < 12) { const k = size + 'px'; if (!smallText.has(k)) smallText.set(k, { fontSize: k, selector: selectorOf(el), sample: txt.slice(0, 40) }); }
    const fg0 = rgba(s.color), bg = backgroundOf(el), fg = over(fg0, bg.color);
    add(textColors, hex(fg), el);
    const left = rectOf(el).left + parseFloat(s.paddingLeft) + parseFloat(s.borderLeftWidth);
    if (left >= 0 && left < minInset) { minInset = left; minInsetEl = el; }
    // Alignment: the content edge of the block that holds this text (a nav bar counts once, not once per link).
    let block = el; while (block.parentElement && /^inline/.test(style(block).display)) block = block.parentElement;
    if (!edgeBlocks.has(block) && !block.closest('button,select,label')) {
      edgeBlocks.add(block);
      const bs = style(block);
      add(edges, Math.round(rectOf(block).left + parseFloat(bs.paddingLeft) + parseFloat(bs.borderLeftWidth)), block);
    }
    const ratio = contrast(fg, bg.color), need = (size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5;
    if (ratio < need) {
      const k = hex(fg) + hex(bg.color) + need;
      if (!contrastFails.has(k)) contrastFails.set(k, { ratio: round(ratio), required: need, text: hex(fg), background: hex(bg.color),
        backgroundUncertain: bg.uncertain, selector: selectorOf(el), sample: txt.slice(0, 40), occurrences: 0 });
      contrastFails.get(k).occurrences++;
    }
  }
  Array.from(document.querySelectorAll('p,li,dd,blockquote')).filter(isVisible).slice(0, 800).forEach(el => {
    const len = (el.innerText || '').trim().length; if (len < 120) return;
    const s = style(el), r = rectOf(el), size = parseFloat(s.fontSize);
    const lh = parseFloat(s.lineHeight) || size * 1.2, lines = Math.max(1, Math.round(r.height / lh)), cpl = Math.round(len / lines);
    if (cpl > 90) longLines.push({ selector: selectorOf(el), charsPerLine: cpl, lines,
      widerThanViewport: vw ? r.width > vw : null });
    if (len > 600) walls.push({ selector: selectorOf(el), characters: len, lines });
    const ratio = s.lineHeight === 'normal' ? null : parseFloat(s.lineHeight) / size;
    if (lines >= 3 && (ratio === null || ratio < 1.3)) tightLines.push({ selector: selectorOf(el),
      lineHeight: ratio === null ? 'normal (about 1.2)' : round(ratio), lines });
  });

  // ---- 6. structure, attention, layout ----
  const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).filter(isVisible)
    .map(h => ({ level: +h.tagName[1], text: textOf(h) }));
  let fixedOrSticky = 0, checked = 0, moving = 0;
  const spacing = tally(), bgColors = tally(), radii = tally(), shadows = tally(), fieldWidths = tally();
  for (const el of document.body.querySelectorAll('*')) {
    if (++checked > MAX_NODES) break;
    if (/^(SCRIPT|STYLE|NOSCRIPT|OPTION|BR)$/.test(el.tagName) || !isVisible(el)) continue;
    const cs = style(el);
    if (cs.position === 'fixed' || cs.position === 'sticky') fixedOrSticky++;
    const used = new Set();   // each value once per element, so four equal paddings do not count four times
    ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'rowGap', 'columnGap']
      .forEach(k => { const v = parseFloat(cs[k]); if (v > 2 && v < 200) used.add(round(v)); });
    used.forEach(v => add(spacing, v, el));
    const bgc = rgba(cs.backgroundColor), hasBorder = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none';
    if (bgc[3] > 0.5) add(bgColors, hex(bgc), el);
    if ((bgc[3] > 0.5 || hasBorder) && el !== document.body) add(radii, cs.borderTopLeftRadius, el);   // boxes only, square ones included
    if (cs.boxShadow && cs.boxShadow !== 'none') add(shadows, cs.boxShadow, el);
    if ((cs.transitionDuration && !/^(0s(, )?)+$/.test(cs.transitionDuration)) || (cs.animationName && cs.animationName !== 'none')) moving++;
  }
  const spacingTotal = Object.values(spacing.n).reduce((a, b) => a + b, 0);
  const offScale = Object.entries(spacing.n).filter(([v]) => Number(v) % 4 !== 0);
  const offScaleCount = offScale.reduce((a, [, c]) => a + c, 0);

  // alignment: images and fields join the text blocks collected above; field widths show ragged right edges
  Array.from(document.querySelectorAll('img,input:not([type=hidden]):not([type=checkbox]):not([type=radio]),select,textarea'))
    .filter(isVisible).slice(0, 800).forEach(el => {
      add(edges, Math.round(rectOf(el).left), el);
      if (el.tagName !== 'IMG') add(fieldWidths, Math.round(rectOf(el).width), el);
    });

  // stylesheets: removed focus outlines, reduced-motion and dark-mode support
  const focusRemoved = []; let reducedMotionRule = false, colorSchemeRule = false, unreadableSheets = 0;
  const walkRules = rules => {
    for (const r of Array.from(rules || [])) {
      const cond = (r.conditionText || (r.media && r.media.mediaText) || '');
      if (/prefers-reduced-motion/.test(cond)) reducedMotionRule = true;
      if (/prefers-color-scheme/.test(cond)) colorSchemeRule = true;
      if (r.selectorText && /:focus/.test(r.selectorText) && r.style) {
        const noOutline = r.style.outlineStyle === 'none' || r.style.outlineWidth === '0px' || r.style.outlineWidth === '0';
        const replaced = r.style.boxShadow || r.style.borderColor || r.style.border || r.style.backgroundColor || r.style.textDecoration;
        if (noOutline && !replaced && focusRemoved.length < 10) focusRemoved.push(r.selectorText.slice(0, 80));
      }
      if (r.cssRules) walkRules(r.cssRules);
    }
  };
  Array.from(document.styleSheets).forEach(sh => { try { walkRules(sh.cssRules); } catch (e) { unreadableSheets++; } });

  // images (Imagery and Media)
  const dpr = window.devicePixelRatio || 1, imageIssues = [];
  Array.from(document.images).filter(isVisible).slice(0, 300).forEach(img => {
    const r = rectOf(img), issues = [];
    if (!img.hasAttribute('alt')) issues.push('no alt attribute');
    if (img.naturalWidth && img.naturalHeight && !/\.svg(\?|$)/i.test(img.currentSrc || img.src)) {
      const natural = img.naturalWidth / img.naturalHeight, shown = r.width / r.height;
      if (style(img).objectFit === 'fill' && Math.abs(natural - shown) / natural > 0.05) issues.push('stretched: natural ratio ' + round(natural) + ', shown ' + round(shown));
      if (r.width * dpr > img.naturalWidth * 1.2) issues.push('upscaled: ' + img.naturalWidth + 'px source shown at ' + Math.round(r.width * dpr) + ' device px');
    }
    if (!img.hasAttribute('width') && !img.hasAttribute('height') && style(img).aspectRatio === 'auto') issues.push('no reserved size (layout may shift)');
    if (issues.length) imageIssues.push({ selector: selectorOf(img), issues });
  });

  const vp = document.querySelector('meta[name=viewport]');
  const vpContent = vp ? (vp.getAttribute('content') || '') : null;
  const zoomBlocked = !!vpContent && (/user-scalable\s*=\s*(no|0)/i.test(vpContent) || /maximum-scale\s*=\s*1(\.0+)?\s*(,|$)/i.test(vpContent));
  const doc = document.scrollingElement || document.documentElement;
  const contentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
  const overflowX = vw ? Math.max(0, doc.scrollWidth - vw) : null;
  if (document.visibilityState !== 'visible') warnings.push('The tab is not visible, so paint timing (firstContentfulPaint) is unreliable.');
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) warnings.push('Served from localhost: load timing does not represent production.');
  if (overflowX && touchLayout) warnings.push('Content is ' + overflowX + 'px wider than the viewport; phones will zoom out or scroll sideways.');
  const nav = performance.getEntriesByType('navigation')[0];
  const paint = name => { const e = performance.getEntriesByName(name)[0]; return e ? Math.round(e.startTime) : null; };
  if (paint('first-contentful-paint') === null) warnings.push('No paint timing was recorded (background or embedded tab); firstContentfulPaint is null.');

  return {
    page: { url: location.origin + location.pathname, title: document.title, viewport: vw + 'x' + vh, touchLayout,
      screensTall: vh ? round(contentHeight / vh) : null, horizontalOverflowPx: overflowX },
    warnings,
    summary: {
      interactiveTargets: targets.length,
      targetsBelow24px: sizeIssues.filter(i => i.level.startsWith('fail')).length,
      targetsBelow44px: below44.length,
      crowdedSmallTargets: sizeIssues.filter(i => i.nearestTargetGapPx !== null && i.nearestTargetGapPx < 8).length,
      navigationGroups: navs.length, largestNavItemCount: navs.reduce((m, n) => Math.max(m, n.itemCount), 0),
      buttons: buttons.length, distinctButtonStyles: Object.keys(styleGroups).length, emphasizedButtons: emphasized.length,
      emphasizedButtonsAboveFold: vh ? emphasized.filter(b => b.aboveFold).length : null,
      formFields: allFields.length, fieldsWithIssues: fieldIssues.length, preCheckedCheckboxes: preChecked.length,
      formsSendingPasswordInUrl: forms.filter(f => f.passwordSentInUrl).length,
      contrastFailures: contrastFails.size, textBelow12px: smallText.size,
      distinctFontSizes: Object.keys(fontSizes).length, distinctFontFamilies: Object.keys(fontFamilies).length,
      h1Count: headings.filter(h => h.level === 1).length, wallsOfText: walls.length, linesOver90Chars: longLines.length,
      fixedOrStickyElements: fixedOrSticky, runningAnimations: document.getAnimations ? document.getAnimations().length : null,
      distinctSpacingValues: Object.keys(spacing.n).length,
      spacingOffScalePercent: spacingTotal ? Math.round(offScaleCount / spacingTotal * 100) : null,
      distinctTextColors: Object.keys(textColors.n).length, distinctBackgroundColors: Object.keys(bgColors.n).length,
      distinctCornerRadii: Object.keys(radii.n).length, distinctShadows: Object.keys(shadows.n).length,
      distinctLeftEdges: Object.keys(edges.n).length, distinctFieldWidths: Object.keys(fieldWidths.n).length,
      tightLineHeightBlocks: tightLines.length, pageBackgroundSet,
      focusOutlineRemovedRules: focusRemoved.length, imagesWithIssues: imageIssues.length, zoomBlocked
    },
    timingMs: nav ? { firstByte: Math.round(nav.responseStart), firstContentfulPaint: paint('first-contentful-paint'),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd) } : null,
    smallTargets: smallTargetGroups.slice(0, CAP),
    navigation: navs, selects, radioGroups,
    buttonStyles,
    emphasizedButtons: emphasized.slice(0, CAP),
    forms, preCheckedCheckboxes: preChecked, fieldIssues: fieldIssues.slice(0, CAP),
    contrastFailures: Array.from(contrastFails.values()).sort((a, b) => a.ratio - b.ratio).slice(0, CAP),
    smallText: Array.from(smallText.values()).slice(0, CAP),
    fontSizesPx: fontSizes, fontFamilies,
    longLines: longLines.slice(0, CAP), wallsOfText: walls.slice(0, CAP),
    headings: headings.slice(0, 40),
    ui: {
      pageBackgroundSet,
      spacing: { topValuesPx: topOf(spacing, 12),
        offScaleValuesPx: offScale.sort((x, y) => y[1] - x[1]).slice(0, 10).map(([value, count]) => ({ value: Number(value), count, example: spacing.ex[value] || null })) },
      leftEdgesPx: topOf(edges, 10), fieldWidthsPx: topOf(fieldWidths, 8),
      textColors: topOf(textColors, 12), backgroundColors: topOf(bgColors, 12),
      cornerRadii: topOf(radii, 10), shadows: topOf(shadows, 6).map(x => ({ value: x.value.slice(0, 70), count: x.count, example: x.example })),
      tightLineHeight: tightLines.slice(0, CAP),
      minTextInsetLeftPx: minInset === Infinity ? null : round(minInset), minTextInsetAt: minInsetEl ? selectorOf(minInsetEl) : null,
      focus: { outlineRemovedWithoutReplacement: focusRemoved, unreadableStylesheets: unreadableSheets },
      motion: { elementsWithTransitionOrAnimation: moving, hasReducedMotionRule: moving ? reducedMotionRule : null },
      theme: { hasColorSchemeRule: colorSchemeRule },
      images: imageIssues.slice(0, CAP),
      viewportMeta: vpContent, zoomBlocked
    }
  };
})()
