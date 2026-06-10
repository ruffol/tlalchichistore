import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pago exitoso — Tlalchichi777",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string; session_id?: string }>;
}) {
  const { order_id, session_id } = await searchParams;
  const orderId = order_id || session_id;

  let pedido = null;

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 pt-16">
      <div className="reveal max-w-md text-center">
        <div className="wax-seal mx-auto mb-8 text-2xl">✓</div>
        <h1 className="font-[var(--font-serif)] text-3xl font-bold text-[var(--color-ink)]">
          ¡Gracias por tu compra!
        </h1>
        <p className="mt-4 text-[var(--color-ink-light)]">
          Tu pedido ha sido confirmado. Te enviaremos un correo con los detalles del envío.
        </p>
        {pedido?.email && (
          <p className="mt-2 text-sm text-[var(--color-ink-light)]">
            Correo: {pedido.email}
          </p>
        )}
        {pedido && Array.isArray(pedido.items) && pedido.items.length > 0 && (
          <div className="mt-4 text-left text-sm text-[var(--color-ink-light)]">
            <p className="font-medium text-[var(--color-ink)]">Productos:</p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              {pedido.items.map((item: any, idx: number) => (
                <li key={idx}>
                  {item.nombre} x{item.cantidad} — ${item.precioUsd.toFixed(2)} USD
                  {item.modeloNombre && ` (${item.modeloNombre})`}
                  {item.colorNombre && ` — ${item.colorNombre}`}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="divider-ornament">
          <span className="text-sm">✦</span>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)] px-8 py-3 text-sm font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-gold)] hover:text-white"
        >
          Volver al inicio
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
