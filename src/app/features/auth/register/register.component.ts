import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/models';   // ← corregido
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  payload: RegisterRequest = {
    name: '',
    email: '',
    direccionEnvio: '',
    telefono: '',
    password: ''
  };

  loading  = false;
  errorMsg = '';
  showPass = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.payload.name || !this.payload.email || !this.payload.password) {
      this.errorMsg = 'Por favor, completa los campos obligatorios.';
      return;
    }

    this.loading  = true;
    this.errorMsg = '';

    this.auth.register(this.payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      },
      error: (err: HttpErrorResponse) => {
        this.loading  = false;
        this.errorMsg = err.status === 400
          ? 'Los datos ingresados no son válidos o el correo ya existe.'
          : 'Error al conectar con el servidor de registro.';
      }
    });
  }
}
