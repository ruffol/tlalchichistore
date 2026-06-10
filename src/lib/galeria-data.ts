export interface GaleriaPieza {
  titulo: string;
  subtitulo: string;
  materiales: string;
  historia: string;
}

export const piezas: Record<string, GaleriaPieza> = {
  "tlalchichi-maceta": {
    titulo: "Maceta",
    subtitulo: "Cemento y color",
    materiales: "Cemento artesanal · Pintura a base de cal · Acabado sellado",
    historia:
      "Nace de un molde tradicional de Colima, vertido a mano y curado al sol. Cada maceta se lija, sella y pinta con pigmentos naturales que respiran con la tierra. Su forma evoca los volcanes que vigilan el valle.",
  },
  "tlalchichi-vela": {
    titulo: "Vela",
    subtitulo: "Cera y luz",
    materiales: "Cera de abeja natural · Pabilo de algodón · Aroma de vainilla",
    historia:
      "La cera se funde a baño maría y se vierte en moldes creados por manos artesanas. Al enfriarse, cada vela conserva el calor del taller. La llama baila como lo hacen las tradiciones: incesante, viva, única.",
  },
  "tlalchichi-jabon": {
    titulo: "Jabón",
    subtitulo: "Natural y suave",
    materiales: "Aceite de oliva · Sosa cáustica natural · Aromas botánicos",
    historia:
      "El proceso de saponificación en frío respeta cada ingrediente. Lavanda, cítricos y miel se combinan en proporciones exactas. No hay dos barras iguales: el corte a mano deja la huella del artesano en cada pieza.",
  },
  "tlalchichi-yeso": {
    titulo: "Yeso",
    subtitulo: "Molde y detalle",
    materiales: "Yeso natural · Pigmentos minerales · Barniz mate",
    historia:
      "El yeso se cierne, se mezcla y se vierte en moldes de caucho hechos a partir de esculturas originales. Cada pieza se desmolda a mano, se revisa, se pinta y se sella. Grietas y texturas cuentan su propia historia.",
  },
  "tlalchichi-alcancia": {
    titulo: "Alcancía",
    subtitulo: "Guardar con estilo",
    materiales: "Cemento artesanal · Pintura acrílica · Tapón de hule",
    historia:
      "Nacida de la misma forma que la maceta, pero con un propósito distinto: guardar sueños. Su interior hueco y su tapón sellado la convierten en la compañera de ahorros. Cada alcancía es una pieza única pintada a mano.",
  },
  "tlalchichi-llavero": {
    titulo: "Llavero",
    subtitulo: "La vela en tu bolsillo",
    materiales: "Resina · Pintura automotriz · Argolla metálica",
    historia:
      "Es la vela hecha miniatura, la misma forma pero en resina. Caben en la palma de tu mano y llevan el mismo diseño que su hermana mayor. Un fragmento de tradición que puedes cargar a donde vayas.",
  },
};
