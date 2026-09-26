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
#         ./check-doc-counts.sh --write  # stamp the measured values into the
#                                        # documents, so a count is generated
#                                        # rather than maintained by hand
#
# Every slot --write knows how to fill is also a slot the report checks, and
# vice versa: they read from the same table below. A number that lives anywhere
# else is, by definition, one nobody is guarding — which is how the landing
# page sat at 327 games and the article's byline at 32 systems / 317 games
# while the same article's own NUMBERS block said 33 and 328.
set -uo pipefail
cd "$(dirname "$0")"

WRITE=0
[ "${1:-}" = "--write" ] && WRITE=1

fail=0
note() { printf '  %-34s %s\n' "$1" "$2"; }
bad()  { printf '  \033[31mMISMATCH\033[0m  %-24s %s\n' "$1" "$2"; fail=1; }
ok()   { printf '  \033[32mok\033[0m        %-24s %s\n' "$1" "$2"; }

# ---- ground truth, measured from the tree -------------------------------
# Not every page under docs/games/ is a game. MS-DOS 4.00 is the operating
# system itself, on the IBM PC shelf since 24/09/2026: it needs a page like
# anything else, but it is not counted on the games tally. Listed by name on
# purpose, so a future non-game has to be added here deliberately rather than
# quietly inflating the number the landing page and the card both quote.
NONGAME_DOCS='docs/games/dos/msdos4.html'
DOCPAGES=$(find docs/games -name '*.html' | wc -l)
NONGAMES=0
for f in $NONGAME_DOCS; do [ -f "$f" ] && NONGAMES=$((NONGAMES + 1)); done
GAMES=$((DOCPAGES - NONGAMES))
SUBSYS=$(find docs/games -mindepth 1 -maxdepth 1 -type d | wc -l)
CONTROLS=$(find systems -name 'controls.html' | wc -l)
# SHARED is a page count, not a games count, so the non-game pages belong in it.
SHARED=$((DOCPAGES + CONTROLS))
# Bundles sharing the one EmulatorJS framework. The wiki and README both quote
# it, and both sat at 13 for the six days after the arcade bundle joined them.
EJSB=$(grep -l "_shared-ejs" systems/*/play.html 2>/dev/null | wc -l)
# Anchored to ./ on purpose: a bare --exclude=dist matches by basename at any
# depth and would drop systems/*/dist (the jsbeeb bundles), understating the
# site by ~50 MB. These four are the repo-root build/staging dirs only.
SIZE=$(du -sm --exclude=./.git --exclude=./_Portable --exclude=./dist --exclude=./npm-pkg --exclude='./GenX-DOS-v*.zip' . 2>/dev/null | cut -f1)

echo "Measured from the tree:"
note "gamedocs (games)"        "$GAMES"
note "gamedoc pages (incl. non-games)" "$DOCPAGES"
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
  # "bundled sub-systems" is the same claim with a word in the way; the
  # Virtual Filesystem page sat at 32 for two days behind that word.
  check_phrase "$f" '[0-9]+ (bundled )?sub-systems'  "$SUBSYS" "sub-systems"
done
# AI-DISCLAIMER says "N systems" rather than "sub-systems", so it needs its own
# line — it was left at 33 for the six days after the arcade section landed.
check_phrase AI-DISCLAIMER.md                      '[0-9]+ systems' "$SUBSYS" "systems"
# Every count of EmulatorJS bundles, whatever the sentence around it. The two
# rules here used to name the exact phrasings "bundles via" and "bundles
# share", so three other ways of writing the same number -- in the README, in
# ATTRIBUTION and on the Roadmap -- sat a release behind unseen. The regex
# refuses a number preceded by "/" or by a letter, so neither "the Atari
# 400/800 bundles" nor "the ZX81 bundles" is read as a count.
for f in README.md ATTRIBUTION.md AI-DISCLAIMER.md index.html \
         docs/article/index.html docs/wiki-src/pages/*.md; do
  check_phrase "$f" '(^|[^0-9A-Za-z/])[0-9]+ bundles' "$EJSB" "EmulatorJS bundles"
done
check_phrase docs/wiki-src/pages/Roadmap.md        '[0-9]+ pages' "$GAMES"  "gamedoc pages"
# The landing page says the number twice in prose -- the meta description and
# the article link -- where no generated slot reaches it. Both sat at 33 after
# the arcade landed, on the page every visitor sees first.
check_phrase index.html '[0-9]+ classic computers'  "$SUBSYS" "landing prose · systems"
check_phrase index.html '[0-9]+-system'             "$SUBSYS" "landing prose · systems"
check_phrase docs/wiki-src/pages/File-Structure.md '[0-9]+ pages' "$SHARED" "gamedocs+controls"
echo

# ---- the generated slots ------------------------------------------------
# Each entry is a file, a regex with the number as its one capture group, and
# the measured value it must hold. The report and --write both read this table,
# so a slot cannot be checked without being writable or vice versa.
slots() {
  cat <<SLOTS
index.html|(<span class="k">Systems</span><span class="lead"></span><span class="v">)[0-9]+|$SUBSYS|landing page · Systems
index.html|(<span class="k">Games</span><span class="lead"></span><span class="v">)[0-9]+|$GAMES|landing page · Games
docs/article/index.html|(<span><b>SYSTEMS:</b> )[0-9]+|$SUBSYS|article byline · Systems
docs/article/index.html|(<span><b>GAMES:</b> )[0-9]+|$GAMES|article byline · Games
docs/article/index.html|(<li><span>Systems</span><b>)[0-9]+|$SUBSYS|article numbers · Systems
docs/article/index.html|(<li><span>Games</span><b>)[0-9]+|$GAMES|article numbers · Games
docs/article/index.html|(<li><span>Size on disk</span><b>)[0-9]+|$SIZE|article numbers · Size on disk
docs/article/index.html|(pleasantly heavy: about )[0-9]+|$SIZE|article prose · Size on disk
SLOTS
}

echo "Generated counts:"
# process substitution, not a pipe: a piped while runs in a subshell, where
# `fail=1` would be set and then thrown away, and the script would exit 0 on a
# mismatch it had just printed in red.
while IFS='|' read -r file re want label; do
  [ -f "$file" ] || continue
  have=$(grep -oE "$re" "$file" | grep -oE '[0-9]+$' | sort -u | tr '\n' ' ' | sed 's/ $//')
  if [ "$WRITE" = 1 ] && [ "$have" != "$want" ]; then
    python3 - "$file" "$re" "$want" <<'PYW'
import io, re, sys
path, pattern, want = sys.argv[1], sys.argv[2], sys.argv[3]
s = io.open(path, encoding='utf-8').read()
s2 = re.sub(pattern, lambda m: m.group(1) + want, s)
if s2 != s:
    io.open(path, 'w', encoding='utf-8').write(s2)
PYW
    printf '  \033[33mwrote\033[0m     %-24s %s -> %s\n' "$label" "${have:-none}" "$want"
  elif [ "$have" = "$want" ]; then
    ok "$label" "$have"
  else
    bad "$label" "says ${have:-nothing}, tree says $want"
  fi
done < <(slots)
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

# ---- COMMAND.COM's version banner --------------------------------------
# The prompt's COMMAND.COM prints a version number, and nothing else in the
# tree derives it, so it can sit at a released version for months without
# anyone noticing it is a release behind. It must equal the newest release
# heading in CHANGELOG.md -- [Unreleased] is skipped, because the banner
# reports what shipped, not what is pending.
VERBAN=$(grep -oE "GENX_VERSION = '[0-9]+\.[0-9]+\.[0-9]+'" prompt/javascript/globals.js \
           | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
VERLOG=$(grep -oE '^## \[[0-9]+\.[0-9]+\.[0-9]+\]' CHANGELOG.md \
           | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
if [ -z "$VERBAN" ] || [ -z "$VERLOG" ]; then
  bad "version banner" "could not read GENX_VERSION or the newest CHANGELOG release"
elif [ "$VERBAN" != "$VERLOG" ]; then
  bad "version banner" "COMMAND.COM says $VERBAN, CHANGELOG's newest release is $VERLOG"
else
  ok "version banner" "COMMAND.COM reports $VERBAN, the current release"
fi
echo

# ---- corner links: every launcher key must have a gamedoc to point at ---
# genx-controls-link.js builds the top-left "Gameplay controls" link whenever
# the launch URL carries a key. Ten launchers named a machine's own firmware
# (BASIC, LDOS, TRSDOS), which has no gamedoc, so the link 404'd on the live
# site for months -- a dead corner link looks exactly like a live one. The
# script now skips those, listed as platform/key in NO_GAMEDOC; this holds
# that list to the tree in both directions.
echo "Corner links (genx-controls-link.js):"
link_out=$(python3 - <<'PYEOF'
import re, pathlib
root = pathlib.Path(".")
fs = (root / "prompt/javascript/fs.js").read_text(encoding="utf-8")
js = (root / "systems/_shared/genx-controls-link.js").read_text(encoding="utf-8")

m = re.search(r"var NO_GAMEDOC = \[(.*?)\];", js, re.S)
listed = set(re.findall(r"'([^']+)'", m.group(1))) if m else set()

launched = set()
for mm in re.finditer(r"\.\./systems/([a-z0-9_]+)/[^'\"]*?[?&](?:game|tape|rom)=([A-Za-z0-9_.\-]+)", fs):
    launched.add((mm.group(1), mm.group(2)))

missing = {f"{b}/{k}" for b, k in launched if not (root / "docs/games" / b / f"{k}.html").exists()}

for x in sorted(missing - listed):
    print(f"UNLISTED {x} is launched, has no gamedoc, and is not in NO_GAMEDOC")
for x in sorted(listed - missing):
    print(f"STALE    {x} is in NO_GAMEDOC but now has a gamedoc (or is never launched)")
print(f"OK {len(launched)} keyed launchers, {len(listed)} firmware keys without a gamedoc")
PYEOF
)
if printf '%s' "$link_out" | grep -qE '^(UNLISTED|STALE)'; then
  bad "corner links" "NO_GAMEDOC is out of step with the tree:"
  printf '%s\n' "$link_out" | grep -E '^(UNLISTED|STALE)' | sed 's/^/                                     /'
else
  ok "corner links" "$(printf '%s' "$link_out" | sed -n 's/^OK //p')"
fi
echo

# ---- social card: drawn from the font sheet by tools/social-card.py -----
# The card's text rows are the prompt's CP437 sheet scaled up, so the tool can
# draw them exactly and compare. Its stats line measures docs/games/ the same
# way GAMES and SUBSYS are measured above.
echo "Social card (docs/images/genx-social.png):"
if ! command -v python3 >/dev/null || ! python3 -c 'import PIL' 2>/dev/null; then
  bad "social card" "python3 with Pillow is needed to check it"
else
  [ "$WRITE" = 1 ] && python3 tools/social-card.py | sed 's/^/  /'
  if card_out=$(python3 tools/social-card.py --check); then
    ok "social card" "$GAMES games · $SUBSYS systems, and every menu row as drawn"
  else
    bad "social card" "rows differ — run tools/social-card.py (or --write):"
    printf '%s\n' "$card_out" | sed 's/^/                                     /'
  fi
fi
echo

[ "$fail" = 0 ] && echo "All documented counts match." || echo "Drift found — fix the files above (and re-run docs/wiki-src/build.py if a wiki page changed)."
exit "$fail"
