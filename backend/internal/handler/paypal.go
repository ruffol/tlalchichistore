package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"tlalchichi/market/internal/model"
	"tlalchichi/market/internal/repository"
	"tlalchichi/market/internal/service"
)

type PayPalHandler struct {
	svc     *service.PayPalService
	pedidos repository.PedidoRepository
}

func NewPayPalHandler(svc *service.PayPalService, pedidos repository.PedidoRepository) *PayPalHandler {
	return &PayPalHandler{svc: svc, pedidos: pedidos}
}

type createOrderRequest struct {
	Items []createOrderItem `json:"items"`
}

type createOrderItem struct {
	ProductoID   string  `json:"productoId"`
	Nombre       string  `json:"nombre"`
	PrecioUSD    float64 `json:"precioUsd"`
	Cantidad     int     `json:"cantidad"`
	Imagen       string  `json:"imagen"`
	ModeloNombre string  `json:"modeloNombre,omitempty"`
	ColorNombre  string  `json:"colorNombre,omitempty"`
}

func (h *PayPalHandler) CreateOrder(w http.ResponseWriter, r *http.Request) {
	var req createOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, "Body inválido", http.StatusBadRequest)
		return
	}
	if len(req.Items) == 0 {
		writeError(w, "Se requiere al menos un producto", http.StatusBadRequest)
		return
	}

	var svcItems []service.CreateOrderItem
	for _, item := range req.Items {
		svcItems = append(svcItems, service.CreateOrderItem{
			ProductoID:   item.ProductoID,
			Nombre:       item.Nombre,
			PrecioUSD:    item.PrecioUSD,
			Cantidad:     item.Cantidad,
			Imagen:       item.Imagen,
			ModeloNombre: item.ModeloNombre,
			ColorNombre:  item.ColorNombre,
		})
	}
	orderID, err := h.svc.CreateOrder(r.Context(), svcItems)
	if err != nil {
		log.Printf("paypal create order error: %v", err)
		writeError(w, "Error al crear orden en PayPal", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"orderId": orderID})
}

type captureOrderRequest struct {
	OrderID string `json:"orderId"`
}

type captureOrderResponse struct {
	Status  string       `json:"status"`
	OrderID string       `json:"orderId"`
	Pedido  *model.Pedido `json:"pedido,omitempty"`
}

func (h *PayPalHandler) CaptureOrder(w http.ResponseWriter, r *http.Request) {
	var req captureOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, "Body inválido", http.StatusBadRequest)
		return
	}
	if req.OrderID == "" {
		writeError(w, "orderId es requerido", http.StatusBadRequest)
		return
	}

	existing, _ := h.pedidos.GetByGateway(r.Context(), "paypal", req.OrderID)
	if existing != nil {
		json.NewEncoder(w).Encode(captureOrderResponse{
			Status:  "COMPLETED",
			OrderID: req.OrderID,
			Pedido:  existing,
		})
		return
	}

	pedido, err := h.svc.CaptureOrder(r.Context(), req.OrderID)
	if err != nil {
		log.Printf("paypal capture order error: %v", err)
		writeError(w, "Error al capturar orden en PayPal", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(captureOrderResponse{
		Status:  "COMPLETED",
		OrderID: req.OrderID,
		Pedido:  pedido,
	})
}
