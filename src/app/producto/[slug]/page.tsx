import { notFound } from "next/navigation";
import Image from "next/image";
import { VariantSelector } from "@/components/VariantSelector";
import { apiFetch } from "@/lib/api";

export async function generateStaticParams() {
  const productos = await apiFetch<any[]>("/productos");
  return productos.map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const producto = await apiFetch<any>(`/productos/${slug}`);
    return {
      title: `${producto.nombre} — Tlalchichi777`,
      description: producto.descripcion ?? undefined,
      openGraph: {
        title: producto.nombre,
        description: producto.descripcion ?? undefined,
        images: [{ url: producto.imagen, width: 800, height: 600 }],
      },
    };
  } catch {
    return { title: "Producto no encontrado" };
  }
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let producto: any;
  try {
    producto = await apiFetch<any>(`/productos/${slug}`);
  } catch {
    notFound();
  }
  if (!producto) notFound();

  return (
    <div className="producto-layout">
      {/* Left: product image */}
      <div className="producto-imagen">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
      </div>

      {/* Right: product info */}
      <div className="producto-info">
        <p className="producto-categoria">
          {producto.categoria.nombre}
        </p>
        <h1 className="producto-titulo">
          {producto.nombre}
        </h1>
        {producto.descripcion && (
          <p className="producto-descripcion">
            {producto.descripcion}
          </p>
        )}

        <VariantSelector
          productoId={producto.id}
          nombre={producto.nombre}
          precioUsd={producto.precioUsd}
          modelos={producto.modelos}
        />
      </div>
    </div>
  );
}
