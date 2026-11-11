# Component and flow checklist

Find the component type, apply the listed laws, and run the checks. Law IDs (L01 to L30) refer to the UX laws in `laws.md`. The listed laws are the ones that most often matter for that component; apply any other law that is clearly relevant too.

This file covers the UX laws. Every component is also checked against the UI laws (U01 to U20): the table at the top of `ui-laws.md` says which ones apply to each component type.

A component that fits no type here still gets tested: pick the closest type and reason from the laws directly.

## Contents

- Components: buttons, links, navigation, forms, selection controls, search, lists and tables, cards, modals and sheets, messages, loading states, empty states, content and typography, icons, media and carousels, pricing and plan pickers, dashboards, settings, authentication
- Screen-level checks
- Flow-level checks
- Mobile-only checks

---

## Components

### Buttons and calls to action
Laws: L07, L10, L15, L28, L06, L13, L05

- Measured size meets the target threshold; padding counts as hit area.
- One primary button per view; secondary and tertiary styles are clearly weaker.
- Same role, same style everywhere in the product.
- Label is a verb that says what happens ("Save changes", not "OK").
- Pressed, hover, focus, disabled, and loading states exist; tap gives feedback within 400 ms; double taps cannot double submit.
- Sits next to what it acts on; destructive buttons are separated from routine ones and ask for confirmation or offer undo.
- Disabled buttons explain why, or validation is shown instead.

### Links
Laws: L15, L11, L07, L29

- Look like links and unlike plain text; nothing non-clickable is styled as a link.
- Link text describes the destination ("View invoice", not "Click here").
- Visited or current state is shown where it helps orientation.
- Standalone links meet target size; links inside a sentence are exempt from the size minimum.

### Navigation (top bar, sidebar, tab bar, hamburger menu, breadcrumbs)
Laws: L11, L10, L26, L21, L15, L07, L17, L29

- Placed where the platform puts it; logo goes home; current location is highlighted.
- Item count is manageable and grouped; labels are user words.
- Most important destinations sit first and last; most used destinations are reachable in one step.
- Mobile tab bar has 3 to 5 items with icon and label; items are full-size targets.
- Important destinations are not hidden behind a hamburger on wide screens.
- Breadcrumbs or a title show where the user is in deep structures.
- Back behaves as expected and keeps state.

### Forms and inputs
Laws: L13, L03, L24, L22, L27, L05, L25, L19, L07, L29

- Every field has a visible label that stays visible while typing (placeholder alone is not a label).
- Each label is closer to its own field than to any other.
- Only necessary fields; optional ones are marked; long forms are sectioned or stepped.
- Correct `type`, `inputmode`, and `autocomplete`; right keyboard on mobile; paste allowed.
- Accepts natural formats and normalizes them; format requirements are shown before typing, not after failing.
- Errors appear beside the field, say how to fix it, and do not clear the user's input.
- The system fills what it can: defaults, detected values, remembered details.
- Fields and their tap areas are full size; the label is clickable for checkboxes and radios.
- Submit button is near the last field and names the action.

### Selection controls (dropdown, radio, checkbox, toggle, picker, segmented control, slider)
Laws: L10, L02, L11, L07, L15, L17

- Control type fits the choice: radio or segmented for 2 to 5 options, dropdown for more, searchable dropdown past about 15.
- Options are ordered meaningfully; a sensible default is preselected when one exists.
- Native controls on mobile unless there is a strong reason.
- Toggles take effect the same way everywhere (all instant, or all on Save).
- Selected state is unmistakable, not conveyed by color alone.

### Search
Laws: L11, L24, L06, L29, L20

- Field is where people look for it and is recognizable (magnifier, placeholder hint).
- Tolerates typos, case, and spacing; shows suggestions or recent searches.
- Results or a loading state appear fast; the query stays visible and editable on the results screen.
- No-results state suggests what to do next.

### Lists, tables, and grids
Laws: L03, L13, L15, L10, L07, L26, L29, L06

- Rows are scannable: consistent structure, key field first, alignment by type (numbers right-aligned).
- Long lists can be sorted, filtered, or searched; active filters are visible.
- Whole row is the target when the row is clickable; row actions are consistent and close to the row.
- Pagination or infinite scroll shows position and does not lose it on back.
- Tables on phones reflow or scroll deliberately, never overflow by accident.
- Loading, empty, and error variants exist.

### Cards
Laws: L12, L13, L15, L07, L14

- One subject per card; everything inside belongs to it.
- All cards of a kind share structure and style.
- If the card is clickable, the whole card is, and it looks it.
- At most one primary action per card.

### Modals, dialogs, bottom sheets, popovers
Laws: L08, L11, L07, L16, L10, L25, L05

- Used only when the task needs focus or a decision, not for promotion in the middle of a task.
- Clear title, one primary action, and an obvious way out (close button, Esc, tap outside, system back).
- Close and action targets are full size and within reach on phones.
- Popovers and tooltips are attached to their trigger.
- Confirmation dialogs name the consequence and label buttons with the action ("Delete project", "Cancel").
- No modal stacked on a modal.

