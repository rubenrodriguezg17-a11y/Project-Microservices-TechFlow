// ─── Usuario / Identity ──────────────────────────────
export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
}

// ─── Cliente (perfil completo) ───────────────────────
export interface Cliente {
  idCliente?: number;
  idUsuario: number;
  name?: string;        // viene de Identity via Feign
  email?: string;       // viene de Identity via Feign
  telefono?: string;
  direccionEnvio?: string;
  rol: 'CLIENTE' | 'ADMIN';
}

// ─── Request de registro completo ────────────────────
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  telefono: string;
  direccionEnvio: string;
}

// ─── Payload del JWT decodificado ────────────────────
export interface JwtPayload {
  sub: string;          // email
  id?: number;          // idUsuario (si lo incluyes en el token)
  iat: number;
  exp: number;
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

// ─── Pedido ─────────────────────────────────────────
export interface Pedido {
  id?: number;
  idUsuario: number;
  idProducto: number;
  cantidad: number;
  estado?: 'PENDIENTE' | 'PROCESANDO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
  fechaCreacion?: string;
}

// ─── Pago ───────────────────────────────────────────
export interface Pago {
  id?: number;
  idPedido: number;
  monto: number;
  metodoPago: 'TARJETA' | 'EFECTIVO' | 'TRANSFERENCIA' | 'YAPE' | 'PLIN';
  estado?: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  fechaPago?: string;
}

// ─── Envio ──────────────────────────────────────────
export interface Envio {
  id?: number;
  idPedido: number;
  trackingNumber?: string;
  empresaEnvio?: string;
  estadoEnvio?: 'PREPARANDO' | 'EN_CAMINO' | 'ENTREGADO';
}
