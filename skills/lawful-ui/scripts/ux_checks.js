/*
 * ux_checks.js: helpers for the checks the probe cannot do by reading alone.
 *
 * Evaluate this file once in the page (same ways as ux_probe.js). It defines window.__lawful and returns
 * the list of helpers. Unlike the probe, these ACT on the page: click() really clicks, and aid() injects a
 * temporary style. Nothing is saved; a reload removes everything. Mind side effects before clicking on a
 * live product (see SKILL.md).
 *
 *   await __lawful.click('button.primary')   did anything happen after a click? (dead-control test)
 *   __lawful.focusTour()                     which tab stops show no visible focus change
 *   __lawful.stateRules()                    which state styles (:hover, :active, :focus, :disabled) exist
 *   __lawful.aid('grayscale' | 'textSpacing' | 'off')   temporary visual aid for U09 and U06/U20
 *   __lawful.clipped()                       text that is cut off (run after aid('textSpacing') or at 200% zoom)
 */
(() => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const visible = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const sel = el => {
    if (el.id) return el.tagName.toLowerCase() + '#' + el.id;
    const cls = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.');
    const name = el.getAttribute('name');
    const twins = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.tagName === el.tagName) : [];
    return el.tagName.toLowerCase() + (cls ? '.' + cls : '') + (name ? '[name="' + name + '"]' : twins.length > 1 ? ':nth-of-type(' + (twins.indexOf(el) + 1) + ')' : '');
  };

  const api = {
    // Click and watch for one second. A control with no DOM change and no navigation is dead.
    // If the click navigates away, the page unloads and this never returns: that is itself the answer (not dead).
    async click(selector, waitMs = 1000) {
      const el = document.querySelector(selector);
      if (!el) return { selector, error: 'not found' };
      const url = location.href, t0 = performance.now();
      let changes = 0, first = null;
      const mo = new MutationObserver(list => { changes += list.length; if (first === null) first = Math.round(performance.now() - t0); });
      mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
      el.click();
      await sleep(waitMs);
      mo.disconnect();
      const urlChanged = location.href !== url;
      return { selector, domChanges: changes, msToFirstChange: first, urlChanged,
        dead: changes === 0 && !urlChanged, feedbackWithin400ms: first !== null && first <= 400 };
    },

    // Two views of focus visibility for every tab stop:
    //  - outlineRemovedByRule: an author rule strips the focus outline from this element and sets nothing in its
    //    place. This is read from the stylesheets, so it is reliable even in a background tab.
    //  - noChangeOnScriptFocus: focusing it from script changed nothing visible. Script focus does not always
    //    trigger :focus-visible, so treat this one as a hint and confirm a few stops by pressing Tab.
    focusTour() {
      const stops = Array.from(document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,summary,[tabindex]:not([tabindex="-1"])'))
        .filter(el => visible(el) && !el.disabled);
      const killers = [];
      const walk = rules => { for (const r of Array.from(rules || [])) {
        if (r.selectorText && /:focus/.test(r.selectorText) && r.style) {
          const none = r.style.outlineStyle === 'none' || r.style.outlineWidth === '0px' || r.style.outlineWidth === '0';
          const replaced = r.style.boxShadow || r.style.borderColor || r.style.border || r.style.backgroundColor || r.style.textDecoration;
          if (none && !replaced) r.selectorText.split(',').filter(p => /:focus/.test(p))
            .forEach(p => killers.push(p.replace(/:focus(-visible|-within)?/g, '').trim() || '*'));
        }
        if (r.cssRules) walk(r.cssRules);
      } };
      Array.from(document.styleSheets).forEach(sh => { try { walk(sh.cssRules); } catch (e) { /* cross-origin sheet */ } });
      const killed = el => killers.some(k => { try { return el.matches(k); } catch (e) { return false; } });
      const look = el => { const s = getComputedStyle(el); return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.boxShadow, s.borderTopColor, s.backgroundColor, s.textDecorationLine].join('|'); };
      const previous = document.activeElement, byRule = [], noChange = [];
      stops.forEach(el => {
        if (killed(el)) byRule.push(sel(el));
        const before = look(el);
        el.focus({ preventScroll: true });
        if (document.activeElement === el && look(el) === before) noChange.push(sel(el));
        el.blur();
      });
      if (previous && previous.focus) previous.focus({ preventScroll: true });
      const firstField = stops.findIndex(el => /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName));
      return { tabStops: stops.length, outlineRemovedByRule: byRule.length, removedExamples: byRule.slice(0, 10),
        noChangeOnScriptFocus: noChange.length, tabStopsBeforeFirstField: firstField < 0 ? null : firstField };
    },

    // Count the style rules that exist for each interaction state.
    stateRules() {
      const states = { ':hover': [], ':active': [], ':focus-visible': [], ':focus': [], ':disabled': [], '[disabled]': [], '[aria-current': [], '[aria-selected': [] };
      let unreadable = 0;
      const walk = rules => { for (const r of Array.from(rules || [])) {
        if (r.selectorText) for (const k of Object.keys(states)) if (r.selectorText.includes(k) && !(k === ':focus' && !/:focus(?!-)/.test(r.selectorText))) states[k].push(r.selectorText.slice(0, 80));
        if (r.cssRules) walk(r.cssRules);
      } };
      Array.from(document.styleSheets).forEach(sh => { try { walk(sh.cssRules); } catch (e) { unreadable++; } });
      const out = {};
      for (const [k, v] of Object.entries(states)) out[k] = { rules: v.length, examples: v.slice(0, 3) };
      out.unreadableStylesheets = unreadable;
      return out;
    },

    // Temporary visual aids. 'grayscale' for Color Independence; 'textSpacing' applies the WCAG 1.4.12 values.
    aid(name) {
      const id = '__lawful_aid';
      const old = document.getElementById(id); if (old) old.remove();
      const css = { grayscale: 'html{filter:grayscale(1)!important}',
        textSpacing: '*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}' }[name];
      if (!css) return { active: 'off' };
      const st = document.createElement('style'); st.id = id; st.textContent = css; document.head.appendChild(st);
      return { active: name, note: "take a screenshot, then call aid('off') or reload" };
    },

    // Elements whose text no longer fits its box.
    clipped() {
      const out = [];
      for (const el of document.body.querySelectorAll('*')) {
        if (out.length >= 25) break;
        if (!visible(el) || !(el.innerText || '').trim() || el.children.length > 3) continue;
        const s = getComputedStyle(el);
        const cutY = el.scrollHeight > el.clientHeight + 1 && /hidden|clip/.test(s.overflowY);
        const cutX = el.scrollWidth > el.clientWidth + 1 && /hidden|clip/.test(s.overflowX);
        if (cutX || cutY) out.push({ selector: sel(el), cut: cutX && cutY ? 'both' : cutX ? 'horizontal' : 'vertical', text: el.innerText.trim().slice(0, 40) });
      }
      return out;
    }
  };
  window.__lawful = api;
  return Object.keys(api);
})()
