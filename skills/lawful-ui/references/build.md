# Build mode: making UI that obeys the laws from the start

Read this when you are creating or changing an interface: a page, screen, component, form, layout, or mockup, in any framework, for web or mobile. The laws in `laws.md` and `ui-laws.md` are written as test criteria. This file turns them into defaults to build with, so nothing has to be caught afterwards.

## What these rules are, and are not

They are constraints on usability and construction. They do not choose the look: brand, mood, palette, typeface, and layout style stay with the user and the project. Two interfaces can look nothing alike and both obey every rule here.

Order of authority:

1. **The user's explicit instruction.** If it conflicts with a rule of thumb here, follow the user. If it conflicts with a firm threshold (a WCAG or platform number: contrast, target size, zoom), say so once, offer the nearest compliant option, and then do what they decide.
2. **The project's design system.** Use existing tokens, components, and patterns. Where they meet the thresholds, they win over the defaults below. Where they do not (a token that fails contrast, a 28 px button), build with them only if told to, and mention it.
3. **The defaults below**, wherever the first two are silent.

## Before writing anything

Answer these for yourself. They take seconds and prevent most violations.

- **What is this screen's one job?** That decides the single primary action (L10, L28, U01).
- **Who uses it, on what?** Phone or desktop, first-time or daily, in a hurry or not (L17, L21).
- **What does the system already know or can work out?** Do not ask for it (L27, L22, L19).
- **Which states exist?** Empty, loading, error, success, disabled, and long content. Build them, not only the happy path (U13, L06, L23).

## The rules

### 1. Structure and choices

- One primary action per view, visually distinct. Everything else is secondary or tertiary and looks it (L10, L28, U01).
- Keep choices few at each decision point. Past about seven comparable options, group them, add search or filters, or recommend one (L02, L10).
- Put the most important navigation items first and last; a mobile tab bar has three to five items, each with icon and label (L26, L11).
- The most frequent task takes the fewest steps and the most prominent place (L21).
- Ask only for what the task needs. Every field, step, and confirmation must earn its place (L19, L27).
- Break long tasks into steps and show progress ("Step 2 of 4") (L09, L03).
- Follow platform and web conventions unless there is a reason not to: logo goes home, links look like links, system back works (L11).
- Use the user's words, not internal terms (L17).

### 2. Layout and spacing

- Take every padding, margin, and gap from one scale: 4, 8, 12, 16, 24, 32, 48. No one-off values (U03).
- Align to a grid with a few shared edges; one left edge for a column of content (U02).
- Space within a group is smaller than space between groups. A label sits closer to its own field than to the next one; a heading sits closer to what follows than to what came before (L13).
- Put related things in one visible region and unrelated things in separate ones (L12, L16).
- Keep at least 16 px between content and the screen edge on phones, and padding inside every container (U04).
- Break long content into short, headed chunks. Group long numbers (L03).

### 3. Type and color

- Body text 16 px on web (17 pt iOS, 16 sp Android); nothing below 12. One or two font families, four to six sizes from a scale, two or three weights (U05).
- Body line height about 1.5; cap text blocks near 65 characters wide (U06).
- Define colors as tokens by role: primary, neutral ramp, success, warning, error. Red means danger or error and nothing else (U07).
- Contrast: 4.5 : 1 for text, 3 : 1 for large text and for the boundaries of controls. Check every pair you introduce (U08).
- Never let color carry meaning alone: add an icon, label, underline, or shape (U09).
- Set the page background explicitly. Do not rely on the host being white (U08).
- If the product supports dark mode, style both themes.

### 4. Controls

- Use real elements: `<button>` for actions, `<a href>` for navigation, native inputs. On mobile, the platform's own components (U11, L11).
- Hit areas: 44 × 44 px on touch web layouts (never under 24), 44 pt on iOS, 48 dp on Android, with 8 or more between neighbours. Padding counts (L07, U12).
- Give every control its states: hover, focus-visible, active, disabled, and loading where it waits (U13).
- Never remove a focus outline without replacing it. Focus order follows visual order (U14). The one exception is an element that only script ever focuses, such as a heading with `tabindex="-1"` that receives focus after a page change: it may drop its outline.
- Label buttons with the action ("Save changes", "Delete project"), not "OK" or "Submit" (L05).
- Same role, same style, everywhere. Static things never look clickable (L15, U10).
- Keep destructive actions apart from routine ones, and add a confirmation that names the consequence, or an undo (L07, L08).
- Icons from one family; label any whose meaning is not universal; give icon-only buttons an accessible name (U15).

