import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pedido, Pago, Inventario, Envio, Proveedor } from '../models/models';

// ─── Pedido Service ──────────────────────────────────
@Injectable({ providedIn: 'root' })
export class PedidoService {
  private BASE = `${environment.gateway}/api/pedidos`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Pedido[]>        { return this.http.get<Pedido[]>(this.BASE); }
  getById(id: number): Observable<Pedido> { return this.http.get<Pedido>(`${this.BASE}/${id}`); }
  create(p: Pedido): Observable<Pedido> { return this.http.post<Pedido>(`${this.BASE}/createOrder`, p); }
}

// ─── Pago Service ────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class PagoService {
  private BASE = `${environment.gateway}/api/pagos`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Pago[]>          { return this.http.get<Pago[]>(this.BASE); }
  processPayment(p: Pago): Observable<Pago> { return this.http.post<Pago>(`${this.BASE}/processPayment`, p); }
}

// ─── Inventario Service ──────────────────────────────
@Injectable({ providedIn: 'root' })
export class InventarioService {
  private BASE = `${environment.gateway}/api/inventario`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Inventario[]>    { return this.http.get<Inventario[]>(this.BASE); }
  save(i: Inventario): Observable<Inventario> { return this.http.post<Inventario>(`${this.BASE}/save`, i); }
}

// ─── Envio Service ───────────────────────────────────
@Injectable({ providedIn: 'root' })
export class EnvioService {
  private BASE = `${environment.gateway}/api/envios`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Envio[]>         { return this.http.get<Envio[]>(this.BASE); }
  getById(id: number): Observable<Envio> { return this.http.get<Envio>(`${this.BASE}/${id}`); }
}

// ─── Proveedor Service ───────────────────────────────
@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private BASE = `${environment.gateway}/api/proveedores`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Proveedor[]>     { return this.http.get<Proveedor[]>(this.BASE); }
  create(p: Proveedor): Observable<Proveedor> { return this.http.post<Proveedor>(`${this.BASE}/createVendor`, p); }
}
