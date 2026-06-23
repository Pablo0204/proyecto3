import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="brand"> SportPat</a>

      <div class="links">
        <a routerLink="/canchas" routerLinkActive="active">Canchas</a>

        @if (auth.estaAutenticado()) {
          <a routerLink="/mis-reservas" routerLinkActive="active">Mis reservas</a>
        }

        @if (auth.esAdmin()) {
          <a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/admin/canchas" routerLinkActive="active">Gestionar canchas</a>
        }
      </div>

      <div class="auth-area">
        @if (auth.estaAutenticado()) {
          <span class="user-chip">👤 {{ auth.usuario()?.nombre }}</span>
          <button class="btn-ghost" (click)="cerrarSesion()">Salir</button>
        } @else {
          <a routerLink="/login" class="btn-primary">Ingresar</a>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 12px 24px;
      background: #0f6e56;
      color: white;
    }
    .brand { font-weight: 600; font-size: 18px; color: white; }
    .links { display: flex; gap: 16px; flex: 1; }
    .links a { color: rgba(255,255,255,0.85); font-size: 14px; padding: 4px 0; }
    .links a.active { color: white; font-weight: 600; border-bottom: 2px solid white; }
    .auth-area { display: flex; align-items: center; gap: 10px; }
    .user-chip { font-size: 13px; opacity: 0.9; }
    .btn-primary {
      background: white; color: #0f6e56; padding: 6px 14px;
      border-radius: 6px; font-size: 13px; font-weight: 600;
    }
    .btn-ghost {
      background: transparent; border: 1px solid rgba(255,255,255,0.4);
      color: white; padding: 6px 14px; border-radius: 6px; font-size: 13px;
    }
  `],
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}

  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
