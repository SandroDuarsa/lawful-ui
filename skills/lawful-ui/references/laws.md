# The 30 Laws of UX as test criteria

Source of the laws: https://lawsofux.com/ . The wording below is this skill's own restatement, written for testing. Each law has an ID (L01 to L30, alphabetical, matching the site) used in the report.

## Contents

| Group | Laws |
|---|---|
| Choice and decision | L02 Choice Overload, L10 Hick's Law, L21 Pareto Principle, L19 Occam's Razor |
| Memory and mental effort | L03 Chunking, L05 Cognitive Load, L18 Miller's Law, L29 Working Memory |
| Visual grouping (Gestalt) | L12 Common Region, L13 Proximity, L14 Prägnanz, L15 Similarity, L16 Uniform Connectedness |
| Attention and emphasis | L25 Selective Attention, L26 Serial Position Effect, L28 Von Restorff Effect, L01 Aesthetic-Usability Effect |
| Pointing and input | L07 Fitts's Law, L24 Postel's Law |
| Time and responsiveness | L06 Doherty Threshold, L22 Parkinson's Law |
| Motivation and journey | L08 Flow, L09 Goal-Gradient Effect, L23 Peak-End Rule, L30 Zeigarnik Effect |
| Expectations | L11 Jakob's Law, L17 Mental Model, L20 Paradox of the Active User |
| Complexity and ethics | L27 Tesler's Law, L04 Cognitive Bias |

## Firm thresholds used across laws

These come from platform guidelines and WCAG 2.2, so treat them as firm.

| Measure | Threshold |
|---|---|
| Tap / click target, web | Fail below 24 × 24 CSS px (WCAG 2.5.8). Aim for 44 × 44 on touch layouts. |
| Tap target, iOS | 44 × 44 pt |
| Tap target, Android | 48 × 48 dp |
| Gap between adjacent small targets | 8 px / pt / dp or more |
| Text contrast | 4.5 : 1 normal text; 3 : 1 large text (24 px+, or 18.66 px+ bold) and UI component boundaries |
| Feedback after an action | Visible within 100 ms feels instant; 400 ms is the Doherty limit; show a loading indicator past 1 s; show progress and allow leaving past 10 s |
| Body text size | 16 px web / 17 pt iOS / 16 sp Android is the comfortable default; below 12 is a fail |
| Line length | About 45 to 75 characters per line on desktop (over 90 is a fail signal), 30 to 50 on phones |

---

## L01 Aesthetic-Usability Effect
https://lawsofux.com/aesthetic-usability-effect/

**Idea.** People assume a good-looking interface is easier to use and forgive its small flaws. This cuts both ways: polish builds trust, and polish can hide real usability problems.

**Check.**
- Spacing, alignment, type sizes, colors, radii, and icon style follow a consistent system.
- Nothing is visually broken: overflow, clipped text, overlapping elements, stretched or blurry images, layout shift, misaligned baselines.
- The layout holds at every breakpoint and with long content.
- Looks are not masking problems: test function on the prettiest screens as hard as on the plain ones.

**Fail signals.** Many unrelated font sizes or grays; inconsistent padding between similar cards; horizontal scroll on a phone; a beautiful screen whose main action does not work.

**Fix direction.** Adopt a spacing and type scale; repair broken layouts first, since they cost the most trust.

## L02 Choice Overload
https://lawsofux.com/choice-overload/

**Idea.** Facing too many options, people stall, choose badly, or leave.

**Check.** At each decision point (plans, products, templates, filters, share targets, action menus) count the options shown at once. Look for a recommended or default choice, a way to narrow (search, filter, sort, categories), and a way to compare.

**Fail signals.** More than about 7 comparable options with no grouping, filter, or recommendation; four or more pricing plans with none highlighted; a long flat list of settings.

**Fix direction.** Curate, feature one, group the rest, reveal the long tail on request.

## L03 Chunking
https://lawsofux.com/chunking/

**Idea.** Information broken into small meaningful groups is easier to scan, understand, and remember.

**Check.**
- Long content has headings, short paragraphs, lists, and whitespace between groups.
- Long strings are grouped: phone numbers, card numbers, OTP codes, account numbers, currency with thousands separators.
- Long forms are split into labelled sections or steps.

**Fail signals.** A text block of 600+ characters with no break; a 16-digit number shown or typed as one run; a form with more than about 7 fields and no sections.

