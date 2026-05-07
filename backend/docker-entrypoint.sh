#!/bin/sh
set -e
chown -R 1001:1001 /app/_storage 2>/dev/null || true

echo "🌱 Rodando migrations + seeders..."
if [ -f "/app/database/seeders/main.ts" ]; then
  su-exec 1001:1001 npm run seed
else
  su-exec 1001:1001 node /app/database/seeders/main.js
fi

exec su-exec 1001 "$@"
