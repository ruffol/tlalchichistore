import Image from "next/image";
import type { GaleriaPieza } from "@/lib/galeria-data";

interface ProductoVitrina {
  nombre: string;
}

interface VitrinaMuseoProps {
  producto: ProductoVitrina;
  galeria: GaleriaPieza;
  imagen: string;
  reversed?: boolean;
}

export function VitrinaMuseo({
  producto,
  galeria,
  imagen,
  reversed = false,
}: VitrinaMuseoProps) {
  return (
    <section className="vitrina-museo">
      <div className={`vitrina-grid${reversed ? " vitrina-reversed" : ""}`}>
        {/* ─── DISPLAY CASE ─── */}
        <div className="vitrina-display">
          <div className="vitrina-spotlight" />
          <div className="vitrina-glass">
            <div className="relative aspect-[4/5] w-full max-w-sm mx-auto overflow-hidden rounded-lg">
              <Image
                src={imagen}
                alt={producto.nombre}
                fill
                className="object-cover vitrina-imagen"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>
          </div>
          <div className="vitrina-mount" />
        </div>

        {/* ─── CÉDULA ─── */}
        <div className="vitrina-cedula">
          <div className="cedula-label">
            <span className="cedula-coleccion">COLECCIÓN TLALCHICHI777</span>
            <span className="cedula-numero">—</span>
          </div>

          <h2 className="cedula-titulo">{galeria.titulo}</h2>
          <p className="cedula-subtitulo">{galeria.subtitulo}</p>

          <div className="cedula-divider" />

          <p className="cedula-materiales">{galeria.materiales}</p>

          <p className="cedula-historia">{galeria.historia}</p>
        </div>
      </div>
    </section>
  );
}
