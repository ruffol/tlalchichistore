.PHONY: dev-backend dev-frontend dev build docker-build docker-up docker-down cli-migrate cli-seed cli-export

# Go backend
dev-backend:
	cd backend && go run ./cmd/server

# Next.js (static export dev)
dev-frontend:
	npm run dev

# Build everything locally
build:
	cd backend && go build -o ../bin/market-server ./cmd/server
	npm run build

# Docker
docker-build:
	docker build -f docker/Dockerfile -t tlalchichi/market .

docker-up:
	docker compose -f docker/docker-compose.yml up -d

docker-down:
	docker compose -f docker/docker-compose.yml down

# CLI commands (via Go)
cli-migrate:
	cd backend && go run ./cmd/cli migrate

cli-seed:
	cd backend && go run ./cmd/cli seed

cli-export:
	cd backend && go run ./cmd/cli export
