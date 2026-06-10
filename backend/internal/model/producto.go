package model

type Producto struct {
	ID          string    `db:"id" json:"id"`
	Nombre      string    `db:"nombre" json:"nombre"`
	Slug        string    `db:"slug" json:"slug"`
	Descripcion *string   `db:"descripcion" json:"descripcion,omitempty"`
	PrecioUSD   float64   `db:"precio_usd" json:"precioUsd"`
	Imagen      string    `db:"imagen" json:"imagen"`
	Activo      bool      `db:"activo" json:"activo"`
	CategoriaID string    `db:"categoria_id" json:"categoriaId"`
	Categoria   Categoria `db:"categoria" json:"categoria"`
	Modelos     []Modelo  `db:"-" json:"modelos,omitempty"`
	CreatedAt   string    `db:"created_at" json:"createdAt"`
	UpdatedAt   string    `db:"updated_at" json:"updatedAt"`
}
