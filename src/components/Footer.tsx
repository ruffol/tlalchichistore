export function Footer() {
  return (
    <footer className="border-t border-[var(--color-gold)]/20 bg-[var(--color-parchment-dark)]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="font-[var(--font-serif)] text-lg font-bold text-[var(--color-ink)]">
              Tlalchichi777
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-light)]">
              Artesanías colimenses auténticas
            </p>
          </div>
          <div className="flex gap-6 text-sm text-[var(--color-ink-light)]">
            <span>Colima, México</span>
            <span className="text-[var(--color-gold)]">·</span>
            <span>Envío: $100 MXN</span>
          </div>
        </div>
        <div className="divider-ornament">
          <span className="text-sm">✦</span>
        </div>
        <p className="text-center text-xs text-[var(--color-ink-light)] opacity-60">
           © {new Date().getFullYear()} Tlalchichi777. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
