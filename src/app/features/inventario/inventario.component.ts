import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding:2rem;font-family:'Inter',system-ui">
      <h2 style="color:#185FA5;margin-bottom:1rem">Inventario</h2>
      <p style="color:#64748b;margin-bottom:1rem">Módulo en construcción — próxima entrega.</p>
      <a routerLink="/dashboard" style="color:#185FA5;font-size:.9rem">← Volver al dashboard</a>
    </div>
  `
})
export class InventarioComponent {}
