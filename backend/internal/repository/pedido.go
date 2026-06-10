package repository

import (
	"context"
	"tlalchichi/market/internal/model"
)

type PedidoRepository interface {
	Create(ctx context.Context, p *model.Pedido) error
	GetByID(ctx context.Context, id string) (*model.Pedido, error)
	ListByEmail(ctx context.Context, email string) ([]model.Pedido, error)
	GetByGateway(ctx context.Context, gateway, orderID string) (*model.Pedido, error)
}
