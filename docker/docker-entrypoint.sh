#!/bin/sh
set -e
if [ "${SKIP_PRISMA_MIGRATE:-0}" != "1" ]; then
  if [ -d prisma/migrations ] && find prisma/migrations -mindepth 1 -maxdepth 1 -type d | read -r _; then
    echo "[docker-entrypoint] prisma migrate deploy..."
    npx prisma migrate deploy
  else
    echo "[docker-entrypoint] no migrations found, running prisma db push..."
    npx prisma db push --skip-generate
  fi
fi
echo "[docker-entrypoint] node dist/src/main.js"
exec node dist/src/main.js
