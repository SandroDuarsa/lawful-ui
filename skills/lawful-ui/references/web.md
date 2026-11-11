# Testing a website or web app

## Getting evidence

Use whatever browser access you have. Any of these work: a built-in browser tool, Playwright, Puppeteer, Selenium, Chrome DevTools via MCP, or asking the user to paste the script into the console and send back the output. If you have no browser at all, fall back to source code (see the end of this file) and tag findings `inferred`.

For each screen in scope:

1. Load it at a desktop viewport (about 1280 × 800) and at a phone viewport (about 375 × 812). Take a screenshot of each.
2. Run `scripts/ux_probe.js` in the page at both viewports. It is one JavaScript expression that returns an object. It only reads the page.
3. Open what is hidden and run the probe again where it matters: menus, modals, dropdowns, accordions, tabs, the mobile navigation drawer.
4. Trigger the states: submit a form empty and with bad input, slow the network, look at empty and loading states, hover and tab through the controls. Submitting is only safe on a local, test, or staging environment; see "Mind side effects" in SKILL.md before doing it anywhere else.

On a page that does not change between viewports, the second probe run repeats the first. Read only `page`, `warnings`, `summary`, and `smallTargets` from it.

Running the probe:

```js
// Playwright or Puppeteer
const result = await page.evaluate(require('fs').readFileSync('scripts/ux_probe.js', 'utf8'));
```

```python
# Selenium
result = driver.execute_script("return " + open("scripts/ux_probe.js").read())
```

In a browser console, paste the file contents; to copy the result, wrap the paste as `copy(JSON.stringify( ...paste... , null, 2))`.

Some agent browser tools accept only a string of JavaScript and cannot read a local file. Pass the file's contents as that string. If the tool returns only serialisable values, wrap the script: `JSON.stringify( ...script... )`. To avoid resending the script for every screen, store it once per page load (`window.__probe = <script text as a string>`) and call `(0, eval)(window.__probe)` afterwards.

## Reading the probe output

The probe reports signals. You still decide the status, using `laws.md`.

| Field | What it tells you | Laws |
|---|---|---|
| `warnings` | Not empty means some values are unreliable (for example the tab was hidden); fix the cause and run again | |
| `page.horizontalOverflowPx` | Greater than 0 on a phone viewport means the layout is broken | L01, L24 |
| `page.screensTall` | Page length in viewports; very long pages need chunking and navigation aids | L03 |
| `smallTargets` | Controls under 44 px, with size, nearest neighbour gap, and whether a label extends the hit area. `fail` rows are under 24 px. Inline text links are already excluded. | L07 |
| `summary.crowdedSmallTargets` | Small targets with less than 8 px to the next target | L07 |
| `navigation` | Item count per navigation group, plus first and last item | L10, L26, L02 |
| `selects`, `radioGroups` | Options per choice control | L10, L02 |
| `buttonStyles` | Distinct visual styles among buttons with examples; many styles for the same role means inconsistency | L15 |
| `emphasizedButtons` | Buttons with a solid background that stands out from its surroundings, each flagged `aboveFold`. More than one in the same view means they compete for the primary role. | L28, L10 |
| `forms` | Field count, required count, sections, and submit buttons per form | L03, L19, L10 |
| `fieldIssues` | Missing labels, placeholder-only labels, missing `autocomplete`, wrong input type, missing `inputmode` | L22, L24, L27, L05 |
| `contrastFailures` | Text below the WCAG ratio. `backgroundUncertain: true` means an image or gradient is behind it; check that one by eye. | L05, L01 |
| `smallText`, `fontSizesPx`, `fontFamilies` | Text under 12 px; how many sizes and families are in use | L01, L14, L05 |
| `longLines`, `wallsOfText` | Lines over 90 characters; blocks over 600 characters | L03, L05 |
| `headings` | Heading outline; check for a single h1 and no skipped levels | L03, L14 |
| `summary.fixedOrStickyElements`, `runningAnimations` | Things that follow the user or move; each one competes for attention | L25, L08 |
| `timingMs` | First byte, first contentful paint, DOM ready, load | L06 |
| `ui.spacing` | Most used padding, margin, and gap values, and those that are not multiples of 4. `summary.spacingOffScalePercent` is their share. A high share or many distinct values means no spacing system. | U03 |
| `ui.leftEdgesPx` | Left edges shared by headings, paragraphs, lists, and fields. A few edges with many elements is a grid; many edges with one or two elements each are strays. | U02 |
| `ui.textColors`, `ui.backgroundColors` | Palette actually in use, with counts. Look for near-duplicates and colors used for conflicting roles. | U07 |
| `ui.cornerRadii`, `ui.shadows` | Distinct radius and shadow styles | U10, U17 |
| `ui.tightLineHeight` | Multi-line text blocks with line height under 1.3 | U06 |
| `ui.minTextInsetLeftPx` | Smallest distance from text to the left screen edge; under 16 on a phone is cramped | U04 |
| `ui.focus.outlineRemovedWithoutReplacement` | Style rules that remove the focus outline and set nothing in its place. Confirm by tabbing through the page. `unreadableStylesheets` counts cross-origin stylesheets the probe could not inspect. | U14 |
| `ui.motion` | How many elements animate, and whether a reduced-motion rule exists | U19 |
| `ui.theme.hasColorSchemeRule` | Whether the styles respond to dark mode; if so, test both themes | U07 |
| `ui.images` | Images that are stretched, upscaled, missing `alt`, or have no reserved size | U18 |
| `ui.viewportMeta`, `ui.zoomBlocked` | Viewport tag, and whether it stops the user zooming | U20 |
| `smallTargets`, `contrastFailures`, `buttonStyles`, `fontSizesPx`, `fieldIssues`, `page.horizontalOverflowPx` | Already listed above; they also feed U12, U08, U10, U05, U16, and U20 | U-laws |

