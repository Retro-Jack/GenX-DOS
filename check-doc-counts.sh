#!/usr/bin/env bash
# GenX-DOS — verify the counts quoted in the docs still match the tree.
#
# Several numbers are repeated across README, the wiki pages, the feature
# article and the social card. Platform changes update some and miss others —
# the feature article's engine count sat stale from the Vectrex retirement
# until an audit caught it months later. This script makes that drift loud.
#
# Derivable numbers are measured from the tree and compared everywhere they're
# quoted. The engine count can't be derived (EmulatorJS is ONE engine hosting
# many libretro cores, by the definition in Emulators.md), so instead every
# document that states it must agree with every other.
#
# Usage:  ./check-doc-counts.sh          # report; exit 1 if anything drifted
set -uo pipefail
cd "$(dirname "$0")"

fail=0
note() { printf '  %-34s %s\n' "$1" "$2"; }
bad()  { printf '  \033[31mMISMATCH\033[0m  %-24s %s\n' "$1" "$2"; fail=1; }
ok()   { printf '  \033[32mok\033[0m        %-24s %s\n' "$1" "$2"; }

# ---- ground truth, measured from the tree -------------------------------
GAMES=$(find docs/games -name '*.html' | wc -l)
SUBSYS=$(find docs/games -mindepth 1 -maxdepth 1 -type d | wc -l)
CONTROLS=$(find systems -name 'controls.html' | wc -l)
SHARED=$((GAMES + CONTROLS))
# Anchored to ./ on purpose: a bare --exclude=dist matches by basename at any
# depth and would drop systems/*/dist (the jsbeeb bundles), understating the
# site by ~50 MB. These four are the repo-root build/staging dirs only.
SIZE=$(du -sm --exclude=./.git --exclude=./_Portable --exclude=./dist --exclude=./npm-pkg --exclude='./GenX-DOS-v*.zip' . 2>/dev/null | cut -f1)

echo "Measured from the tree:"
note "gamedocs (games)"        "$GAMES"
note "sub-systems"             "$SUBSYS"
note "controls.html"           "$CONTROLS"
note "gamedocs + controls"     "$SHARED"
note "size on disk (MB)"       "$SIZE"
echo

# ---- helper: every "<N> <label>" occurrence in a file must equal want ----
check_phrase() {  # file  regex-with-one-capture  want  human-label
  local file="$1" re="$2" want="$3" label="$4" found
  [ -f "$file" ] || return 0
  found=$(grep -oE "$re" "$file" | grep -oE '[0-9]+' | sort -u)
  [ -z "$found" ] && return 0
  for n in $found; do
    if [ "$n" != "$want" ]; then
      bad "$label" "$file says $n, tree says $want"
    else
      ok "$label" "$file"
    fi
  done
}

