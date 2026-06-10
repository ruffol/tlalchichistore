import { MisPedidosClient } from "./MisPedidosClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mis Pedidos — Tlalchichi777",
  description: "Consulta el estado de tus pedidos de artesanías colimenses.",
};

export default async function MisPedidosPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 pt-24 pb-16">
      <div className="mb-8 text-center">
        <h1 className="font-[var(--font-serif)] text-3xl font-bold text-[var(--color-ink)]">
          Mis Pedidos
        </h1>
        <p className="mt-3 text-[var(--color-ink-light)]">
          Ingresa tu correo electrónico para consultar tus pedidos.
        </p>
      </div>
      <MisPedidosClient />
    </section>
  );
}
