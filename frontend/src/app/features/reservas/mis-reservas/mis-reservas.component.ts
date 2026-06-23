import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../../core/services/reservas.service';
import { Reserva } from '../../../core/models/models';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Mis reservas</h1>

    @if (cargando()) {
      <p class="muted">Cargando reservas...</p>
    } @else if (reservas().length === 0) {
      <p class="muted">Aún no tienes reservas.</p>
    } @else {
      <table>
        <thead>
          <tr>
            <th>Cancha</th>
            <th>Fecha</th>
            <th>Horario</th>
            <th>Monto</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (r of reservas(); track r.id) {
            <tr>
              <td>{{ r.cancha.nombre }}</td>
              <td>{{ r.fechaInicio | date: 'dd/MM/yyyy' }}</td>
              <td>{{ r.fechaInicio | date: 'HH:mm' }} - {{ r.fechaFin | date: 'HH:mm' }}</td>
              <td>$ {{ r.montoTotal | number }}</td>
              <td><span class="badge" [class]="r.estado">{{ r.estado }}</span></td>
              <td>
                @if (r.estado === 'pendiente' || r.estado === 'confirmada') {
                  <button class="btn-link" (click)="cancelar(r.id)">Cancelar</button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: [`
    h1 { font-size: 22px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden; }
    th { text-align: left; padding: 10px 14px; background: #f4f6f8; font-size: 12px; color: #666; }
    td { padding: 10px 14px; font-size: 13px; border-top: 1px solid #eee; }
    .badge { padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
    .badge.pendiente { background: #fef3e0; color: #ba7517; }
    .badge.confirmada { background: #e6f4ea; color: #1a7a3c; }
    .badge.cancelada { background: #fdecea; color: #b3261e; }
    .badge.completada { background: #e8eaf6; color: #3949ab; }
    .btn-link { background: none; border: none; color: #b3261e; font-size: 12px; cursor: pointer; }
    .muted { color: #888; }
  `],
})
export class MisReservasComponent implements OnInit {
  reservas = signal<Reserva[]>([]);
  cargando = signal(true);

  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.reservasService.misReservas().subscribe({
      next: (data) => {
        this.reservas.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  cancelar(id: number): void {
    if (!confirm('¿Seguro que deseas cancelar esta reserva?')) return;
    this.reservasService.cancelar(id).subscribe(() => this.cargar());
  }
}
