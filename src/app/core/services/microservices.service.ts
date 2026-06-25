import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pedido, Pago, Inventario, Envio, Proveedor, Producto, Cliente } from '../models/models';

// ─── Producto ────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly BASE = `${environment.gateway}/api/productos`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.BASE}/getAllProducts`);
  }
  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.BASE}/obtenerProductoId/${id}`);
  }
  create(p: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${this.BASE}/createProduct`, p);
  }
  update(id: number, p: Producto): Observable<string> {
    return this.http.put(`${this.BASE}/updateProduct/${id}`, p, { responseType: 'text' });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/deleteProduct/${id}`);
  }
}

// ─── Cliente ─────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly BASE = `${environment.gateway}/api/clientes`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.BASE}/all`);
  }
  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.BASE}/${id}`);
  }
  getPerfilByIdUsuario(idUsuario: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.BASE}/perfil/${idUsuario}`);
  }
  update(id: number, c: Partial<Cliente>): Observable<string> {
    return this.http.put(`${this.BASE}/${id}`, c, { responseType: 'text' });
  }
  cambiarRol(id: number, rol: string): Observable<string> {
    return this.http.put(`${this.BASE}/${id}/cambiar-rol?rol=${rol}`, {}, { responseType: 'text' });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${id}`);
  }
  misPedidos(idUsuario: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.BASE}/mis-pedidos/${idUsuario}`);
  }
  tracking(idPedido: number): Observable<Envio> {
    return this.http.get<Envio>(`${this.BASE}/tracking/${idPedido}`);
  }
}

// ─── Pedido ──────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly BASE = `${environment.gateway}/api/pedidos`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.BASE}/getAllOrders`);
  }
  getById(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.BASE}/getOrder/${id}`);
  }
  create(p: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.BASE}/createOrder`, p);
  }
  actualizarEstado(id: number, estado: string): Observable<string> {
    return this.http.put(`${this.BASE}/actualizarEstado/${id}?estado=${estado}`, {}, { responseType: 'text' });
  }
}

// ─── Pago ────────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class PagoService {
  private readonly BASE = `${environment.gateway}/api/pagos`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.BASE}/getAllPayments`);
  }
  processPayment(p: Pago): Observable<Pago> {
    return this.http.post<Pago>(`${this.BASE}/processPayment`, p);
  }
}

// ─── Inventario ──────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class InventarioService {
  private readonly BASE = `${environment.gateway}/api/inventario`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(`${this.BASE}/getAll`);
  }
  save(i: Inventario): Observable<Inventario> {
    return this.http.post<Inventario>(`${this.BASE}/save`, i);
  }
  getByProducto(idProducto: number): Observable<Inventario> {
    return this.http.get<Inventario>(`${this.BASE}/product/${idProducto}`);
  }
  updateStock(idProducto: number, cantidad: number): Observable<string> {
    return this.http.put(`${this.BASE}/update-stock?idProducto=${idProducto}&cantidad=${cantidad}`, {}, { responseType: 'text' });
  }
  descontarStock(idProducto: number, cantidad: number): Observable<string> {
    return this.http.post(`${this.BASE}/descontar?idProducto=${idProducto}&cantidad=${cantidad}`, {}, { responseType: 'text' });
  }
}

// ─── Envio ───────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class EnvioService {
  private readonly BASE = `${environment.gateway}/api/envios`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Envio[]> {
    return this.http.get<Envio[]>(`${this.BASE}/getAllEnvios`);
  }
  create(e: Envio): Observable<Envio> {
    return this.http.post<Envio>(`${this.BASE}/createEnvio`, e);
  }
  trackByPedido(idPedido: number): Observable<Envio> {
    return this.http.get<Envio>(`${this.BASE}/track/${idPedido}`);
  }
  updateStatus(idPedido: number, nuevoEstado: string): Observable<string> {
    return this.http.put(`${this.BASE}/update-status?idPedido=${idPedido}&nuevoEstado=${nuevoEstado}`, {}, { responseType: 'text' });
  }
}

// ─── Proveedor ───────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private readonly BASE = `${environment.gateway}/api/proveedores`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.BASE}/getAllVendors`);
  }
  create(p: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(`${this.BASE}/createVendor`, p);
  }
  solicitarReabastecimiento(idProducto: number, cantidadRE: number): Observable<string> {
    return this.http.post(
      `${this.BASE}/solicitarReabastecimiento?idProducto=${idProducto}&cantidadRE=${cantidadRE}`,
      {},
      { responseType: 'text' }
    );
  }
}
