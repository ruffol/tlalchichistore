package handler

import (
	"encoding/json"
	"net/http"

	"tlalchichi/market/internal/repository"
)

type PedidoHandler struct {
	repo repository.PedidoRepository
}

func NewPedidoHandler(repo repository.PedidoRepository) *PedidoHandler {
	return &PedidoHandler{repo: repo}
}

type buscarRequest struct {
	Email string `json:"email"`
}

func (h *PedidoHandler) Buscar(w http.ResponseWriter, r *http.Request) {
	var req buscarRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, "Body inválido", http.StatusBadRequest)
		return
	}
	if req.Email == "" {
		writeError(w, "email es requerido", http.StatusBadRequest)
		return
	}

	pedidos, err := h.repo.ListByEmail(r.Context(), req.Email)
	if err != nil {
		writeError(w, "Error al buscar pedidos", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(pedidos)
}
