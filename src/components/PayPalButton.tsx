"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useCart } from "@/store/cart";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PayPalButtonProps {
  items: {
    productoId: string;
    cantidad: number;
    modeloNombre?: string;
    colorNombre?: string;
  }[];
}

export function PayPalButton({ items }: PayPalButtonProps) {
  const router = useRouter();
  const { clearCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [{ isPending, isRejected, isResolved }] = usePayPalScriptReducer();

  return (
    <div className="w-full">
      {isRejected && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          No se pudo cargar PayPal. Verifica que el Client ID sea correcto o intenta más tarde.
        </p>
      )}
      {isPending && (
        <div className="flex min-h-[48px] items-center justify-center rounded-lg border border-dashed border-[var(--color-museum-border)]">
          <span className="text-sm text-[var(--color-ink-light)]">Cargando PayPal...</span>
        </div>
      )}
      {isResolved && (
        <PayPalButtons
          style={{ layout: "vertical", shape: "rect", height: 48 }}
          createOrder={async () => {
            setError(null);
            const res = await fetch("/api/create-paypal-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items }),
            });
            if (!res.ok) {
              const data = await res.json();
              throw new Error(data.error || "Error al crear la orden");
            }
            const data = await res.json();
            return data.orderId;
          }}
          onApprove={async (data) => {
            const res = await fetch("/api/capture-paypal-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            });
            if (!res.ok) {
              const errData = await res.json();
              throw new Error(errData.error || "Error al capturar la orden");
            }
            const result = await res.json();
            if (result.status === "COMPLETED") {
              clearCart();
              router.push(`/success?order_id=${data.orderID}`);
            }
          }}
          onError={(err) => {
            console.error("PayPal error:", err);
            setError("Ocurrió un error al procesar el pago. Intenta de nuevo.");
          }}
        />
      )}
      {error && (
        <p className="mt-2 text-center text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