### 5. Forms

- One column. A visible label above every field, tied to it in code. A placeholder is a hint, never the label (U16, L29).
- Set `type`, `inputmode`, and `autocomplete` (or the mobile keyboard and autofill hints) so entry is fast (L22).
- Accept what people naturally type: spaces in numbers, any letter case, pasted values. Normalize in code instead of rejecting (L24).
- State format rules before typing, in help text under the field (L25).
- Show errors next to the field, in words that say how to fix it, with an icon as well as color, and keep what the user typed (L25, L23, U09).
- Size fields to their expected content; mark required or optional consistently (U16).
- Sensible defaults. Never pre-select anything that costs money, shares data, or gives consent (L04).
- Put the submit button after the last field, aligned with the fields.
- Send form data in the request body (POST, whether by form action or `fetch`), never in the URL.
- Do not add a reset button.

### 6. Feedback and flow

- Respond to every action within 400 ms: a pressed state at once, an indicator if it takes longer, progress past a few seconds. Guard against double submits (L06).
- Every data view has empty, loading, and error variants. Empty states say what belongs there and offer the action that fills it (U13, L20).
- End each flow with a clear confirmation that says what happened and what comes next. Design the failure ending too (L23).
- Keep progress: save drafts, persist carts, let people resume (L30). Never store passwords, payment details, or other secrets this way; persist only what is safe to leave on the device.
- Do not interrupt a task with popups, sign-up walls, or prompts (L08).
- Show information again where it is needed instead of asking people to remember it (L29, L18).
- No pressure or trickery: no fake urgency, no shaming decline text, no hidden costs, accept and decline equally easy (L04).

### 7. Responsive, media, motion

- Fluid widths; no fixed width wider than the viewport. The layout works at 320 px with no sideways scroll (U20, L24).
- On web, include the viewport meta tag and never block zoom. On mobile, respect safe areas and system font size (U20).
- Give images explicit dimensions or an aspect ratio, correct `object-fit`, and alternative text (U18).
- Motion only where it explains a change; 150 to 400 ms; honor reduced-motion; nothing loops without a pause (U19).
- A small, consistent set of radii and shadows; overlays dim what is behind them (U10, U17).

## How much to apply

Match the effort to the change.

| Change | What to do |
|---|---|
| A small edit (a label, a color, one component) | Apply the rules that touch it. Do not rework the rest of the screen unasked; if you notice a serious violation nearby, mention it in one line. |
| A new component or section | Apply the rules for its type, and make it consistent with what is already there. |
| A new screen or flow | Apply everything above, then run the check below. |

Building is not auditing. Do not produce a findings report in Build mode unless the user asks for a test.

## Check before delivering

For a new screen or flow, go through this once before you present the work, and fix what fails.

1. One primary action, visually distinct?
2. Every control at least the minimum size, with 8 or more between neighbours?
3. All text and control boundaries at the contrast minimum? Page background set?
4. Spacing from the scale; one consistent left edge; labels closer to their own fields?
5. Every field labelled, with the right type and autocomplete?
6. Hover, focus-visible, active, disabled, and loading states present? No outline removed?
7. Empty, loading, error, and success states built?
8. Works at 320 px wide; zoom not blocked?
9. Nothing asked that the system could know; nothing pre-selected against the user's interest?
10. Does the flow end with a confirmation, and keep the user's input on error?

If you can run the result and have a browser tool, run `scripts/ux_probe.js` on it at a phone and a desktop width: `summary` should show no targets under 24 px (none under 44 on the phone width), no contrast failures, no fields with issues, no removed focus outlines, no pre-checked boxes, and zero horizontal overflow. This is a quick confirmation, not a full test.

For a file on disk, one command serves both the page and the scripts:

```bash
python3 scripts/serve.py --site path/to/folder
```

Open `http://localhost:8791/yourpage.html` and evaluate `(0, eval)(await (await fetch('/__lawful/ux_probe.js')).text())` in it. Stop the server afterwards. `web.md` has the other ways to run the scripts and explains the output.

Then close your reply with a short note, two to four lines, titled **Lawful check**:

- what you verified and how (by reading the code, or measured with the probe);
- any rule you knowingly bent, and why (a user instruction, a design-system constraint);
- anything you could not verify.

Skip the note for small edits. Keep it factual: it tells the user what was checked, it is not a sales pitch for the result.

If another installed skill or the project also asks for a closing verification note, write one combined note. Do not report the same facts twice in two formats.
