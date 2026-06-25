import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProductoService, PedidoService, ClienteService } from '../../core/services/microservices.service';
import { Producto, Pedido, Envio } from '../../core/models/models';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  private auth           = inject(AuthService);
  private productoSvc    = inject(ProductoService);
  private pedidoSvc      = inject(PedidoService);
  private clienteSvc     = inject(ClienteService);
  private router         = inject(Router);

  isAdmin = false;

  // ── ADMIN ────────────────────────────────────────────────────────────────
  productosBajoStock: Producto[]  = [];
  pedidosPendientes:  Pedido[]    = [];
  totalPedidos      = 0;
  cargandoAdmin     = true;

  // ── CLIENTE ──────────────────────────────────────────────────────────────
  misPedidos:   Pedido[] = [];
  ultimoEnvio:  Envio | null = null;
  cargandoCliente = true;

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin;
    if (this.isAdmin) {
      this.cargarDatosAdmin();
    } else {
      this.cargarDatosCliente();
    }
  }

  // ── ADMIN ────────────────────────────────────────────────────────────────

  cargarDatosAdmin(): void {
    this.productoSvc.getAll().subscribe({
      next: (productos) => {
        this.productosBajoStock = productos.filter(p => (p as any).stock <= 10);
      },
      error: () => {}
    });

    this.pedidoSvc.getAll().subscribe({
      next: (pedidos) => {
        this.totalPedidos     = pedidos.length;
        this.pedidosPendientes = pedidos.filter(p => p.estado === 'PENDIENTE');
        this.cargandoAdmin    = false;
      },
      error: () => { this.cargandoAdmin = false; }
    });
  }

  irAReabastecer(idProducto: number): void {
    this.router.navigate(['/dashboard/proveedores']);
  }

  // ── CLIENTE ──────────────────────────────────────────────────────────────

  cargarDatosCliente(): void {
    const idUsuario = this.auth.idUsuario;
    if (!idUsuario) { this.cargandoCliente = false; return; }

    this.clienteSvc.misPedidos(idUsuario).subscribe({
      next: (pedidos) => {
        this.misPedidos = pedidos;
        // Buscar el tracking del último pedido
        if (pedidos.length > 0) {
          const ultimo = pedidos[pedidos.length - 1];
          if (ultimo.id) {
            this.clienteSvc.tracking(ultimo.id).subscribe({
              next: (envio) => { this.ultimoEnvio = envio; },
              error: () => {}
            });
          }
        }
        this.cargandoCliente = false;
      },
      error: () => { this.cargandoCliente = false; }
    });
  }

  estadoLabel(estado?: string): string {
    const map: Record<string, string> = {
      PENDIENTE: 'Pendiente', PROCESANDO: 'Procesando',
      ENVIADO: 'Enviado', ENTREGADO: 'Entregado', CANCELADO: 'Cancelado'
    };
    return map[estado ?? ''] ?? estado ?? '—';
  }

  estadoEnvioLabel(e?: string): string {
    const map: Record<string, string> = {
      PREPARANDO: 'Preparando', EN_CAMINO: 'En camino', ENTREGADO: 'Entregado'
    };
    return map[e ?? ''] ?? e ?? '—';
  }
}