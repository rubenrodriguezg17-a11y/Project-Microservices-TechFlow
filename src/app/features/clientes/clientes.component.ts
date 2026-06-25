import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../core/services/microservices.service';
import { Cliente } from '../../core/models/models';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.style.scss']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading = true;
    this.clienteService.getAll().subscribe({
      next: (data) => { this.clientes = data; this.loading = false; },
      error: () => { this.errorMsg = 'Error al cargar clientes.'; this.loading = false; }
    });
  }

  cambiarRol(cliente: Cliente, nuevoRol: string): void {
    if (!cliente.idCliente) return;
    this.clienteService.cambiarRol(cliente.idCliente, nuevoRol).subscribe({
      next: () => {
        cliente.rol = nuevoRol as 'CLIENTE' | 'ADMIN';
        this.successMsg = `Rol de ${cliente.name ?? 'usuario'} cambiado a ${nuevoRol}.`;
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.errorMsg = 'Error al cambiar el rol.'; }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este cliente?')) return;
    this.clienteService.delete(id).subscribe({
      next: () => {
        this.clientes = this.clientes.filter(c => c.idCliente !== id);
        this.successMsg = 'Cliente eliminado.';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.errorMsg = 'Error al eliminar el cliente.'; }
    });
  }
}
