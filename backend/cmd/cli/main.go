package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	pgrepo "tlalchichi/market/internal/repository/postgres"
	sqliterepo "tlalchichi/market/internal/repository/sqlite"
)

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	dbURL := os.Getenv("DATABASE_URL")
	dbPath := envOrDefault("DATABASE_PATH", "./data/market.db")
	migrationsDir := envOrDefault("MIGRATIONS_DIR", "./migrations")

	cmd := os.Args[1]

	if dbURL != "" {
		runPG(dbURL, cmd, os.Args[2:])
	} else {
		runSQLite(dbPath, migrationsDir, cmd, os.Args[2:])
	}
}

func runPG(dbURL, cmd string, args []string) {
	db, err := pgrepo.Open(dbURL)
	if err != nil {
		log.Fatalf("error abriendo DB: %v", err)
	}
	defer db.Close()

	migrationsDir := envOrDefault("MIGRATIONS_DIR", "./migrations/postgres")

	switch cmd {
	case "migrate":
		cmdMigratePG(db, migrationsDir)
	case "seed":
		cmdSeedPG(db)
	case "export":
		cmdExport(db, args)
	default:
		printUsage()
		os.Exit(1)
	}
}

func runSQLite(dbPath, migrationsDir, cmd string, args []string) {
	switch cmd {
	case "migrate":
		cmdMigrate(dbPath, migrationsDir)
	case "seed":
		cmdSeed(dbPath)
	case "export":
		cmdExportSQLite(dbPath, args)
	default:
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Println(`Uso: market <comando> [argumentos]
Comandos:
  migrate              Ejecuta migraciones pendientes
  seed                 Carga datos de ejemplo
  export [--csv|--xlsx] Exporta pedidos (CSV por defecto)`)
}

func envOrDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func openDB(path string) *sql.DB {
	db, err := sqliterepo.Open(path)
	if err != nil {
		log.Fatalf("error abriendo DB: %v", err)
	}
	return db
}

func cmdMigrate(dbPath, migrationsDir string) {
	db := openDB(dbPath)
	defer db.Close()

	if err := sqliterepo.RunMigrations(db, migrationsDir); err != nil {
		log.Fatalf("error ejecutando migraciones: %v", err)
	}
	fmt.Println("migraciones completadas")
}

func cmdMigratePG(db *sql.DB, migrationsDir string) {
	if err := pgrepo.RunMigrations(db, migrationsDir); err != nil {
		log.Fatalf("error ejecutando migraciones: %v", err)
	}
	fmt.Println("migraciones completadas")
}

func cmdExportSQLite(dbPath string, args []string) {
	db := openDB(dbPath)
	defer db.Close()
	cmdExport(db, args)
}

func cmdExport(db *sql.DB, args []string) {
	format := "csv"
	if len(args) > 0 {
		switch args[0] {
		case "--csv":
			format = "csv"
		case "--xlsx":
			format = "xlsx"
			fmt.Fprintln(os.Stderr, "XLSX aún no implementado, usando CSV")
		}
	}

	rows, err := db.Query(`
		SELECT p.id, p.email, p.total, p.gateway, p.status, p.created_at,
			   pi.nombre, pi.cantidad, pi.precio_usd, pi.modelo_nombre, pi.color_nombre
		FROM pedidos p
		LEFT JOIN pedido_items pi ON pi.pedido_id = p.id
		ORDER BY p.created_at DESC
	`)
	if err != nil {
		log.Fatalf("error consultando pedidos: %v", err)
	}
	defer rows.Close()

	if format == "csv" {
		fmt.Println("fecha,email,total,status,producto,cantidad,precio_unitario,modelo,color")
		for rows.Next() {
			var id, email, gateway, status, createdAt string
			var total float64
			var nombre, cantidad, precioUsd sql.NullString
			var modelo, color sql.NullString

			err := rows.Scan(&id, &email, &total, &gateway, &status, &createdAt,
				&nombre, &cantidad, &precioUsd, &modelo, &color)
			if err != nil {
				log.Fatalf("error leyendo fila: %v", err)
			}

			prodName := nombre.String
			qty := cantidad.String
			price := precioUsd.String
			m := modelo.String
			c := color.String

			fmt.Printf("%s,%s,%.2f,%s,%s,%s,%s,%s,%s\n",
				createdAt, email, total, status, prodName, qty, price, m, c)
		}
	}
}

func rebindQuery(query string) string {
	var buf strings.Builder
	n := 0
	for i := 0; i < len(query); i++ {
		if query[i] == '?' {
			n++
			fmt.Fprintf(&buf, "$%d", n)
		} else {
			buf.WriteByte(query[i])
		}
	}
	return buf.String()
}
