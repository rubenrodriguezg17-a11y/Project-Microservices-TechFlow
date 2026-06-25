import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

export interface Pago {
  id?: number;
  idPedido: number;
  monto: number;
  metodoPago: string;
  estadoPago: string;
}

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.style.scss']
})
export class PagosComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  private readonly BASE_URL = `${environment.services.productos}/api/pagos`;

  pagos: Pago[] = [];
  cargando: boolean = true;
  errorMensaje: string = '';

  pagoForm!: FormGroup;
  mostrarModal: boolean = false;

  metodosPago: string[] = ['Yape', 'Plin', 'Efectivo', 'Tarjeta de Crédito', 'Transferencia'];

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerPagos();
  }

  inicializarFormulario(): void {
    this.pagoForm = this.fb.group({
      idPedido: ['', [Validators.required, Validators.min(1)]],
      monto: ['', [Validators.required, Validators.min(0.1)]],
      metodoPago: ['Yape', [Validators.required]],
      estadoPago: ['Activo', [Validators.required]]
    });
  }

  obtenerPagos(): void {
    this.http.get<Pago[]>(`${this.BASE_URL}/getAllPayments`).subscribe({
      next: (data) => {
        this.pagos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMensaje = 'No se pudo conectar con el servidor de pasarela de pagos.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalCrear(): void {
    this.pagoForm.reset({ metodoPago: 'Yape', estadoPago: 'Activo' });
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.pagoForm.reset();
  }

  procesarPago(): void {
    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();
      return;
    }

    const nuevoPago: Pago = this.pagoForm.value;

    // Asegurar que el string conserve el formato esperado por el backend
    if (nuevoPago.estadoPago === 'Activo') {
      nuevoPago.estadoPago = 'Activo ';
    }

    this.http.post<Pago>(`${this.BASE_URL}/processPayment`, nuevoPago).subscribe({
      next: () => {
        this.obtenerPagos();
        this.cerrarModal();
      },
      error: (err) => console.error(err)
    });
  }
}