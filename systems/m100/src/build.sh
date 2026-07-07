#!/usr/bin/env bash
# Reproducible WASM build for the Tandy TRS-80 Model 100 (VirtualT) bundle.
#
# This bundle is VirtualT's FLTK-free core compiled to WebAssembly behind a
# small headless SDL2 frontend — an *acknowledgement* of VirtualT, not a fork:
# the ~40 FLTK GUI / IDE / debugger files are simply never compiled. The five
# .c files beside this script are the GenX-DOS side of that (see BUILDING-WASM.md
# and LICENSE); everything else comes straight from upstream VirtualT.
#
# Inputs:
#   - VirtualT source   (git.code.sf.net/p/virtualt/code — core .c + the 32 KB
#                        M100 ROM, which upstream tracks at ROMs/M100rom.bin)
#   - *.c in this dir    (our headless frontend + display/file/clock/stubs units)
# Outputs (written up into the bundle, systems/m100/):
#   - virtualt.js, virtualt.wasm
# Requires: an activated emsdk (emcc on PATH), git.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"          # systems/m100/src
BUNDLE="$(dirname "$HERE")"                     # systems/m100
BUILD="${BUILD:-/tmp/virtualt-build}"
VT_REPO="${VT_REPO:-https://git.code.sf.net/p/virtualt/code}"

command -v emcc >/dev/null 2>&1 || {
  echo "emcc not on PATH — run 'source \"\$EMSDK/emsdk_env.sh\"' first" >&2; exit 1; }

# 1. Fetch upstream VirtualT (Stephen Hurd & Ken Pettit, BSD).
[ -d "$BUILD/virtualt" ] || git clone --depth 1 "$VT_REPO" "$BUILD/virtualt"
VT="$BUILD/virtualt"

# 2. Stage our headless units alongside the core; make an obj dir.
WB="$VT/wasm-build"; mkdir -p "$WB/obj"
cp "$HERE"/*.c "$WB"/

CFLAGS=(-I "$VT/src" -I "$VT/src/FLU" -O2 -sUSE_SDL=2 -fsigned-char
        -Wno-strict-aliasing -Wno-implicit-function-declaration -Wno-unused-variable)

# 3a. Compile the FLTK-free upstream core (8085 CPU, memory, io, the LCD/keyboard
#     scan, BASIC/ROM images, sound, serial). display.cpp / file.cpp / clock.cpp
#     and the whole Fl_* UI are deliberately omitted — our units below stand in.
CORE=(doins genwrap intelhex io kc85rom m100emu m100rom m10rom m200rom memory
      n8201rom n8300rom reximages romstrings serial sound strcase tsdosimages)
for f in "${CORE[@]}"; do emcc "${CFLAGS[@]}" -c "$VT/src/$f.c" -o "$WB/obj/$f.o"; done

# 3b. Compile the GenX-DOS headless units.
OURS=(frontend_sdl display_headless file_headless clock_headless stubs)
for f in "${OURS[@]}"; do emcc "${CFLAGS[@]}" -c "$WB/$f.c" -o "$WB/obj/$f.o"; done

# 4. Link. ASYNCIFY lets the blocking emulate() loop yield via emscripten_sleep;
#    growable memory; a big stack (the file loader has ~294 KB of locals);
#    FS + HEAPU8 exported (game load into MEMFS, and battery-backup RAM access);
#    the 32 KB Model 100 ROM embedded into MEMFS at ROMs/M100rom.bin.
emcc "$WB"/obj/*.o -O2 -sUSE_SDL=2 -sASYNCIFY -sALLOW_MEMORY_GROWTH=1 \
  -sINITIAL_MEMORY=33554432 -sSTACK_SIZE=8388608 \
  -sEXPORTED_RUNTIME_METHODS=FS,HEAPU8 -sFORCE_FILESYSTEM=1 \
  --embed-file "$VT/ROMs/M100rom.bin@ROMs/M100rom.bin" \
  -o "$WB/virtualt.js"

# 5. Drop the engine into the bundle.
cp "$WB/virtualt.js" "$WB/virtualt.wasm" "$BUNDLE/"
echo "built: $BUNDLE/virtualt.js + virtualt.wasm"
