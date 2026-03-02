#!/bin/sh
# Wait for DB to be reachable then run migrations and start the server
_max=30
_attempt=1
while true; do
  if pnpm exec prisma migrate deploy; then
    break
  fi
  if [ "$_attempt" -ge "$_max" ]; then
    echo "prisma migrate deploy failed after $_max attempts" >&2
    exit 1
  fi
  echo "Database not ready, retrying in 2s (attempt $_attempt/$_max)..." >&2
  sleep 2
  _attempt=$((_attempt + 1))
done
exec pnpm exec tsx watch src/index.ts
