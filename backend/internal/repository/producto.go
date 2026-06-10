package repository

import (
	"context"
	"tlalchichi/market/internal/model"
)

type ProductoRepository interface {
	List(ctx context.Context, categoriaSlug string) ([]model.Producto, error)
	GetBySlug(ctx context.Context, slug string) (*model.Producto, error)
}
