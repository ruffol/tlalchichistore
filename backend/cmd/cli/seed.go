package main

import (
	"fmt"
	"log"
	"math/rand"

	sqliterepo "tlalchichi/market/internal/repository/sqlite"
)

var coloresPorProducto = map[string][]struct {
	nombre string
	seed   string
}{
	"tlalchichi-maceta":  {{"Barro", "barro"}, {"Blanco", "blanco"}, {"Verde", "verde"}},
	"tlalchichi-vela":    {{"Natural", "natural"}, {"Rojo", "rojo"}, {"Dorado", "dorado"}},
	"tlalchichi-jabon":   {{"Lavanda", "lavanda"}, {"Cítrico", "citrico"}, {"Miel", "miel"}},
	"tlalchichi-yeso":    {{"Blanco", "blanco"}, {"Gris", "gris"}, {"Rosa", "rosa"}},
	"tlalchichi-alcancia": {{"Rojo", "rojo"}, {"Azul", "azul"}, {"Amarillo", "amarillo"}},
	"tlalchichi-llavero": {{"Café", "cafe"}, {"Negro", "negro"}, {"Rojo", "rojo"}},
}

var modelos = []struct {
	nombre string
	seed   string
}{
	{"Sentado viejito", "sentado-viejito"},
	{"Sentado simple", "sentado-simple"},
	{"Con máscara simple", "con-mascara-simple"},
	{"Parado simple", "parado-simple"},
	{"Hechado simple", "hechado-simple"},
	{"Perritos ritual", "perritos-ritual"},
	{"Con máscara 2", "con-mascara-2"},
}

var productos = []struct {
	nombre      string
	slug        string
	descripcion string
	precioUsd   float64
}{
	{
		"Tlalchichi Maceta", "tlalchichi-maceta",
		"Maceta artesanal de cemento pintada a mano. Diseño único con acabados tradicionales mexicanos.",
		25,
	},
	{
		"Tlalchichi Vela", "tlalchichi-vela",
		"Vela decorativa de cera natural vertida a mano en moldes artesanales.",
		18,
	},
	{
		"Tlalchichi Jabón", "tlalchichi-jabon",
		"Jabón artesanal hecho con ingredientes naturales. Suave con la piel.",
		12,
	},
	{
		"Tlalchichi Yeso", "tlalchichi-yeso",
		"Figura decorativa de yeso moldeada y pintada a mano.",
		15,
	},
	{
		"Tlalchichi Alcancía", "tlalchichi-alcancia",
		"Alcancía de cemento con diseño tradicional mexicano.",
		20,
	},
	{
		"Tlalchichi Llavero", "tlalchichi-llavero",
		"Llavero artesanal de cemento pintado a mano.",
		8,
	},
}

func cmdSeed(dbPath string) {
	db := openDB(dbPath)
	defer db.Close()

	if err := sqliterepo.RunMigrations(db, "./migrations"); err != nil {
		log.Fatalf("error: %v", err)
	}

	// Clean existing data
	for _, t := range []string{"colores", "modelos", "pedido_items", "pedidos", "productos", "categorias"} {
		db.Exec("DELETE FROM " + t)
	}

	// Create category
	catID := "cat-tlalchichi"
	_, err := db.Exec(
		"INSERT INTO categorias (id, nombre, slug, imagen) VALUES (?, ?, ?, ?)",
		catID, "Tlalchichi", "tlalchichi", "/assets/gallery/gallery-tlalchichi-maceta.png",
	)
	if err != nil {
		log.Fatalf("error creando categoría: %v", err)
	}

	for _, p := range productos {
		prodID := "prod-" + p.slug
		imagenURL := "/assets/gallery/gallery-" + p.slug + ".png"

		_, err := db.Exec(
			`INSERT INTO productos (id, nombre, slug, descripcion, precio_usd, imagen, activo, categoria_id)
			 VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
			prodID, p.nombre, p.slug, p.descripcion, p.precioUsd, imagenURL, catID,
		)
		if err != nil {
			log.Fatalf("error creando producto %s: %v", p.slug, err)
		}

		colores := coloresPorProducto[p.slug]

		for _, m := range modelos {
			modeloID := "mod-" + p.slug + "-" + m.seed
			_, err := db.Exec(
				"INSERT INTO modelos (id, nombre, producto_id) VALUES (?, ?, ?)",
				modeloID, m.nombre, prodID,
			)
			if err != nil {
				log.Fatalf("error creando modelo %s: %v", modeloID, err)
			}

			for _, c := range colores {
				colorID := "col-" + p.slug + "-" + m.seed + "-" + c.seed
				stock := rand.Intn(15) + 3
				_, err := db.Exec(
					"INSERT INTO colores (id, nombre, imagen, stock, modelo_id) VALUES (?, ?, ?, ?, ?)",
					colorID, c.nombre, imagenURL, stock, modeloID,
				)
				if err != nil {
					log.Fatalf("error creando color %s: %v", colorID, err)
				}
			}
		}

		fmt.Printf("  ✓ %s (%d modelos × %d colores)\n", p.nombre, len(modelos), len(colores))
	}

	fmt.Println("seed completado")
}