### Messages (errors, alerts, toasts, banners, inline validation)
Laws: L25, L13, L05, L23, L17, L28

- Appear where the user is looking and next to the cause.
- Plain language: what happened, why, what to do.
- Critical messages persist until acknowledged; toasts are only for non-critical confirmation and stay long enough to read.
- Severity is distinguishable without relying on color alone.
- Tone does not blame the user.

### Loading states (spinners, skeletons, progress bars)
Laws: L06, L09, L08, L30

- Something appears within 400 ms of any action that takes longer.
- Skeletons match the layout that follows; no layout jump.
- Determinate progress for long operations; the user can leave or cancel.
- Partial content is shown as soon as it is available.

### Empty states and onboarding
Laws: L20, L05, L21, L08, L30

- Empty screens explain what goes here and offer the action that fills them.
- Onboarding is short, skippable, and teaches by doing.
- First-run asks for the minimum; permissions are requested in context with a reason.
- Setup progress is visible and resumable.

### Content and typography
Laws: L03, L05, L14, L01, L26

- Body text meets size and contrast thresholds; line length is comfortable.
- Clear heading hierarchy; one main heading per screen.
- Short paragraphs, lists for parallel items, key point first.
- A small, consistent set of sizes and weights.
- Numbers, dates, and currency are formatted for the locale.

### Icons
Laws: L11, L05, L15, L14, L07

- Conventional icons keep their conventional meaning.
- Unfamiliar icons have text labels; icon-only buttons have an accessible name.
- One icon family and weight.
- Icon buttons have full-size hit areas even when the glyph is small.

### Media and carousels
Laws: L25, L08, L07, L29

- No autoplay with sound; motion can be paused.
- Carousels show how many items there are and do not hide essential content in later slides.
- Controls are full size and visible.

### Pricing and plan pickers
Laws: L02, L10, L28, L04, L29

- A small number of plans, one recommended and visually distinct.
- Differences are comparable side by side.
- Full price, billing period, and renewal terms are shown up front; no fake discounts or pre-selected add-ons.

### Dashboards and data displays
Laws: L21, L03, L12, L05, L28, L14

- The numbers most users need are first and largest.
- Related metrics are grouped in regions; each chart answers one question.
- Emphasis marks what needs attention, not everything.
- No decoration that does not carry data.

### Settings
Laws: L10, L03, L17, L21, L15

- Grouped under plain-language headings; searchable when long.
- Common settings first; advanced ones tucked away.
- Consistent save behaviour; each setting says what it does.

### Authentication (sign up, sign in, OTP, password reset)
Laws: L22, L24, L19, L27, L29, L23

- Fewest possible fields; social or passkey options where appropriate.
- Password rules are shown before typing; show-password toggle exists; paste and password managers work.
- OTP fields accept paste and auto-fill, and show where the code was sent.
- Errors are specific without leaking security information.
- After success the user lands where they were going.

---

## Screen-level checks

Run these once per screen, after the components. Record the results on the screen's `C0` row ("the screen as a whole").

| Check | Laws |
|---|---|
| The screen has one clear purpose and one primary action | L10, L28, L05 |
| Visual hierarchy guides the eye: title, key content, action | L14, L28, L26 |
| Groups are clear from spacing, regions, and connection | L12, L13, L16 |
| Same things look the same as on other screens | L15, L11 |
| Nothing is there that nobody would miss | L19 |
| Layout is intact at phone and desktop widths, with long content and large text | L01, L24 |
| Most used things are the easiest to reach | L21, L07 |

## Flow-level checks

Walk each main task from start to finish and record the steps, taps, and seconds it takes. Flow results count toward each law's status in the coverage table, and their findings are written up like any other, citing the flow instead of a component.

| Check | Laws |
|---|---|
| Every step responds within 400 ms or shows that it is working | L06 |
| The user always knows how far along they are | L09 |
| Nothing interrupts the task before it is finished | L08 |
| No step asks for something the system already knows or could work out | L27, L22 |
| Information from earlier steps is shown again when needed | L29, L18 |
| Leaving midway does not lose progress, and there is a way back in | L30 |
| The flow ends with a clear confirmation and a next step | L23 |
| Failure paths (declined payment, no network, validation error) end with a way forward | L23, L08 |
| The number of steps fits the importance and frequency of the task | L21, L19 |
| No step uses pressure or trickery | L04 |
| A first-time user can complete it without instructions | L20, L17 |

## Mobile-only checks

| Check | Laws |
|---|---|
| Primary actions are in the lower, thumb-reachable part of the screen | L07 |
| Targets are 44 pt (iOS) or 48 dp (Android) with 8 or more between them | L07 |
| Content respects safe areas, notch, and home indicator | L01, L11 |
| The keyboard does not cover the focused field or the submit button; the right keyboard type appears | L22, L08 |
| Gestures follow the platform, and every gesture has a visible alternative | L11, L20 |
| System back, swipe back, and deep links land where expected | L11, L17 |
| Layout survives large system font size and both orientations if supported | L24 |
| Offline and slow-network states are handled | L06, L23 |
