"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";

interface ComprarAhoraButtonProps {
  productoId: string;
  nombre: string;
  precioUsd: number;
  imagen: string;
  modeloNombre?: string;
  colorNombre?: string;
}

export function ComprarAhoraButton({
  productoId,
  nombre,
  precioUsd,
  imagen,
  modeloNombre,
  colorNombre,
}: ComprarAhoraButtonProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);

  function handleAdd() {
    addItem({ productoId, nombre, precioUsd, imagen, modeloNombre, colorNombre });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full rounded-full bg-[var(--color-museum-text)] px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-museum-accent)]"
    >
      {added ? "✓ Agregado" : "Agregar al carrito"}
    </button>
  );
}
