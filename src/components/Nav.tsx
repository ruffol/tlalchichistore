import Link from "next/link";
import Image from "next/image";
import { NavCart } from "./NavCart";

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-parchment)]/70 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-8 w-8">
            <Image
              src="/assets/nav-logo.png"
              alt="Tlalchichi777"
              fill
              className="object-contain"
              sizes="32px"
            />
          </div>
          <span className="font-[var(--font-serif)] text-lg font-bold tracking-tight text-[var(--color-ink)]">
            Tlalchichi777
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-[var(--color-ink-light)]">
          <Link
            href="/"
            className="hidden transition-colors hover:text-[var(--color-museum-accent)] sm:block"
          >
            Inicio
          </Link>
          <Link
            href="/catalogo"
            className="transition-colors hover:text-[var(--color-museum-accent)]"
          >
            Catálogo
          </Link>
          <Link
            href="/mis-pedidos"
            className="hidden transition-colors hover:text-[var(--color-museum-accent)] sm:block"
          >
            Mis Pedidos
          </Link>
          <NavCart />
        </div>
      </div>
    </nav>
  );
}
