import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  private readonly BASE_URL = `${environment.services.productos}/api/productos`;

  productosBajoStock: Producto[] = [];
  cargandoStock: boolean = true;

  ngOnInit(): void {
    this.obtenerStockCritico();
  }

  obtenerStockCritico(): void {
    this.http.get<Producto[]>(`${this.BASE_URL}/getAllProducts`).subscribe({
      next: (data) => {
        this.productosBajoStock = data.filter(p => p.stock <= 10);
        this.cargandoStock = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cargandoStock = false;
        this.cdr.detectChanges();
      }
    });
  }
}