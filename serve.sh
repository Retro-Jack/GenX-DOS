#!/usr/bin/env bash
# Start a local web server in the repo root and open the prompt in the default browser.
# Usage: ./serve.sh [port]
set -euo pipefail

PORT="${1:-8765}"
HOST="127.0.0.1"
URL="http://${HOST}:${PORT}/prompt/"

cd "$(dirname "$(realpath "$0")")"

if ! command -v python3 >/dev/null 2>&1; then
    echo "python3 is required but not found." >&2
    exit 1
fi

if ss -ltn "sport = :${PORT}" 2>/dev/null | grep -q LISTEN; then
    echo "Port ${PORT} is already in use. Pass a different port: ./serve.sh 9000" >&2
    exit 1
fi

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
