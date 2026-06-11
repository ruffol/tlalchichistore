package postgres

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
	"tlalchichi/market/internal/model"
)

type CategoriaRepo struct {
	db *sqlx.DB
}

func NewCategoriaRepo(db *sql.DB) *CategoriaRepo {
	return &CategoriaRepo{db: sqlx.NewDb(db, "postgres")}
}

func (r *CategoriaRepo) List(ctx context.Context) ([]model.Categoria, error) {
	var cats []model.Categoria
	if err := r.db.SelectContext(ctx, &cats, "SELECT * FROM categorias ORDER BY nombre"); err != nil {
		return nil, fmt.Errorf("list categorias: %w", err)
	}
	return cats, nil
}

func (r *CategoriaRepo) GetBySlug(ctx context.Context, slug string) (*model.Categoria, error) {
	var cat model.Categoria
	if err := r.db.GetContext(ctx, &cat, "SELECT * FROM categorias WHERE slug = $1", slug); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("get categoria by slug: %w", err)
	}
	return &cat, nil
}
