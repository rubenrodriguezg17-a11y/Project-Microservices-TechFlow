import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';
  successMsg = '';
  showPass = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.successMsg = '¡Registro exitoso! Ya puedes iniciar sesión con tus credenciales.';
      }
    });
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMsg = 'Completa todos los campos.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard'])
          .then((navigated) => {
            if (!navigated) {
              this.loading = false;
              this.errorMsg = 'El acceso al panel fue denegado.';
            }
          })
          .catch(() => {
            this.loading = false;
            this.errorMsg = 'Error al renderizar el Dashboard.';
          });
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMsg = err.status === 401
          ? 'Credenciales incorrectas. Verifica tu email y contraseña.'
          : 'Error al conectar con el servidor. Intenta más tarde.';
      }
    });
  }
}