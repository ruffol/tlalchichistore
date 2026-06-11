package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"tlalchichi/market/internal/handler"
	paypalclient "tlalchichi/market/internal/paypal"
	"tlalchichi/market/internal/repository"
	pgrepo "tlalchichi/market/internal/repository/postgres"
	sqliterepo "tlalchichi/market/internal/repository/sqlite"
	"tlalchichi/market/internal/service"
)

func main() {
	dbURL := os.Getenv("DATABASE_URL")
	dbPath := envOrDefault("DATABASE_PATH", "./data/market.db")
	frontendDir := envOrDefault("FRONTEND_DIR", "./frontend/dist")
	port := envOrDefault("PORT", "8080")
	paypalClientID := os.Getenv("PAYPAL_CLIENT_ID")
	paypalSecret := os.Getenv("PAYPAL_CLIENT_SECRET")
	paypalMode := envOrDefault("PAYPAL_MODE", "sandbox")
	envioStr := envOrDefault("ENVIO_USD", "5")

	var db *sql.DB
	var categoriaRepo repository.CategoriaRepository
	var productoRepo repository.ProductoRepository
	var pedidoRepo repository.PedidoRepository

	if dbURL != "" {
		var err error
		db, err = pgrepo.Open(dbURL)
		if err != nil {
			log.Fatalf("database: %v", err)
		}
		defer db.Close()

		migrationsDir := envOrDefault("MIGRATIONS_DIR", "./migrations/postgres")
		if err := pgrepo.RunMigrations(db, migrationsDir); err != nil {
			log.Fatalf("migrations: %v", err)
		}

		categoriaRepo = pgrepo.NewCategoriaRepo(db)
		productoRepo = pgrepo.NewProductoRepo(db)
		pedidoRepo = pgrepo.NewPedidoRepo(db)
	} else {
		os.MkdirAll(filepath.Dir(dbPath), 0755)

		var err error
		db, err = sqliterepo.Open(dbPath)
		if err != nil {
			log.Fatalf("database: %v", err)
		}
		defer db.Close()

		migrationsDir := envOrDefault("MIGRATIONS_DIR", "./migrations")
		if err := sqliterepo.RunMigrations(db, migrationsDir); err != nil {
			log.Fatalf("migrations: %v", err)
		}

		categoriaRepo = sqliterepo.NewCategoriaRepo(db)
		productoRepo = sqliterepo.NewProductoRepo(db)
		pedidoRepo = sqliterepo.NewPedidoRepo(db)
	}

	var envio float64
	if _, err := fmt.Sscanf(envioStr, "%f", &envio); err != nil {
		envio = 5
	}

	paypalAPI := "https://api-m.sandbox.paypal.com"
	if paypalMode == "live" {
		paypalAPI = "https://api-m.paypal.com"
	}
	paypalClient := paypalclient.New(paypalClientID, paypalSecret, paypalAPI)
	paypalSvc := service.NewPayPalService(paypalClient, pedidoRepo, envio)

	categoriaH := handler.NewCategoriaHandler(categoriaRepo)
	productoH := handler.NewProductoHandler(productoRepo)
	pedidoH := handler.NewPedidoHandler(pedidoRepo)
	paypalH := handler.NewPayPalHandler(paypalSvc, pedidoRepo)

	allowedOrigins := []string{
		"http://localhost:3000",
		"http://localhost:5173",
		"http://localhost:8080",
	}

	r := handler.NewRouter(categoriaH, productoH, pedidoH, paypalH, frontendDir, allowedOrigins)

	log.Printf("listening on :%s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("server: %v", err)
	}
}

func envOrDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
