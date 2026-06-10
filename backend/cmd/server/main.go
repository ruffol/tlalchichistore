package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"tlalchichi/market/internal/handler"
	paypalclient "tlalchichi/market/internal/paypal"
	sqliterepo "tlalchichi/market/internal/repository/sqlite"
	"tlalchichi/market/internal/service"
)

func main() {
	dbPath := envOrDefault("DATABASE_PATH", "./data/market.db")
	frontendDir := envOrDefault("FRONTEND_DIR", "./frontend/dist")
	port := envOrDefault("PORT", "8080")
	paypalClientID := os.Getenv("PAYPAL_CLIENT_ID")
	paypalSecret := os.Getenv("PAYPAL_CLIENT_SECRET")
	paypalMode := envOrDefault("PAYPAL_MODE", "sandbox")
	envioStr := envOrDefault("ENVIO_USD", "5")

	// Ensure data directory exists
	os.MkdirAll(filepath.Dir(dbPath), 0755)

	// Open database
	db, err := sqliterepo.Open(dbPath)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer db.Close()

	// Run migrations
	migrationsDir := envOrDefault("MIGRATIONS_DIR", "./migrations")
	if err := sqliterepo.RunMigrations(db, migrationsDir); err != nil {
		log.Fatalf("migrations: %v", err)
	}

	// Calculate envio
	var envio float64
	if _, err := fmt.Sscanf(envioStr, "%f", &envio); err != nil {
		envio = 5
	}

	// Repositories
	categoriaRepo := sqliterepo.NewCategoriaRepo(db)
	productoRepo := sqliterepo.NewProductoRepo(db)
	pedidoRepo := sqliterepo.NewPedidoRepo(db)
	sqliterepo.NewSettingsRepo(db) // available for future use

	// PayPal
	paypalAPI := "https://api-m.sandbox.paypal.com"
	if paypalMode == "live" {
		paypalAPI = "https://api-m.paypal.com"
	}
	paypalClient := paypalclient.New(paypalClientID, paypalSecret, paypalAPI)
	paypalSvc := service.NewPayPalService(paypalClient, pedidoRepo, envio)

	// Handlers
	categoriaH := handler.NewCategoriaHandler(categoriaRepo)
	productoH := handler.NewProductoHandler(productoRepo)
	pedidoH := handler.NewPedidoHandler(pedidoRepo)
	paypalH := handler.NewPayPalHandler(paypalSvc, pedidoRepo)

	// Router
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
