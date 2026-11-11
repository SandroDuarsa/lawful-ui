---
name: lawful-ui
description: Test and audit any web or mobile interface against the 30 Laws of UX (lawsofux.com) and 20 Laws of UI (visual hierarchy, alignment, spacing, typography, color, contrast, touch targets, states, focus, responsive layout, drawn from WCAG, Apple HIG, and Material Design). Use this skill whenever the user asks to test, QA, audit, review, check, or evaluate a website, web app, mobile app, screen, page, flow, component, design, or screenshot, including Indonesian phrasings such as "testing", "tes", "uji", "cek", "periksa", or "review tampilan / UI / UX", even if they never mention UX laws. Also use it when UI was just built or changed and the user asks whether it is good, usable, or ready to ship. It inventories every component, tests each one against the applicable UX and UI laws with measured evidence, and produces a prioritized findings report. Not for backend-only, API, or unit-test work that has no user interface.
---

# lawful-ui: Laws of UX and UI audit

Turn "please test this" into a systematic UX/UI test: every component on every screen in scope is checked against two sets of laws, with evidence, and the result is a report the team can act on.

| Set | What it judges | Where |
|---|---|---|
| **Laws of UX** (L01 to L30) | How well the interface fits the way people think, decide, remember, and move | `references/laws.md`, restated from https://lawsofux.com/ (Jon Yablonski) |
| **Laws of UI** (U01 to U20) | How well the interface itself is built: hierarchy, alignment, spacing, type, color, contrast, components, states, responsiveness | `references/ui-laws.md`, drawn from WCAG 2.2, Apple HIG, Material Design, and visual-design practice |

Both sets are always applied. A screen can obey every UX law and still be badly built, and the reverse.

## What "testing" means here

When a user asks to test a web or mobile product, they usually want to know two things: does it work, and is it good to use. Functional testing answers the first. This skill answers the second, and it runs alongside functional testing rather than replacing it.

If the request is a general "test this", do both. Test function the way you normally would (do the controls work, does the main task complete, are there errors), and record what you find in the report's "Functional notes" section. Problems that matter but belong to no UX law, such as a broken button, a security flaw, or a crash, go there too, so the law findings stay clean and nothing important is dropped.

## Workflow

### 1. Fix the scope and pick the best evidence available

Work out what is being tested (whole product, one flow, one screen, one component) and on which platform. If the user did not narrow it, the scope is every screen you can reach. Only ask a question when you cannot identify any target at all.

**Mind side effects.** Testing means clicking and submitting, and on a live product that can create accounts, send messages, place orders, or delete data. Before submitting anything, check where you are. On a local, test, or staging environment, exercise everything. On production, or when you cannot tell, stay with actions that change nothing (viewing, opening, typing without submitting) and ask the user before going further. Never type real passwords or payment details.

Then use the strongest evidence mode your tools allow, in this order:

| Mode | When | What it gives you |
|---|---|---|
| **Running app** | You can open the site in a browser, or drive an emulator / simulator / device | Measured sizes, real timing, real states. Preferred. |
| **Source code** | You only have the repository | Sizes and structure read from styles and markup; no timing |
| **Screenshots or design files** | You only have images | Visual judgment and pixel estimates |

Modes combine well: run the app for measurements and read the code to find states you could not trigger.

Read the platform guide before measuring:
- Web: `references/web.md` (includes how to run `scripts/ux_probe.js`)
- Android / iOS / Flutter / React Native: `references/mobile.md` (includes `scripts/android_targets.py`)

### 2. Inventory every screen and component

List the screens in scope, then list every component on each screen and give each a stable ID (`S1-C3` = screen 1, component 3). Include the ones that are easy to forget, because that is where problems hide: empty states, loading states, error states, disabled states, modals, toasts, menus that only open on tap, and the keyboard on mobile.

How finely to split:
- A set of repeated items is one component (a navigation bar with 14 links is one row, a product grid is one row).
- A form is one component for its overall structure, plus one row for each field or field group that has concerns of its own (password, phone, payment).
- Each screen gets a row `C0`, "the screen as a whole", which holds the screen-level checks.
- A state you expected and could not find (no error state, no loading state, no confirmation) still gets a row, marked "missing". A missing state is often the finding.

The inventory is what makes the test complete. A component that is not in the inventory was not tested, so write the inventory down before judging anything.

### 3. Measure

Collect numbers before forming opinions. On web, run `scripts/ux_probe.js` at a desktop viewport and at a phone viewport (about 375 × 812). On Android, dump the view hierarchy and run `scripts/android_targets.py`. Elsewhere, measure from screenshots or read values from code.

Exercise the states, not just the resting screen: hover, focus, pressed, disabled, loading, empty, error, and long or unusual content.

### 4. Evaluate each component against its laws

For each component, apply both sets:

- **UX laws:** look up the component type in `references/components.md` to see which laws apply and what to check. Use `references/laws.md` for the pass / fail criteria.
- **UI laws:** use the table "Which UI laws apply to which component" at the top of `references/ui-laws.md`, then the criteria below it.

