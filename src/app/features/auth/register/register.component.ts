import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registerForm.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form = { name: '', email: '', telefono: '', direccionEnvio: '', password: '' };
  loading = false;
  errorMsg = '';
  success = false;
  showPass = false; 

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    const { name, email, telefono, direccionEnvio, password } = this.form;
    
    if (!name || !email || !password || !telefono || !direccionEnvio) { 
      this.errorMsg = 'Por favor, completa todos los campos del sistema.'; 
      return; 
    }
    
    this.loading = true; 
    this.errorMsg = '';
    this.success = false;

    this.auth.register({ name, email, telefono, direccionEnvio, password }).subscribe({
      next: () => { 
        this.loading = false; 
        this.success = true; 
        setTimeout(() => this.router.navigate(['/login']), 3500);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMsg = err.status === 409 
          ? 'Conflicto: Este correo electrónico ya se encuentra registrado.' 
          : 'Error de enlace: No se pudo conectar con el servicio de identidad.';
      }
    });
  }
}