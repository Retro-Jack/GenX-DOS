#!/usr/bin/env bash
# Push docs/wiki-src/pages/*.md to the GitHub wiki repo.
#
# GenX-DOS has two wikis on purpose: the self-hosted one built into docs/wiki/
# (travels with the site, works offline) and the GitHub one people read while
# browsing the repo. Both are generated from the same docs/wiki-src/pages/.
#
# The GitHub side is a SEPARATE git repo with its own remote, and that is where
# this has gone wrong before. A local clone sat ~90 commits behind origin while
# looking perfectly healthy, so a diff against it "proved" the wiki was badly
# out of date when it was in fact current. The push rejection was the only thing
# that exposed it. Nothing about that is visible until you fetch.
#
# So this script fetches FIRST, every time, before anything is compared or
# copied. That is the whole point of it existing: the ordering stops being
# something anyone has to remember.
#
# Usage:
#   ./sync-wiki.sh              # fetch, copy, show the diff, commit and push
#   ./sync-wiki.sh -n           # dry run: report what would change, push nothing
#   ./sync-wiki.sh --no-build   # skip rebuilding the in-repo HTML wiki
set -euo pipefail
cd "$(dirname "$(realpath "$0")")"
REPO_DIR=$PWD

SRC_DIR="$REPO_DIR/docs/wiki-src/pages"
WIKI_DIR="${GENX_WIKI_DIR:-/mnt/misc/Projects/GenX-DOS.wiki}"
WIKI_URL=https://github.com/Retro-Jack/GenX-DOS.wiki.git

# _Sidebar.md is wiki-only navigation with no counterpart in wiki-src. Copying
# would not touch it, but a "delete what the source does not have" sweep would,
# so it is named here once and skipped everywhere.
WIKI_ONLY=(_Sidebar.md)

DRYRUN=0; BUILD=1
for a in "$@"; do
    case "$a" in
        -n|--dry-run) DRYRUN=1 ;;
        --no-build)   BUILD=0 ;;
        -h|--help)    awk 'NR>1 && /^#/ { sub(/^# ?/,""); print; next } NR>1 { exit }' "$0"; exit 0 ;;
        *) echo "Unknown argument: $a  (try --help)" >&2; exit 2 ;;
    esac
done

# ---- the in-repo HTML wiki ----------------------------------------------
# build.py also imports the root CHANGELOG/README/ATTRIBUTION as pages, so
# editing any of those leaves docs/wiki/*.html stale with nothing to show for
# it. Rebuilding here is deterministic and the output is tracked, so it either
# changes nothing or surfaces a staleness you wanted to know about.
if [[ $BUILD -eq 1 ]]; then
    echo "Rebuilding the in-repo wiki..."
    python3 docs/wiki-src/build.py | sed 's/^/  /'
    if ! git diff --quiet -- docs/wiki; then
        echo "  note: docs/wiki/ changed — commit it with the source edit"
    fi
fi

# ---- the GitHub wiki clone ----------------------------------------------
if [[ ! -d "$WIKI_DIR/.git" ]]; then
    echo "No wiki clone at $WIKI_DIR — cloning..."
    git clone -q "$WIKI_URL" "$WIKI_DIR"
fi

cd "$WIKI_DIR"
BRANCH=$(git symbolic-ref --quiet --short HEAD || echo master)

echo "Fetching the wiki remote..."
git fetch -q origin

# Unpushed local commits are the one thing a hard reset would silently destroy.
# It happens when an earlier run committed and then failed to push, and the work
# is real, so stop rather than tidy it away.
if [[ -n "$(git log --oneline "origin/$BRANCH..HEAD" 2>/dev/null)" ]]; then
    echo "The clone has commits that are not on the remote:" >&2
    git log --oneline "origin/$BRANCH..HEAD" | sed 's/^/  /' >&2
    echo "Push or drop them, then run this again." >&2
    exit 1
fi

BEHIND=$(git rev-list --count "HEAD..origin/$BRANCH")
if [[ "$BEHIND" -gt 0 ]]; then
    echo "  clone was $BEHIND commit(s) behind — resetting to origin/$BRANCH"
else
    echo "  clone was already current"
fi
git reset -q --hard "origin/$BRANCH"

# ---- copy the source pages ----------------------------------------------
changed=()
for f in "$SRC_DIR"/*.md; do
    b=$(basename "$f")
    skip=0
    for w in "${WIKI_ONLY[@]}"; do [[ "$b" == "$w" ]] && skip=1; done
    [[ $skip -eq 1 ]] && continue
    if ! cmp -s "$f" "./$b"; then
        changed+=("$b")
        [[ $DRYRUN -eq 0 ]] && cp "$f" "./$b"
    fi
done

# A page on the wiki with no counterpart in the source is either wiki-only nav
# or a leftover from a renamed page. Report it; deleting is a judgement call.
for f in ./*.md; do
    b=$(basename "$f")
    skip=0
    for w in "${WIKI_ONLY[@]}"; do [[ "$b" == "$w" ]] && skip=1; done
    [[ $skip -eq 1 ]] && continue
    [[ -f "$SRC_DIR/$b" ]] || echo "  orphan on the wiki (no source page): $b"
done

if [[ ${#changed[@]} -eq 0 ]]; then
    echo
    echo "Wiki is in sync with docs/wiki-src/pages — nothing to push."
    exit 0
fi

echo
echo "${#changed[@]} page(s) differ:"
printf '  %s\n' "${changed[@]}"

if [[ $DRYRUN -eq 1 ]]; then
    echo
    echo "DRY RUN — nothing copied, committed or pushed."
    exit 0
fi

# ---- commit and push ----------------------------------------------------
git add -- "${changed[@]}"
MSG="Sync $( [[ ${#changed[@]} -eq 1 ]] && echo "${changed[0]%.md}" || echo "${#changed[@]} pages" ) from the in-repo source"
git -c user.name="Retro-Jack" -c user.email="retrojack68@gmail.com" \
    commit -q -m "$MSG"

# Belt and braces: this remote is a plain HTTPS URL today, but a token has been
# embedded in it before, and git echoes the remote on push.
git push -q origin "HEAD:$BRANCH" 2>&1 | sed 's/gh[pousr]_[A-Za-z0-9]*/gh?_***/g'
echo
echo "Pushed: $(git log -1 --format='%h %s')"
