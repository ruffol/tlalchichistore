package repository

import (
	"context"
	"tlalchichi/market/internal/model"
)

type CategoriaRepository interface {
	List(ctx context.Context) ([]model.Categoria, error)
	GetBySlug(ctx context.Context, slug string) (*model.Categoria, error)
}
