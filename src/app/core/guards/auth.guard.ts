import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // 1. Sin token → al login
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    // 2. Verificar rol requerido si la ruta lo define
    const rolesPermitidos: string[] = route.data?.['roles'] ?? [];

    if (rolesPermitidos.length > 0) {
      const rolActual = this.auth.rol;
      if (!rolActual || !rolesPermitidos.includes(rolActual)) {
        // Redirigir a home del dashboard en lugar de login
        this.router.navigate(['/dashboard/home']);
        return false;
      }
    }

    return true;
  }
}
