import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="card">
      <h2>Ingresar a sportpat</h2>

      @if (error()) {
        <div class="alert-error">{{ error() }}</div>
      }

      <form (ngSubmit)="enviar()">
        <label>Email</label>
        <input type="email" [(ngModel)]="email" name="email" required />

        <label>Contraseña</label>
        <input type="password" [(ngModel)]="password" name="password" required />

        <button type="submit" class="btn-primary" [disabled]="cargando()">
          {{ cargando() ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>

      <p class="muted">¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a></p>
    </div>
  `,
  styles: [`
    .card {
      max-width: 380px;
      margin: 40px auto;
      background: white;
      border-radius: 10px;
      padding: 28px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    h2 { margin-top: 0; font-size: 20px; }
    form { display: flex; flex-direction: column; gap: 6px; }
    label { font-size: 13px; color: #555; margin-top: 8px; }
    input {
      padding: 9px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;
    }
    .btn-primary {
      margin-top: 16px; background: #0f6e56; color: white;
      padding: 10px; border: none; border-radius: 6px; font-size: 14px; font-weight: 600;
    }
    .btn-primary:disabled { opacity: 0.6; }
    .muted { font-size: 13px; color: #777; margin-top: 16px; text-align: center; }
    .alert-error {
      background: #fdecea; color: #b3261e; padding: 8px 10px;
      border-radius: 6px; font-size: 13px; margin-bottom: 10px;
    }
  `],
})
export class LoginComponent {
  email = '';
  password = '';
  cargando = signal(false);
  error = signal<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  enviar(): void {
    this.error.set(null);
    this.cargando.set(true);
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/canchas']);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(err.error?.message ?? 'Credenciales inválidas');
      },
    });
  }
}
