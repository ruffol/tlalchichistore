package handler

import (
	"net/http"
)

func NewRouter(
	categorias *CategoriaHandler,
	productos *ProductoHandler,
	pedidos *PedidoHandler,
	paypal *PayPalHandler,
	frontendDir string,
	allowedOrigins []string,
) http.Handler {
	mux := http.NewServeMux()

	// API v1
	mux.HandleFunc("GET /api/v1/categorias", categorias.List)

	mux.HandleFunc("GET /api/v1/productos", productos.List)
	mux.HandleFunc("GET /api/v1/productos/{slug}", productos.Get)

	mux.HandleFunc("POST /api/v1/pedidos/buscar", pedidos.Buscar)

	mux.HandleFunc("POST /api/v1/paypal/create-order", paypal.CreateOrder)
	mux.HandleFunc("POST /api/v1/paypal/capture-order", paypal.CaptureOrder)

	// Health
	mux.HandleFunc("GET /api/v1/health", Health)

	// Static files (Next.js build output)
	if frontendDir != "" {
		fs := http.FileServer(http.Dir(frontendDir))
		mux.Handle("GET /", fs)
	}

	// Middleware chain
	var h http.Handler = mux
	h = LoggerMiddleware(h)
	h = CORSMiddleware(allowedOrigins)(h)
	h = JSONMiddleware(h)

	return h
}
