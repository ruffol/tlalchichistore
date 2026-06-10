"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { ENVIO_USD, ENVIO_MXN, formatPrecio } from "@/lib/envio";
import { PayPalButton } from "@/components/PayPalButton";

export default function CarritoPage() {
  const { items, removeItem, updateCantidad, clearCart, subtotal, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-6 pt-24 pb-16 text-center">
        <h1 className="font-[var(--font-serif)] text-3xl font-bold text-[var(--color-ink)]">
          Tu carrito está vacío
        </h1>
        <p className="mt-4 text-[var(--color-ink-light)]">
          Explora nuestro catálogo y agrega artesanías a tu carrito.
        </p>
        <Link
          href="/catalogo"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)] px-8 py-3 text-sm font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-gold)] hover:text-white"
        >
          Ver catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 pt-24 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="font-[var(--font-serif)] text-3xl font-bold text-[var(--color-ink)]">
          Tu carrito
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:underline"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={item.productoId + item.modeloNombre + item.colorNombre}
            className="flex gap-4 rounded-lg border border-[var(--color-museum-border)] bg-white p-4"
          >
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={item.imagen}
                alt={item.nombre}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-medium text-[var(--color-ink)]">{item.nombre}</h3>
                {(item.modeloNombre || item.colorNombre) && (
                  <p className="text-xs text-[var(--color-ink-light)]">
                    {[item.modeloNombre, item.colorNombre].filter(Boolean).join(" — ")}
                  </p>
                )}
                <p className="mt-1 text-sm font-bold text-[var(--color-museum-accent)]">
                  ${item.precioUsd.toFixed(2)} USD
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateCantidad(item.productoId, item.cantidad - 1, item.modeloNombre, item.colorNombre)
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full border text-sm"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() =>
                      updateCantidad(item.productoId, item.cantidad + 1, item.modeloNombre, item.colorNombre)
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-full border text-sm"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">
                    ${(item.precioUsd * item.cantidad).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.productoId, item.modeloNombre, item.colorNombre)}
                    className="text-sm text-red-400 hover:text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-[var(--color-museum-border)] pt-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-ink-light)]">Subtotal</span>
            <span>{formatPrecio(subtotal())}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-ink-light)]">
              Envío: ${ENVIO_MXN} MXN
            </span>
            <span>{formatPrecio(ENVIO_USD)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--color-museum-border)] pt-3 text-lg font-bold">
            <span>Total</span>
            <span>{formatPrecio(totalPrice())}</span>
          </div>
        </div>
        <div className="mt-4">
          <PayPalButton
            items={items.map((i) => ({
              productoId: i.productoId,
              cantidad: i.cantidad,
              modeloNombre: i.modeloNombre,
              colorNombre: i.colorNombre,
            }))}
          />
        </div>
        <p className="mt-3 text-center text-xs text-[var(--color-ink-light)]">
          Envío: ${ENVIO_MXN} MXN de costo fijo.
        </p>
      </div>
    </section>
  );
}
