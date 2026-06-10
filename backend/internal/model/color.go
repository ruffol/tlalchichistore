package model

type Color struct {
	ID       string `db:"id" json:"id"`
	Nombre   string `db:"nombre" json:"nombre"`
	Imagen   string `db:"imagen" json:"imagen"`
	Stock    int    `db:"stock" json:"stock"`
	ModeloID string `db:"modelo_id" json:"modeloId"`
}
