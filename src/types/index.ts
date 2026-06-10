export interface Color {
  id: string;
  nombre: string;
  imagen: string;
  stock: number;
}

export interface Modelo {
  id: string;
  nombre: string;
  colores: Color[];
}

export interface Producto {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  precioUsd: number;
  imagen: string;
  activo: boolean;
  categoriaId: string;
  categoria: Categoria;
  modelos: Modelo[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  imagen: string | null;
  productos?: Producto[];
}

export interface PedidoItem {
  productoId: string;
  nombre: string;
  precioUsd: number;
  cantidad: number;
  imagen: string;
  modeloNombre?: string;
  colorNombre?: string;
}

export interface Pedido {
  id: string;
  email: string;
  total: number;
  gateway: string;
  gatewayOrderId: string;
  items: PedidoItem[];
  status: string;
  createdAt: Date;
}
