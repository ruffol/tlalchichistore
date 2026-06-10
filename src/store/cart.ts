"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ENVIO_USD } from "@/lib/envio";

interface CartItem {
  productoId: string;
  nombre: string;
  precioUsd: number;
  imagen: string;
  cantidad: number;
  modeloNombre?: string;
  colorNombre?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cantidad">) => void;
  removeItem: (productoId: string, modeloNombre?: string, colorNombre?: string) => void;
  updateCantidad: (productoId: string, cantidad: number, modeloNombre?: string, colorNombre?: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.productoId === item.productoId &&
              i.modeloNombre === item.modeloNombre &&
              i.colorNombre === item.colorNombre
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productoId === item.productoId &&
                i.modeloNombre === item.modeloNombre &&
                i.colorNombre === item.colorNombre
                  ? { ...i, cantidad: i.cantidad + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, cantidad: 1 }] };
        });
      },

      removeItem: (productoId, modeloNombre, colorNombre) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(i.productoId === productoId &&
                i.modeloNombre === modeloNombre &&
                i.colorNombre === colorNombre)
          ),
        }));
      },

      updateCantidad: (productoId, cantidad, modeloNombre, colorNombre) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productoId === productoId &&
            i.modeloNombre === modeloNombre &&
            i.colorNombre === colorNombre
              ? { ...i, cantidad: Math.max(1, cantidad) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.cantidad, 0),

      subtotal: () => get().items.reduce((sum, item) => sum + item.precioUsd * item.cantidad, 0),

      totalPrice: () => {
        const sub = get().items.reduce((sum, item) => sum + item.precioUsd * item.cantidad, 0);
        return sub + ENVIO_USD;
      },
    }),
    { name: "tlalchichi-cart" }
  )
);
