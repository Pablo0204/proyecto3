import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reserva } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private readonly apiUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) {}

  crear(canchaId: number, fechaInicio: string, fechaFin: string): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, {
      canchaId,
      fechaInicio,
      fechaFin,
    });
  }

  misReservas(estado?: string): Observable<Reserva[]> {
    const params: Record<string, string> = {};
    if (estado) params['estado'] = estado;
    return this.http.get<Reserva[]>(this.apiUrl, { params });
  }

  obtener(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`);
  }

  disponibilidad(canchaId: number, desde: string, hasta: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/disponibilidad`, {
      params: { canchaId, desde, hasta },
    });
  }

  cancelar(id: number): Observable<Reserva> {
    return this.http.patch<Reserva>(`${this.apiUrl}/${id}/cancelar`, {});
  }
}
