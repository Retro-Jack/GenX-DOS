#!/usr/bin/env bash
# GenX-DOS — verify the ROM position still holds.
#
# The rule: nothing we supplied — game, BIOS or firmware — is in the
# repository, whatever its licence. It stays in the working tree, untracked,
# so deploy.sh still ships it to the site, and ROMS.txt tells anyone with a
# copy from GitHub what is missing and where it goes. Material an emulator's
# own maintainer ships with the engine is tracked as normal.
#
# Two questions, and the first exists because the second cannot answer it.
# Comparing ROMS.txt against the untracked files only ever sees files that
# are already absent: a content file that is TRACKED appears in neither list,
# so that comparison passes while the file sits in the repo. That is exactly
# how Pitfall! and Prince of Persia survived the September 2026 purge and
# stayed in the history for seven weeks. Question 1 is the one that fails.
#
# Usage:  ./check-roms.sh    # report; exit 1 if the position has slipped
set -uo pipefail
cd "$(dirname "$0")"

fail=0
bad() { printf '  \033[31mFAIL\033[0m  %-22s %s\n' "$1" "$2"; fail=1; }
ok()  { printf '  \033[32mok\033[0m    %-22s %s\n' "$1" "$2"; }

# Content we wrote ourselves, which belongs in the repo: the stubs a bundle
# boots with when no cartridge or disc is chosen. Named rather than matched
# by folder, so a real game cannot arrive under a stub's name unnoticed.
OURS='empty.prg nocart.col nocart.gb nocart.gg nocart.sms nocart.a26'

echo "Tracked content (every media path in systems/*/games.json):"
tracked_out=$(OURS="$OURS" python3 - <<'PY'
import json, glob, os, subprocess, sys

ours = set(os.environ['OURS'].split())
tracked = set(subprocess.run(['git', 'ls-files'], capture_output=True,
                             text=True).stdout.splitlines())
EXT = ('.a26', '.a78', '.ba', '.bas', '.bin', '.cas', '.col', '.cmd', '.d64',
       '.do', '.dsk', '.dsd', '.gb', '.gbc', '.gg', '.hex', '.img', '.int',
       '.lnx', '.nes', '.p', '.prg', '.rom', '.sms', '.ssd', '.tap', '.tzx',
       '.uef', '.wav', '.zip')

def media(o):
    if isinstance(o, dict):
        for v in o.values():
            if isinstance(v, str) and v.lower().endswith(EXT):
                yield v
            yield from media(v)
    elif isinstance(o, list):
        for v in o:
            yield from media(v)

hits, stubs = [], 0
for gj in sorted(glob.glob('systems/*/games.json')):
    base = os.path.dirname(gj)
    with open(gj) as fh:
        data = json.load(fh)
    for p in sorted(set(media(data))):
        f = os.path.normpath(os.path.join(base, p))
        if f not in tracked:
            continue
        if os.path.basename(f) in ours:
            stubs += 1
        else:
            hits.append(f)
print(stubs)
for h in hits:
    print(h)
PY
)
stubs=$(printf '%s' "$tracked_out" | head -1)
hits=$(printf '%s' "$tracked_out" | tail -n +2)
if [ -n "$hits" ]; then
  bad "in the index" "$(printf '%s\n' "$hits" | wc -l) file(s) a menu entry loads:"
  printf '%s\n' "$hits" | sed 's/^/          /'
  echo "          untrack with git rm --cached, add a .gitignore rule and a ROMS.txt line"
else
  ok "in the index" "none — $stubs of our own stubs, nothing else"
fi
echo

echo "Manifest (ROMS.txt against the files that are absent):"
git ls-files --others --ignored --exclude-standard systems |
  grep -v '\.gitkeep$' | LC_ALL=C sort >/tmp/genx-roms-present.$$
# A listing line is a path, two or more spaces, then a title. The prose
# notes between sections are indented the same way and one of them wraps
# onto a line starting "systems/dos/games.json", so matching the indent
# alone picks it up as a phantom entry.
grep -E '^  systems/.*[^ ]  +[^ ]' ROMS.txt |
  sed -E 's/^  (.*[^ ])  +.*$/\1/' | LC_ALL=C sort >/tmp/genx-roms-listed.$$
missing=$(LC_ALL=C comm -23 /tmp/genx-roms-present.$$ /tmp/genx-roms-listed.$$)
phantom=$(LC_ALL=C comm -13 /tmp/genx-roms-present.$$ /tmp/genx-roms-listed.$$)
count=$(wc -l </tmp/genx-roms-present.$$)
rm -f /tmp/genx-roms-present.$$ /tmp/genx-roms-listed.$$

if [ -n "$missing" ]; then
  bad "unlisted" "$(printf '%s\n' "$missing" | wc -l) file(s) absent from the repo but not in ROMS.txt:"
  printf '%s\n' "$missing" | sed 's/^/          /'
fi
if [ -n "$phantom" ]; then
  bad "listed, not present" "$(printf '%s\n' "$phantom" | wc -l) ROMS.txt line(s) with no file behind them:"
  printf '%s\n' "$phantom" | sed 's/^/          /'
fi
[ -z "$missing" ] && [ -z "$phantom" ] && ok "manifest" "$count files, listed exactly"
echo

if [ "$fail" = 0 ]; then
  echo "The ROM position holds: nothing we supplied is in the repository, and"
  echo "ROMS.txt accounts for every file a copy from GitHub is missing."
else
  echo "The ROM position has slipped — fix the files above before committing."
  echo "A file that was ever committed also needs stripping from the history."
fi
exit "$fail"
