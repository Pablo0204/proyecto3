import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Estado reactivo del usuario actual
  private usuarioSignal = signal<Usuario | null>(this.cargarUsuarioGuardado());

  readonly usuario = computed(() => this.usuarioSignal());
  readonly estaAutenticado = computed(() => !!this.usuarioSignal());
  readonly esAdmin = computed(() => this.usuarioSignal()?.rol === 'admin');

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap((res) => this.guardarSesion(res)));
  }

  register(
    nombre: string,
    email: string,
    password: string,
    telefono?: string,
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, {
        nombre,
        email,
        password,
        telefono,
      })
      .pipe(tap((res) => this.guardarSesion(res)));
  }

  logout(): void {
    localStorage.removeItem('sportpat_token');
    localStorage.removeItem('sportpat_usuario');
    this.usuarioSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('sportpat_token');
  }

  private guardarSesion(res: AuthResponse): void {
    localStorage.setItem('sportpat_token', res.access_token);
    localStorage.setItem('sportpat_usuario', JSON.stringify(res.usuario));
    this.usuarioSignal.set(res.usuario);
  }

  private cargarUsuarioGuardado(): Usuario | null {
    const raw = localStorage.getItem('sportpat_usuario');
    return raw ? JSON.parse(raw) : null;
  }
}
