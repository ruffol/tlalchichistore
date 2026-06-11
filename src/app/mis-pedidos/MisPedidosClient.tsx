"use client";

import { useState } from "react";

interface PedidoItem {
  productoId: string;
  nombre: string;
  precioUsd: number;
  cantidad: number;
  imagen: string;
  modeloNombre?: string;
  colorNombre?: string;
}

interface Pedido {
  id: string;
  email: string;
  total: number;
  gateway: string;
  gatewayOrderId: string;
  items: PedidoItem[];
  status: string;
  createdAt: string;
}

export function MisPedidosClient() {
  const [email, setEmail] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function buscar(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    setPedidos(null);
    try {
      const res = await fetch("/api/v1/pedidos/buscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Error al buscar pedidos");
      const data = await res.json();
      setPedidos(data);
    } catch {
      setError("No se pudieron cargar los pedidos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={buscar} className="flex gap-3">
        <input
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 rounded-full border border-[var(--color-gold)]/30 bg-transparent px-5 py-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[var(--color-museum-text)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-museum-accent)] disabled:opacity-50"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-500">{error}</p>
      )}

      {pedidos !== null && pedidos.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-[var(--color-ink-light)]">
            No encontramos pedidos para este correo.
          </p>
        </div>
      )}

      {pedidos && pedidos.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="font-[var(--font-serif)] text-xl font-bold text-[var(--color-ink)]">
            {pedidos.length} pedido{pedidos.length !== 1 ? "s" : ""} encontrado{pedidos.length !== 1 ? "s" : ""}
          </h2>
          {pedidos.map((pedido) => (
            <div
              key={pedido.gatewayOrderId}
              className="rounded-lg border border-[var(--color-museum-border)] bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[var(--color-ink-light)]">
                  Pedido #{pedido.id.slice(0, 8)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    pedido.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : pedido.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {pedido.status === "completed"
                    ? "Completado"
                    : pedido.status === "pending"
                      ? "Pendiente"
                      : pedido.status}
                </span>
              </div>

              {pedido.items && pedido.items.length > 0 && (
                <div className="mt-3 border-t border-[var(--color-museum-border)] pt-3">
                  <p className="text-xs font-medium text-[var(--color-ink)]">Productos:</p>
                  <ul className="mt-1 space-y-1">
                    {pedido.items.map((item, idx) => (
                      <li key={idx} className="text-xs text-[var(--color-ink-light)]">
                        {item.nombre} x{item.cantidad} — ${item.precioUsd.toFixed(2)} USD
                        {(item.modeloNombre || item.colorNombre) && (
                          <span> ({[item.modeloNombre, item.colorNombre].filter(Boolean).join(" — ")})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-[var(--color-museum-border)] pt-3">
                <div>
                  <p className="text-xs text-[var(--color-ink-light)]">
                    {new Date(pedido.createdAt).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-[var(--color-ink-light)]">
                    {pedido.email}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-ink-light)]">
                    Pagado con {pedido.gateway === "paypal" ? "PayPal" : pedido.gateway}
                  </p>
                </div>
                <p className="text-lg font-bold text-[var(--color-museum-accent)]">
                  ${pedido.total.toFixed(2)} USD
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
