#!/usr/bin/env bash
# Build the portable GenX-DOS site: the exact set of files that ship — the live
# static site with every dev/build/meta file stripped out. This is the SINGLE
# SOURCE OF TRUTH for the portable export folder and the release zip.
# Change what ships by editing the excludes here.
#
# Usage: ./build-portable.sh [target-dir]      (default: dist)
set -euo pipefail

cd "$(dirname "$(realpath "$0")")"
TARGET="${1:-dist}"
mkdir -p "$TARGET"

# Everything NOT listed here ships. Excluded = dev tooling, build/meta, repo
# docs (their content is served via the self-hosted wiki), and staging dirs.
# The user-facing launchers (GenX-DOS.sh/.bat) DO ship; the build tooling does not.
rsync -a --delete \
  --exclude='/.git' --exclude='/.github' --exclude='/.claude' \
  --exclude='/.gitignore' --exclude='/.gitattributes' \
  --exclude='/.dockerignore' --exclude='/.npmignore' \
  --exclude='/.prettierignore' --exclude='/.prettierrc' --exclude='/.nojekyll' \
  --exclude='/Dockerfile' --exclude='/package.json' --exclude='/index.js' \
  --exclude='/README.md' --exclude='/CHANGELOG.md' --exclude='/ATTRIBUTION.md' \
  --exclude='/LICENSE.TXT' --exclude='/CONTRIBUTING.md' --exclude='/SECURITY.md' \
  --exclude='/CODE_OF_CONDUCT.md' \
  --exclude='/docs/wiki-src' \
  --exclude='/_paddiag.html' \
  --exclude='/build-portable.sh' \
  --exclude='/check-doc-counts.sh' \
  --exclude='/deploy.sh' \
  --exclude='/.htaccess' \
  --exclude='/systems/_shared/styles/VGA_font/make_fonts.py' \
  --exclude='/dist' --exclude='/npm-pkg' --exclude='/_Portable' --exclude='node_modules' \
  ./ "$TARGET"/

echo "Portable site built in: $TARGET"
