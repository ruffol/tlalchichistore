package postgres

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
	"tlalchichi/market/internal/model"
)

type ProductoRepo struct {
	db *sqlx.DB
}

func NewProductoRepo(db *sql.DB) *ProductoRepo {
	return &ProductoRepo{db: sqlx.NewDb(db, "postgres")}
}

func (r *ProductoRepo) List(ctx context.Context, categoriaSlug string) ([]model.Producto, error) {
	query := `SELECT p.*,
		c.id AS "categoria.id", c.nombre AS "categoria.nombre",
		c.slug AS "categoria.slug", c.imagen AS "categoria.imagen"
	FROM productos p
	JOIN categorias c ON c.id = p.categoria_id
	WHERE ($1 = '' OR c.slug = $1) AND p.activo = true
	ORDER BY p.nombre`

	var productos []model.Producto
	if err := r.db.SelectContext(ctx, &productos, query, categoriaSlug); err != nil {
		return nil, fmt.Errorf("list productos: %w", err)
	}

	if len(productos) == 0 {
		return productos, nil
	}

	productIDs := make([]string, len(productos))
	for i, p := range productos {
		productIDs[i] = p.ID
	}

	modelos, err := r.fetchModelos(ctx, productIDs)
	if err != nil {
		return nil, err
	}

	modeloMap := make(map[string][]model.Modelo)
	for _, m := range modelos {
		modeloMap[m.ProductoID] = append(modeloMap[m.ProductoID], m)
	}

	for i, p := range productos {
		productos[i].Modelos = modeloMap[p.ID]
	}

	return productos, nil
}

func (r *ProductoRepo) GetBySlug(ctx context.Context, slug string) (*model.Producto, error) {
	query := `SELECT p.*,
		c.id AS "categoria.id", c.nombre AS "categoria.nombre",
		c.slug AS "categoria.slug", c.imagen AS "categoria.imagen"
	FROM productos p
	JOIN categorias c ON c.id = p.categoria_id
	WHERE p.slug = $1`

	var p model.Producto
	if err := r.db.GetContext(ctx, &p, query, slug); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("get producto by slug: %w", err)
	}

	modelos, err := r.fetchModelos(ctx, []string{p.ID})
	if err != nil {
		return nil, err
	}

	if len(modelos) > 0 {
		p.Modelos = modelos
	}

	return &p, nil
}

func (r *ProductoRepo) fetchModelos(ctx context.Context, productIDs []string) ([]model.Modelo, error) {
	if len(productIDs) == 0 {
		return nil, nil
	}

	query, args, err := sqlx.In("SELECT * FROM modelos WHERE producto_id IN (?) ORDER BY nombre", productIDs)
	if err != nil {
		return nil, fmt.Errorf("build modelos query: %w", err)
	}
	query = r.db.Rebind(query)

	var modelos []model.Modelo
	if err := r.db.SelectContext(ctx, &modelos, query, args...); err != nil {
		return nil, fmt.Errorf("fetch modelos: %w", err)
	}

	if len(modelos) == 0 {
		return modelos, nil
	}

	modeloIDs := make([]string, len(modelos))
	for i, m := range modelos {
		modeloIDs[i] = m.ID
	}

	colores, err := r.fetchColores(ctx, modeloIDs)
	if err != nil {
		return nil, err
	}

	colorMap := make(map[string][]model.Color)
	for _, c := range colores {
		colorMap[c.ModeloID] = append(colorMap[c.ModeloID], c)
	}

	for i, m := range modelos {
		modelos[i].Colores = colorMap[m.ID]
	}

	return modelos, nil
}

func (r *ProductoRepo) fetchColores(ctx context.Context, modeloIDs []string) ([]model.Color, error) {
	if len(modeloIDs) == 0 {
		return nil, nil
	}

	query, args, err := sqlx.In("SELECT * FROM colores WHERE modelo_id IN (?) ORDER BY nombre", modeloIDs)
	if err != nil {
		return nil, fmt.Errorf("build colores query: %w", err)
	}
	query = r.db.Rebind(query)

	var colores []model.Color
	if err := r.db.SelectContext(ctx, &colores, query, args...); err != nil {
		return nil, fmt.Errorf("fetch colores: %w", err)
	}

	return colores, nil
}
