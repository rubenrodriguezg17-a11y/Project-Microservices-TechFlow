import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

export type EstadoEnvio = 'EN_ALMACEN' | 'EN_CAMINO' | 'ENTREGADO';

export interface Envio {
  id?: number;
  idPedido: number;
  trackingNumber: string;
  empresaEnvio: string;
  estadoEnvio: EstadoEnvio;
}

@Component({
  selector: 'app-envios',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './envios.componet.html',
  styleUrls: ['./envios.style.scss']
})
export class EnviosComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  private readonly BASE_URL = `${environment.services.productos}/api/envios`;

  envios: Envio[] = [];
  cargando: boolean = true;
  errorMensaje: string = '';

  envioForm!: FormGroup;
  mostrarModal: boolean = false;
  editando: boolean = false;

  estadosDisponibles: EstadoEnvio[] = ['EN_ALMACEN', 'EN_CAMINO', 'ENTREGADO'];

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerEnvios();
  }

  inicializarFormulario(): void {
    this.envioForm = this.fb.group({
      idPedido: ['', [Validators.required, Validators.min(1)]],
      trackingNumber: ['', [Validators.required]],
      empresaEnvio: ['', [Validators.required]],
      estadoEnvio: ['EN_ALMACEN', [Validators.required]]
    });
  }

  obtenerEnvios(): void {
    this.http.get<Envio[]>(`${this.BASE_URL}/getAllEnvios`).subscribe({
      next: (data) => {
        this.envios = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMensaje = 'Error al cargar el registro de despachos y envíos.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscarPorCodigo(codigoStr: string): void {
    const idPedido = parseInt(codigoStr, 10);
    if (!idPedido) {
      this.obtenerEnvios();
      return;
    }

    this.cargando = true;
    this.http.get<Envio>(`${this.BASE_URL}/track/${idPedido}`).subscribe({
      next: (data) => {
        this.envios = data ? [data] : [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.envios = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalCrear(): void {
    this.editando = false;
    this.envioForm.reset({ estadoEnvio: 'EN_ALMACEN' });
    this.envioForm.get('idPedido')?.enable();
    this.mostrarModal = true;
  }

  abrirModalEditar(envio: Envio): void {
    this.editando = true;
    this.envioForm.patchValue({
      idPedido: envio.idPedido,
      trackingNumber: envio.trackingNumber,
      empresaEnvio: envio.empresaEnvio,
      estadoEnvio: envio.estadoEnvio
    });
    this.envioForm.get('idPedido')?.disable();
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.envioForm.reset();
  }

  guardarEnvio(): void {
    if (this.envioForm.invalid) {
      this.envioForm.markAllAsTouched();
      return;
    }

    const rawValues = this.envioForm.getRawValue();

    if (this.editando) {
      this.http.put(`${this.BASE_URL}/update-status?idPedido=${rawValues.idPedido}&nuevoEstado=${rawValues.estadoEnvio}`, {}, { responseType: 'text' })
        .subscribe({
          next: () => {
            this.obtenerEnvios();
            this.cerrarModal();
          },
          error: (err) => console.error(err)
        });
    } else {
      const nuevoEnvio: Envio = this.envioForm.value;
      this.http.post<Envio>(`${this.BASE_URL}/createEnvio`, nuevoEnvio).subscribe({
        next: () => {
          this.obtenerEnvios();
          this.cerrarModal();
        },
        error: (err) => console.error(err)
      });
    }
  }
}