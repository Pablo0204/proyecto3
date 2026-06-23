import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cancha } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CanchasService {
  private readonly apiUrl = `${environment.apiUrl}/canchas`;

  constructor(private http: HttpClient) {}

  listar(tipo?: string, estado?: string): Observable<Cancha[]> {
    const params: Record<string, string> = {};
    if (tipo) params['tipo'] = tipo;
    if (estado) params['estado'] = estado;
    return this.http.get<Cancha[]>(this.apiUrl, { params });
  }

  obtener(id: number): Observable<Cancha> {
    return this.http.get<Cancha>(`${this.apiUrl}/${id}`);
  }

  crear(cancha: Partial<Cancha> & { tipoCanchaId: number }): Observable<Cancha> {
    return this.http.post<Cancha>(this.apiUrl, cancha);
  }

  actualizar(id: number, cambios: Partial<Cancha>): Observable<Cancha> {
    return this.http.patch<Cancha>(`${this.apiUrl}/${id}`, cambios);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
