package model

type PedidoItem struct {
	ID           string  `db:"id" json:"id"`
	PedidoID     string  `db:"pedido_id" json:"-"`
	ProductoID   string  `db:"producto_id" json:"productoId"`
	Nombre       string  `db:"nombre" json:"nombre"`
	PrecioUSD    float64 `db:"precio_usd" json:"precioUsd"`
	Cantidad     int     `db:"cantidad" json:"cantidad"`
	Imagen       *string `db:"imagen" json:"imagen,omitempty"`
	ModeloNombre *string `db:"modelo_nombre" json:"modeloNombre,omitempty"`
	ColorNombre  *string `db:"color_nombre" json:"colorNombre,omitempty"`
}