**Fix direction.** Group by meaning, label each group, format numbers.

## L04 Cognitive Bias
https://lawsofux.com/cognitive-bias/

**Idea.** People decide with predictable shortcuts. An interface can support good decisions or exploit those shortcuts.

**Check.** Look for manipulation: fake urgency or scarcity, countdown timers that reset, confirmshaming ("No thanks, I don't like saving money"), pre-ticked upsells or consent, costs revealed only at the last step, fake "was" prices, accept buttons that are far more prominent than decline, hard-to-find cancel or unsubscribe. Also check that defaults are in the user's interest and that framing is neutral.

**Fail signals.** Any dark pattern. Rate it Critical when it makes the user pay or share something they did not choose (pre-ticked paid add-on, hidden cost, forced consent), and High when it pressures without that cost (fake urgency, confirmshaming). They damage trust and can be illegal.

**Fix direction.** Honest defaults, symmetric choices, full price early.

## L05 Cognitive Load
https://lawsofux.com/cognitive-load/

**Idea.** Every element costs mental effort. Effort spent decoding the interface is effort not spent on the task.

**Check.**
- Each screen has one clear purpose and a visible next step.
- No clutter: decorative elements, repeated information, competing banners.
- Labels are plain words; icons that are not universal have text labels.
- The user is not asked to calculate, convert, or remember things the system knows.
- Errors say what happened and how to fix it.

**Fail signals.** Icon-only toolbars with unfamiliar icons; jargon or internal codes; several things animating or demanding attention at once; error text such as "Error 422".

**Fix direction.** Remove, group, label, and let the system do the work.

## L06 Doherty Threshold
https://lawsofux.com/doherty-threshold/

**Idea.** People stay engaged when the system responds within about 400 ms. Slower than that, attention drifts.

**Check.**
- Every tap, click, and keystroke produces visible feedback within 400 ms (pressed state, spinner, skeleton, optimistic update).
- Waits over 1 s show a loading indicator; waits over about 10 s show progress and do not trap the user.
- Content does not jump as it loads.
- Measure page load (first contentful paint, load) and at least the main interactions.

**Fail signals.** A button that does nothing visible for a second after tapping; a blank white screen during navigation; double submissions because nothing showed the first tap registered.

**Fix direction.** Immediate pressed and loading states, skeletons, optimistic UI, then real performance work.

## L07 Fitts's Law
https://lawsofux.com/fittss-law/

**Idea.** A target takes longer to hit the smaller and farther away it is.

**Check.**
- Target sizes meet the firm thresholds above. Measure them.
- Adjacent targets have enough gap, especially a destructive action next to a common one.
- The primary action is large and sits where the pointer or thumb already is: near the content it acts on, and within thumb reach on phones (lower half of the screen).
- The whole row, card, or label is clickable when it looks like it should be, not only the text or a tiny chevron.
- Related actions sit together, so the pointer does not travel across the screen between steps.

**Fail signals.** Icon buttons of 16 to 24 px with no padding; close buttons in the far top corner of a phone screen as the only way out; checkbox whose label is not clickable; Delete right beside Save.

**Fix direction.** Grow the hit area (padding counts), add spacing, move the action closer.

## L08 Flow
https://lawsofux.com/flow/

**Idea.** People do their best work when absorbed in a task that matches their skill, with clear goals and immediate feedback. Interruptions and confusion break that state.

**Check.**
- The main task can be completed without being interrupted by popups, sign-up walls, rating prompts, autoplaying media, or unrelated notifications.
- There is always a clear next step and never a dead end.
- Feedback is immediate; errors are recoverable without losing entered data.
- Difficulty fits the audience: neither patronizing nor overwhelming.

**Fail signals.** A newsletter modal a few seconds into reading; a form that clears on error; a screen with no way forward.

**Fix direction.** Defer interruptions until a task is finished; preserve input; always offer a next action.

## L09 Goal-Gradient Effect
https://lawsofux.com/goal-gradient-effect/

**Idea.** People push harder as they get closer to a goal, so showing progress keeps them going.

**Check.** Multi-step flows (three steps or more) show where the user is and how much is left: step counter, progress bar, checklist. Progress never moves backwards unexpectedly. Rewards and completion states show how close the user is.

