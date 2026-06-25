import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { AuthService } from '../../core/services/auth.service';

import {
  lucideLayoutDashboard,
  lucidePackage,
  lucideShoppingCart,
  lucideCreditCard,
  lucideBoxes,
  lucideTruck,
  lucideFactory,
  lucideLogOut,
  lucideMenu,
  lucideUsers
} from '@ng-icons/lucide';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, NgIconComponent],
  providers: [
    provideIcons({
      lucideLayoutDashboard,
      lucidePackage,
      lucideShoppingCart,
      lucideCreditCard,
      lucideBoxes,
      lucideTruck,
      lucideFactory,
      lucideLogOut,
      lucideMenu,
      lucideUsers
    })
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private auth   = inject(AuthService);
  private router = inject(Router);

  isSidebarHidden = false;
  userName = '';
  isAdmin  = false;

  ngOnInit(): void {
    // Cargar estado inicial
    this.userName = this.auth.name ?? 'Usuario';
    this.isAdmin  = this.auth.isAdmin;

    // Escuchar cambios reactivos (cuando carga el perfil async tras login)
    this.auth.name$.subscribe(n => { if (n) this.userName = n; });
    this.auth.rol$.subscribe(r => { this.isAdmin = r === 'ADMIN'; });
  }

  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  logout(): void {
    this.auth.logout(); // usa gtech_token correctamente
  }
}
