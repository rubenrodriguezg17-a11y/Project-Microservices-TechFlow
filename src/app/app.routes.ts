import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/dashboard/dashboard-home.component').then(m => m.DashboardHomeComponent)
      },

      // ── Solo ADMIN ───────────────────────────────────────────────────────
      {
        path: 'productos',
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('./features/productos/productos.component').then(m => m.ProductosComponent)
      },
      {
        path: 'pagos',
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('./features/pagos/pagos.component').then(m => m.PagosComponent)
      },
      {
        path: 'inventario',
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('./features/inventario/inventario.component').then(m => m.InventarioComponent)
      },
      {
        path: 'proveedores',
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('./features/proveedores/proveedores.component').then(m => m.ProveedoresComponent)
      },
      {
        path: 'clientes',
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('./features/clientes/clientes.component').then(m => m.ClientesComponent)
      },

      // ── ADMIN y CLIENTE ──────────────────────────────────────────────────
      {
        path: 'pedidos',
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'CLIENTE'] },
        loadComponent: () => import('./features/pedidos/pedidos.component').then(m => m.PedidosComponent)
      },
      {
        path: 'envios',
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'CLIENTE'] },
        loadComponent: () => import('./features/envios/envios.component').then(m => m.EnviosComponent)
      },

      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
