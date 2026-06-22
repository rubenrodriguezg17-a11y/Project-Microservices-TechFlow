import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RegisterRequest {
  name: string;
  email: string;
  direccionEnvio: string;
  telefono: string;
  password: string;
}

export interface TokenResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly BASE = environment.identityService;
  private _token$ = new BehaviorSubject<string | null>(this.storedToken);

  constructor(private http: HttpClient, private router: Router) {}

  get token(): string | null { return this._token$.value; }
  get isLoggedIn(): boolean  { return !!this.token; }

  private get storedToken(): string | null {
    return localStorage.getItem('gtech_token');
  }

  register(payload: RegisterRequest): Observable<any> {
    return this.http.post(`${this.BASE}/auth/register`, payload);
  }

  login(username: string, password: string): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.BASE}/auth/token`, { username, password })
      .pipe(
        tap((res: TokenResponse) => {
          localStorage.setItem('gtech_token', res.token);
          this._token$.next(res.token);
        })
      );
  }

  validateToken(): Observable<any> {
    return this.http.get(`${this.BASE}/auth/validate`);
  }

  logout(): void {
    localStorage.removeItem('gtech_token');
    this._token$.next(null);
    this.router.navigate(['/login']);
  }
}
