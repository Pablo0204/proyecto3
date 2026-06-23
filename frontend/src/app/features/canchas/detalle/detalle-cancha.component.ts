import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CanchasService } from '../../../core/services/canchas.service';
import { Cancha } from '../../../core/models/models';

@Component({
  selector: 'app-detalle-cancha',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (cargando()) {
      <p class="muted">Cargando...</p>
    } @else if (cancha()) {
      <div class="breadcrumb">
        <a routerLink="/canchas">Canchas</a> › {{ cancha()!.nombre }}
      </div>

      <div class="detalle">
        <div class="hero">{{ icono() }}</div>

        <div class="info">
          <h1>{{ cancha()!.nombre }}</h1>
          <p class="tipo">{{ cancha()!.tipoCancha.nombre }} · hasta {{ cancha()!.tipoCancha.jugadoresMax }} jugadores</p>

          <div class="stats">
            <div class="stat">
              <span class="label">Precio normal</span>
              <span class="value">$ {{ cancha()!.precioHora | number }}/hr</span>
            </div>
            <div class="stat">
              <span class="label">Precio horario peak</span>
              <span class="value">$ {{ cancha()!.precioPeak | number }}/hr</span>
            </div>
            <div class="stat">
              <span class="label">Rating</span>
              <span class="value">⭐ {{ cancha()!.ratingPromedio || 'Sin calificar' }}</span>
            </div>
            <div class="stat">
              <span class="label">Estado</span>
              <span class="value badge" [class]="cancha()!.estado">{{ cancha()!.estado }}</span>
            </div>
          </div>

          <button
            class="btn-primary"
            [disabled]="cancha()!.estado !== 'activa'"
            (click)="reservar()"
          >
            Reservar esta cancha
          </button>
        </div>
      </div>
    } @else {
      <p class="muted">Cancha no encontrada.</p>
    }
  `,
  styles: [`
    .breadcrumb { font-size: 13px; color: #888; margin-bottom: 14px; }
    .breadcrumb a { color: #0f6e56; }
    .detalle { display: flex; gap: 24px; background: white; border-radius: 12px; padding: 24px; }
    .hero {
      width: 200px; height: 160px; border-radius: 10px; background: #eef6f1;
      display: flex; align-items: center; justify-content: center; font-size: 64px; flex-shrink: 0;
    }
    h1 { margin: 0 0 4px; font-size: 22px; }
    .tipo { color: #777; margin: 0 0 16px; font-size: 14px; }
    .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
    .stat { display: flex; flex-direction: column; gap: 2px; }
    .label { font-size: 12px; color: #999; }
    .value { font-size: 15px; font-weight: 600; }
    .badge { padding: 2px 8px; border-radius: 10px; font-size: 12px; width: fit-content; }
    .badge.activa { background: #e6f4ea; color: #1a7a3c; }
    .badge.mantencion { background: #fef3e0; color: #ba7517; }
    .badge.inactiva { background: #fdecea; color: #b3261e; }
    .btn-primary {
      background: #0f6e56; color: white; border: none; padding: 11px 20px;
      border-radius: 7px; font-size: 14px; font-weight: 600;
    }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .muted { color: #888; }
  `],
})
export class DetalleCanchaComponent implements OnInit {
  cancha = signal<Cancha | null>(null);
  cargando = signal(true);

  private readonly iconos: Record<string, string> = {
    Fútbol: '⚽',
    Tenis: '🎾',
    Pádel: '🏓',
    Básquetbol: '🏀',
    Vóleibol: '🏐',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private canchasService: CanchasService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.canchasService.obtener(id).subscribe({
      next: (data) => {
        this.cancha.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  icono(): string {
    return this.iconos[this.cancha()?.tipoCancha?.nombre ?? ''] ?? '🏟️';
  }

  reservar(): void {
    this.router.navigate(['/reservar', this.cancha()!.id]);
  }
}
