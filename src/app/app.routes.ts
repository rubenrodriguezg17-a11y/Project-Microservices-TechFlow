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
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'productos',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/productos/productos.component').then(m => m.ProductosComponent)
  },
  {
    path: 'pedidos',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/pedidos/pedidos.component').then(m => m.PedidosComponent)
  },
  {
    path: 'pagos',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/pagos/pagos.component').then(m => m.PagosComponent)
  },
  {
    path: 'inventario',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/inventario/inventario.component').then(m => m.InventarioComponent)
  },
  {
    path: 'envios',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/envios/envios.component').then(m => m.EnviosComponent)
  },
  {
    path: 'proveedores',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/proveedores/proveedores.component').then(m => m.ProveedoresComponent)
  },
  { path: '**', redirectTo: 'login' }
];