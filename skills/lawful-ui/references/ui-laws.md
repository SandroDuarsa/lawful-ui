# The 20 Laws of UI as test criteria

The Laws of UX (`laws.md`) describe how people think and behave. The Laws of UI describe how the interface itself must be built so that it is readable, consistent, and operable: layout, type, color, components, states, and adaptation to the device.

There is no single canonical "Laws of UI" site the way lawsofux.com exists for UX. This set is drawn from the sources designers treat as authoritative:

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines
- Material Design 3: https://m3.material.io/
- Established visual-design practice (grids, type scales, spacing systems)

Each law has an ID (U01 to U20) used in the report. Numbers that come from WCAG or a platform guideline are firm. Numbers marked "guide" are rules of thumb: a signal to look closer, not an automatic fail.

## Contents

| Group | Laws |
|---|---|
| Layout | U01 Visual Hierarchy, U02 Alignment and Grid, U03 Spacing System, U04 Whitespace and Density |
| Type and color | U05 Typography, U06 Readability, U07 Color System, U08 Contrast, U09 Color Independence |
| Components | U10 Consistency, U11 Affordance, U12 Touch Targets, U13 Interactive States, U14 Focus Visibility, U15 Iconography, U16 Form Layout |
| Surface and media | U17 Elevation and Layering, U18 Imagery and Media, U19 Motion |
| Adaptation | U20 Responsive and Adaptive Layout |

## Which UI laws apply to which component

Judge the layout and system laws once per screen, on its `C0` row: U01 Visual Hierarchy, U02 Alignment, U03 Spacing, U04 Whitespace, U07 Color System, U10 Consistency, U20 Responsive. They describe how components relate, so they are not re-judged on every component; when one component is the cause (a stray edge, an off-palette button), name that component in the finding.

Per component, apply the laws for its type:

| Component type | Apply |
|---|---|
| Any text (headings, body, labels) | U05, U06, U08 |
| Buttons, links, any control | U08, U09, U11, U12, U13, U14 |
| Navigation, tab bars, menus | U08, U11, U12, U13, U14, U15 |
| Forms and inputs | U08, U09, U12, U13, U14, U16 |
| Selection controls (checkbox, radio, select, toggle) | U08, U09, U12, U13, U14 |
| Icons | U08, U12, U15 |
| Cards, lists, tables | U08, U17, U18 |
| Banners, alerts, toasts, inline messages | U07, U08, U09, U19 |
| Modals, sheets, popovers | U08, U14, U17, U19 |
| Images, video, illustrations | U18 |
| Anything animated | U19 |
| Status badges, charts | U07, U08, U09 |
| A missing state (no error, loading, or empty state) | U13 only |

---

## U01 Visual Hierarchy

**Idea.** Size, weight, color, and position tell the eye what matters first. A screen with no clear order makes the user do the sorting.

**Check.**
- Squint at the screenshot: one element should stand out first, and it should be the most important one.
- Three levels are distinguishable at a glance: primary (title or key action), secondary, supporting.
- Headings are visibly larger or heavier than body text, in a consistent step.
- Position follows reading order: key content early, actions after the content they apply to.

**Fail signals.** Everything the same size and weight; the largest element is decorative; two headings of equal weight competing; the primary action smaller than a secondary one.

**Fix direction.** Pick the focal point, then scale everything else down from it.

## U02 Alignment and Grid

**Idea.** Elements that share edges read as organized. Stray edges read as mistakes.

**Check.**
- Content aligns to a small number of vertical axes. Count the distinct left edges in the main content.
- Labels, fields, and buttons in a form share an edge.
- Text baselines line up across a row; icons are centred with their labels.
- Numbers in tables are right-aligned; text is left-aligned (in left-to-right languages).
- Layout follows a column grid with consistent gutters.

**Fail signals.** Elements off by a few pixels; centred text mixed with left-aligned text in one block; fields of random widths with ragged edges; icon and label vertically misaligned.

**Fix direction.** Snap to a grid; one alignment per block.

## U03 Spacing System

**Idea.** Spacing drawn from one scale (commonly multiples of 4 or 8) makes a layout feel deliberate and keeps related things visibly related.

