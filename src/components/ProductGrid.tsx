import { ProductCard } from "./ProductCard";
import type { Modelo, Color, Categoria } from "@/types";

interface Producto {
  id: string;
  nombre: string;
  slug: string;
  precioUsd: number;
  imagen: string;
  categoria: Pick<Categoria, "nombre">;
  modelos: Modelo[];
}

export function ProductGrid({ productos }: { productos: Producto[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}
