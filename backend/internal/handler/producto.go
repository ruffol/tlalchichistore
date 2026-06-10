package handler

import (
	"encoding/json"
	"net/http"

	"tlalchichi/market/internal/repository"
)

type ProductoHandler struct {
	repo repository.ProductoRepository
}

func NewProductoHandler(repo repository.ProductoRepository) *ProductoHandler {
	return &ProductoHandler{repo: repo}
}

func (h *ProductoHandler) List(w http.ResponseWriter, r *http.Request) {
	categoriaSlug := r.URL.Query().Get("categoria")

	productos, err := h.repo.List(r.Context(), categoriaSlug)
	if err != nil {
		writeError(w, "Error al obtener productos", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(productos)
}

func (h *ProductoHandler) Get(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")

	producto, err := h.repo.GetBySlug(r.Context(), slug)
	if err != nil {
		writeError(w, "Error al obtener producto", http.StatusInternalServerError)
		return
	}
	if producto == nil {
		writeError(w, "Producto no encontrado", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(producto)
}
