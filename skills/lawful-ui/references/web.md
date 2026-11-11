# Testing a website or web app

## Getting evidence

Use whatever browser access you have. Any of these work: a built-in browser tool, Playwright, Puppeteer, Selenium, Chrome DevTools via MCP, or asking the user to paste the script into the console and send back the output. If you have no browser at all, fall back to source code (see the end of this file) and tag findings `inferred`.

For each screen in scope:

1. Load it at a desktop viewport (about 1280 × 800) and at a phone viewport (about 375 × 812). Take a screenshot of each. Check 320 px wide once for sideways scrolling.
2. Run `scripts/ux_probe.js` in the page at both viewports. It is one JavaScript expression that returns an object. It only reads the page.
3. Load `scripts/ux_checks.js` and run the interactive checks (next section).
4. Open what is hidden and run the probe again where it matters: menus, modals, dropdowns, accordions, tabs, the mobile navigation drawer.
5. Trigger the states: submit a form empty and with bad input, slow the network, look at empty and loading states, hover and tab through the controls. Submitting is only safe on a local, test, or staging environment; see "Mind side effects" in SKILL.md before doing it anywhere else.

On a page that does not change between viewports, the second probe run repeats the first. Read only `page`, `warnings`, `summary`, and `smallTargets` from it.

## Running the scripts

If your tool can read local files, pass the file's contents to the page:

```js
// Playwright or Puppeteer
const result = await page.evaluate(require('fs').readFileSync('scripts/ux_probe.js', 'utf8'));
```

```python
# Selenium
result = driver.execute_script("return " + open("scripts/ux_probe.js").read())
```

If your tool accepts only a string of JavaScript (most agent browser tools), do not paste the script again after every reload. Serve the folder once and load it by URL:

```bash
python3 scripts/serve.py        # http://127.0.0.1:8791, localhost only, read-only
```

```js
JSON.stringify((0, eval)(await (await fetch('http://127.0.0.1:8791/ux_probe.js')).text()))
```

Stop the server when the test is done. If the page's Content-Security-Policy blocks the fetch, paste the script's contents instead. In a browser console, paste the file contents; to copy the result, wrap the paste as `copy(JSON.stringify( ...paste... , null, 2))`.

## Interactive checks: `ux_checks.js`

Evaluate the file once per page load. It defines `window.__lawful`. Unlike the probe, these act on the page, so the side-effect rule applies to `click`.

| Call | What it answers | Laws |
|---|---|---|
| `await __lawful.click(selector)` | Did anything happen within a second of clicking? `dead: true` means no DOM change and no navigation: report "no feedback" and a functional note. If the click navigates, the call never returns, which itself shows the control works. | L06, U13 |
| `__lawful.focusTour()` | `outlineRemovedByRule`: tab stops whose focus outline an author rule removes with nothing in its place (reliable). `noChangeOnScriptFocus`: a weaker hint, since focus set from script does not always show the keyboard focus ring; confirm a few by pressing Tab. `tabStopsBeforeFirstField`: how many Tab presses before the first field. | U14, L21 |
| `__lawful.stateRules()` | How many style rules exist for `:hover`, `:active`, `:focus`, `:focus-visible`, `:disabled`, `aria-current`, `aria-selected`. Zero rules for a state means the state was never designed. | U13 |
| `__lawful.aid('grayscale')` | Shows the page without color. Take a screenshot: is every status, selection, and link still distinguishable? | U09 |
| `__lawful.aid('textSpacing')` then `__lawful.clipped()` | Applies the WCAG 1.4.12 spacing values, then lists text that no longer fits its box. | U06, U20 |
| `__lawful.aid('off')` | Removes the aid. A reload does the same. | |

## Reading the probe output

The probe reports signals. You still decide the status, using `laws.md` and `ui-laws.md`. Lists carry an `example` selector wherever a value was first seen, so you can cite a location.

