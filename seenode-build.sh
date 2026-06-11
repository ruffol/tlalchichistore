#!/bin/bash
set -e

echo "=== Installing Node.js ==="
apt-get update && apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

echo "=== Building frontend (Next.js) ==="
npm ci
npm run build

echo "=== Building Go backend ==="
cd backend
go build -o ../server ./cmd/server
cd ..

echo "=== Copying migrations ==="
mkdir -p migrations/postgres
cp backend/migrations/postgres/*.sql migrations/postgres/

echo "=== Build complete ==="
