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
	apiMux := http.NewServeMux()

	apiMux.HandleFunc("GET /api/v1/categorias", categorias.List)

	apiMux.HandleFunc("GET /api/v1/productos", productos.List)
	apiMux.HandleFunc("GET /api/v1/productos/{slug}", productos.Get)

	apiMux.HandleFunc("POST /api/v1/pedidos/buscar", pedidos.Buscar)

	apiMux.HandleFunc("POST /api/v1/paypal/create-order", paypal.CreateOrder)
	apiMux.HandleFunc("POST /api/v1/paypal/capture-order", paypal.CaptureOrder)

	apiMux.HandleFunc("GET /api/v1/health", Health)

	var api http.Handler = apiMux
	api = LoggerMiddleware(api)
	api = CORSMiddleware(allowedOrigins)(api)
	api = JSONMiddleware(api)

	mainMux := http.NewServeMux()
	mainMux.Handle("/api/v1/", api)

	if frontendDir != "" {
		fs := http.FileServer(http.Dir(frontendDir))
		mainMux.Handle("/", fs)
	}

	return mainMux
}
