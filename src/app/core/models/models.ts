// ─── Usuario ────────────────────────────────────────
export interface User {
  id?: number;
  name: string;
  email: string;
  direccionEnvio: string;
  telefono: string;
  password?: string;
}

// ─── Producto ───────────────────────────────────────
export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

// ─── Proveedor ──────────────────────────────────────
export interface Proveedor {
  id?: number;
  nombre: string;
  ruc: string;
  contacto: string;
  activo: boolean;
}

// ─── Inventario ─────────────────────────────────────
export interface Inventario {
  id?: number;
  idProducto: number;
  cantidad: number;
  ubicacion: string;
}

export interface Pedido {
  id?: number;
  idUsuario: number;
  idProducto: number;
  cantidad: number;
  estado?: 'PENDIENTE' | 'PROCESANDO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
  fechaCreacion?: string;
}

export interface Pago {
  id?: number;
  idPedido: number;
  monto: number;
  metodoPago: 'TARJETA' | 'EFECTIVO' | 'TRANSFERENCIA' | 'YAPE' | 'PLIN';
  estado?: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  fechaPago?: string;
}

export interface Envio {
  id?: number;
  idPedido: number;
  direccion: string;
  estado?: 'PREPARANDO' | 'EN_CAMINO' | 'ENTREGADO';
  fechaEstimada?: string;
}