**Check.**
- Collect the padding, margin, and gap values in use. They come from a short scale, such as 4, 8, 12, 16, 24, 32, 48.
- The same kind of gap is the same everywhere: card padding, space between form fields, section spacing.
- Spacing within a group is smaller than spacing between groups.

**Fail signals.** One-off values (5, 7, 13, 18 px); the same component with different padding on different screens; more than about 8 to 10 distinct spacing values (guide).

**Fix direction.** Define spacing tokens and replace one-off values.

## U04 Whitespace and Density

**Idea.** Empty space separates, groups, and gives the eye a rest. Too little is cramped; too much scatters related content and forces scrolling.

**Check.**
- Content does not touch the screen edges or container borders: at least 16 px side margin on phones (guide).
- Text has room around it inside buttons, cards, and inputs.
- Density fits the product: data tools can be dense, consumer flows need air.
- The first screen is not filled edge to edge with competing blocks.

**Fail signals.** Text against a border; cards packed with no gap; a phone screen with no side margin; a sparse layout that pushes the main action below the fold for no reason.

**Fix direction.** Add padding inside containers first, then space between them.

## U05 Typography

**Idea.** A small, consistent type system makes text easy to scan and the hierarchy easy to see.

**Check.**
- At most two font families (one is often enough).
- Sizes come from a scale with clear steps; about 4 to 6 sizes per product (guide).
- Body text is 16 px on web, 17 pt on iOS, 16 sp on Android by default; nothing below 12.
- Two or three weights, used consistently for the same role.
- No long passages in all caps, italics, or centred alignment.
- Text is real text, not text baked into images.

**Fail signals.** Eight or more font sizes on a page; three or more families; 10 to 11 px labels; headings that differ from body by one pixel.

**Fix direction.** Define a type scale and map every text role to one step.

## U06 Readability

**Idea.** Line length, line height, and paragraph spacing decide whether text can be read comfortably.

**Check.**
- Line length is about 45 to 75 characters on desktop and 30 to 50 on phones; over 90 is a fail signal.
- Line height is about 1.4 to 1.6 for body text and 1.1 to 1.3 for large headings; body below 1.3 is a fail signal.
- Paragraphs are separated by visible space.
- The layout survives the WCAG 1.4.12 text-spacing settings (line height 1.5, paragraph spacing 2 × font size) without clipping.
- Long text is left-aligned, not justified without hyphenation.

**Fail signals.** Text running the full width of a wide screen; tight line height on multi-line body text; justified text with rivers of space.

**Fix direction.** Set a max-width on text blocks (about 65ch) and a body line height of 1.5.

## U07 Color System

**Idea.** A limited palette with fixed roles lets color carry meaning. When any color can mean anything, color means nothing.

**Check.**
- A small palette: one or two brand colors, a neutral ramp, and semantic colors (success, warning, error, info).
- Each color has one role. The primary action color is not also used for decoration; red means danger or error and nothing else.
- Proportions are balanced: mostly neutral, some secondary, a little accent (the 60-30-10 guide).
- Count the distinct text and background colors; many near-identical shades indicate no system.
- If dark mode is supported, both themes hold up: contrast, images, shadows, and borders.

**Fail signals.** A submit button in the error color; five slightly different grays; brand color used for body text, links, borders, and backgrounds alike; dark mode with unreadable text or glowing white images.

**Fix direction.** Define color tokens by role and replace raw values.

## U08 Contrast

**Idea.** Text and controls must stand out from their background to be seen at all. This is WCAG 1.4.3 and 1.4.11.

**Check.**
- Normal text: at least 4.5 : 1 against its background.
- Large text (24 px and up, or 18.66 px and up in bold): at least 3 : 1.
- Boundaries of inputs, icons that carry meaning, and control states: at least 3 : 1 against adjacent colors.
- Placeholder text and disabled text are still legible (disabled is exempt from the ratio, but should not vanish).
- Text over images or gradients has a scrim or solid backing.

**Fail signals.** Light gray text on white; white text on a mid-tone brand color; an input whose border is barely visible; text over a busy photo.

**Fix direction.** Darken the text or the background until the ratio is met; add a scrim over images.

## U09 Color Independence

**Idea.** Color alone must not carry information, because many people cannot tell the colors apart. This is WCAG 1.4.1.

