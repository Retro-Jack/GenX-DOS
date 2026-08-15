#!/usr/bin/env bash
# Deploy GenX-DOS to the genx-dos.fun web host (Namecheap shared / cPanel /
# LiteSpeed) over rsync-on-SSH.
#
# What ships is decided by build-portable.sh, NOT by this script. That file
# calls itself the single source of truth for the shipping file set, and a
# second exclude list here would silently drift from it the first time either
# changed — so this builds the portable set into a temp dir and mirrors that.
# Change what reaches the web host by editing build-portable.sh.
#
# The target is a required argument rather than a default, because the only
# thing separating a routine staging push from overwriting the live public
# site is which word you type. Live also asks for confirmation unless -y.
#
# Usage:
#   ./deploy.sh staging          # push to staging.genx-dos.fun (HTTP only)
#   ./deploy.sh live             # push to genx-dos.fun, with a confirm prompt
#   ./deploy.sh live -n          # dry run: report what would change, send nothing
#   ./deploy.sh live -y          # skip the confirm prompt (for unattended use)
set -euo pipefail
cd "$(dirname "$(realpath "$0")")"

# ---- host ---------------------------------------------------------------
SSH_USER=genxuuaw
SSH_HOST=199.188.201.33
SSH_PORT=21098                       # Namecheap shared hosting, NOT 22
SSH_KEY="${HOME}/.ssh/genx-dos-deploy"

# ---- arguments ----------------------------------------------------------
TARGET=""; DRYRUN=0; ASSUME_YES=0
for a in "$@"; do
    case "$a" in
        live|staging) TARGET="$a" ;;
        -n|--dry-run) DRYRUN=1 ;;
        -y|--yes)     ASSUME_YES=1 ;;
        -h|--help)    awk 'NR>1 && /^#/ { sub(/^# ?/,""); print; next } NR>1 { exit }' "$0"; exit 0 ;;
        *) echo "Unknown argument: $a  (try --help)" >&2; exit 2 ;;
    esac
done

if [[ -z "$TARGET" ]]; then
    echo "Specify a target: ./deploy.sh staging   or   ./deploy.sh live" >&2
    exit 2
fi

case "$TARGET" in
    live)    REMOTE_DIR=public_html ; URL=https://genx-dos.fun ;;
    staging) REMOTE_DIR=staging     ; URL=http://staging.genx-dos.fun ;;
esac

[[ -f "$SSH_KEY" ]] || { echo "Deploy key missing: $SSH_KEY" >&2; exit 1; }

# LogLevel=ERROR suppresses the client's post-quantum key-exchange warning,
# which fires on every connection and buries the transfer summary.
SSH_CMD="ssh -i $SSH_KEY -p $SSH_PORT -o BatchMode=yes -o ConnectTimeout=15 -o LogLevel=ERROR"

# ---- build the shipping set --------------------------------------------
# Built fresh every run rather than mirroring _Portable, so a stale portable
# folder can never become a stale website.
STAGE_DIR=$(mktemp -d /tmp/genx-deploy.XXXXXX)
trap 'rm -rf "$STAGE_DIR"' EXIT

echo "Building the shipping file set..."
./build-portable.sh "$STAGE_DIR" >/dev/null

# The one place a web deploy legitimately differs from the portable build:
# GenX-DOS.sh/.bat start a local web server for a downloaded copy of the site.
# On a host that already serves the site they do nothing except sit there
# publicly downloadable, so they ship in the zip but not to the web.
rm -f "$STAGE_DIR/GenX-DOS.sh" "$STAGE_DIR/GenX-DOS.bat"

echo "  $(find "$STAGE_DIR" -type f | wc -l) files, $(du -sh "$STAGE_DIR" | cut -f1)"

# ---- deploy -------------------------------------------------------------
# protect = present on the server, absent from the build, must survive --delete:
#   .well-known    SSL/domain validation — removing it can break cert renewal
#   cgi-bin        created by cPanel
#   nc_assets, parking-page.shtml.old   Namecheap leftovers (live only)
#   robots.txt     staging's noindex guard; the repo has no robots.txt, so
#                  without this the first staging deploy makes it indexable
RSYNC_OPTS=(-az --delete --human-readable
    --filter='protect .well-known/'
    --filter='protect cgi-bin/'
    --filter='protect nc_assets/'
    --filter='protect parking-page.shtml.old'
    --filter='protect robots.txt')

if [[ $DRYRUN -eq 1 ]]; then
    echo
    echo "DRY RUN — $TARGET ($URL). Nothing will be sent."
    rsync "${RSYNC_OPTS[@]}" -n --itemize-changes -e "$SSH_CMD" \
        "$STAGE_DIR"/ "$SSH_USER@$SSH_HOST:$REMOTE_DIR/" \
        | grep -vE '^(sending|sent|total|$)' | head -60
    echo
    echo "(showing at most 60 changes)"
    exit 0
fi

if [[ "$TARGET" == live && $ASSUME_YES -eq 0 ]]; then
    echo
    echo "About to overwrite the LIVE public site at $URL."
    read -rp "Type 'deploy' to continue: " confirm
    [[ "$confirm" == "deploy" ]] || { echo "Aborted."; exit 1; }
fi

echo
echo "Deploying to $TARGET ($URL)..."
rsync "${RSYNC_OPTS[@]}" --info=stats2 -e "$SSH_CMD" \
    "$STAGE_DIR"/ "$SSH_USER@$SSH_HOST:$REMOTE_DIR/" \
    | grep -E 'Number of (created|deleted|regular)|Total transferred' | sed 's/^/  /'

# ---- verify -------------------------------------------------------------
# A deploy that reports success while the site 404s is the failure mode worth
# catching — an earlier upload left directory entries as zero-byte files and
# every path under them broke, with nothing in the transfer log to show it.
echo
echo "Verifying..."
fail=0
for path in / /prompt/ /styles/genx.css /docs/wiki/ /systems/bbcmicro/dist/index.html; do
    # curl exits non-zero AND prints 000 on a resolve failure, so a `|| echo 000`
    # fallback would concatenate into "000000". Capture, then default if empty.
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 "$URL$path" 2>/dev/null) || true
    [[ -z "$code" ]] && code=000
    if [[ "$code" == 200 ]]; then
        printf '  \033[32mok\033[0m    %s\n' "$path"
    else
        printf '  \033[31m%s\033[0m   %s\n' "$code" "$path"; fail=1
    fi
done

wasm=$(curl -sI --max-time 25 "$URL/systems/atari400/atari800.wasm" 2>/dev/null \
       | grep -i '^content-type:' | tr -d '\r' | awk '{print $2}') || true
if [[ "$wasm" == "application/wasm" ]]; then
    printf '  \033[32mok\033[0m    .wasm served as application/wasm\n'
else
    printf '  \033[31mbad\033[0m   .wasm served as "%s" — emulators will not start\n' "$wasm"; fail=1
fi

echo
if [[ $fail -eq 0 ]]; then
    echo "Deployed to $URL"
elif ! getent hosts "${URL#*://}" >/dev/null 2>&1; then
    # Files went up fine; this machine just can't resolve the name yet. A newly
    # created subdomain gets negative-cached locally well after the
    # authoritative server has the record.
    echo "Files deployed. Checks could not run: ${URL#*://} does not resolve here yet."
    echo "The authoritative server may already have it — verify with:"
    echo "  dig +short A ${URL#*://} @dns1.namecheaphosting.com"
    echo "  curl --resolve ${URL#*://}:80:$SSH_HOST $URL/"
else
    echo "Deployed, but checks failed above — inspect before announcing." >&2
    exit 1
fi
