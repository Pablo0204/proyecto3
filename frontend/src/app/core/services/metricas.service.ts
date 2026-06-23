import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MetricasService {
  private readonly apiUrl = `${environment.apiUrl}/metricas`;

  constructor(private http: HttpClient) {}

  resumen(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resumen`);
  }

  ocupacionSemanal(): Observable<{ dia: number; total: number }[]> {
    return this.http.get<{ dia: number; total: number }[]>(
      `${this.apiUrl}/ocupacion-semanal`,
    );
  }

  porTipoCancha(): Observable<{ tipo: string; total: string }[]> {
    return this.http.get<{ tipo: string; total: string }[]>(
      `${this.apiUrl}/por-tipo-cancha`,
    );
  }

  ingresosPorHora(): Observable<{ hora: string; total: string }[]> {
    return this.http.get<{ hora: string; total: string }[]>(
      `${this.apiUrl}/ingresos-por-hora`,
    );
  }

  canchasMasReservadas(): Observable<{ nombre: string; totalReservas: string }[]> {
    return this.http.get<{ nombre: string; totalReservas: string }[]>(
      `${this.apiUrl}/canchas-mas-reservadas`,
    );
  }
}
