# syntax=docker/dockerfile:1

# ---- Go build ----
FROM golang:1.24-alpine AS go-build
WORKDIR /build
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ .
RUN CGO_ENABLED=0 go build -o /market-server ./cmd/server

# ---- Frontend build (Next.js static export) ----
FROM node:22-alpine AS frontend-build
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Runtime ----
FROM alpine:3.21
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app

COPY --from=go-build /market-server .
COPY --from=frontend-build /build/out ./out
COPY backend/migrations ./migrations

EXPOSE 8080

ENV PORT=8080
ENV DATABASE_PATH=/data/market.db
ENV FRONTEND_DIR=./out

CMD ["./market-server"]
