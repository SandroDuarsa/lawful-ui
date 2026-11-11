---
name: lawful-ui
description: Make web and mobile interfaces obey 30 Laws of UX (lawsofux.com) and 20 Laws of UI (hierarchy, spacing, typography, color, contrast, touch targets, states, focus, responsive layout; from WCAG, Apple HIG, Material Design). It has two modes. Use Build mode whenever you create, design, or change any user interface (a page, screen, component, form, layout, or mockup, in any framework), so the result follows the laws from the start, even if the user never mentions UX. Use Test mode whenever the user asks to test, QA, audit, review, or check a website, app, screen, flow, component, design, or screenshot; it inventories every component, checks each against the laws with measured evidence, and writes a prioritized findings report. Also triggers on Indonesian phrasings such as "buat", "bikin", "desain", "testing", "tes", "uji", "cek", "review tampilan". Not for backend-only, API, or unit-test work with no user interface.
---

# lawful-ui: make the UI obey the law

Two sets of laws, applied in two modes: while an interface is being built, and when one is being tested.

| Set | What it judges | Where |
|---|---|---|
| **Laws of UX** (L01 to L30) | How well the interface fits the way people think, decide, remember, and move | `references/laws.md`, restated from https://lawsofux.com/ (Jon Yablonski) |
| **Laws of UI** (U01 to U20) | How well the interface itself is built: hierarchy, alignment, spacing, type, color, contrast, components, states, responsiveness | `references/ui-laws.md`, drawn from WCAG 2.2, Apple HIG, Material Design, and visual-design practice |

Both sets are always applied. A screen can obey every UX law and still be badly built, and the reverse.

## Pick the mode

| Mode | You are in it when | Read |
|---|---|---|
| **Build** | You are creating or changing an interface: a page, screen, component, form, layout, or mockup. The user does not have to mention UX. | `references/build.md`: the rules to build with, so the result obeys the laws from the start. For a new screen or flow, run its short check and close with a "Lawful check" note. |
| **Test** | The user asks to test, QA, audit, review, or check an interface that exists. | `references/test.md`: the workflow, the rules of evidence, and how to score. It ends in a findings report. |

Read only the file for your mode, then whatever that file points you to.

When a request is both ("build the checkout page, then test it"), build first, then test what you built. When the user asks you to fix test findings, the fixes follow `references/build.md`.

Build mode keeps violations out. Test mode finds the ones that are already there. Neither replaces the other: Build mode does not produce a findings report, and Test mode does not change anything unless asked.

## Files in this skill

| File | Read it when |
|---|---|
| `references/build.md` | Build mode: the rules to build with and the check before delivering |
| `references/test.md` | Test mode: the workflow, rules of evidence, severity, and scoring |
| `references/laws.md` | Judging a UX law: idea, checks, fail signals, fix direction for all 30 |
| `references/ui-laws.md` | Judging a UI law: the same for all 20, plus which UI laws apply to which component |
| `references/components.md` | Mapping a component type or a flow to the UX laws and checks that apply |
| `references/web.md` | Testing a website or web app; explains the probe output |
| `references/mobile.md` | Testing Android, iOS, Flutter, or React Native |
| `scripts/ux_probe.js` | Measuring a web page; read-only |
| `scripts/ux_checks.js` | Interactive web checks: dead controls, focus visibility, state styles, grayscale and text-spacing aids |
| `scripts/serve.py` | Serving the scripts (and, with `--site`, a page on disk) on localhost for browser tools |
| `scripts/android_targets.py` | Measuring tap targets from an Android view-hierarchy dump |
| `assets/report-template.md` | Writing the report |
