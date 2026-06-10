CREATE TABLE settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

INSERT OR IGNORE INTO settings (key, value) VALUES ('envio_usd', '5');
INSERT OR IGNORE INTO settings (key, value) VALUES ('paypal_mode', 'sandbox');
INSERT OR IGNORE INTO settings (key, value) VALUES ('contact_email', 'hola@tlalchichi.com');
INSERT OR IGNORE INTO settings (key, value) VALUES ('maintenance_mode', 'false');
