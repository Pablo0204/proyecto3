import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CanchasService } from '../../../core/services/canchas.service';
import { TiposCanchaService } from '../../../core/services/tipos-cancha.service';
import { Cancha, EstadoCancha, TipoCancha } from '../../../core/models/models';

@Component({
  selector: 'app-admin-canchas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Gestión de canchas</h1>

    <!-- ===== FORMULARIO NUEVA CANCHA ===== -->
    <div class="card-form">
      <h2>Agregar nueva cancha</h2>

      @if (errorCrear()) {
        <div class="alert-error">{{ errorCrear() }}</div>
      }
      @if (exitoCrear()) {
        <div class="alert-success">Cancha creada correctamente ✓</div>
      }

      <div class="form-grid">
        <div class="field">
          <label>Nombre</label>
          <input type="text" [(ngModel)]="nuevoNombre" placeholder="Ej: Fútbol 7 D" />
        </div>

        <div class="field">
          <label>Tipo de cancha</label>
          <select [(ngModel)]="nuevoTipoId">
            <option [ngValue]="null" disabled>Selecciona un tipo</option>
            @for (tipo of tipos(); track tipo.id) {
              <option [ngValue]="tipo.id">{{ tipo.nombre }}</option>
            }
          </select>
        </div>

        <div class="field">
          <label>Precio por hora (CLP)</label>
          <input type="number" [(ngModel)]="nuevoPrecioHora" min="0" />
        </div>

        <div class="field">
          <label>Precio horario peak (CLP)</label>
          <input type="number" [(ngModel)]="nuevoPrecioPeak" min="0" />
        </div>

        <div class="field">
          <label>Estado inicial</label>
          <select [(ngModel)]="nuevoEstado">
            <option value="activa">Activa</option>
            <option value="mantencion">Mantención</option>
            <option value="inactiva">Inactiva</option>
          </select>
        </div>

        <div class="field">
          <label>URL de imagen (opcional)</label>
          <input type="text" [(ngModel)]="nuevoImagenUrl" placeholder="https://..." />
        </div>
      </div>

      <button class="btn-primary" [disabled]="creando()" (click)="crearCancha()">
        {{ creando() ? 'Creando...' : '+ Agregar cancha' }}
      </button>
    </div>

    <!-- ===== LISTADO / EDICIÓN ===== -->
    @if (cargando()) {
      <p class="muted">Cargando...</p>
    } @else {
      <table>
        <thead>
          <tr>
            <th>Cancha</th>
            <th>Tipo</th>
            <th>Precio/hr</th>
            <th>Precio peak</th>
            <th>Estado</th>
            <th>Rating</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (c of canchas(); track c.id) {
            <tr [class.editing]="editandoId() === c.id">
              @if (editandoId() === c.id) {
                <td>{{ c.nombre }}</td>
                <td>{{ c.tipoCancha.nombre }}</td>
                <td><input type="number" [(ngModel)]="precioHoraEdit" /></td>
                <td><input type="number" [(ngModel)]="precioPeakEdit" /></td>
                <td>
                  <select [(ngModel)]="estadoEdit">
                    <option value="activa">Activa</option>
                    <option value="mantencion">Mantención</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </td>
                <td>{{ c.ratingPromedio }}</td>
                <td class="acciones">
                  <button class="btn-save" (click)="guardar(c)">Guardar</button>
                  <button class="btn-cancel" (click)="cancelarEdicion()">Cancelar</button>
                </td>
              } @else {
                <td>{{ c.nombre }}</td>
                <td>{{ c.tipoCancha.nombre }}</td>
                <td>$ {{ c.precioHora | number }}</td>
                <td>$ {{ c.precioPeak | number }}</td>
                <td><span class="badge" [class]="c.estado">{{ c.estado }}</span></td>
                <td>⭐ {{ c.ratingPromedio || '-' }}</td>
                <td class="acciones">
                  <button class="btn-edit" (click)="editar(c)">Editar</button>
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: [`
    h1 { font-size: 22px; margin-bottom: 16px; }

    .card-form {
      background: white; border-radius: 10px; padding: 20px;
      margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .card-form h2 { margin: 0 0 14px; font-size: 16px; color: #0f6e56; }
    .form-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 16px;
    }
    .field { display: flex; flex-direction: column; gap: 4px; }
    .field label { font-size: 12px; color: #666; font-weight: 600; }
    .field input, .field select {
      padding: 9px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;
    }
    .btn-primary {
      background: #0f6e56; color: white; border: none; padding: 10px 18px;
      border-radius: 7px; font-size: 14px; font-weight: 600;
    }
    .btn-primary:disabled { opacity: 0.6; }
    .alert-error { background: #fdecea; color: #b3261e; padding: 8px 10px; border-radius: 6px; font-size: 13px; margin-bottom: 12px; }
    .alert-success { background: #e6f4ea; color: #1a7a3c; padding: 8px 10px; border-radius: 6px; font-size: 13px; margin-bottom: 12px; }

    table { width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden; }
    th { text-align: left; padding: 10px 14px; background: #f4f6f8; font-size: 12px; color: #666; }
    td { padding: 8px 14px; font-size: 13px; border-top: 1px solid #eee; }
    tr.editing { background: #f0f9f5; }
    td input, td select { padding: 5px 7px; border: 1px solid #ccc; border-radius: 5px; font-size: 13px; width: 90px; }
    .badge { padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
    .badge.activa { background: #e6f4ea; color: #1a7a3c; }
    .badge.mantencion { background: #fef3e0; color: #ba7517; }
    .badge.inactiva { background: #fdecea; color: #b3261e; }
    .acciones { display: flex; gap: 6px; }
    .btn-edit, .btn-save, .btn-cancel {
      border: none; padding: 5px 10px; border-radius: 5px; font-size: 12px; cursor: pointer;
    }
    .btn-edit { background: #eef6f1; color: #0f6e56; }
    .btn-save { background: #0f6e56; color: white; }
    .btn-cancel { background: #f1f1f1; color: #555; }
    .muted { color: #888; }
  `],
})
export class AdminCanchasComponent implements OnInit {
  canchas = signal<Cancha[]>([]);
  tipos = signal<TipoCancha[]>([]);
  cargando = signal(true);
  editandoId = signal<number | null>(null);

  // edición de fila existente
  precioHoraEdit = 0;
  precioPeakEdit = 0;
  estadoEdit: EstadoCancha = 'activa';

  // formulario de nueva cancha
  nuevoNombre = '';
  nuevoTipoId: number | null = null;
  nuevoPrecioHora: number | null = null;
  nuevoPrecioPeak: number | null = null;
  nuevoEstado: EstadoCancha = 'activa';
  nuevoImagenUrl = '';
  creando = signal(false);
  errorCrear = signal<string | null>(null);
  exitoCrear = signal(false);

  constructor(
    private canchasService: CanchasService,
    private tiposCanchaService: TiposCanchaService,
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.tiposCanchaService.listar().subscribe((data) => this.tipos.set(data));
  }

  cargar(): void {
    this.cargando.set(true);
    this.canchasService.listar().subscribe({
      next: (data) => {
        this.canchas.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  crearCancha(): void {
    this.errorCrear.set(null);
    this.exitoCrear.set(false);

    if (!this.nuevoNombre.trim()) {
      this.errorCrear.set('El nombre es obligatorio');
      return;
    }
    if (!this.nuevoTipoId) {
      this.errorCrear.set('Selecciona un tipo de cancha');
      return;
    }
    if (!this.nuevoPrecioHora || !this.nuevoPrecioPeak) {
      this.errorCrear.set('Ingresa ambos precios');
      return;
    }

    this.creando.set(true);
    this.canchasService
      .crear({
        nombre: this.nuevoNombre.trim(),
        tipoCanchaId: this.nuevoTipoId,
        precioHora: this.nuevoPrecioHora,
        precioPeak: this.nuevoPrecioPeak,
        estado: this.nuevoEstado,
        imagenUrl: this.nuevoImagenUrl.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.creando.set(false);
          this.exitoCrear.set(true);
          this.limpiarFormulario();
          this.cargar();
          setTimeout(() => this.exitoCrear.set(false), 3000);
        },
        error: (err) => {
          this.creando.set(false);
          this.errorCrear.set(err.error?.message ?? 'No se pudo crear la cancha');
        },
      });
  }

  private limpiarFormulario(): void {
    this.nuevoNombre = '';
    this.nuevoTipoId = null;
    this.nuevoPrecioHora = null;
    this.nuevoPrecioPeak = null;
    this.nuevoEstado = 'activa';
    this.nuevoImagenUrl = '';
  }

  editar(c: Cancha): void {
    this.editandoId.set(c.id);
    this.precioHoraEdit = c.precioHora;
    this.precioPeakEdit = c.precioPeak;
    this.estadoEdit = c.estado;
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
  }

  guardar(c: Cancha): void {
    this.canchasService
      .actualizar(c.id, {
        precioHora: this.precioHoraEdit,
        precioPeak: this.precioPeakEdit,
        estado: this.estadoEdit,
      })
      .subscribe(() => {
        this.editandoId.set(null);
        this.cargar();
      });
  }
}
