import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'canchas',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'canchas',
    loadComponent: () =>
      import('./features/canchas/listado/listado-canchas.component').then(
        (m) => m.ListadoCanchasComponent,
      ),
  },
  {
    path: 'canchas/:id',
    loadComponent: () =>
      import('./features/canchas/detalle/detalle-cancha.component').then(
        (m) => m.DetalleCanchaComponent,
      ),
  },
  {
    path: 'reservar/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/reservas/nueva/nueva-reserva.component').then(
        (m) => m.NuevaReservaComponent,
      ),
  },
  {
    path: 'mis-reservas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/reservas/mis-reservas/mis-reservas.component').then(
        (m) => m.MisReservasComponent,
      ),
  },
  {
    path: 'admin/dashboard',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent,
      ),
  },
  {
    path: 'admin/canchas',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/canchas/admin-canchas.component').then(
        (m) => m.AdminCanchasComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'canchas',
  },
];
