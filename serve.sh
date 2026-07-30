#!/usr/bin/env bash
# Start a local web server in the repo root and open the landing page in the default browser.
# Usage: ./serve.sh [port]
set -euo pipefail

PORT="${1:-8765}"
HOST="127.0.0.1"

cd "$(dirname "$(realpath "$0")")"

if ! command -v python3 >/dev/null 2>&1; then
    echo "python3 is required but not found." >&2
    exit 1
fi

port_free() {
    ! ss -ltn "sport = :$1" 2>/dev/null | grep -q LISTEN
}

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
    if [ -z "${PORT}" ]; then
        echo "Could not find a free port after 50 attempts." >&2
        exit 1
    fi
    echo "Using port ${PORT} instead of ${ORIG_PORT}." >&2
fi

URL="http://${HOST}:${PORT}/"

echo "Serving GenX-DOS on ${URL}"
echo "Press Ctrl+C to stop."

python3 -m http.server "${PORT}" --bind "${HOST}" &
SERVER_PID=$!
trap 'kill ${SERVER_PID} 2>/dev/null || true' INT TERM EXIT

sleep 1
if command -v xdg-open >/dev/null 2>&1; then xdg-open "${URL}" >/dev/null 2>&1 &
elif command -v open >/dev/null 2>&1; then open "${URL}" >/dev/null 2>&1 &
fi

wait ${SERVER_PID}
