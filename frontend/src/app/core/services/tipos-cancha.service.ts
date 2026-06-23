import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TipoCancha } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TiposCanchaService {
  private readonly apiUrl = `${environment.apiUrl}/tipos-cancha`;

  constructor(private http: HttpClient) {}

  listar(): Observable<TipoCancha[]> {
    return this.http.get<TipoCancha[]>(this.apiUrl);
  }
}
