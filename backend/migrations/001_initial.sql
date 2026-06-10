CREATE TABLE IF NOT EXISTS schema_migrations (
    version    TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
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
    precio_usd   REAL NOT NULL,
    imagen       TEXT NOT NULL,
    activo       INTEGER NOT NULL DEFAULT 1,
    categoria_id TEXT NOT NULL REFERENCES categorias(id),
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
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
