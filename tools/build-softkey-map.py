#!/usr/bin/env python3
"""Generate systems/_shared/softkeys.json — which games get which soft keys.

A soft key exists to surface a machine key a player cannot guess: the TRS-80's
CLEAR, the BBC's COPY. Showing one on a game that never asks for that key is
noise, and worse, it implies the game wants it. So the policy is: the button
appears only where the game's own page says the key is used.

That makes each gamedoc's **Controls table** the configuration. Not the whole
page — the "Getting started" boilerplate used to hedge with "press the key it
names to begin (often CLEAR)", which was true of nine TRS-80 gamedocs and told
you nothing. The Controls table is the researched, per-game list, so it is the
only part read here.

Deriving the map rather than hand-keeping it means the two cannot disagree: if
a gamedoc gains a CLEAR row, the button appears next build.

Run:  python3 tools/build-softkey-map.py
"""

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# system -> {soft-key id: regex that must match inside the Controls table}
#
# Only systems whose key is genuinely optional are listed. The Atari console
# keys are deliberately absent: OPTION/SELECT/START are named in all 10 of the
# 400 and 800XL gamedocs and every 2600/7800 page names its switches, so gating
# them would add a lookup that can only ever answer "yes".
WANTED = {
    "trs80": {"CLEAR": r"\bCLEAR\b"},
    "bbcmicro": {"COPY": r"\bCOPY\b"},
    "bbcmaster": {"COPY": r"\bCOPY\b"},
}

CONTROLS = re.compile(r"<h2>Controls</h2>(.*?)(?=<h2>|<p class=\"note\")", re.S)


def controls_table(path):
    with open(path, encoding="utf-8") as fh:
        m = CONTROLS.search(fh.read())
    return m.group(1) if m else ""


def main():
    out = {}
    for system, keys in sorted(WANTED.items()):
        docdir = os.path.join(ROOT, "docs", "games", system)
        if not os.path.isdir(docdir):
            print("  no gamedocs for %s — skipped" % system, file=sys.stderr)
            continue
        for fn in sorted(os.listdir(docdir)):
            if not fn.endswith(".html"):
                continue
            game = fn[:-5]
            table = controls_table(os.path.join(docdir, fn))
            found = [k for k, pat in keys.items() if re.search(pat, table)]
            if found:
                out["%s/%s" % (system, game)] = sorted(found)

    dest = os.path.join(ROOT, "systems", "_shared", "softkeys.json")
    with open(dest, "w", encoding="utf-8") as fh:
        json.dump(out, fh, indent=2, sort_keys=True)
        fh.write("\n")

    for system in sorted(WANTED):
        n = sum(1 for k in out if k.startswith(system + "/"))
        total = len(
            [
                f
                for f in os.listdir(os.path.join(ROOT, "docs", "games", system))
                if f.endswith(".html")
            ]
        )
        print("  %-11s %2d of %2d games take a soft key" % (system, n, total))
    print("  wrote systems/_shared/softkeys.json (%d entries)" % len(out))


if __name__ == "__main__":
    main()
