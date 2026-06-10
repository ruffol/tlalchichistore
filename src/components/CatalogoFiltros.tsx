"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { colorMap } from "@/lib/colors";
import type { Modelo, Color, Categoria } from "@/types";

interface Producto {
  id: string;
  nombre: string;
  slug: string;
  precioUsd: number;
  imagen: string;
  categoria: Pick<Categoria, "nombre" | "slug">;
  modelos: Modelo[];
}

interface CatalogoFiltrosProps {
  productos: Producto[];
  categorias: Pick<Categoria, "nombre" | "slug">[];
}

export function CatalogoFiltros({ productos, categorias }: CatalogoFiltrosProps) {
  const [categoriaSlug, setCategoriaSlug] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [colorFilter, setColorFilter] = useState("");

  const allColors = useMemo(() => {
    const colors = new Set<string>();
    productos.forEach((p) =>
      p.modelos.forEach((m) =>
        m.colores.forEach((c) => colors.add(c.nombre))
      )
    );
    return Array.from(colors).sort();
  }, [productos]);

  const filtered = useMemo(() => {
    return productos.filter((p) => {
      if (categoriaSlug && p.categoria.slug !== categoriaSlug) return false;
      if (precioMin && p.precioUsd < Number(precioMin)) return false;
      if (precioMax && p.precioUsd > Number(precioMax)) return false;
      if (colorFilter) {
        const hasColor = p.modelos.some((m) =>
          m.colores.some((c) => c.nombre === colorFilter)
        );
        if (!hasColor) return false;
      }
      return true;
    });
  }, [productos, categoriaSlug, precioMin, precioMax, colorFilter]);

  return (
    <>
      <div className="mb-10 space-y-4 rounded-lg border border-[var(--color-museum-border)] bg-white p-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-[var(--color-ink-light)]">
              Categoría
            </label>
            <select
              value={categoriaSlug}
              onChange={(e) => setCategoriaSlug(e.target.value)}
              className="w-full rounded-full border border-[var(--color-gold)]/30 bg-transparent px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
            >
              <option value="">Todas</option>
              {categorias.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-[var(--color-ink-light)]">
              Color
            </label>
            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="w-full rounded-full border border-[var(--color-gold)]/30 bg-transparent px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
            >
              <option value="">Todos</option>
              {allColors.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-[var(--color-ink-light)]">
              Precio mín.
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              placeholder="$0"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              className="w-full rounded-full border border-[var(--color-gold)]/30 bg-transparent px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-[var(--color-ink-light)]">
              Precio máx.
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              placeholder="$999"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className="w-full rounded-full border border-[var(--color-gold)]/30 bg-transparent px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-museum-border)] pt-3">
          <p className="text-xs text-[var(--color-ink-light)]">
            {filtered.length} de {productos.length} artesanías
          </p>
          {(categoriaSlug || precioMin || precioMax || colorFilter) && (
            <button
              onClick={() => {
                setCategoriaSlug("");
                setPrecioMin("");
                setPrecioMax("");
                setColorFilter("");
              }}
              className="text-xs text-[var(--color-museum-accent)] hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[var(--color-ink-light)]">
            No hay artesanías que coincidan con los filtros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </>
  );
}
