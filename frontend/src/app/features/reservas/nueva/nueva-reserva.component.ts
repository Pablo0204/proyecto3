import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CanchasService } from '../../../core/services/canchas.service';
import { ReservasService } from '../../../core/services/reservas.service';
import { Cancha } from '../../../core/models/models';

@Component({
  selector: 'app-nueva-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    @if (cancha()) {
      <div class="breadcrumb">
        <a routerLink="/canchas">Canchas</a> ›
        <a [routerLink]="['/canchas', cancha()!.id]">{{ cancha()!.nombre }}</a> › Nueva reserva
      </div>

      <div class="card">
        <h2>Reservar {{ cancha()!.nombre }}</h2>

        @if (error()) {
          <div class="alert-error">{{ error() }}</div>
        }

        <div class="form-row">
          <div class="field">
            <label>Fecha</label>
            <input type="date" [(ngModel)]="fecha" [min]="hoy" (ngModelChange)="recalcular()" />
          </div>
          <div class="field">
            <label>Hora de inicio</label>
            <input type="time" [(ngModel)]="horaInicio" (ngModelChange)="recalcular()" />
          </div>
        </div>

        <div class="field">
          <label>Duración</label>
          <select [(ngModel)]="duracionHoras" (ngModelChange)="recalcular()">
            <option [value]="1">1 hora</option>
            <option [value]="2">2 horas</option>
            <option [value]="3">3 horas</option>
          </select>
        </div>

        <div class="resumen">
          <div class="resumen-row">
            <span>Horario</span>
            <span>{{ fecha }} {{ horaInicio }} ({{ duracionHoras }}h)</span>
          </div>
          <div class="resumen-row total">
            <span>Total estimado</span>
            <span>$ {{ montoEstimado() | number }}</span>
          </div>
        </div>

        <button class="btn-primary" [disabled]="enviando()" (click)="confirmar()">
          {{ enviando() ? 'Creando reserva...' : 'Confirmar reserva' }}
        </button>
      </div>
    }
  `,
  styles: [`
    .breadcrumb { font-size: 13px; color: #888; margin-bottom: 14px; }
    .breadcrumb a { color: #0f6e56; }
    .card { background: white; border-radius: 12px; padding: 24px; max-width: 480px; }
    h2 { margin-top: 0; font-size: 19px; }
    .form-row { display: flex; gap: 12px; }
    .field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; flex: 1; }
    label { font-size: 12px; color: #666; font-weight: 600; }
    input, select { padding: 9px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
    .resumen { background: #f4f6f8; border-radius: 8px; padding: 14px; margin: 16px 0; }
    .resumen-row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; }
    .resumen-row.total { font-weight: 700; font-size: 15px; color: #0f6e56; border-top: 1px solid #ddd; margin-top: 6px; padding-top: 10px; }
    .btn-primary {
      width: 100%; background: #0f6e56; color: white; border: none; padding: 12px;
      border-radius: 7px; font-size: 14px; font-weight: 600;
    }
    .btn-primary:disabled { opacity: 0.6; }
    .alert-error { background: #fdecea; color: #b3261e; padding: 8px 10px; border-radius: 6px; font-size: 13px; margin-bottom: 14px; }
  `],
})
export class NuevaReservaComponent implements OnInit {
  cancha = signal<Cancha | null>(null);
  enviando = signal(false);
  error = signal<string | null>(null);

  fecha = '';
  horaInicio = '18:00';
  duracionHoras = 1;
  montoEstimado = signal(0);

  hoy = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private canchasService: CanchasService,
    private reservasService: ReservasService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.fecha = this.hoy;
    this.canchasService.obtener(id).subscribe((data) => {
      this.cancha.set(data);
      this.recalcular();
    });
  }

  /** Estimación simple en el cliente; el backend recalcula y valida el precio real */
  recalcular(): void {
    const c = this.cancha();
    if (!c || !this.fecha || !this.horaInicio) return;

    const fechaHora = new Date(`${this.fecha}T${this.horaInicio}:00`);
    const dia = fechaHora.getDay();
    const esFinDeSemana = dia === 0 || dia === 6;
    const hora = fechaHora.getHours();
    const esPeakEntreSemana = !esFinDeSemana && hora >= 18 && hora < 22;
    const esPeak = esFinDeSemana || esPeakEntreSemana;

    const precioUnitario = esPeak ? c.precioPeak : c.precioHora;
    this.montoEstimado.set(Number(precioUnitario) * this.duracionHoras);
  }

  confirmar(): void {
    const c = this.cancha();
    if (!c) return;

    this.error.set(null);
    this.enviando.set(true);

    const inicio = new Date(`${this.fecha}T${this.horaInicio}:00`);
    const fin = new Date(inicio.getTime() + this.duracionHoras * 60 * 60 * 1000);

    this.reservasService
      .crear(c.id, inicio.toISOString(), fin.toISOString())
      .subscribe({
        next: (reserva) => {
          this.enviando.set(false);
          this.router.navigate(['/mis-reservas']);
        },
        error: (err) => {
          this.enviando.set(false);
          this.error.set(
            err.error?.message ?? 'No se pudo crear la reserva. Intenta otro horario.',
          );
        },
      });
  }
}