**Check.**
- Errors have an icon or text as well as red.
- Links inside text are underlined or otherwise distinguished by more than color.
- Selected, active, and required states have a second cue: shape, icon, weight, or label.
- Charts use labels, patterns, or direct annotation as well as color.
- Status badges carry text.

**Fail signals.** A field that only turns red on error; green and red dots as the only status indicator; a chart legend that depends on telling five hues apart.

**Fix direction.** Add an icon, label, underline, or shape to every color cue.

## U10 Consistency

**Idea.** The same thing looks and behaves the same everywhere. Each inconsistency makes the user stop and relearn.

**Check.**
- One style per component role across all screens: primary button, secondary button, input, card, link.
- Count distinct button styles, corner radii, and shadow styles; each should be a short list.
- The same action has the same label, icon, and position on every screen.
- Terminology and capitalization are uniform.
- The product follows its platform's conventions where it uses platform components.

**Fail signals.** Three corner radii on one screen; "Save" on one page and "Submit" on another for the same action; a back button that moves between screens; mixed sentence case and title case on buttons.

**Fix direction.** Build from a component library; remove one-off variants.

## U11 Affordance

**Idea.** A control should look like what it does. Things that can be pressed look pressable; things that cannot, do not.

**Check.**
- Buttons look like buttons (shape, fill, or border); links look like links.
- Clickable cards and rows show it: hover state, chevron, pointer cursor on web.
- Static text and decorative elements are not styled like controls.
- Inputs look like places to type; disabled controls look unavailable.
- Draggable, swipeable, and expandable elements have a visible handle or hint.

**Fail signals.** Flat text that is secretly a button; underlined blue text that is not a link; a card that is clickable with nothing to show it; a swipe action with no visual hint.

**Fix direction.** Give every interactive element a signifier, and remove signifiers from static ones.

## U12 Touch Targets

**Idea.** A control must be large enough, and far enough from its neighbours, to hit reliably.

**Check.**
- Web: at least 24 × 24 CSS px (WCAG 2.5.8); aim for 44 × 44 on touch layouts.
- iOS: 44 × 44 pt. Android: 48 × 48 dp.
- At least 8 px / pt / dp between adjacent targets.
- The hit area can be larger than the visible glyph: check padding and hit slop, not only the icon size.
- Links inside a sentence are exempt from the size minimum.

**Fail signals.** 16 to 24 px icon buttons with no padding; a row of small controls a few pixels apart; a tiny close button on a modal.

**Fix direction.** Add padding or a minimum size; spread crowded controls apart.

## U13 Interactive States

**Idea.** A control has more than one state, and each must be designed. Missing states leave the user unsure whether anything happened.

**Check.** Each interactive component has, where relevant:
- Default, hover (pointer devices), focus, pressed or active, disabled.
- Loading or pending, for anything that waits.
- Selected or current, for toggles, tabs, and navigation.
- Error and success, for inputs.
- Empty, loading, and error variants for lists and data views.

States are visibly different from one another, and consistent across components.

**Fail signals.** No pressed feedback on tap; a disabled button indistinguishable from an enabled one; no loading state on submit; a tab bar with no current-tab indicator; a list that shows a blank screen when empty.

**Fix direction.** Define the full state set per component in the design system.

## U14 Focus Visibility

**Idea.** People using a keyboard or switch need to see where they are. This is WCAG 2.4.7 and 2.4.11.

**Check.**
- Tab through the page: every interactive element shows a clear focus indicator.
- The indicator contrasts with its surroundings (3 : 1) and is not hidden behind sticky headers or overlays.
- Focus order follows the visual order.
- Opening a modal moves focus into it; closing returns focus to the trigger.
- Stylesheets do not remove outlines (`outline: none`) without a replacement.

**Fail signals.** `outline: none` on `:focus` with nothing in its place; focus disappearing under a sticky bar; focus jumping around the page; focus left behind a modal.

**Fix direction.** Restore a visible `:focus-visible` style; manage focus in overlays.

## U15 Iconography

**Idea.** Icons work when they are recognizable, consistent, and labelled where meaning is not universal.

**Check.**
- One icon family: same stroke weight, corner style, and fill style.
- Consistent sizes (commonly 16, 20, 24) and optical alignment with adjacent text.
- Icons whose meaning is not universal have a text label.
- Icon-only buttons have an accessible name.
- Meaningful icons meet 3 : 1 contrast.
- The same icon means the same thing everywhere.

