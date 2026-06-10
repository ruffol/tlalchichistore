.PHONY: dev-backend dev-frontend dev build docker-up docker-build

# Go backend
dev-backend:
	cd backend && go run ./cmd/server

# Next.js frontend
dev-frontend:
	npm run dev

# Run both in parallel
dev:
	@trap 'kill 0' EXIT; \
		$(MAKE) dev-backend & \
		$(MAKE) dev-frontend & \
		wait

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

# Build binaries
build-server:
	cd backend && go build -o ../bin/market-server ./cmd/server

build-cli:
	cd backend && go build -o ../bin/market ./cmd/cli

build-all: build-server build-cli
