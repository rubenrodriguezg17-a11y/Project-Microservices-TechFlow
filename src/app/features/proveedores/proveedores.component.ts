import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

export interface Proveedor {
  id?: number;
  nombre: string;
  contacto: string;
  ruc: string;
  activo: boolean;
}

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.style.scss']
})
export class ProveedoresComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  private readonly BASE_URL = `${environment.services.productos}/api/proveedores`;

  proveedores: Proveedor[] = [];
  cargando: boolean = true;
  errorMensaje: string = '';

  proveedorForm!: FormGroup;
  mostrarModal: boolean = false;
  editando: boolean = false;
  proveedorIdEnEdicion?: number;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerProveedores();
  }

  inicializarFormulario(): void {
    this.proveedorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      ruc: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      contacto: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      activo: [true]
    });
  }

  obtenerProveedores(): void {
    this.http.get<Proveedor[]>(`${this.BASE_URL}/getAllVendors`).subscribe({
      next: (data) => {
        this.proveedores = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMensaje = 'Error al cargar los proveedores desde el Gateway.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalCrear(): void {
    this.editando = false;
    this.proveedorIdEnEdicion = undefined;
    this.proveedorForm.reset({ activo: true });
    this.mostrarModal = true;
  }

  abrirModalEditar(proveedor: Proveedor): void {
    this.editando = true;
    this.proveedorIdEnEdicion = proveedor.id;
    this.proveedorForm.patchValue({
      nombre: proveedor.nombre,
      ruc: proveedor.ruc,
      contacto: proveedor.contacto,
      activo: proveedor.activo
    });
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.proveedorForm.reset();
  }

  guardarProveedor(): void {
    if (this.proveedorForm.invalid) {
      this.proveedorForm.markAllAsTouched();
      return;
    }

    const proveedorData: Proveedor = this.proveedorForm.value;

    if (this.editando && this.proveedorIdEnEdicion) {
      this.http.put(`${this.BASE_URL}/updateVendor/${this.proveedorIdEnEdicion}`, proveedorData, { responseType: 'text' })
        .subscribe({
          next: () => {
            this.obtenerProveedores();
            this.cerrarModal();
          },
          error: (err) => console.error(err)
        });
    } else {
      this.http.post<Proveedor>(`${this.BASE_URL}/createVendor`, proveedorData).subscribe({
        next: () => {
          this.obtenerProveedores();
          this.cerrarModal();
        },
        error: (err) => console.error(err)
      });
    }
  }

  eliminarProveedor(id?: number): void {
    if (!id) return;

    const confirmar = confirm('¿Estás seguro de eliminar este proveedor?');
    if (confirmar) {
      this.http.delete(`${this.BASE_URL}/deleteVendor/${id}`, { responseType: 'text' })
        .subscribe({
          next: () => {
            this.obtenerProveedores();
            this.cdr.detectChanges();
          },
          error: (err) => console.error(err)
        });
    }
  }
}