**Fail signals.** Outlined and filled icons mixed without a rule; a letter standing in for an icon; the same glyph used for two actions; unlabeled icons in a main navigation.

**Fix direction.** Standardize on one set and one size scale; add labels.

## U16 Form Layout

**Idea.** The visual structure of a form decides how fast and how accurately it gets filled.

**Check.**
- One column; fields stacked in a logical order.
- A visible label above each field (or beside it, consistently); the placeholder is not the label.
- Field width hints at the expected input: short for postal code, long for address.
- Required or optional is marked consistently.
- Help text sits below the field; error text replaces or joins it, in the error color with an icon.
- Related fields are grouped under a heading; the primary button is aligned with the fields and placed after the last one.
- Input height matches the touch-target minimum.

**Fail signals.** Two or three columns of unrelated fields; placeholder-only labels; every field the same width; errors shown only at the top; the submit button far from the fields.

**Fix direction.** Single column, label on top, error below, button at the end.

## U17 Elevation and Layering

**Idea.** Shadows, borders, and overlays show what sits on top of what. Inconsistent depth makes the stacking order unreadable.

**Check.**
- A small set of elevation levels, each with one shadow style.
- Higher surfaces (menus, dialogs) look closer than the content beneath.
- Modals and sheets dim or block the background with a scrim.
- Sticky headers and bars are separated from scrolling content by a shadow or border.
- Nothing is clipped or covered by accident: dropdowns cut off by a container, toasts hidden under a bar.

**Fail signals.** Every card with a different shadow; a modal with no scrim; a dropdown clipped by `overflow: hidden`; overlapping layers in the wrong order.

**Fix direction.** Define elevation tokens; fix stacking contexts.

## U18 Imagery and Media

**Idea.** Images that are sharp, correctly proportioned, and consistently treated support the content. Distorted or blurry ones undermine it.

**Check.**
- Images keep their aspect ratio (no stretching or squashing).
- Images are sharp at the displayed size, including on high-density screens.
- Consistent aspect ratios and corner treatment within a set (a product grid, avatars).
- Space is reserved while images load, so the layout does not jump.
- Informative images have alternative text; decorative ones are marked decorative.
- Illustration and photo styles are consistent.

**Fail signals.** A stretched logo; a blurry upscaled photo; a grid of thumbnails with mixed ratios; content jumping as images arrive; missing alt text.

**Fix direction.** Fix sizing with `object-fit` or equivalent, serve adequate resolution, reserve dimensions.

## U19 Motion

**Idea.** Motion should explain a change or confirm an action. Motion with no purpose distracts, and for some people it causes discomfort.

**Check.**
- Animations have a purpose: showing where something came from, confirming input, indicating progress.
- Transitions are short: roughly 150 to 400 ms for most interface changes (guide).
- Nothing loops or moves indefinitely without a way to pause it (WCAG 2.2.2 covers motion that lasts more than 5 seconds).
- Motion respects the system's reduce-motion setting (`prefers-reduced-motion` on web).
- Nothing flashes more than three times per second (WCAG 2.3.1).

**Fail signals.** Slow decorative animations on every navigation; an auto-advancing carousel with no pause; parallax or zoom effects with no reduce-motion fallback.

**Fix direction.** Cut decorative motion, shorten the rest, honor reduce-motion.

## U20 Responsive and Adaptive Layout

**Idea.** The interface must work at the size, orientation, and settings the user actually has.

**Check.**
- No horizontal scrolling at 320 CSS px wide (WCAG 1.4.10), except for content that needs two dimensions, such as large tables or maps.
- The layout reflows at phone, tablet, and desktop widths; nothing is cut off or overlapping.
- Text can be enlarged to 200% without loss of content (WCAG 1.4.4); zoom is not disabled.
- On mobile: content respects safe areas (notch, home indicator), both orientations work if supported, and system font-size settings are honored.
- On web: the viewport meta tag is present and does not block zoom.
- Fixed-width containers do not exceed the screen.

**Fail signals.** Sideways scroll on a phone; `user-scalable=no` or `maximum-scale=1`; a fixed 1100 px container; text clipped at large font size; content under the notch.

**Fix direction.** Use fluid widths and breakpoints; allow zoom; test at 320 px and at 200% text.
