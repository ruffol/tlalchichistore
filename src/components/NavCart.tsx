"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";

export function NavCart() {
  const totalItems = useCart((s) => s.totalItems());
  const items = useCart((s) => s.items);

  return (
    <Link
      href="/carrito"
      className="relative transition-colors hover:text-[var(--color-museum-accent)]"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-gold-dark)] text-[10px] font-bold text-white">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );
}
