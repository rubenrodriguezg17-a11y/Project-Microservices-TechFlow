import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

export interface Pedido {
  id?: number;
  idUsuario: number;
  idProducto: number;
  cantidad: number;
  total: number;
  estado: string;
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.style.scss']
})
export class PedidosComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  private readonly BASE_URL = `${environment.services.productos}/api/pedidos`;

  pedidos: Pedido[] = [];
  cargando: boolean = true;
  errorMensaje: string = '';

  pedidoForm!: FormGroup;
  mostrarModal: boolean = false;
  editando: boolean = false;
  idPedidoSeleccionado?: number;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerPedidos();
  }

  inicializarFormulario(): void {
    this.pedidoForm = this.fb.group({
      idUsuario: ['', [Validators.required, Validators.min(1)]],
      idProducto: ['', [Validators.required, Validators.min(1)]],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      total: ['', [Validators.required, Validators.min(0.1)]],
      estado: ['1', [Validators.required]] // Por defecto "1" (ej. Pendiente)
    });
  }

  obtenerPedidos(): void {
    this.http.get<Pedido[]>(`${this.BASE_URL}/getAllOrders`).subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMensaje = 'No se pudo establecer conexión con el módulo de órdenes.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscarPorCodigo(codigoStr: string): void {
    const codigo = parseInt(codigoStr, 10);
    if (!codigo) {
      this.obtenerPedidos();
      return;
    }

    this.cargando = true;
    this.http.get<Pedido | null>(`${this.BASE_URL}/getOrder/${codigo}`).subscribe({
      next: (data) => {
        this.pedidos = data ? [data] : [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.pedidos = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalCrear(): void {
    this.editando = false;
    this.idPedidoSeleccionado = undefined;
    this.pedidoForm.reset({ estado: '1' });
    this.pedidoForm.get('idUsuario')?.enable();
    this.pedidoForm.get('idProducto')?.enable();
    this.pedidoForm.get('cantidad')?.enable();
    this.mostrarModal = true;
  }

  abrirModalEditar(pedido: Pedido): void {
    this.editando = true;
    this.idPedidoSeleccionado = pedido.id;
    this.pedidoForm.patchValue({
      idUsuario: pedido.idUsuario,
      idProducto: pedido.idProducto,
      cantidad: pedido.cantidad,
      total: pedido.total,
      estado: pedido.estado
    });
    this.pedidoForm.get('idUsuario')?.disable();
    this.pedidoForm.get('idProducto')?.disable();
    this.pedidoForm.get('cantidad')?.disable();
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.pedidoForm.reset();
  }

  guardarPedido(): void {
    if (this.pedidoForm.invalid) {
      this.pedidoForm.markAllAsTouched();
      return;
    }

    if (this.editando && this.idPedidoSeleccionado) {
      const estadoNuevo = this.pedidoForm.get('estado')?.value;
      this.http.put(`${this.BASE_URL}/actualizarEstado/${this.idPedidoSeleccionado}?estado=${estadoNuevo}`, {}, { responseType: 'text' })
        .subscribe({
          next: () => {
            this.obtenerPedidos();
            this.cerrarModal();
          },
          error: (err) => console.error(err)
        });
    } else {
      const nuevoPedido: Pedido = this.pedidoForm.value;
      this.http.post<Pedido>(`${this.BASE_URL}/createOrder`, nuevoPedido).subscribe({
        next: () => {
          this.obtenerPedidos();
          this.cerrarModal();
        },
        error: (err) => console.error(err)
      });
    }
  }

  obtenerTextoEstado(estado: string): string {
    switch (estado) {
      case '1': return 'Pendiente';
      case '2': return 'Procesado';
      case '3': return 'Cancelado';
      default: return 'Desconocido';
    }
  }
}