**Fail signals.** A checkout or onboarding of unknown length; a progress bar that jumps back; a step count that grows midway.

**Fix direction.** Show "Step 2 of 4"; give credit for what is already done.

## L10 Hick's Law
https://lawsofux.com/hicks-law/

**Idea.** The more options, and the more complex they are, the longer a decision takes.

**Check.**
- Count choices at each decision point: navigation items, buttons on a screen, menu entries, form options.
- Each view has one obvious primary action; secondary actions look secondary.
- Long lists are ordered meaningfully and are searchable or categorized.
- Complex tasks are broken into steps; a recommended option is highlighted.

**Fail signals.** Two or more equally loud primary buttons; a flat menu of 12+ unrelated items; a first-run screen that asks for many decisions at once.

**Fix direction.** Prioritize, group, stage. Do not simplify so far that labels become vague, since that only moves the decision cost.

## L11 Jakob's Law
https://lawsofux.com/jakobs-law/

**Idea.** People spend most of their time in other products and expect yours to work the same way.

**Check.**
- Web conventions: logo top-left linking home, primary navigation at the top or left, search near the top, cart and account top-right, links that look like links, standard form controls.
- Platform conventions: iOS back swipe and tab bar at the bottom, Android system back and Material patterns, native pickers and share sheets, pull to refresh.
- Icons carry their usual meaning (magnifier = search, gear = settings, trash = delete).
- Standard gestures and keyboard behaviour work (Enter submits, Esc closes, Tab moves focus).

**Fail signals.** Custom scrolling or custom dropdowns that behave unlike native ones; a hamburger icon that opens something other than navigation; back button that exits the flow or loses data.

**Fix direction.** Use the convention unless there is a strong, tested reason not to.

## L12 Law of Common Region
https://lawsofux.com/law-of-common-region/

**Idea.** Elements inside the same clearly bounded area are seen as a group.

**Check.** Related items share a container (card, panel, background, border). Unrelated items are not placed in the same container. Each card holds one subject, and its actions apply to that subject.

**Fail signals.** One card mixing two unrelated topics; an action button inside a container it does not act on; adjacent groups with no visible boundary where spacing alone is ambiguous.

**Fix direction.** Add or correct the boundary; one container per group.

## L13 Law of Proximity
https://lawsofux.com/law-of-proximity/

**Idea.** Things placed close together are read as related.

**Check.**
- A label is closer to its own field than to the neighbouring field.
- A heading is closer to the content below it than to the section above it.
- Helper and error text sit directly by the field they refer to.
- A button sits by the thing it acts on.
- Space between groups is clearly larger than space within a group.

**Fail signals.** Evenly spaced labels and fields where it is unclear which label belongs to which field; an error summary far from the fields; a Save button visually closer to a different section.

**Fix direction.** Tighten within groups, widen between them.

## L14 Law of Prägnanz
https://lawsofux.com/law-of-pr%C3%A4gnanz/

**Idea.** People interpret complex or ambiguous visuals in the simplest way they can, because that takes least effort.

**Check.** Layouts follow a clear, simple structure (a grid, a few alignment axes). Icons and illustrations are simple and unambiguous. Shapes and decorations do not compete with content.

**Fail signals.** Many alignment axes on one screen; intricate icons that cannot be read at their display size; decorative backgrounds that make text hard to read.

**Fix direction.** Simplify shapes, align to a grid, remove ornament.

## L15 Law of Similarity
https://lawsofux.com/law-of-similarity/

**Idea.** Things that look alike are assumed to do alike.

**Check.**
- Elements with the same function share one style across the whole product (all primary buttons, all links, all inputs).
- Interactive elements look different from static ones. Static text is not styled like a link; a clickable card looks clickable.
- Icon style, corner radius, and color roles are consistent.
- Count distinct button styles; more than about three or four per product deserves a closer look.

**Fail signals.** The same action styled differently on different screens; colored, underlined text that is not a link; a tag that looks like a button.

**Fix direction.** One style per role; use a component library.

## L16 Law of Uniform Connectedness
https://lawsofux.com/law-of-uniform-connectedness/

**Idea.** Elements joined by a visual link (a line, a shared color, a frame) are seen as more related than unconnected ones.

**Check.** Steppers and timelines have connecting lines. The active tab visibly connects to its panel. Dropdowns, popovers, and tooltips attach to or point at their trigger. Related fields are tied together visually.

