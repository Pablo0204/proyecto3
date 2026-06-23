import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CanchasService } from '../../../core/services/canchas.service';
import { Cancha } from '../../../core/models/models';

const ICONOS: Record<string, string> = {
  Fútbol: '⚽',
  Tenis: '🎾',
  Pádel: '🏓',
  Básquetbol: '🏀',
  Vóleibol: '🏐',
};

@Component({
  selector: 'app-listado-canchas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Canchas disponibles</h1>

    <div class="filtros">
      <select [(ngModel)]="tipoSeleccionado" (ngModelChange)="cargar()">
        <option value="">Todos los deportes</option>
        <option value="Fútbol">⚽ Fútbol</option>
        <option value="Tenis">🎾 Tenis</option>
        <option value="Pádel">🏓 Pádel</option>
        <option value="Básquetbol">🏀 Básquetbol</option>
        <option value="Vóleibol">🏐 Vóleibol</option>
      </select>
    </div>

    @if (cargando()) {
      <p class="muted">Cargando canchas...</p>
    } @else if (canchas().length === 0) {
      <p class="muted">No hay canchas para este filtro.</p>
    } @else {
      <div class="grid">
        @for (cancha of canchas(); track cancha.id) {
          <div class="card" (click)="verDetalle(cancha.id)">
            <div class="card-img">
                @if (cancha.imagenUrl) {
                 <img [src]="cancha.imagenUrl" [alt]="cancha.nombre" />
                } @else {
                  {{ icono(cancha) }}
               }
            </div>
            <div class="card-body">
              <div class="card-title">{{ cancha.nombre }}</div>
              <div class="card-sub">{{ cancha.tipoCancha.nombre }}</div>
              <div class="card-price">$ {{ cancha.precioHora | number }}/hr</div>
              <div class="card-footer">
                <span class="rating">⭐ {{ cancha.ratingPromedio || 'Sin rating' }}</span>
                <span class="badge" [class]="cancha.estado">{{ etiquetaEstado(cancha.estado) }}</span>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    h1 { font-size: 22px; margin-bottom: 16px; }
    .filtros { margin-bottom: 16px; }
    select { padding: 8px 10px; border-radius: 6px; border: 1px solid #ddd; font-size: 14px; }
    .grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
    }
    .card {
      background: white; border-radius: 10px; overflow: hidden; cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08); transition: transform .15s;
    }
    .card:hover { transform: translateY(-2px); }
    .card-img {
      height: 90px; display: flex; align-items: center; justify-content: center;
      font-size: 36px; background: #eef6f1;
    }
    .card-body { padding: 12px 14px; }
    .card-title { font-weight: 600; font-size: 15px; }
    .card-sub { color: #777; font-size: 12px; margin-bottom: 6px; }
    .card-price { font-weight: 600; color: #0f6e56; margin-bottom: 8px; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
    .badge { padding: 3px 8px; border-radius: 10px; font-weight: 600; }
    .badge.activa { background: #e6f4ea; color: #1a7a3c; }
    .badge.mantencion { background: #fef3e0; color: #ba7517; }
    .badge.inactiva { background: #fdecea; color: #b3261e; }
    .muted { color: #888; }
    .card-img img { width: 100%; height: 100%; object-fit: cover; }
  `],
})
export class ListadoCanchasComponent implements OnInit {
  canchas = signal<Cancha[]>([]);
  cargando = signal(true);
  tipoSeleccionado = '';

  constructor(private canchasService: CanchasService, private router: Router) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.canchasService.listar(this.tipoSeleccionado || undefined).subscribe({
      next: (data) => {
        this.canchas.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/canchas', id]);
  }

  icono(cancha: Cancha): string {
    return ICONOS[cancha.tipoCancha?.nombre] ?? '🏟️';
  }

  etiquetaEstado(estado: string): string {
    const mapa: Record<string, string> = {
      activa: 'Disponible',
      mantencion: 'Mantención',
      inactiva: 'Inactiva',
    };
    return mapa[estado] ?? estado;
  }
}
