# Testing a mobile app

Covers native Android and iOS, Flutter, React Native, and other cross-platform apps. A mobile website in a browser is a web test: use `web.md` at a phone viewport.

## Units

Thresholds are in density-independent units, and screenshots are in pixels. Convert before judging.

| Platform | Unit | Conversion | Minimum target |
|---|---|---|---|
| Android | dp | dp = px × 160 ÷ density dpi | 48 × 48 dp |
| iOS | pt | pt = px ÷ scale (2 or 3) | 44 × 44 pt |
| Flutter | logical px | same as dp / pt | 48 × 48 |
| React Native | dp / pt | same as the host platform | 44 to 48 |

## Android, running app

With `adb` and an emulator or device:

```bash
adb shell wm density
adb shell uiautomator dump /sdcard/ui.xml
adb pull /sdcard/ui.xml
adb exec-out screencap -p > screen.png
python3 scripts/android_targets.py ui.xml --density 420
```

The script lists tappable elements under 48 dp, crowded neighbours, tappable elements with no text or content description, and how many tappable elements sit in the bottom strip (the bottom navigation count). Repeat for every screen and for opened menus, dialogs, and sheets.

Compose and Flutter screens may expose fewer nodes to `uiautomator`. If the dump looks sparse, rely on screenshots plus source.

## iOS, running app

With a simulator: take a screenshot (`xcrun simctl io booted screenshot screen.png`) and divide pixel sizes by the device scale to get points. If a UI test target exists, `XCUIApplication().debugDescription` prints the accessibility tree with frames in points. Xcode's Accessibility Inspector shows the frame of any element.

## Screenshots only

Measure in pixels and convert using the device's scale or density. If the device is unknown, estimate against a known element: the iOS status bar and the Android navigation bar have standard heights, and a standard tab bar item is about a fifth of the screen width with five items. Tag these findings `observed` and give the estimate as a range.

## Source only

Read sizes and behaviour from code. Tag findings `inferred`.

| Framework | Where target size lives | Other things to read |
|---|---|---|
| Jetpack Compose | `Modifier.size`, `.padding`, `minimumInteractiveComponentSize`, `IconButton` (48 dp by default) | `KeyboardOptions`, `contentDescription`, navigation graph |
| Android Views | `layout_width/height`, `minWidth/minHeight`, `padding`, `TouchDelegate` | `inputType`, `autofillHints`, `contentDescription` |
| SwiftUI | `.frame`, `.padding`, `.contentShape` | `.keyboardType`, `.textContentType`, `.accessibilityLabel` |
| UIKit | frames, constraints, `point(inside:)` overrides | `keyboardType`, `textContentType` |
| Flutter | `SizedBox`, `constraints`, `IconButton` (48 by default), `InkWell` child size, `materialTapTargetSize` | `keyboardType`, `autofillHints`, `Semantics` |
| React Native | style `width/height/padding`, `hitSlop`, `Pressable` | `keyboardType`, `textContentType`, `autoComplete`, `accessibilityLabel` |

Also look for: loading, empty, and error branches in each screen; whether form state survives navigation and process death; whether lists paginate; debounce on submit buttons; how many items the tab bar defines.

## What to check on every screen

Run the "Mobile-only checks" table in `components.md` and the UI laws in `ui-laws.md` (on mobile, judge them from screenshots and the view hierarchy: hierarchy, alignment, spacing, type size, contrast, states, safe areas), plus:

- **Thumb reach (L07).** On a tall phone held in one hand, the top corners are the hardest place to reach and the lower middle is the easiest. Primary and frequent actions belong low; a top-corner control should not be the only route to a frequent action.
- **Platform conventions (L11).** iOS: tab bar at the bottom, back at top-left plus edge swipe, sheets that drag down to dismiss, native share sheet. Android: system back works everywhere, Material components, snackbars for light feedback. An app that ships one platform's patterns on the other is a finding.
- **Keyboard (L22, L08).** The right keyboard for each field (email, number, phone); the focused field and the submit button stay visible above the keyboard; there is a way to dismiss it; "Next" moves through fields.
- **Gestures (L20).** Swipe actions, long press, and pull to refresh each have a visible alternative or a hint.
- **System settings (L24).** Largest system font size, dark mode, both orientations if supported, small and large devices.
- **Network (L06, L23).** Airplane mode and a throttled connection: is there feedback, and a way to retry?
- **Interruptions (L30, L08).** Background the app mid-form, take a call, rotate: is the input still there?
- **Permissions (L08, L04).** Asked at the moment they are needed, with a reason, and the app still works when declined.

## Response time on mobile (L06)

Count from touch to first visible change. A pressed state should show at once; anything slower than 400 ms needs an indicator. Screen recordings make this measurable: step through the frames and count them (at 60 fps, 24 frames is 400 ms).