**Fail signals.** A tab panel that looks detached from its tab; a popover that appears far from its trigger; steps shown as loose numbers with nothing linking them.

**Fix direction.** Add the connection: line, arrow, shared edge or color.

## L17 Mental Model
https://lawsofux.com/mental-model/

**Idea.** People act on their own picture of how the system works. When the interface matches that picture, it feels obvious.

**Check.**
- Words are the user's words, not internal or technical terms.
- The structure matches how users think about their tasks, not the database or the org chart.
- Metaphors are consistent (cart, folder, inbox).
- Actions do what people predict: back goes back, undo undoes, toggles apply the way neighbouring toggles do, state persists where expected.

**Fail signals.** Menu names only staff understand; back button that discards a filled form without warning; some settings save instantly and others need a Save button on the same screen.

**Fix direction.** Rename and restructure to match the user's model; make behaviour consistent.

## L18 Miller's Law
https://lawsofux.com/millers-law/

**Idea.** People can hold only a handful of items in short-term memory, classically put at 7 ± 2.

**Check.** The user is never required to keep more than a few items in mind at once. Content is chunked (see L03). Do not use "seven" as a cap on menus or lists that stay visible; things on screen do not need to be remembered. Judge whether the interface relies on memory, not whether it has more than seven of something.

**Fail signals.** Instructions on one screen that must be remembered on the next; long ungrouped codes; a comparison that has to be held in the head.

**Fix direction.** Keep information visible, chunk it, let the system remember.

## L19 Occam's Razor
https://lawsofux.com/occams-razor/

**Idea.** Among solutions that work equally well, prefer the one with the fewest parts.

**Check.** For each element ask what the user loses if it is removed. Look for duplicate paths to the same place with different labels, fields whose data is never needed, confirmation steps that confirm nothing risky, and decoration without purpose.

**Fail signals.** Two buttons that do the same thing; "Are you sure?" on a harmless action; optional fields that outnumber the required ones.

**Fix direction.** Remove until something breaks, then put that one back.

## L20 Paradox of the Active User
https://lawsofux.com/paradox-of-the-active-user/

**Idea.** People do not read manuals. They start using the product straight away and learn only when stuck.

**Check.**
- The product is usable with no tutorial.
- Guidance appears in context at the moment of need: inline hints, tooltips, helpful empty states, sensible placeholders.
- Onboarding is short and skippable.
- Features are discoverable from the interface itself.

**Fail signals.** A forced multi-screen tutorial before first use; essential information that lives only in an FAQ; hidden gestures with no visible alternative.

**Fix direction.** Teach inside the task; make empty states instructive.

## L21 Pareto Principle
https://lawsofux.com/pareto-principle/

**Idea.** A small share of features and screens carries most of the use.

**Check.** Identify the few tasks most users come for. Those tasks are the most prominent and take the fewest steps. Rarely used features do not occupy prime space.

**Fail signals.** The main task is three or more levels deep while a rare feature sits on the home screen; every feature given equal weight.

**Fix direction.** Promote the vital few, tuck away the rest.

## L22 Parkinson's Law
https://lawsofux.com/parkinsons-law/

**Idea.** A task swells to fill the time available. Interfaces that shorten the task beat the user's expectation.

**Check.**
- The system fills in what it can: autofill, saved details, sensible defaults, remembered preferences.
- Inputs use the right `type`, `autocomplete`, and keyboard so entry is fast.
- Codes can be pasted or auto-read; addresses autocomplete.
- Time expectations are set ("takes about 2 minutes") and time limits are announced.

**Fail signals.** Re-entering information the product already has; a numeric field that opens the full keyboard; paste disabled on a code or password field.

**Fix direction.** Prefill, default, and remove steps.

## L23 Peak-End Rule
https://lawsofux.com/peak-end-rule/

**Idea.** People remember an experience by its most intense moment and by how it ended.

**Check.**
- The end of each main flow is a clear, satisfying confirmation that says what happened and what comes next.
- The high point of the product (the moment of value) is polished.
- Negative peaks are softened: error pages, payment failures, empty results, and waits are handled with care and a way forward.

**Fail signals.** A flow that ends by dropping the user back on a list with no confirmation; a raw error page as the last thing seen; harsh or blaming error wording.

