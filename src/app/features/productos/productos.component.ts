import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { environment } from '../../../environments/environment';

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule], 
  templateUrl: './productos.component.html',
  styleUrls: ['./productos-list.component.scss']
})
export class ProductosComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  private readonly BASE_URL = `${environment.services.productos}/api/productos`;

  // Variables de Estado
  productos: Producto[] = [];
  cargando: boolean = true;
  errorMensaje: string = '';

  // Variables para el Modal y Formulario de editar y crear
  productoForm!: FormGroup;
  mostrarModal: boolean = false;
  editando: boolean = false;
  productoId?: number;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerProductos();
  }

  inicializarFormulario(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required]],
      precio: [0, [Validators.required, Validators.min(0.1)]]
    });
  }

  obtenerProductos(): void {
    this.http.get<Producto[]>(`${this.BASE_URL}/getAllProducts`).subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMensaje = 'Error al cargar los productos.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  buscarPorCodigo(codigoStr: string): void {
  const codigo = parseInt(codigoStr, 10);
  if (!codigo) {
    this.obtenerProductos(); 
    return;
  }

  this.cargando = true;

  this.http.get<any>(`${this.BASE_URL}/obtenerProductoId/{codigo}`).subscribe({
    next: (data) => {
      this.productos = data ? [data] : [];
      this.cargando = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
      this.productos = [];
      this.errorMensaje = 'No se encontró ningún registro con ese código.';
      this.cargando = false;
      this.cdr.detectChanges();
    }
  });
} 

  abrirModalCrear(): void {
    this.editando = false;
    this.productoId = undefined;
    this.productoForm.reset({ precio: 0 });
    this.mostrarModal = true;
  }

  abrirModalEditar(producto: Producto): void {
    this.editando = true;
    this.productoId = producto.id;
    this.productoForm.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio
    });
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.productoForm.reset();
  }

  // FORMULARIO (GUARDAR / ACTUALIZAR) 
  guardarProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const productoData: Producto = this.productoForm.value;

    if (this.editando && this.productoId) {
      this.http.put<Producto>(`${this.BASE_URL}/updateProduct/${this.productoId}`, productoData,{ responseType: 'text' })
        .subscribe({
          next: () => {
            this.obtenerProductos(); 
            this.cerrarModal();
          },
          error: (err) => console.error('Error al actualizar:', err)
        });
    } else {
      this.http.post<Producto>(`${this.BASE_URL}/createProduct`, productoData)
        .subscribe({
          next: () => {
            this.obtenerProductos(); 
            this.cerrarModal();
          },
          error: (err) => console.error('Error al guardar:', err)
        });
    }
  }
  eliminarProducto(id?: number): void {
  if (!id) return;

  const confirmar = confirm('¿Estás seguro de que deseas eliminar este producto?');
  
  if (confirmar) {
    this.http.delete(`${this.BASE_URL}/deleteProduct/${id}`, { responseType: 'text' })
      .subscribe({
        next: (respuesta) => {
          console.log('Producto eliminado:', respuesta);
          this.obtenerProductos(); // Recarga la tabla con los datos frescos
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al eliminar el producto:', err);
          alert('No se pudo eliminar el producto. Verifica si está asociado a un pedido.');
        }
      });
  }
}
}
