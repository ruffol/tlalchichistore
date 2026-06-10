package model

type Categoria struct {
	ID     string  `db:"id" json:"id"`
	Nombre string  `db:"nombre" json:"nombre"`
	Slug   string  `db:"slug" json:"slug"`
	Imagen *string `db:"imagen" json:"imagen,omitempty"`
}
