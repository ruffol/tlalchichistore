import { VitrinaMuseo } from "@/components/VitrinaMuseo";
import { piezas } from "@/lib/galeria-data";
import { apiFetch } from "@/lib/api";

export const metadata = {
  title: "Tlalchichi777 — Artesanías colimenses auténticas",
  description:
    "Museo virtual de artesanías colimenses. Descubre la historia y los modelos de cada pieza.",
};

const slugs = [
  "tlalchichi-maceta",
  "tlalchichi-vela",
  "tlalchichi-jabon",
  "tlalchichi-yeso",
  "tlalchichi-alcancia",
  "tlalchichi-llavero",
] as const;

const galleryImages: Record<string, string> = {
  "tlalchichi-maceta": "/assets/gallery/gallery-tlalchichi-maceta.png",
  "tlalchichi-vela": "/assets/gallery/gallery-tlalchichi-vela.png",
  "tlalchichi-jabon": "/assets/gallery/gallery-tlalchichi-jabon.png",
  "tlalchichi-yeso": "/assets/gallery/gallery-tlalchichi-yeso.png",
  "tlalchichi-alcancia": "/assets/gallery/gallery-tlalchichi-alcancia.png",
  "tlalchichi-llavero": "/assets/gallery/gallery-tlalchichi-llavero.png",
};

export default async function Home() {
  const all = await apiFetch<any[]>("/productos");
  const slugsSet = new Set(slugs as unknown as string[]);
  const productos = all.filter((p: any) => slugsSet.has(p.slug));

  const productoMap = Object.fromEntries(productos.map((p: any) => [p.slug, p]));

  return (
    <div>
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 pt-20 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-gold-dark)]">
          Museo Tlalchichi777
        </p>
        <h1 className="mt-4 font-[var(--font-serif)] text-4xl font-bold text-[var(--color-ink)] sm:text-5xl">
          Artesanías de Colima
        </h1>
        <p className="mt-4 max-w-lg text-[var(--color-ink-light)] leading-relaxed">
          Cada pieza cuenta una historia. Explora nuestra colección y descubre
          los materiales, los modelos y los colores que hacen única a cada
          artesanía.
        </p>
        <div className="mt-8 h-px w-16 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
      </section>

      {slugs.map((slug, i) => {
        const producto = productoMap[slug];
        const galeria = piezas[slug];
        if (!producto || !galeria) return null;
        return (
          <VitrinaMuseo
            key={slug}
            producto={producto}
            galeria={galeria}
            imagen={galleryImages[slug] || producto.imagen}
            reversed={i % 2 !== 0}
          />
        );
      })}
    </div>
  );
}
