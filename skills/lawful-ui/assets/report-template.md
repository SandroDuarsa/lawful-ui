# UX and UI Laws Test Report: [product or screen name]

<!-- Write the report in the user's language: translate headings and prose. Keep in English: law names and IDs,
     status words (PASS, WARN, FAIL, N/A, NOT TESTED), severity words, and evidence tags. -->

**Date:** [date] · **Platform:** [web / Android / iOS / ...] · **Tested by:** [agent or person]

## 1. Summary

[Two to four sentences: overall state, the most serious problems, and the first thing to fix.]

| Critical | High | Medium | Low |
|---|---|---|---|
| [n] | [n] | [n] | [n] |

**UX score:** [x] / 100 · **UI score:** [x] / 100. Each is (PASS + 0.5 × WARN) ÷ (PASS + WARN + FAIL) over its coverage table in section 6. Indicators for tracking progress between runs, not grades.

## 2. Scope and method

- **In scope:** [screens, flows]
- **Out of scope / not reachable:** [what and why]
- **Evidence mode:** [running app / source code / screenshots], with [tools used]
- **Viewports or devices:** [e.g. 1280 × 800 and 375 × 812]
- **Limits:** This is a heuristic audit against the Laws of UX and Laws of UI. It finds likely problems; it does not replace testing with real users.

## 3. Inventory

| ID | Screen | Component | Type |
|---|---|---|---|
| S1-C0 | [Home] | [The screen as a whole] | [Screen] |
| S1-C1 | [Home] | [Top navigation] | [Navigation] |
| S1-C2 | [Home] | [Hero call to action] | [Button] |
| S1-C3 | [Home] | [Error state: missing] | [Message] |

## 4. Findings

Ordered by severity. One block per finding.

### F-01 [short title]: [Critical / High / Medium / Low]

- **Component:** [S1-C2, name] · **Where:** [selector, file:line, or screenshot region]
- **Primary law:** [U12 Touch Targets] · **Related:** [L07 Fitts's Law]
- **Evidence** (`measured` / `observed` / `inferred`): [what you found, with numbers]
- **Impact:** [what it costs the user]
- **Fix:** [one concrete change, with target value]

## 5. Results by component

Every component in the inventory, with its worst status. A law not listed for a component passed or did not apply.

| ID | Component | Result | Failed | Warned | Not tested | Findings |
|---|---|---|---|---|---|---|
| S1-C1 | [Top navigation] | [FAIL] | [U12] | [L10] | [-] | [F-04, F-09] |
| S1-C2 | [Hero call to action] | [PASS] | [-] | [-] | [-] | [-] |

## 6. Law coverage

Every law in both sets, each with a status. FAIL = it is the primary law of a finding that breaks a firm threshold or is rated High or Critical. WARN = it is the primary law of a lesser finding, or is named only as a related law. PASS = checked, no finding names it. Otherwise N/A or NOT TESTED. Component and flow findings both count.

### 6a. Laws of UX

| ID | Law | Status | Notes / findings |
|---|---|---|---|
| L01 | Aesthetic-Usability Effect | | |
| L02 | Choice Overload | | |
| L03 | Chunking | | |
| L04 | Cognitive Bias | | |
| L05 | Cognitive Load | | |
| L06 | Doherty Threshold | | |
| L07 | Fitts's Law | | |
| L08 | Flow | | |
| L09 | Goal-Gradient Effect | | |
| L10 | Hick's Law | | |
| L11 | Jakob's Law | | |
| L12 | Law of Common Region | | |
| L13 | Law of Proximity | | |
| L14 | Law of Prägnanz | | |
| L15 | Law of Similarity | | |
| L16 | Law of Uniform Connectedness | | |
| L17 | Mental Model | | |
| L18 | Miller's Law | | |
| L19 | Occam's Razor | | |
| L20 | Paradox of the Active User | | |
| L21 | Pareto Principle | | |
| L22 | Parkinson's Law | | |
| L23 | Peak-End Rule | | |
| L24 | Postel's Law | | |
| L25 | Selective Attention | | |
| L26 | Serial Position Effect | | |
| L27 | Tesler's Law | | |
| L28 | Von Restorff Effect | | |
| L29 | Working Memory | | |
| L30 | Zeigarnik Effect | | |

### 6b. Laws of UI

| ID | Law | Status | Notes / findings |
|---|---|---|---|
| U01 | Visual Hierarchy | | |
| U02 | Alignment and Grid | | |
| U03 | Spacing System | | |
| U04 | Whitespace and Density | | |
| U05 | Typography | | |
| U06 | Readability | | |
| U07 | Color System | | |
| U08 | Contrast | | |
| U09 | Color Independence | | |
| U10 | Consistency | | |
| U11 | Affordance | | |
| U12 | Touch Targets | | |
| U13 | Interactive States | | |
| U14 | Focus Visibility | | |
| U15 | Iconography | | |
| U16 | Form Layout | | |
| U17 | Elevation and Layering | | |
| U18 | Imagery and Media | | |
| U19 | Motion | | |
| U20 | Responsive and Adaptive Layout | | |

## 7. Flows

| Flow | Size | Result | Findings |
|---|---|---|---|
| [Sign up] | [5 screens, 14 fields, 6 actions] | [Completed / blocked at step 3] | [F-02, F-07] |

## 8. Functional notes

Things found while testing that are not UX-law or UI-law findings: broken controls, errors, security or data problems. Omit this section if there are none.

| No | What | Evidence | Severity |
|---|---|---|---|
| FN-1 | [Submit button has no handler] | [`measured`: no DOM change or navigation after click] | [Critical] |

## 9. Fix order

1. [F-01: why first]
2. [F-03]
3. ...

## 10. Not tested

| What | Why | What is needed to test it |
|---|---|---|
| [Payment success screen] | [No test account] | [Sandbox credentials] |
