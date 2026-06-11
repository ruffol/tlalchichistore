CREATE TABLE IF NOT EXISTS schema_migrations (
    version    TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categorias (
    id     TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    slug   TEXT NOT NULL UNIQUE,
    imagen TEXT
);

CREATE TABLE productos (
    id           TEXT PRIMARY KEY,
    nombre       TEXT NOT NULL,
    slug         TEXT NOT NULL UNIQUE,
    descripcion  TEXT,
    precio_usd   NUMERIC(10,2) NOT NULL,
    imagen       TEXT NOT NULL,
    activo       BOOLEAN NOT NULL DEFAULT true,
    categoria_id TEXT NOT NULL REFERENCES categorias(id),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE modelos (
    id          TEXT PRIMARY KEY,
    nombre      TEXT NOT NULL,
    producto_id TEXT NOT NULL REFERENCES productos(id) ON DELETE CASCADE
);

CREATE TABLE colores (
    id        TEXT PRIMARY KEY,
    nombre    TEXT NOT NULL,
    imagen    TEXT NOT NULL,
    stock     INTEGER NOT NULL DEFAULT 0,
    modelo_id TEXT NOT NULL REFERENCES modelos(id) ON DELETE CASCADE
);
