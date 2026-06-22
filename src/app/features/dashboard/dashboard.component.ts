import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding:2rem;font-family:'Inter',system-ui">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem">
        <h1 style="color:#185FA5;font-size:1.5rem;font-weight:700">GTech Dashboard</h1>
        <button (click)="logout()" style="padding:.5rem 1rem;background:#e24b4a;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:.85rem">
          Cerrar sesión
        </button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem">
        <a routerLink="/productos"   style="text-decoration:none"><div class="card" style="background:#e6f1fb;border-radius:12px;padding:1.25rem;cursor:pointer"><div style="font-size:1.75rem">📦</div><div style="font-weight:600;color:#185FA5;margin-top:.5rem">Productos</div></div></a>
        <a routerLink="/pedidos"     style="text-decoration:none"><div class="card" style="background:#e1f5ee;border-radius:12px;padding:1.25rem;cursor:pointer"><div style="font-size:1.75rem">🛒</div><div style="font-weight:600;color:#0f6e56;margin-top:.5rem">Pedidos</div></div></a>
        <a routerLink="/pagos"       style="text-decoration:none"><div class="card" style="background:#faeeda;border-radius:12px;padding:1.25rem;cursor:pointer"><div style="font-size:1.75rem">💳</div><div style="font-weight:600;color:#854f0b;margin-top:.5rem">Pagos</div></div></a>
        <a routerLink="/inventario"  style="text-decoration:none"><div class="card" style="background:#eeedfe;border-radius:12px;padding:1.25rem;cursor:pointer"><div style="font-size:1.75rem">🏪</div><div style="font-weight:600;color:#534ab7;margin-top:.5rem">Inventario</div></div></a>
        <a routerLink="/envios"      style="text-decoration:none"><div class="card" style="background:#faece7;border-radius:12px;padding:1.25rem;cursor:pointer"><div style="font-size:1.75rem">🚚</div><div style="font-weight:600;color:#993c1d;margin-top:.5rem">Envíos</div></div></a>
        <a routerLink="/proveedores" style="text-decoration:none"><div class="card" style="background:#eaf3de;border-radius:12px;padding:1.25rem;cursor:pointer"><div style="font-size:1.75rem">🏭</div><div style="font-weight:600;color:#3b6d11;margin-top:.5rem">Proveedores</div></div></a>
      </div>
    </div>
  `
})
export class DashboardComponent {
  constructor(private auth: AuthService) {}
  logout() { this.auth.logout(); }
}
