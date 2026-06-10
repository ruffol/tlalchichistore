"use client";

import { useState } from "react";
import { ComprarAhoraButton } from "./ComprarAhoraButton";
import { colorMap } from "@/lib/colors";
import { ENVIO_MXN } from "@/lib/envio";
import type { Color, Modelo } from "@/types";

interface VariantSelectorProps {
  productoId: string;
  nombre: string;
  precioUsd: number;
  modelos: Modelo[];
}

export function VariantSelector({
  productoId,
  nombre,
  precioUsd,
  modelos,
}: VariantSelectorProps) {
  const [selectedModelo, setSelectedModelo] = useState<Modelo>(modelos[0]);
  const [selectedColor, setSelectedColor] = useState<Color>(
    modelos[0]?.colores[0]
  );

  const currentImage = selectedColor?.imagen;

  return (
    <div className="variant-selector">
      {/* Modelo - Select */}
      <div className="variant-section">
        <p className="variant-label">Modelo</p>
        <select
          value={selectedModelo.id}
          onChange={(e) => {
            const modelo = modelos.find((m) => m.id === e.target.value);
            if (modelo) {
              setSelectedModelo(modelo);
              setSelectedColor(modelo.colores[0]);
            }
          }}
          className="variant-select"
        >
          {modelos.map((modelo) => (
            <option key={modelo.id} value={modelo.id}>
              {modelo.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Color - Select */}
      {selectedModelo && (
        <div className="variant-section">
          <p className="variant-label">Color</p>
          <select
            value={selectedColor?.id}
            onChange={(e) => {
              const color = selectedModelo.colores.find((c) => c.id === e.target.value);
              if (color) setSelectedColor(color);
            }}
            className="variant-select"
          >
            {selectedModelo.colores.map((color) => {
              const outOfStock = color.stock <= 0;
              return (
                <option key={color.id} value={color.id} disabled={outOfStock}>
                  {color.nombre}{outOfStock ? " (agotado)" : ""}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* Precio, envío y compra */}
      <div className="variant-footer">
        <div className="variant-precio-block">
          <p className="variant-precio">${precioUsd.toFixed(2)} USD</p>
          <p className="variant-envio">Envío: ${ENVIO_MXN} MXN</p>
        </div>

        {selectedColor && selectedColor.stock > 0 && (
          <ComprarAhoraButton
            productoId={productoId}
            nombre={`${nombre} - ${selectedModelo.nombre} (${selectedColor.nombre})`}
            precioUsd={precioUsd}
            imagen={currentImage || ""}
            modeloNombre={selectedModelo.nombre}
            colorNombre={selectedColor.nombre}
          />
        )}

        {selectedColor && selectedColor.stock <= 0 && (
          <p className="variant-agotado-msg">
            Esta variante está agotada. Selecciona otra combinación.
          </p>
        )}
      </div>
    </div>
  );
}