**Fix direction.** Design the success and failure endings on purpose.

## L24 Postel's Law
https://lawsofux.com/postels-law/

**Idea.** Be generous in what you accept from users and consistent in what you give back.

**Check.**
- Inputs accept the formats people naturally type: phone numbers with spaces, dashes, or country code; dates in common forms; leading and trailing spaces; any letter case in emails; pasted values.
- Validation is tolerant and explains itself; the system normalizes instead of rejecting.
- The layout copes with varied conditions: long names, translated text, large font settings, small and large screens, slow networks.

**Fail signals.** "Invalid format" because of a space in a card number; a required pattern that is not shown up front; a layout that breaks at 200% text size or with a long name.

**Fix direction.** Normalize input in code; design for the extremes.

## L25 Selective Attention
https://lawsofux.com/selective-attention/

**Idea.** People focus on what serves their goal and filter out the rest, which is why banners and changes outside their focus go unseen.

**Check.**
- Important information does not look like an advertisement or sit where promotions usually sit.
- Feedback appears where the user is looking: errors next to the field, confirmation near the action.
- Changes on screen are noticeable from the point of action.
- Motion and decoration do not pull attention away from the task.
- Critical messages do not vanish on a timer.

**Fail signals.** An error shown at the top of a long form while the user is at the bottom; a critical notice styled as a promo banner; an auto-dismissing toast for a failed payment.

**Fix direction.** Put feedback at the focus of attention; keep critical messages until acknowledged.

## L26 Serial Position Effect
https://lawsofux.com/serial-position-effect/

**Idea.** In a sequence, the first and last items are remembered best.

**Check.** In navigation bars, tab bars, menus, and lists, the most important items sit at the start and the end; the least important sit in the middle. Key points open and close a block of content.

**Fail signals.** The primary destination buried in the middle of a tab bar; the key action in the middle of a long menu.

**Fix direction.** Reorder so the ends carry the weight.

## L27 Tesler's Law
https://lawsofux.com/teslers-law/

**Idea.** Every process has complexity that cannot be removed, only moved. The question is who carries it: the system or the user.

**Check.**
- The system does what it can do: detect card type, derive city from postal code, detect locale and time zone, compute totals, format input, remember preferences.
- Simplification has not gone too far: icons without labels, hidden options, and vague wording push the complexity back to the user as guesswork.

**Fail signals.** Asking the user to choose their card type; asking for data the system could look up; a "clean" screen where nobody can find the main feature.

**Fix direction.** Move the work into the system; keep necessary complexity visible and well organized.

## L28 Von Restorff Effect
https://lawsofux.com/von-restorff-effect/

**Idea.** Among similar items, the one that differs stands out and is remembered.

**Check.**
- The primary action or key information on each view is visually distinct, and only that.
- Emphasis is used sparingly; if several things shout, none is heard.
- Emphasis does not rely on color alone, so it survives color blindness.
- Distinct styling is not mistaken for an advertisement (see L25).

**Fail signals.** Primary and secondary buttons that look the same; five accent-colored elements on one screen; badges on everything.

**Fix direction.** One emphasized element per view; demote the rest.

## L29 Working Memory
https://lawsofux.com/working-memory/

**Idea.** People hold about four chunks in mind for a short time. Recognizing is easier than recalling.

**Check.**
- Information needed on a later screen is carried forward and shown there (order summary, selected filters, entered details on a review step).
- Comparison happens side by side, not by flipping between pages.
- The interface shows state: visited links, current location, active filters, recent items.
- Codes can be copied, pasted, or auto-filled.

**Fail signals.** A code shown on one screen that must be typed on another with no copy button; active filters that are invisible; a wizard that hides earlier answers.

**Fix direction.** Show it, do not make people remember it.

## L30 Zeigarnik Effect
https://lawsofux.com/zeigarnik-effect/

**Idea.** Unfinished tasks stay on the mind more than finished ones.

**Check.**
- Incomplete work is visible and resumable: saved drafts, persistent cart, "continue where you left off", setup checklists, profile completeness.
- Completion is clearly marked.
- Reminders about unfinished tasks are helpful and can be dismissed, not nagging.

**Fail signals.** Progress lost when leaving a form; no draft; an abandoned setup with no way back in; guilt-driven nagging (see L04).

**Fix direction.** Save state automatically and show a clear path to finish.
