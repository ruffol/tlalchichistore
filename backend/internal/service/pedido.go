package service

import (
	"context"
	"fmt"

	"tlalchichi/market/internal/model"
	"tlalchichi/market/internal/repository"
)

type PedidoService struct {
	repo repository.PedidoRepository
}

func NewPedidoService(repo repository.PedidoRepository) *PedidoService {
	return &PedidoService{repo: repo}
}

func (s *PedidoService) BuscarPorEmail(ctx context.Context, email string) ([]model.Pedido, error) {
	pedidos, err := s.repo.ListByEmail(ctx, email)
	if err != nil {
		return nil, fmt.Errorf("buscar pedidos: %w", err)
	}
	return pedidos, nil
}