| Field | What it tells you | Laws |
|---|---|---|
| `warnings` | Not empty means some values are unreliable or need care: hidden tab, localhost timing, no page background, content wider than the viewport. Read these first. | |
| `page.horizontalOverflowPx` | Greater than 0 on a phone viewport means the layout is broken | L01, L24, U20 |
| `page.screensTall` | Page length in viewports; very long pages need chunking and navigation aids | L03 |
| `smallTargets` | Controls under the size minimum, grouped: siblings of the same kind share one row with a `count`, size range, and `smallestGapPx`. `fail` rows are under 24 px. Inline text links are excluded. On a pointer layout only the under-24 rows are listed; on a touch layout everything under 44. | L07, U12 |
| `summary.crowdedSmallTargets` | Small targets with less than 8 px to the next target | L07, U12 |
| `navigation` | Item count per navigation group, plus first and last item | L10, L26, L02 |
| `selects`, `radioGroups` | Options per choice control | L10, L02 |
| `buttonStyles` | Distinct visual styles among buttons, with examples; many styles for one role means inconsistency | L15, U10 |
| `emphasizedButtons` | Buttons with a solid background that stands out. More than one in the same view compete for the primary role. `aboveFold` is measured from the top of the page, whatever the scroll position. | L28, L10, U01 |
| `forms` | Per form: `method`, field count, required count, sections, submit and reset buttons, and `passwordSentInUrl` (a GET form with a password field: report as a functional and security note) | L03, L19, L10 |
| `preCheckedCheckboxes` | Boxes ticked before the user touched anything. Read each label: a pre-selected cost, upsell, or consent is a dark pattern. | L04 |
| `fieldIssues` | Missing labels, placeholder-only labels, missing `autocomplete`, wrong input type, missing `inputmode` | L22, L24, L27, L05, U16 |
| `contrastFailures` | Text below the WCAG ratio. `backgroundUncertain: true` means an image or gradient is behind it; check that one by eye. Placeholder text is not measured. | U08, L05 |
| `smallText`, `fontSizesPx`, `fontFamilies` | Text under 12 px; how many sizes and families are in use | U05, L01 |
| `longLines`, `wallsOfText` | Lines over 90 characters; blocks over 600 characters. `widerThanViewport: true` means the block overflows the screen, so the count describes the layout and not what the user sees at once. | U06, L03 |
| `headings` | Heading outline; check for a single h1 and no skipped levels | U01, L03 |
| `summary.fixedOrStickyElements`, `runningAnimations` | Things that follow the user or move; each one competes for attention | L25, L08, U19 |
| `timingMs` | First byte, first contentful paint, DOM ready, load | L06 |
| `ui.pageBackgroundSet` | `false` means neither `html` nor `body` sets a background. The page then depends on the host being white; in a dark webview the text can vanish. Report it. | U08, U07 |
| `ui.spacing` | Most used padding, margin, and gap values (each counted once per element), and those that are not multiples of 4. Browser defaults are included, such as heading margins: an off-scale value on an unstyled heading is not the author's choice. | U03 |
| `ui.leftEdgesPx` | Where text blocks, images, and fields start. One or two edges holding most elements is a grid; edges with a single element are strays. | U02 |
| `ui.fieldWidthsPx` | Widths of inputs and selects. Several widths in one column mean ragged right edges. | U02, U16 |
| `ui.textColors`, `ui.backgroundColors` | Palette actually in use, with counts. Look for near-duplicates and colors used for conflicting roles. | U07 |
| `ui.cornerRadii`, `ui.shadows` | Radius (including square, `0px`) and shadow styles of boxes | U10, U17 |
| `ui.tightLineHeight` | Multi-line text blocks with line height under 1.3 | U06 |
| `ui.minTextInsetLeftPx`, `ui.minTextInsetAt` | Smallest distance from text to the left screen edge and where; under 16 on a phone is cramped | U04 |
| `ui.focus.outlineRemovedWithoutReplacement` | Style rules that remove the focus outline and set nothing in its place. `unreadableStylesheets` counts cross-origin stylesheets the probe could not inspect. | U14 |
| `ui.motion` | How many elements animate. `hasReducedMotionRule` is `null` when nothing animates (U19 is then N/A), otherwise whether a reduced-motion rule exists. | U19 |
| `ui.theme.hasColorSchemeRule` | `true`: the styles respond to dark mode, so test both themes. `false`: single theme; then `pageBackgroundSet` must be true. | U07 |
| `ui.images` | Images that are stretched, upscaled, missing `alt`, or have no reserved size | U18 |
| `ui.viewportMeta`, `ui.zoomBlocked` | Viewport tag, and whether it stops the user zooming | U20 |

Notes on reading it:

- A checkbox or radio can appear as a small target while `labelExtendsHitArea` is true. Measure the label instead before failing it.
- "no associated label" means no `<label>`, `aria-label`, or `aria-labelledby` is tied to the field. There may still be visible text beside it; look at the screenshot, and report an unassociated visible label as a weaker problem than no label at all.
- `timingMs` from localhost, a hidden tab, or an embedded browser pane does not represent what users get. The probe adds a warning in those cases; report page speed as NOT TESTED unless you measured in a realistic setting.

## What still needs your eyes

- **Grouping (L12, L13, L16).** Judge from the screenshot. For a label and field, compare the gap from the label to its own field with the gap to the field above.
- **Visual hierarchy and affordance (U01, U11).** Squint at the screenshot: what stands out first, and does everything clickable look clickable?
- **Conventions and wording (L11, L17, L20).** Read the labels as a first-time user would.
- **Flows (L08, L09, L23, L29, L30).** Walk them. Leave midway and come back. Use the back button. Fail a step on purpose.
- **Input tolerance (L24).** Type a phone number with spaces, an email in capitals with a trailing space, a pasted code.
- **Dark patterns (L04).** Read the checkout, cancellation, and consent screens closely. `preCheckedCheckboxes` finds one kind; fake urgency and confirmshaming need reading.
- **Interaction response time (L06).** `__lawful.click` reports `msToFirstChange`; for anything it cannot reach, watch whether something changes within 400 ms.
- **Text resize (U20).** Browser zoom to 200% usually cannot be set from a script. If you cannot do it, narrow the viewport to 320 px as the nearest equivalent and list 200% zoom under "Not tested".
- **Keyboard (L11).** Tab order, Enter and Esc.

## Source-only mode

When you cannot run the page, read the code. Look for:

- Sizes: `width`, `height`, `padding`, `min-height` on buttons, icon buttons, and inputs; utility classes such as `w-4 h-4`, `p-1`; design-token values.
- Spacing and type scales in the theme or token files, and one-off values that bypass them.
- Component variants: how many button variants exist and whether screens use them consistently.
- Form markup: `<label>`, `type`, `autocomplete`, `inputmode`, `required`, `method`, `checked`, validation messages and where they render.
- State handling: loading, empty, and error branches in each view; disabled and pending states on submit handlers; debounce and double-submit guards; `:hover`, `:active`, `:focus-visible` styles.
- Navigation structure: route definitions, number of top-level items, depth of the main task.
- Copy: labels, error strings, confirmation text.

Sizes read from code are `inferred`: the rendered result can differ. Say so in the report and list what a live run would confirm.
