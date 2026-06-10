import { CatalogoFiltros } from "@/components/CatalogoFiltros";
import { apiFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catálogo — Tlalchichi",
  description: "Explora nuestra colección de artesanías colimenses auténticas.",
};

export default async function CatalogoPage() {
  const [productos, categorias] = await Promise.all([
    apiFetch<any[]>("/productos"),
    apiFetch<any[]>("/categorias"),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-6 pt-24 pb-16">
      <div className="reveal mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-gold-dark)]">
          Catálogo
        </p>
        <h1 className="mt-3 font-[var(--font-serif)] text-3xl font-bold text-[var(--color-ink)] sm:text-4xl">
          Artesanías Mexicanas
        </h1>
      </div>
      <CatalogoFiltros productos={productos} categorias={categorias} />
    </section>
  );
}
