package model

type Pedido struct {
	ID              string       `db:"id" json:"id"`
	Email           string       `db:"email" json:"email"`
	Total           float64      `db:"total" json:"total"`
	Gateway         string       `db:"gateway" json:"gateway"`
	GatewayOrderID  string       `db:"gateway_order_id" json:"gatewayOrderId"`
	GatewayResponse *string      `db:"gateway_response" json:"-"`
	Status          string       `db:"status" json:"status"`
	Items           []PedidoItem `db:"-" json:"items"`
	CreatedAt       string       `db:"created_at" json:"createdAt"`
}
