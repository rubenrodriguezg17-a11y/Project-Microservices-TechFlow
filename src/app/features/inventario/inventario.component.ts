import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { NgIcon, NgIconComponent, provideIcons } from '@ng-icons/core'

import { 
  lucideSearch,
  lucideEdit2
} from '@ng-icons/lucide';

export interface Inventario {
  id?: number;
  idProducto: number;
  cantidad: number;
  ubicacion: string;
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule, NgIconComponent],
  providers: [
    provideIcons({ 
      lucideSearch,
      lucideEdit2
    })
  ],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.style.scss']
})
export class InventarioComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  private readonly BASE_URL = `${environment.services.productos}/api/inventario`;

  inventarios: Inventario[] = [];
  cargando: boolean = true;
  errorMensaje: string = '';

  inventarioForm!: FormGroup;
  mostrarModal: boolean = false;
  editando: boolean = false;
  inventarioIdEnEdicion?: number;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerInventarios();
  }

  inicializarFormulario(): void {
    this.inventarioForm = this.fb.group({
      idProducto: ['', [Validators.required, Validators.min(1)]],
      cantidad: ['', [Validators.required, Validators.min(0)]],
      ubicacion: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  obtenerInventarios(): void {
    this.http.get<Inventario[]>(`${this.BASE_URL}/getAll`).subscribe({
      next: (data) => {
        this.inventarios = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMensaje = 'Error al cargar los registros de inventario.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscarPorCodigo(codigoStr: string): void {
    const idProducto = parseInt(codigoStr, 10);
    if (!idProducto) {
      this.obtenerInventarios();
      return;
    }

    this.cargando = true;
    this.http.get<Inventario>(`${this.BASE_URL}/product/${idProducto}`).subscribe({
      next: (data) => {
        this.inventarios = data ? [data] : [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.inventarios = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalCrear(): void {
    this.editando = false;
    this.inventarioIdEnEdicion = undefined;
    this.inventarioForm.reset();
    this.inventarioForm.get('idProducto')?.enable();
    this.mostrarModal = true;
  }

  abrirModalEditar(item: Inventario): void {
    this.editando = true;
    this.inventarioIdEnEdicion = item.id;
    this.inventarioForm.patchValue({
      idProducto: item.idProducto,
      cantidad: item.cantidad,
      ubicacion: item.ubicacion
    });
    this.inventarioForm.get('idProducto')?.disable();
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.inventarioForm.reset();
  }

  guardarInventario(): void {
    if (this.inventarioForm.invalid) {
      this.inventarioForm.markAllAsTouched();
      return;
    }

    if (this.editando && this.inventarioIdEnEdicion) {
      const rawValues = this.inventarioForm.getRawValue();
      this.http.put(`${this.BASE_URL}/update-stock?idProducto=${rawValues.idProducto}&cantidad=${rawValues.cantidad}`, {}, { responseType: 'text' })
        .subscribe({
          next: () => {
            this.obtenerInventarios();
            this.cerrarModal();
          },
          error: (err) => console.error(err)
        });
    } else {
      const nuevoInventario: Inventario = this.inventarioForm.value;
      this.http.post<Inventario>(`${this.BASE_URL}/save`, nuevoInventario).subscribe({
        next: () => {
          this.obtenerInventarios();
          this.cerrarModal();
        },
        error: (err) => console.error(err)
      });
    }
  }
}