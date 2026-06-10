package service

import (
	"context"
	"crypto/rand"
	"fmt"
	"strconv"

	"tlalchichi/market/internal/model"
	paypalclient "tlalchichi/market/internal/paypal"
	"tlalchichi/market/internal/repository"
)

type PayPalService struct {
	client  *paypalclient.Client
	pedidos repository.PedidoRepository
	envio   float64
}

func NewPayPalService(client *paypalclient.Client, pedidos repository.PedidoRepository, envio float64) *PayPalService {
	return &PayPalService{client: client, pedidos: pedidos, envio: envio}
}

type CreateOrderItem struct {
	ProductoID   string
	Nombre       string
	PrecioUSD    float64
	Cantidad     int
	Imagen       string
	ModeloNombre string
	ColorNombre  string
}

func (s *PayPalService) CreateOrder(ctx context.Context, items []CreateOrderItem) (string, error) {
	var subtotal float64
	var paypalItems []paypalclient.OrderItem

	for _, item := range items {
		subtotal += item.PrecioUSD * float64(item.Cantidad)
		desc := ""
		if item.ModeloNombre != "" || item.ColorNombre != "" {
			desc = item.ModeloNombre
			if item.ColorNombre != "" {
				if desc != "" {
					desc += " — "
				}
				desc += item.ColorNombre
			}
		}
		paypalItems = append(paypalItems, paypalclient.OrderItem{
			Name:        item.Nombre,
			UnitAmount:  item.PrecioUSD,
			Quantity:    item.Cantidad,
			Description: desc,
		})
	}

	total := subtotal + s.envio

	orderID, err := s.client.CreateOrder(paypalclient.CreateOrderInput{
		Items:    paypalItems,
		Subtotal: subtotal,
		Shipping: s.envio,
		Total:    total,
	})
	if err != nil {
		return "", fmt.Errorf("create paypal order: %w", err)
	}

	return orderID, nil
}

func (s *PayPalService) CaptureOrder(ctx context.Context, orderID string) (*model.Pedido, error) {
	captureData, err := s.client.CaptureOrder(orderID)
	if err != nil {
		return nil, fmt.Errorf("capture paypal order: %w", err)
	}

	status, _ := captureData["status"].(string)
	if status != "COMPLETED" {
		return nil, fmt.Errorf("orden no completada: %s", status)
	}

	email := extractString(captureData, "payer", "email_address")

	var total float64
	var items []model.PedidoItem

	purchaseUnits, _ := captureData["purchase_units"].([]any)
	if len(purchaseUnits) > 0 {
		pu, _ := purchaseUnits[0].(map[string]any)
		total = extractAmount(pu, "amount", "value")

		rawItems, _ := pu["items"].([]any)
		for _, ri := range rawItems {
			item, _ := ri.(map[string]any)
			name, _ := item["name"].(string)
			qtyStr, _ := item["quantity"].(string)
			qty, _ := strconv.Atoi(qtyStr)

			price := extractAmount(item, "unit_amount", "value")
			desc, _ := item["description"].(string)

			items = append(items, model.PedidoItem{
				ID:         newID(),
				ProductoID: "",
				Nombre:     name,
				PrecioUSD:  price,
				Cantidad:   qty,
				ModeloNombre: &desc,
			})
		}
	}

	pedido := &model.Pedido{
		ID:             newID(),
		Email:          email,
		Total:          total,
		Gateway:        "paypal",
		GatewayOrderID: orderID,
		Status:         "completed",
		Items:          items,
	}

	if err := s.pedidos.Create(ctx, pedido); err != nil {
		return nil, fmt.Errorf("save pedido: %w", err)
	}

	return pedido, nil
}

func extractString(m map[string]any, keys ...string) string {
	for _, k := range keys {
		if nested, ok := m[k].(map[string]any); ok {
			m = nested
		} else {
			if v, ok := m[k].(string); ok {
				return v
			}
			return ""
		}
	}
	return ""
}

func extractAmount(m map[string]any, keys ...string) float64 {
	for i, k := range keys {
		if i == len(keys)-1 {
			if v, ok := m[k].(string); ok {
				f, _ := strconv.ParseFloat(v, 64)
				return f
			}
			if v, ok := m[k].(float64); ok {
				return v
			}
			return 0
		}
		if nested, ok := m[k].(map[string]any); ok {
			m = nested
		} else {
			return 0
		}
	}
	return 0
}

func newID() string {
	b := make([]byte, 16)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}