When one defect touches both sets (a 16 px icon button fails L07 Fitts's Law and U12 Touch Targets), write one finding and cite both laws.

Give every component-law pair one status:

- **PASS**: meets the criteria, with evidence.
- **WARN**: works, but is weaker than it should be, or sits near a threshold.
- **FAIL**: violates the law in a way that will cost users time, errors, or trust.
- **N/A**: the law does not apply to this component.
- **NOT TESTED**: it applies, but you could not verify it with the access you had. Say what would be needed.

### 5. Evaluate the flows

Some laws only show up across a journey, not on a single component: Doherty Threshold, Flow, Goal-Gradient, Peak-End, Zeigarnik, Parkinson's, Working Memory, Tesler's, Pareto. Walk the main task flows end to end (sign up, search, purchase, create, whatever the product is for) and judge those laws on the journey. See "Flow-level checks" in `references/components.md`.

### 6. Report

Write the report using `assets/report-template.md`. Write it in the language the user is using. Save it as a file when you can write files; otherwise put it in the reply.

Every one of the 30 UX laws and 20 UI laws appears in its coverage table with a status, even if the status is N/A or NOT TESTED, so the reader can see nothing was skipped. The status of a law follows from its findings, component-level and flow-level alike, so that two testers reach the same result:

- FAIL: at least one Critical or High finding cites the law.
- WARN: only Medium or Low findings cite it.
- PASS: it was checked and no finding cites it.
- N/A or NOT TESTED: as defined above.

Report two scores, one per coverage table: UX score and UI score, each (PASS + 0.5 × WARN) ÷ (PASS + WARN + FAIL) × 100. They exist to compare one run with the next on the same product.

### 7. Fix and retest, if asked

The default deliverable is the report. Change code or designs only when the user asked for fixes. After fixing, rerun the same measurements and update the statuses, so the report shows before and after.

## Rules of evidence

These keep the report trustworthy.

- **Tag each finding with how you know it**: `measured` (a tool returned it from the running app: a size, a timing, a count, an attribute of the live page), `observed` (you saw it in the running app or a screenshot), or `inferred` (read from source code without running it, or deduced). A reader will act differently on "the button is 28 px, measured" than on "the button looks small".
- **Never invent a measurement.** If you could not measure, say so and mark it NOT TESTED or `inferred`.
- **Cite the location**: screen, component ID, and a selector, file and line, or screenshot region. A finding nobody can locate will not get fixed.
- **Say what the user loses.** "Violates Fitts's Law" is not a finding. "The 16 px close icon sits 4 px from Delete, so a thumb will hit Delete by accident" is.
- **Give one concrete fix per finding**, with the target value where there is one.

## Judgment

The UX laws are heuristics drawn from psychology, not a compliance standard. The UI laws are firmer where they quote WCAG or a platform guideline, and rules of thumb elsewhere (`ui-laws.md` marks which). Apply both the way an experienced designer would:

- **Context decides.** An expert tool used eight hours a day can be denser than a consumer checkout. Judge against the audience and the task.
- **Laws pull against each other.** Hick's Law says reduce choices; hiding them behind menus raises Cognitive Load and breaks Jakob's Law if users expect them visible. Tesler's Law says complexity must live somewhere. When two laws conflict, name the trade-off and recommend the side that serves the main task.
- **Numbers are signals, not verdicts.** Miller's "7 ± 2" is about memory, and is not a rule that a menu may hold only seven items. A nine-item navigation that is well grouped passes. The hard numbers in this skill (target sizes, contrast ratios, response times) come from platform guidelines and WCAG and can be treated as firm; the counts are prompts to look closer.
- **Severity follows impact.** Rate by how badly a finding blocks the main task, how many users meet it, and how often.

| Severity | Meaning |
|---|---|
| Critical | Blocks a main task, destroys saved data, or tricks the user into paying or sharing something they did not choose |
| High | Main task is still possible but slow, error-prone, or confusing for most users; loses unsaved input; pressures the user without costing them money or data |
| Medium | Friction on a secondary task, or a main-task issue only some users will meet |
| Low | Polish; noticeable but cheap to live with |

A heuristic audit finds likely problems. It does not replace watching real users, and the report should say so in one line.

## Files in this skill

| File | Read it when |
|---|---|
| `references/laws.md` | Judging a UX law: idea, checks, fail signals, fix direction for all 30 |
| `references/ui-laws.md` | Judging a UI law: the same for all 20, plus which UI laws apply to which component |
| `references/components.md` | Mapping a component type or a flow to the UX laws and checks that apply |
| `references/web.md` | Testing a website or web app; explains the probe output |
| `references/mobile.md` | Testing Android, iOS, Flutter, or React Native |
| `scripts/ux_probe.js` | Measuring a web page (paste into any browser automation or the console) |
| `scripts/android_targets.py` | Measuring tap targets from an Android view-hierarchy dump |
| `assets/report-template.md` | Writing the report |
