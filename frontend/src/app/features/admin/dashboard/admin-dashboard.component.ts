import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricasService } from '../../../core/services/metricas.service';

interface BarraSemanal { dia: string; total: number; }
interface BarraTipo { tipo: string; total: number; color: string; }

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const COLORES_TIPO: Record<string, string> = {
  'Fútbol': '#1a7a3c',
  'Tenis': '#e88725',
  'Pádel': '#3b6fd4',
  'Básquetbol': '#e84c25',
  'Vóleibol': '#7c3bd4',
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Dashboard de métricas</h1>

    @if (resumen()) {
      <div class="stat-row">
        <div class="stat-box">
          <span class="label">Reservas hoy</span>
          <span class="value">{{ resumen().reservasHoy }}</span>
        </div>
        <div class="stat-box">
          <span class="label">Canchas activas</span>
          <span class="value">{{ resumen().canchasActivas }} / {{ resumen().canchasTotal }}</span>
        </div>
        <div class="stat-box">
          <span class="label">Ingresos (7 días)</span>
          <span class="value">$ {{ resumen().ingresosSemana | number }}</span>
        </div>
      </div>
    }

    <div class="chart-card">
      <h3>Ocupación por día de la semana</h3>
      <svg [attr.viewBox]="'0 0 640 200'" class="chart-svg">
        @for (b of barrasSemana(); track b.dia; let i = $index) {
          <rect
            [attr.x]="40 + i * 84"
            [attr.y]="160 - alturaBarra(b.total, maxSemana())"
            width="50"
            [attr.height]="alturaBarra(b.total, maxSemana())"
            fill="#0f6e56"
            rx="4"
          ></rect>
          <text [attr.x]="65 + i * 84" y="178" text-anchor="middle" font-size="11" fill="#666">{{ b.dia }}</text>
          <text [attr.x]="65 + i * 84" [attr.y]="152 - alturaBarra(b.total, maxSemana())" text-anchor="middle" font-size="11" fill="#222">{{ b.total }}</text>
        }
      </svg>
    </div>

    <div class="chart-card">
      <h3>Reservas por tipo de cancha</h3>
      <div class="donut-row">
        <svg viewBox="0 0 140 140" class="donut">
          @for (slice of slicesDonut(); track slice.tipo) {
            <path [attr.d]="slice.path" [attr.fill]="slice.color"></path>
          }
          <circle cx="70" cy="70" r="38" fill="white"></circle>
        </svg>
        <div class="legend">
          @for (b of barrasTipo(); track b.tipo) {
            <div class="legend-item">
              <span class="dot" [style.background]="b.color"></span>
              {{ b.tipo }} — {{ b.total }} reservas
            </div>
          }
        </div>
      </div>
    </div>

    <div class="chart-card">
      <h3>Canchas más reservadas</h3>
      <table>
        <thead><tr><th>Cancha</th><th>Reservas</th></tr></thead>
        <tbody>
          @for (c of ranking(); track c.nombre) {
            <tr>
              <td>{{ c.nombre }}</td>
              <td>{{ c.totalReservas }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    h1 { font-size: 22px; margin-bottom: 16px; }
    .stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
    .stat-box { background: white; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 4px; }
    .label { font-size: 12px; color: #888; }
    .value { font-size: 22px; font-weight: 700; color: #0f6e56; }
    .chart-card { background: white; border-radius: 10px; padding: 18px; margin-bottom: 18px; }
    .chart-card h3 { margin: 0 0 12px; font-size: 14px; color: #444; }
    .chart-svg { width: 100%; height: 180px; }
    .donut-row { display: flex; align-items: center; gap: 24px; }
    .donut { width: 140px; height: 140px; }
    .legend { display: flex; flex-direction: column; gap: 8px; font-size: 13px; }
    .legend-item { display: flex; align-items: center; gap: 6px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 8px; font-size: 12px; color: #888; }
    td { padding: 8px; font-size: 13px; border-top: 1px solid #eee; }
  `],
})
export class AdminDashboardComponent implements OnInit {
  resumen = signal<any>(null);
  barrasSemana = signal<BarraSemanal[]>([]);
  barrasTipo = signal<BarraTipo[]>([]);
  ranking = signal<{ nombre: string; totalReservas: string }[]>([]);

  maxSemana = computed(() => Math.max(1, ...this.barrasSemana().map((b) => b.total)));

  constructor(private metricasService: MetricasService) {}

  ngOnInit(): void {
    this.metricasService.resumen().subscribe((data) => this.resumen.set(data));

    this.metricasService.ocupacionSemanal().subscribe((data) => {
      this.barrasSemana.set(data.map((d) => ({ dia: DIAS[d.dia], total: d.total })));
    });

    this.metricasService.porTipoCancha().subscribe((data) => {
      this.barrasTipo.set(
        data.map((d) => ({
          tipo: d.tipo,
          total: Number(d.total),
          color: COLORES_TIPO[d.tipo] ?? '#999',
        })),
      );
    });

    this.metricasService.canchasMasReservadas().subscribe((data) => this.ranking.set(data));
  }

  alturaBarra(valor: number, max: number): number {
    return (valor / max) * 120;
  }

  /** Genera los paths del gráfico de torta/donut a partir de los porcentajes */
  slicesDonut(): { tipo: string; color: string; path: string }[] {
    const datos = this.barrasTipo();
    const total = datos.reduce((sum, d) => sum + d.total, 0);
    if (total === 0) return [];

    const cx = 70, cy = 70, r = 60;
    let anguloActual = -Math.PI / 2;
    const resultado: { tipo: string; color: string; path: string }[] = [];

    for (const d of datos) {
      const porcentaje = d.total / total;
      const anguloFinal = anguloActual + porcentaje * Math.PI * 2;

      const x1 = cx + r * Math.cos(anguloActual);
      const y1 = cy + r * Math.sin(anguloActual);
      const x2 = cx + r * Math.cos(anguloFinal);
      const y2 = cy + r * Math.sin(anguloFinal);
      const largeArc = anguloFinal - anguloActual > Math.PI ? 1 : 0;

      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      resultado.push({ tipo: d.tipo, color: d.color, path });

      anguloActual = anguloFinal;
    }
    return resultado;
  }
}
