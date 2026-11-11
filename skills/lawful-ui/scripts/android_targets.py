#!/usr/bin/env python3
"""Measure tap targets in an Android view-hierarchy dump for the Laws of UX audit.

Get a dump of the current screen:
    adb shell uiautomator dump /sdcard/ui.xml && adb pull /sdcard/ui.xml
    adb shell wm density            # e.g. "Physical density: 420"

Then:
    python3 android_targets.py ui.xml --density 420

Prints JSON: tappable elements smaller than 48 dp, crowded neighbours, tappable
elements with no text or content description, and the bottom-navigation item count.
Standard library only. Reads the file; changes nothing.
"""
import argparse
import json
import re
import sys
import xml.etree.ElementTree as ET

BOUNDS = re.compile(r"\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]")
MIN_DP = 48
MIN_GAP_DP = 8


def parse_bounds(node):
    m = BOUNDS.match(node.get("bounds", ""))
    if not m:
        return None
    x1, y1, x2, y2 = map(int, m.groups())
    return (x1, y1, x2, y2) if x2 > x1 and y2 > y1 else None


def label_of(node):
    for n in node.iter("node"):
        text = (n.get("text") or n.get("content-desc") or "").strip()
        if text:
            return text[:50]
    return ""


def gap(a, b):
    dx = max(0, max(a[0], b[0]) - min(a[2], b[2]))
    dy = max(0, max(a[1], b[1]) - min(a[3], b[3]))
    return (dx * dx + dy * dy) ** 0.5


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("dump", help="XML file from `uiautomator dump`")
    ap.add_argument("--density", type=float, default=160, help="screen density in dpi from `adb shell wm density`")
    args = ap.parse_args()

    to_dp = lambda px: round(px * 160 / args.density, 1)
    root = ET.parse(args.dump).getroot()

    screen = None
    tappable = []
    for node in root.iter("node"):
        b = parse_bounds(node)
        if b is None:
            continue
        if screen is None:
            screen = b
        if node.get("clickable") == "true" or node.get("checkable") == "true" or node.get("long-clickable") == "true":
            tappable.append({"node": node, "bounds": b})

    small, unlabeled = [], []
    for t in tappable:
        x1, y1, x2, y2 = t["bounds"]
        w, h = to_dp(x2 - x1), to_dp(y2 - y1)
        node = t["node"]
        ident = node.get("resource-id") or node.get("class", "")
        label = label_of(node)
        if not label:
            unlabeled.append({"id": ident, "bounds": node.get("bounds")})
        if min(w, h) < MIN_DP:
            others = [o for o in tappable if o is not t and gap(t["bounds"], o["bounds"]) > 0]
            nearest = min((gap(t["bounds"], o["bounds"]) for o in others), default=None)
            nearest_dp = to_dp(nearest) if nearest is not None else None
            small.append({
                "id": ident, "label": label, "widthDp": w, "heightDp": h, "bounds": node.get("bounds"),
                "nearestTargetGapDp": nearest_dp,
                "crowded": nearest_dp is not None and nearest_dp < MIN_GAP_DP,
            })
    small.sort(key=lambda s: min(s["widthDp"], s["heightDp"]))

    bottom_nav = 0
    if screen:
        cutoff = screen[3] - (screen[3] - screen[1]) * 0.12
        row = [t for t in tappable if t["bounds"][1] >= cutoff]
        bottom_nav = len(row)

    out = {
        "screen": {"widthDp": to_dp(screen[2] - screen[0]), "heightDp": to_dp(screen[3] - screen[1])} if screen else None,
        "densityDpi": args.density,
        "summary": {
            "tappableElements": len(tappable),
            "below48dp": len(small),
            "crowded": sum(1 for s in small if s["crowded"]),
            "withoutLabel": len(unlabeled),
            "tappableInBottom12Percent": bottom_nav,
        },
        "smallTargets": small[:40],
        "unlabeledTargets": unlabeled[:40],
    }
    json.dump(out, sys.stdout, indent=2, ensure_ascii=False)
    print()


if __name__ == "__main__":
    main()
