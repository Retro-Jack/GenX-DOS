#!/usr/bin/env bash
# Format the Emscripten JavaScript glue that GenX-DOS compiles itself, and put
# a provenance banner at the top of each file.
#
# Emscripten writes its glue as one long minified line, which nobody can read
# or diff. This runs Prettier over it (with the repo's .prettierrc) and prepends
# a banner saying where the file came from and how to rebuild it.
#
# ONLY engines we build from source are listed below. Glue that came ready-made
# from an upstream (XRoar, jzIntv, EmulatorJS and the rest) stays exactly as it
# shipped: beautifying vendored runtime once broke EmulatorJS.
#
# Safe to run any number of times: an existing banner is stripped before
# formatting and written back afterwards. Run it after every rebuild — the
# m100 and odyssey2 build scripts call it themselves; copies of atari800.js,
# sdltrs.js and cpc.js come from builds outside this repository, so run it
# by hand after copying one in. Then boot the engine before committing.
#
# Usage:
#   tools/beautify-glue.sh              # all of them
#   tools/beautify-glue.sh <file>...    # just these (repo-relative paths)
set -euo pipefail
cd "$(dirname "$(realpath "$0")")/.."

BEGIN='/* GENX-GLUE-BANNER-BEGIN'
END='GENX-GLUE-BANNER-END */'

banner_for() {
  case "$1" in
    systems/m100/virtualt.js)
      echo 'VirtualT (Tandy TRS-80 Model 100): Emscripten JavaScript glue.'
      echo 'Compiled by GenX-DOS from upstream VirtualT plus the headless frontend'
      echo 'in systems/m100/src/, by build.sh there (see BUILDING-WASM.md).' ;;
    systems/atari800/atari800.js | systems/atari400/atari800.js)
      echo 'atari800 v5.2.0: Emscripten JavaScript glue.'
      echo 'Compiled by GenX-DOS from github.com/Retro-Jack/atari800, by'
      echo 'build-wasm.sh there. The atari400 and atari800 bundles carry the'
      echo 'same file.' ;;
    systems/odyssey2/o2em.js)
      echo 'libretro-o2em (Magnavox Odyssey 2): Emscripten JavaScript glue.'
      echo 'Compiled by GenX-DOS from github.com/libretro/libretro-o2em with the'
      echo 'SDL2 frontend in frontend.c beside it, by systems/odyssey2/build.sh.' ;;
    systems/trs80/sdltrs.js)
      echo 'sdltrs (TRS-80 Model III): Emscripten JavaScript glue.'
      echo 'Compiled by GenX-DOS from gitlab.com/jengun/sdltrs, patched to yield'
      echo 'to the browser; see the Emulator-sdltrs-TRS-80 wiki page.' ;;
    systems/cpc/cpc.js)
      echo "floooh's tiny8bit Amstrad CPC: Emscripten JavaScript glue."
      echo 'Rebuilt by GenX-DOS from github.com/floooh/chips-test with local'
      echo 'patches; see systems/cpc/BUILDING-WASM.md.' ;;
    *) return 1 ;;
  esac
}

ALL=(
  systems/m100/virtualt.js
  systems/atari800/atari800.js
  systems/atari400/atari800.js
  systems/odyssey2/o2em.js
  systems/trs80/sdltrs.js
  systems/cpc/cpc.js
)
FILES=("$@")
[ ${#FILES[@]} -eq 0 ] && FILES=("${ALL[@]}")

for f in "${FILES[@]}"; do
  if ! banner_for "$f" >/dev/null; then
    echo "not built by GenX-DOS, left alone: $f" >&2
    exit 1
  fi
  [ -f "$f" ] || { echo "missing: $f" >&2; exit 1; }

  # Strip a banner left by an earlier run.
  if head -n1 "$f" | grep -qF "$BEGIN"; then
    awk -v end="$END" 'done { print; next } index($0, end) { done = 1 }' "$f" > "$f.tmp"
    mv "$f.tmp" "$f"
  fi

  # --ignore-path /dev/null: .prettierignore keeps systems/**/*.js away from
  # everyday formatting, and this is the one deliberate exception.
  npx --yes prettier@3 --log-level warn --ignore-path /dev/null --write "$f"

  {
    echo "$BEGIN"
    banner_for "$f" | sed 's/^/ * /'
    echo ' *'
    echo ' * Generated code, formatted by tools/beautify-glue.sh so that it can be'
    echo ' * read and diffed. Do not edit it by hand: change the source, rebuild,'
    echo ' * and run that script again.'
    echo " * $END"
    cat "$f"
  } > "$f.tmp"
  mv "$f.tmp" "$f"
  echo "formatted: $f"
done