echo "Counts quoted in the docs:"
for f in README.md docs/wiki-src/pages/*.md; do
  check_phrase "$f" '[0-9]+ sub-systems'  "$SUBSYS" "sub-systems"
done
check_phrase docs/wiki-src/pages/Roadmap.md        '[0-9]+ pages' "$GAMES"  "gamedoc pages"
check_phrase docs/wiki-src/pages/File-Structure.md '[0-9]+ pages' "$SHARED" "gamedocs+controls"
echo

# ---- feature article: the THE NUMBERS block -----------------------------
ART=docs/article/index.html
if [ -f "$ART" ]; then
  echo "Feature article ($ART):"
  art_stat() {  # label  want
    local v
    v=$(grep -oE "<span>$1</span><b>[^<]+</b>" "$ART" | grep -oE '<b>[^<]+' | cut -c4- | grep -oE '[0-9]+')
    [ -z "$v" ] && { note "$1" "not found — check the block"; return; }
    [ "$v" = "$2" ] && ok "$1" "$v" || bad "$1" "article says $v, tree says $2"
  }
  art_stat Systems          "$SUBSYS"
  art_stat Games            "$GAMES"
  art_stat "Size on disk"   "$SIZE"
  # prose count, spelled out
  if grep -qiE 'thirty-three machines' "$ART" && [ "$SUBSYS" != 33 ]; then
    bad "prose 'thirty-three'" "article prose still says thirty-three, tree says $SUBSYS"
  fi
  echo
fi

# ---- engine count: not derivable, so enforce agreement ------------------
echo "Engine count (not derivable — all docs must agree):"
eng=$(grep -rhoE '[0-9]+ (emulator )?engines' README.md docs/wiki-src/pages/*.md 2>/dev/null \
      | grep -oE '[0-9]+' | sort -u)
art_eng=$(grep -oE '<span>Emulator engines</span><b>[0-9]+</b>' "$ART" 2>/dev/null | grep -oE '[0-9]+')
[ -n "$art_eng" ] && eng=$(printf '%s\n%s\n' "$eng" "$art_eng" | sort -u)
n=$(printf '%s\n' "$eng" | grep -c .)
if [ "$n" -le 1 ]; then
  ok "engines" "all sources agree on ${eng:-?}"
else
  bad "engines" "sources disagree: $(echo $eng | tr '\n' ' ')— README/wiki and the article must match"
fi
echo

# ---- stale prose: terms that describe a state the tree left behind ------
# Counts drift loudly and this script has always caught them. WORDING drifts
# silently: when the soft keys moved out of the top-left corner, four documents
# went on describing them there, and nothing here noticed — it was found by
# eye, months later, the same way the article's engine count was.
#
# So: a blocklist of phrases that were true once. Each is a term plus the paths
# it may legitimately still appear in — history is not drift, and the CHANGELOG
# is nothing but history, so it is never searched. Add a line whenever you
# change something the docs describe in prose rather than in numbers.
#
#   term <TAB> allowed-path-regex (empty = allowed nowhere)
echo "Stale prose (terms describing a state the tree has left):"
STALE_PROSE=$(cat <<'EOF'
top-left	genx-bbc-copykey|genx-trs80-softkeys|genx-atari-console|Emulator-sdltrs-TRS-80.md|genx-controls-link
is hyperspace in a few	
most games start with CLEAR	
TRS-80 Model I 	ATTRIBUTION.md|Emulator-sdltrs-TRS-80.md
Level II	ATTRIBUTION.md|Emulator-sdltrs-TRS-80.md
TRS80.png	
elimintr	
Eliminator	Emulator-sdltrs-TRS-80.md
no separate ROM file ships	
AltirraOS baked in	
EOF
)
prose_hits=0
while IFS=$'\t' read -r term allow; do
  [ -z "$term" ] && continue
  hits=$(grep -rln -- "$term" README.md ATTRIBUTION.md AI-DISCLAIMER.md CONTRIBUTING.md \
           SECURITY.md index.html docs/article/index.html docs/wiki-src/pages \
           systems/*/controls.html systems/_shared/*.js 2>/dev/null)
  if [ -n "$allow" ]; then hits=$(printf '%s\n' "$hits" | grep -vE "$allow"); fi
  hits=$(printf '%s\n' "$hits" | grep -c . )
  if [ "$hits" != 0 ]; then
    bad "stale wording" "\"$term\" still in $hits file(s) outside its allowed places"
    prose_hits=1
  fi
done <<< "$STALE_PROSE"
[ "$prose_hits" = 0 ] && ok "stale wording" "no retired phrasing found"
echo

# ---- retired asset filenames -------------------------------------------
# Renamed files leave references behind, and a stale one is invisible: the
# page just renders with no bezel. The blocklist above cannot catch these
# because it does not scan play.html or prompt/, which is exactly where bezel
# references live -- hence a separate check with its own haystack. CHANGELOG.md
# and the generated docs/wiki/ are excluded: historical entries correctly name
# the files as they were called at the time.
RETIRED_ASSETS="Sinclair.png Acorn.png Apple.png PC.png NES.png Pet.png
gamegear.png gbc.png lynx.png TRS80-3.png Model100.png TRS80.png
Amstrad_CPC_128.png crt-barrel.png"
# Roadmap.md is allowed to name them: it carries the deliberate old->new
# mapping so the historical entries above it still reconcile. A stale name in
# prose is harmless anyway; what matters is a stale one in a runtime reference.
RETIRED_ALLOW='docs/wiki-src/pages/Roadmap.md'
retired_hits=0
for name in $RETIRED_ASSETS; do
  hits=$(grep -rln -- "$name" \
           systems/ prompt/ tools/ docs/wiki-src/pages \
           README.md ATTRIBUTION.md index.html docs/article/index.html \
           2>/dev/null | grep -v _Portable | grep -vE "$RETIRED_ALLOW" | grep -c . )
  if [ "$hits" != 0 ]; then
    bad "retired asset" "\"$name\" was renamed but is still referenced in $hits file(s)"
    retired_hits=1
  fi
done
[ "$retired_hits" = 0 ] && ok "retired assets" "no references to renamed files"
echo

# ---- social card: an image, so just restate what it should read ---------
echo "Social card (docs/images/genx-social.png) — cannot be parsed; its stats"
echo "  line should read:  $GAMES games · $SUBSYS systems · 100% self-hosted"
echo

[ "$fail" = 0 ] && echo "All documented counts match." || echo "Drift found — fix the files above (and re-run docs/wiki-src/build.py if a wiki page changed)."
exit "$fail"
