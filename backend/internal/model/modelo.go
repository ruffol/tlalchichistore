package model

type Modelo struct {
	ID         string  `db:"id" json:"id"`
	Nombre     string  `db:"nombre" json:"nombre"`
	ProductoID string  `db:"producto_id" json:"productoId"`
	Colores    []Color `db:"-" json:"colores,omitempty"`
}
