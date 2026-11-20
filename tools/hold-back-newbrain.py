#!/usr/bin/env python3
"""Take the NewBrain out of a built site's DOS prompt.

The NewBrain's files are held back from the published site by an rsync
exclude in build-portable.sh. That alone is not enough: the prompt's
filesystem lives in prompt/javascript/fs.js, which ships regardless, so the
published menu offered a machine whose files were not there. Picking it got
you a games menu, and picking a game got you a 404.

This strips the three places the NewBrain appears in that filesystem:

  1. the NEWBRAIN directory, which holds its games menu and the links into
     systems/newbrain/
  2. the 2.bat that walks into it from PORTABLE COMPUTERS
  3. its row in the PORTABLE COMPUTERS menu, together with the blank line
     above it -- a menu this short puts a blank line between each entry and
     two before Back, so the blank has to go with the row or the spacing
     comes out wrong

It runs on the BUILT COPY, never on the repo. The repo keeps one fs.js with
the NewBrain in it; staging ships that file untouched.

Delete this script, and its call in build-portable.sh, when the NewBrain
ships everywhere.
"""

import re
import sys
from pathlib import Path

ROW = "echo                 º   2.  Grundy NewBrain                (1982) º"
BLANK = "echo                 º                                             º"
BAT = "              { name: '2.bat', data: 'cd newbrain\\ncd games\\nmenu\\n' },\n"
DIR_START = "              {\n                name: 'NEWBRAIN',\n"


def strip_block(src: str, start_marker: str) -> str:
    """Remove one brace-balanced object literal, starting at start_marker.

    Counts braces while skipping single-quoted strings, because the menu data
    is one long quoted blob and a stray brace inside it would throw the count.
    """
    i = src.index(start_marker)
    j = src.index("{", i)
    depth, k, in_str = 0, j, False
    while k < len(src):
        c = src[k]
        if in_str:
            if c == "\\":
                k += 2
                continue
            if c == "'":
                in_str = False
        elif c == "'":
            in_str = True
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                break
        k += 1
    else:
        raise SystemExit("hold-back-newbrain: never closed the NEWBRAIN object")
    end = k + 1
    if src[end : end + 1] == ",":
        end += 1
    while src[end : end + 1] in (" ", "\n"):
        end += 1
    return src[:i] + src[end:]


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: hold-back-newbrain.py <built-site-dir>")
    path = Path(sys.argv[1]) / "prompt" / "javascript" / "fs.js"
    src = path.read_text(encoding="utf-8")
    before = len(src)

    pair = BLANK + "\\n" + ROW + "\\n"
    for name, needle in (("menu row", pair), ("2.bat", BAT)):
        if src.count(needle) != 1:
            raise SystemExit(
                f"hold-back-newbrain: expected exactly one {name}, "
                f"found {src.count(needle)} -- fs.js has changed shape"
            )
        src = src.replace(needle, "")

    if src.count(DIR_START) != 1:
        raise SystemExit("hold-back-newbrain: NEWBRAIN directory not found once")
    src = strip_block(src, DIR_START)

    leftovers = len(re.findall(r"newbrain|NewBrain|NEWBRAIN", src))
    if leftovers:
        raise SystemExit(
            f"hold-back-newbrain: {leftovers} NewBrain references still in fs.js"
        )

    path.write_text(src, encoding="utf-8")
    print(
        f"  held back: NewBrain removed from the prompt filesystem "
        f"({before - len(src)} bytes)"
    )


if __name__ == "__main__":
    main()