Notes on reading it:

- On a pointer (desktop) layout `smallTargets` lists only controls under 24 px; on a touch layout it lists everything under 44 px. `summary.targetsBelow44px` counts both either way.
- A checkbox or radio can appear as a small target while `labelExtendsHitArea` is true. Measure the label instead before failing it.
- "no associated label" means no `<label>`, `aria-label`, or `aria-labelledby` is tied to the field. There may still be visible text beside it; look at the screenshot, and report an unassociated visible label as a weaker problem than no label at all.
- `timingMs` from localhost, a hidden tab, or an embedded browser pane does not represent what users get. The probe adds a warning in those cases; report page speed as NOT TESTED unless you measured in a realistic setting.

## What the probe cannot see

Check these by hand:

- **Interaction response time (L06).** Click and watch: does anything change within 400 ms? To measure, record `performance.now()` before the click and again in a `requestAnimationFrame` callback after the first visible change, or use a trace. A control that produces no DOM change and no navigation within a second of being clicked is a dead control: report it as "no feedback" under L06 and as a functional defect.
- **Grouping (L12, L13, L16).** Judge from the screenshot. For a label and field, compare the gap from the label to its own field with the gap to the field above.
- **Visual hierarchy and affordance (U01, U11).** Squint at the screenshot: what stands out first, and does everything clickable look clickable?
- **States (U13, U14).** Hover, press, and tab through each control; trigger loading, error, empty, and disabled states.
- **Color independence (U09).** View the screenshot in grayscale: is every status and selection still distinguishable?
- **Text resize and reflow (U20).** Zoom to 200% and narrow the window to 320 px.
- **Conventions and wording (L11, L17, L20).** Read the labels as a first-time user would.
- **Flows (L08, L09, L23, L29, L30).** Walk them. Leave midway and come back. Use the back button. Fail a step on purpose.
- **Input tolerance (L24).** Type a phone number with spaces, an email in capitals with a trailing space, a pasted code.
- **Dark patterns (L04).** Read the checkout, cancellation, and consent screens closely.
- **Keyboard (L11).** Tab order, visible focus, Enter and Esc.

## Source-only mode

When you cannot run the page, read the code. Look for:

- Sizes: `width`, `height`, `padding`, `min-height` on buttons, icon buttons, and inputs; utility classes such as `w-4 h-4`, `p-1`; design-token values.
- Spacing and type scales in the theme or token files, and one-off values that bypass them.
- Component variants: how many button variants exist and whether screens use them consistently.
- Form markup: `<label>`, `type`, `autocomplete`, `inputmode`, `required`, validation messages and where they render.
- State handling: loading, empty, and error branches in each view; disabled and pending states on submit handlers; debounce and double-submit guards.
- Navigation structure: route definitions, number of top-level items, depth of the main task.
- Copy: labels, error strings, confirmation text.

Sizes read from code are `inferred`: the rendered result can differ. Say so in the report and list what a live run would confirm.
