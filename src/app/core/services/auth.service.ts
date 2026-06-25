import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RegisterRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // El registro va al Gateway → Cliente-Service (1 solo paso)
  private readonly GATEWAY  = environment.gateway;
  // El login/validate sigue yendo a Identity directamente
  private readonly IDENTITY = environment.identityService;

  private _token$    = new BehaviorSubject<string | null>(localStorage.getItem('gtech_token'));
  private _rol$      = new BehaviorSubject<string | null>(localStorage.getItem('gtech_rol'));
  private _idUsuario$ = new BehaviorSubject<number | null>(
    localStorage.getItem('gtech_id') ? Number(localStorage.getItem('gtech_id')) : null
  );
  private _name$     = new BehaviorSubject<string | null>(localStorage.getItem('gtech_name'));

  public token$     = this._token$.asObservable();
  public rol$       = this._rol$.asObservable();
  public idUsuario$ = this._idUsuario$.asObservable();
  public name$      = this._name$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ── Getters síncronos ────────────────────────────────────────────────────

  get token(): string | null     { return this._token$.value; }
  get rol(): string | null       { return this._rol$.value; }
  get idUsuario(): number | null { return this._idUsuario$.value; }
  get name(): string | null      { return this._name$.value; }
  get isLoggedIn(): boolean      { return !!this._token$.value; }
  get isAdmin(): boolean         { return this._rol$.value === 'ADMIN'; }
  get isCliente(): boolean       { return this._rol$.value === 'CLIENTE'; }

  // ── Registro completo (Identity + perfil Cliente en 1 llamada) ───────────

  register(payload: RegisterRequest): Observable<string> {
    return this.http.post(
      `${this.GATEWAY}/api/clientes/register`,
      payload,
      { responseType: 'text' }
    );
  }

  // ── Login ────────────────────────────────────────────────────────────────

  login(username: string, password: string): Observable<string> {
    return this.http
      .post(
        `${this.IDENTITY}/auth/token`,
        { username, password },
        { responseType: 'text' }
      )
      .pipe(
        tap((token: string) => {
          localStorage.setItem('gtech_token', token);
          this._token$.next(token);
          // Decodificar el JWT para extraer sub (email)
          this._decodeAndStore(token);
          // Luego cargar el perfil del cliente para obtener rol e idUsuario
          this._cargarPerfilCliente(token);
        })
      );
  }

  // ── Logout ───────────────────────────────────────────────────────────────

  logout(): void {
    localStorage.removeItem('gtech_token');
    localStorage.removeItem('gtech_rol');
    localStorage.removeItem('gtech_id');
    localStorage.removeItem('gtech_name');
    this._token$.next(null);
    this._rol$.next(null);
    this._idUsuario$.next(null);
    this._name$.next(null);
    this.router.navigate(['/login']);
  }

  // ── Validar token ────────────────────────────────────────────────────────

  validateToken(token: string): Observable<string> {
    return this.http.get(
      `${this.IDENTITY}/auth/validate?token=${token}`,
      { responseType: 'text' }
    );
  }

  // ── Helpers privados ─────────────────────────────────────────────────────

  /**
   * Decodifica el payload del JWT (Base64) sin verificar firma.
   * Solo se usa para leer el subject (email) del token.
   */
  private _decodeAndStore(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Identity pone el email en 'sub'
      if (payload.sub) {
        localStorage.setItem('gtech_name', payload.sub);
        this._name$.next(payload.sub);
      }
    } catch {
      // token malformado — no bloqueamos el flujo
    }
  }

  /**
   * Llama a Cliente-Service para obtener rol e idUsuario reales.
   * Usa el email del token para buscar por idUsuario.
   * Como no tenemos endpoint search-by-email en Cliente, usamos
   * Identity para obtener el id y luego Cliente para el perfil.
   */
  private _cargarPerfilCliente(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email: string = payload.sub;
      if (!email) return;

      // Paso 1: obtener el UserCredential por email de Identity
      this.http
        .get<any>(`${this.IDENTITY}/api/usuario/getByEmail/${encodeURIComponent(email)}`)
        .subscribe({
          next: (usuario) => {
            if (!usuario?.id) return;
            const idUsuario: number = usuario.id;

            // Guardamos nombre real del Identity
            localStorage.setItem('gtech_name', usuario.name ?? email);
            this._name$.next(usuario.name ?? email);

            // Paso 2: obtener perfil de Cliente-Service
            this.http
              .get<any>(`${this.GATEWAY}/api/clientes/perfil/${idUsuario}`)
              .subscribe({
                next: (cliente) => {
                  const rol = cliente?.rol ?? 'CLIENTE';
                  localStorage.setItem('gtech_id',  String(idUsuario));
                  localStorage.setItem('gtech_rol', rol);
                  this._idUsuario$.next(idUsuario);
                  this._rol$.next(rol);
                },
                error: () => {
                  // Sin perfil de cliente todavía → rol por defecto
                  localStorage.setItem('gtech_id',  String(idUsuario));
                  localStorage.setItem('gtech_rol', 'CLIENTE');
                  this._idUsuario$.next(idUsuario);
                  this._rol$.next('CLIENTE');
                }
              });
          }
        });
    } catch {
      // No bloqueamos el login si falla la carga del perfil
    }
  }
}
