#!/usr/bin/env bash
# Launch a local web server in the repo root and open the home page in a browser.
# Closing the browser window stops the server (Chromium-family browsers); otherwise
# stop it with Ctrl+C.
# Usage: ./GenX-DOS.sh [port]
set -euo pipefail

PORT="${1:-8765}"
HOST="127.0.0.1"

cd "$(dirname "$(realpath "$0")")"

pause() { read -rp "Press Enter to close... " _ 2>/dev/null || true; }
die()   { echo "$@" >&2; pause; exit 1; }

command -v python3 >/dev/null 2>&1 || die "python3 is required but not found."

port_free() { ! ss -ltn "sport = :$1" 2>/dev/null | grep -q LISTEN; }

# If the chosen port is taken, fall back to a random free port in the IANA
# dynamic range (49152-65535) rather than giving up.
if ! port_free "${PORT}"; then
    echo "Port ${PORT} is in use — selecting a free port..." >&2
    ORIG_PORT="${PORT}"
    PORT=""
    for _ in $(seq 1 50); do
        CANDIDATE=$(( (RANDOM % 16384) + 49152 ))
        if port_free "${CANDIDATE}"; then PORT="${CANDIDATE}"; break; fi
    done
    [ -n "${PORT}" ] || die "Could not find a free port after 50 attempts."
    echo "Using port ${PORT} instead of ${ORIG_PORT}." >&2
fi

URL="http://${HOST}:${PORT}/"
echo "Serving GenX-DOS on ${URL}"

python3 -m http.server "${PORT}" --bind "${HOST}" >/dev/null 2>&1 &
SERVER_PID=$!
trap 'kill "${SERVER_PID}" 2>/dev/null || true' INT TERM EXIT

sleep 1

# A Chromium-family browser launched with its own profile is a single process we
# can wait on, so closing its window stops the server. Otherwise fall back to the
# default browser (stop with Ctrl+C).
BROWSER=""
for b in chromium chromium-browser google-chrome google-chrome-stable \
         brave-browser vivaldi-stable microsoft-edge microsoft-edge-stable; do
    if command -v "$b" >/dev/null 2>&1; then BROWSER="$b"; break; fi
done

if [ -n "${BROWSER}" ]; then
    echo "Close the browser window to stop the server."
    "${BROWSER}" --new-window --user-data-dir="${TMPDIR:-/tmp}/genxdos-browser" "${URL}" >/dev/null 2>&1 || true
    echo "Server stopped."
    pause
else
    echo "Press Ctrl+C to stop."
    if   command -v xdg-open >/dev/null 2>&1; then xdg-open "${URL}" >/dev/null 2>&1 || true
    elif command -v open     >/dev/null 2>&1; then open     "${URL}" >/dev/null 2>&1 || true
    fi
    wait "${SERVER_PID}"
fi
