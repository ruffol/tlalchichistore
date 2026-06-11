CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

INSERT INTO settings (key, value) VALUES ('envio_usd', '5')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value) VALUES ('paypal_mode', 'sandbox')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value) VALUES ('contact_email', 'hola@tlalchichi.com')
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value) VALUES ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;
