import Link from "next/link";

export const metadata = {
  title: "Pago exitoso — Tlalchichi777",
};

export default function SuccessPage() {
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
