#!/usr/bin/env sh
set -eu

# Rails (Puma) writes a pid file; when the container is restarted abruptly and
# /app is bind-mounted, the pid can remain and block the next boot.
rm -f /app/tmp/pids/server.pid

exec "$@"

