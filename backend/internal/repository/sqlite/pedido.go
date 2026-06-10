package sqlite

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
	"tlalchichi/market/internal/model"
)

type PedidoRepo struct {
	db *sqlx.DB
}

func NewPedidoRepo(db *sql.DB) *PedidoRepo {
	return &PedidoRepo{db: sqlx.NewDb(db, "sqlite")}
}

func (r *PedidoRepo) Create(ctx context.Context, p *model.Pedido) error {
	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback()

	_, err = tx.ExecContext(ctx,
		`INSERT INTO pedidos (id, email, total, gateway, gateway_order_id, gateway_response, status)
		 VALUES (?, ?, ?, ?, ?, ?, ?)`,
		p.ID, p.Email, p.Total, p.Gateway, p.GatewayOrderID, p.GatewayResponse, p.Status,
	)
	if err != nil {
		return fmt.Errorf("insert pedido: %w", err)
	}

	for _, item := range p.Items {
		_, err = tx.ExecContext(ctx,
			`INSERT INTO pedido_items (id, pedido_id, producto_id, nombre, precio_usd, cantidad, imagen, modelo_nombre, color_nombre)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			item.ID, p.ID, item.ProductoID, item.Nombre, item.PrecioUSD, item.Cantidad,
			item.Imagen, item.ModeloNombre, item.ColorNombre,
		)
		if err != nil {
			return fmt.Errorf("insert pedido_item: %w", err)
		}
	}

	return tx.Commit()
}

func (r *PedidoRepo) GetByID(ctx context.Context, id string) (*model.Pedido, error) {
	p, err := r.scanPedido(ctx, "SELECT * FROM pedidos WHERE id = ?", id)
	if err != nil {
		return nil, err
	}
	return p, nil
}

func (r *PedidoRepo) ListByEmail(ctx context.Context, email string) ([]model.Pedido, error) {
	var pedidos []model.Pedido
	if err := r.db.SelectContext(ctx, &pedidos,
		"SELECT * FROM pedidos WHERE email = ? ORDER BY created_at DESC", email); err != nil {
		return nil, fmt.Errorf("list pedidos by email: %w", err)
	}
	for i := range pedidos {
		items, err := r.fetchItems(ctx, pedidos[i].ID)
		if err != nil {
			return nil, err
		}
		pedidos[i].Items = items
	}
	return pedidos, nil
}

func (r *PedidoRepo) GetByGateway(ctx context.Context, gateway, orderID string) (*model.Pedido, error) {
	return r.scanPedido(ctx,
		"SELECT * FROM pedidos WHERE gateway = ? AND gateway_order_id = ?", gateway, orderID)
}

func (r *PedidoRepo) scanPedido(ctx context.Context, query string, args ...any) (*model.Pedido, error) {
	var p model.Pedido
	if err := r.db.GetContext(ctx, &p, query, args...); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("scan pedido: %w", err)
	}
	items, err := r.fetchItems(ctx, p.ID)
	if err != nil {
		return nil, err
	}
	p.Items = items
	return &p, nil
}

func (r *PedidoRepo) fetchItems(ctx context.Context, pedidoID string) ([]model.PedidoItem, error) {
	var items []model.PedidoItem
	if err := r.db.SelectContext(ctx, &items,
		"SELECT * FROM pedido_items WHERE pedido_id = ?", pedidoID); err != nil {
		return nil, fmt.Errorf("fetch pedido items: %w", err)
	}
	return items, nil
}
