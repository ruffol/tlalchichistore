CREATE TABLE pedidos (
    id               TEXT PRIMARY KEY,
    email            TEXT NOT NULL,
    total            NUMERIC(10,2) NOT NULL,
    gateway          TEXT NOT NULL,
    gateway_order_id TEXT NOT NULL,
    gateway_response TEXT,
    status           TEXT NOT NULL DEFAULT 'pending',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(gateway, gateway_order_id)
);

CREATE TABLE pedido_items (
    id            TEXT PRIMARY KEY,
    pedido_id     TEXT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id   TEXT NOT NULL,
    nombre        TEXT NOT NULL,
    precio_usd    NUMERIC(10,2) NOT NULL,
    cantidad      INTEGER NOT NULL,
    imagen        TEXT,
    modelo_nombre TEXT,
    color_nombre  TEXT
);
