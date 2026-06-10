"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { colorMap } from "@/lib/colors";
import type { Modelo, Color } from "@/types";

interface ProductCardProps {
  id: string;
  nombre: string;
  slug: string;
  precioUsd: number;
  imagen: string;
  categoria: { nombre: string };
  modelos: Modelo[];
}

export function ProductCard({ producto }: { producto: ProductCardProps }) {
  const [selectedModelo, setSelectedModelo] = useState<Modelo>(producto.modelos[0]);
  const [selectedColor, setSelectedColor] = useState<Color>(producto.modelos[0]?.colores[0]);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);

  const currentImage = selectedColor?.imagen || producto.imagen;

  return (
    <div className="group block">
      <Link href={`/producto/${producto.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-museum transition-all duration-500 group-hover:shadow-museum-hover group-hover:-translate-y-1">
          <Image
            src={currentImage}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </Link>
      <div className="mt-3">
        <p className="text-xs uppercase tracking-widest text-[var(--color-gold-dark)]">
          {producto.categoria.nombre}
        </p>
        <Link href={`/producto/${producto.slug}`}>
          <h3 className="mt-1 font-[var(--font-serif)] font-medium text-[var(--color-ink)] hover:text-[var(--color-museum-accent)] transition-colors">
            {producto.nombre}
          </h3>
        </Link>

        {/* Modelo - Select */}
        <div className="mt-2">
          <select
            value={selectedModelo.id}
            onChange={(e) => {
              const modelo = producto.modelos.find((m) => m.id === e.target.value);
              if (modelo) {
                setSelectedModelo(modelo);
                setSelectedColor(modelo.colores[0]);
              }
            }}
            className="w-full rounded-lg border border-[var(--color-gold)]/30 bg-white px-2 py-1.5 text-xs text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
          >
            {producto.modelos.map((modelo) => (
              <option key={modelo.id} value={modelo.id}>
                {modelo.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Color - dots */}
        <div className="mt-2 flex gap-1.5">
          {selectedModelo?.colores.map((color) => (
            <button
              key={color.id}
              onClick={(e) => {
                e.preventDefault();
                setSelectedColor(color);
              }}
              className={`h-5 w-5 rounded-full border-2 transition-all ${
                selectedColor?.id === color.id
                  ? "border-[var(--color-museum-accent)] scale-110"
                  : "border-transparent hover:scale-110"
              }`}
              style={{
                backgroundColor: colorMap[color.nombre] || "#CCC",
              }}
              title={color.nombre}
            />
          ))}
        </div>

        <p className="mt-2 text-sm font-bold text-[var(--color-museum-accent)]">
          ${producto.precioUsd.toFixed(2)} USD
        </p>

        <button
          onClick={(e) => {
            e.preventDefault();
            addItem({
              productoId: producto.id,
              nombre: producto.nombre,
              precioUsd: producto.precioUsd,
              imagen: currentImage,
              modeloNombre: selectedModelo?.nombre,
              colorNombre: selectedColor?.nombre,
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          className="mt-3 w-full rounded-full bg-[var(--color-museum-text)] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--color-museum-accent)]"
        >
          {added ? "✓ Agregado" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
