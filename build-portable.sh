#!/usr/bin/env bash
# Build the portable GenX-DOS site: the exact set of files that ship — the live
# static site with every dev/build/meta file stripped out. This is the SINGLE
# SOURCE OF TRUTH for the portable export folder and the release zip.
# Change what ships by editing the excludes here.
#
# Usage: ./build-portable.sh [--no-roms] [target-dir]
#        (default target: _Portable, the working copy)
#
# --no-roms is for the release zip. Games and firmware that didn't come with
# their emulators are not in the repository; they sit in the working tree untracked, so deploy.sh and
# the working copy still carry them to genx-dos.fun. With --no-roms, every
# untracked file under systems/ is left out and ROMS.txt goes in, so the zip
# holds exactly what the repository does. Without it, ROMS.txt stays out: the
# site has the files that notice says are missing.
set -euo pipefail

cd "$(dirname "$(realpath "$0")")"
NO_ROMS=0
ARGS=()
for arg in "$@"; do
  case "$arg" in
    --no-roms) NO_ROMS=1 ;;
    *) ARGS+=("$arg") ;;
  esac
done
TARGET="${ARGS[0]:-_Portable}"
mkdir -p "$TARGET"

# ---- the prompt's version banner must match the newest release -----------
# COMMAND.COM and VER.COM print GENX_VERSION, and nothing in the tree derives
# it, so it is the one number that can sit a release behind without anyone
# noticing. This is the choke point for everything that leaves the repo --
# deploy.sh builds through it for staging and live, the portable copy comes
# from it, and so does the release zip -- so the mismatch is caught here
# rather than trusting anyone to run check-doc-counts.sh first. The fix is to
# edit GENX_VERSION, or to add the release's heading to CHANGELOG.md.
VER_BANNER=$(grep -oE "GENX_VERSION = '[0-9]+\.[0-9]+\.[0-9]+'" prompt/javascript/globals.js |
  head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || true)
VER_CHANGELOG=$(grep -oE '^## \[[0-9]+\.[0-9]+\.[0-9]+\]' CHANGELOG.md |
  head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || true)
if [[ -z $VER_BANNER || -z $VER_CHANGELOG ]]; then
  echo "build-portable: cannot read GENX_VERSION or the newest CHANGELOG release" >&2
  exit 1
fi
if [[ $VER_BANNER != "$VER_CHANGELOG" ]]; then
  echo "build-portable: the prompt says version $VER_BANNER, CHANGELOG's newest release is $VER_CHANGELOG" >&2
  echo "  fix prompt/javascript/globals.js (GENX_VERSION) or CHANGELOG.md before shipping" >&2
  exit 1
fi

ROM_RULES=(--exclude='/ROMS.txt')
if [[ $NO_ROMS == 1 ]]; then
  ROM_LIST=$(mktemp)
  trap 'rm -f "$ROM_LIST"' EXIT
  # Anchored to the root, with rsync's wildcard characters escaped.
  git ls-files --others -z -- systems |
    while IFS= read -r -d '' f; do printf '/%s\n' "$f"; done |
    sed 's/[][*?\\]/\\&/g' >"$ROM_LIST"
  ROM_RULES=(--exclude-from="$ROM_LIST")
fi

# Everything NOT listed here ships. Excluded = dev tooling, build/meta, repo
# docs (their content is served via the self-hosted wiki), and staging dirs.
# The user-facing launchers (GenX-DOS.sh/.bat) DO ship; the build tooling does not.
#
# The root shell scripts are excluded by PATTERN, not one by one. Naming each
# one meant a newly added maintainer script shipped by default, which is how
# sync-wiki.sh briefly ended up in the release zip. The pattern fails the other
# way: a new root script is out unless someone deliberately lets it in.
#
# The exclude is anchored to the root and the launcher is admitted ahead of it
# (rsync takes the first matching rule), because a bare '*.sh' would also strip
# systems/odyssey2/build.sh and systems/m100/src/build.sh — the reproducible
# WASM build recipes that sit beside the binaries they produced. o2em is
# GPL-2.0+, so shipping the recipe with it is the point, not an oversight.
# --delete-excluded, not just --delete: an --exclude'd path is skipped on BOTH
# sides, so rsync never considers removing it from the target either. Anything
# that shipped before its exclude was added therefore sat in the export folder
# — and in the release zip — for good. `tools/build-softkey-map.py` had been
# doing exactly that since 18/08/2026. With this, the target is only ever the
# set below, and adding an exclude actually removes what it names.
rsync -a --delete --delete-excluded \
  "${ROM_RULES[@]}" \
  --exclude='/.git' --exclude='/.github' --exclude='/.claude' \
  --exclude='/.gitignore' --exclude='/.gitattributes' \
  --exclude='/.dockerignore' --exclude='/.npmignore' \
  --exclude='/.prettierignore' --exclude='/.prettierrc' --exclude='/.nojekyll' \
  --exclude='/Dockerfile' --exclude='/package.json' --exclude='/index.js' \
  --exclude='/README.md' --exclude='/CHANGELOG.md' --exclude='/ATTRIBUTION.md' \
  --exclude='/LICENSE.TXT' --exclude='/CONTRIBUTING.md' --exclude='/SECURITY.md' \
  --exclude='/CODE_OF_CONDUCT.md' --exclude='/AI-DISCLAIMER.md' \
  --exclude='/docs/wiki-src' \
  --exclude='/_paddiag.html' \
  --include='/GenX-DOS.sh' \
  --exclude='/*.sh' \
  --exclude='/.htaccess' \
  --exclude='/GenX-DOS-v*.zip' \
  --exclude='/systems/_shared/styles/VGA_font/make_fonts.py' \
  --exclude='/tools' \
  --exclude='/dist' --exclude='/npm-pkg' --exclude='/_Portable' --exclude='node_modules' \
  ./ "$TARGET"/

echo "Portable site built in: $TARGET"
