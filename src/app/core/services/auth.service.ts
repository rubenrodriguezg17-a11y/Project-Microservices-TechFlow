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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly BASE = environment.identityService;
  private _token$ = new BehaviorSubject<string | null>(localStorage.getItem('gtech_token'));
  
  public token$ = this._token$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  get token(): string | null { 
    return this._token$.value; 
  }

  get isLoggedIn(): boolean { 
    return !!localStorage.getItem('gtech_token'); 
  }

  register(payload: RegisterRequest): Observable<string> {
    return this.http.post(
      `${this.BASE}/auth/register`, 
      payload, 
      { responseType: 'text' }
    );
  }

  login(username: string, password: string): Observable<string> {
    return this.http
      .post(
        `${this.BASE}/auth/token`, 
        { username, password }, 
        { responseType: 'text' }
      )
      .pipe(
        tap((tokenPlano: string) => {
          localStorage.setItem('gtech_token', tokenPlano);
          this._token$.next(tokenPlano);
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