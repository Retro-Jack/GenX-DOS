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
SIZE=$(du -sm --exclude=.git . 2>/dev/null | cut -f1)

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

# ---- social card: an image, so just restate what it should read ---------
echo "Social card (docs/images/genx-social.png) — cannot be parsed; its stats"
echo "  line should read:  $GAMES games · $SUBSYS systems · 100% self-hosted"
echo

[ "$fail" = 0 ] && echo "All documented counts match." || echo "Drift found — fix the files above (and re-run docs/wiki-src/build.py if a wiki page changed)."
exit "$fail"
