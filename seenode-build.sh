#!/bin/bash
set -e

echo "=== Installing Node.js ==="
apt-get update && apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

echo "=== Building Go backend ==="
cd backend
go build -o ../server ./cmd/server
cd ..

echo "=== Starting Go server for static build ==="
export DATABASE_PATH=/tmp/market-build.db
export MIGRATIONS_DIR=./backend/migrations
export PORT=3001
export PAYPAL_MODE=sandbox
export ENVIO_USD=5
export PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID:-dummy}
export PAYPAL_CLIENT_SECRET=${PAYPAL_CLIENT_SECRET:-dummy}
./server &
SERVER_PID=$!
sleep 2

echo "=== Installing JS dependencies ==="
npm ci

echo "=== Building frontend (Next.js) ==="
API_URL=http://localhost:3001 npm run build

echo "=== Stopping build server ==="
kill $SERVER_PID 2>/dev/null || true
rm -f /tmp/market-build.db

echo "=== Copying migrations for production ==="
mkdir -p migrations/postgres
cp backend/migrations/postgres/*.sql migrations/postgres/

echo "=== Build complete ==="
