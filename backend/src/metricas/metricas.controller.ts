import { Controller, Get, UseGuards } from '@nestjs/common';
import { MetricasService } from './metricas.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('metricas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class MetricasController {
  constructor(private readonly service: MetricasService) {}

  @Get('resumen')
  resumen() {
    return this.service.resumen();
  }

  @Get('ocupacion-semanal')
  ocupacionPorDiaSemana() {
    return this.service.ocupacionPorDiaSemana();
  }

  @Get('por-tipo-cancha')
  reservasPorTipoCancha() {
    return this.service.reservasPorTipoCancha();
  }

  @Get('ingresos-por-hora')
  ingresosPorHora() {
    return this.service.ingresosPorHora();
  }

  @Get('canchas-mas-reservadas')
  canchasMasReservadas() {
    return this.service.canchasMasReservadas();
  }
}
