#!/usr/bin/env bash
# Reproducible WASM build for the Odyssey² (o2em) bundle.
#
# Inputs:
#   - libretro/libretro-o2em (built as a static lib with platform=emscripten)
#   - frontend.c              (this dir — minimal SDL2/emscripten libretro frontend)
#
# Outputs (overwrites in this dir):
#   - o2em.js, o2em.wasm
#
# Requires:
#   - emsdk activated (emcc/emar on PATH; or set EMSDK env var)
#   - git + standard build tools (for the libretro-o2em build)
#
# Why a custom frontend (not EmulatorJS)?  The libretro nightly cores
# are NOT EJS-compatible — EmulatorJS forks each libretro core to add
# EJS-specific helpers (system_restart, simulate_input, cmd_*, etc.).
# Dropping in vanilla libretro o2em fails after the .data extraction
# because GameManager.cwrap("system_restart", …) resolves to undefined.
# Same shape as Intellivision (jzIntv) and atari800 — bespoke SDL2
# loop, no EmulatorJS dependency.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
BUILD="${BUILD:-/tmp/o2em-build}"
CORE_REPO="${CORE_REPO:-https://github.com/libretro/libretro-o2em.git}"

if ! command -v emcc >/dev/null 2>&1; then
  echo "emcc not on PATH; run 'source \$EMSDK/emsdk_env.sh' first" >&2
  exit 1
fi

mkdir -p "$BUILD"
if [ ! -d "$BUILD/libretro-o2em" ]; then
  git clone --depth 1 "$CORE_REPO" "$BUILD/libretro-o2em"
fi
CORE="$BUILD/libretro-o2em"

# Build the libretro static archive (.bc is the libretro-convention name
# for the emscripten-target static archive — it's actually an ar archive).
(cd "$CORE" && emmake make platform=emscripten -j"$(nproc)")
cp "$CORE/o2em_libretro_emscripten.bc" "$CORE/libo2em.a"

# libretro-o2em's Makefile.common omits libretro-common helpers under
# STATIC_LINKING=1, on the assumption that the frontend supplies them.
# We compile them explicitly into our build.
LRC="$CORE/libretro-common"
COMMON_SRCS=(
  "$LRC/compat/compat_snprintf.c"
  "$LRC/compat/compat_strcasestr.c"
  "$LRC/compat/compat_strl.c"
  "$LRC/compat/fopen_utf8.c"
  "$LRC/encodings/encoding_crc32.c"
  "$LRC/encodings/encoding_utf.c"
  "$LRC/file/file_path.c"
  "$LRC/file/file_path_io.c"
  "$LRC/streams/file_stream.c"
  "$LRC/streams/file_stream_transforms.c"
  "$LRC/string/stdstring.c"
  "$LRC/time/rtime.c"
  "$LRC/vfs/vfs_implementation.c"
)

# MODULARIZE=1 + EXPORT_NAME so play.html can drive the runtime lifecycle.
# EXPORTED_RUNTIME_METHODS=FS,callMain — preRun writes BIOS + cart into MEMFS.
# INITIAL_MEMORY=32M is comfortable for 1 KB BIOS + ~16 KB cart + SDL.
emcc -O2 -s USE_SDL=2 \
  -s INITIAL_MEMORY=33554432 -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORTED_RUNTIME_METHODS=FS,callMain \
  -s MODULARIZE=1 -s EXPORT_NAME=createO2EM \
  -I"$LRC/include" \
  -o "$HERE/o2em.js" \
  "$HERE/frontend.c" "$CORE/libo2em.a" \
  "${COMMON_SRCS[@]}"

echo "OK — built $HERE/o2em.{js,wasm}"
