package handler

import (
	"encoding/json"
	"net/http"

	"tlalchichi/market/internal/repository"
)

type CategoriaHandler struct {
	repo repository.CategoriaRepository
}

func NewCategoriaHandler(repo repository.CategoriaRepository) *CategoriaHandler {
	return &CategoriaHandler{repo: repo}
}

func (h *CategoriaHandler) List(w http.ResponseWriter, r *http.Request) {
	categorias, err := h.repo.List(r.Context())
	if err != nil {
		writeError(w, "Error al obtener categorías", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(categorias)
}
