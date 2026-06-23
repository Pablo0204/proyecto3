import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Reserva, EstadoReserva } from '../reservas/entities/reserva.entity';
import { Cancha } from '../canchas/entities/cancha.entity';

@Injectable()
export class MetricasService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    @InjectRepository(Cancha)
    private canchaRepository: Repository<Cancha>,
  ) {}

  /** Tarjetas resumen del dashboard */
  async resumen() {
    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0);
    const hoyFin = new Date();
    hoyFin.setHours(23, 59, 59, 999);

    const reservasHoyReal = await this.reservaRepository
      .createQueryBuilder('r')
      .where('r.createdAt BETWEEN :inicio AND :fin', {
        inicio: hoyInicio,
        fin: hoyFin,
      })
      .getCount();

    const canchasActivas = await this.canchaRepository.count({
      where: { estado: 'activa' as any },
    });
    const canchasTotal = await this.canchaRepository.count();

    const ingresosSemana = await this.reservaRepository
      .createQueryBuilder('r')
      .select('SUM(r.montoTotal)', 'total')
      .where('r.estado IN (:...estados)', {
        estados: [EstadoReserva.CONFIRMADA, EstadoReserva.COMPLETADA],
      })
      .andWhere('r.fechaInicio >= :hace7', {
        hace7: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      })
      .getRawOne();

    return {
      reservasHoy: reservasHoyReal,
      canchasActivas,
      canchasTotal,
      ingresosSemana: Number(ingresosSemana?.total ?? 0),
    };
  }

  /** Ocupación por día de la semana (0=Dom..6=Sáb) en las últimas N semanas */
  async ocupacionPorDiaSemana() {
    const reservas = await this.reservaRepository.find({
      where: { estado: Not(EstadoReserva.CANCELADA) },
    });
    const conteoPorDia = [0, 0, 0, 0, 0, 0, 0];
    reservas.forEach((r) => {
      const dia = new Date(r.fechaInicio).getDay();
      conteoPorDia[dia]++;
    });
    return conteoPorDia.map((total, dia) => ({ dia, total }));
  }

  /** Reservas agrupadas por tipo de cancha (para el gráfico tipo donut) */
  async reservasPorTipoCancha() {
    return this.reservaRepository
      .createQueryBuilder('r')
      .innerJoin('r.cancha', 'cancha')
      .innerJoin('cancha.tipoCancha', 'tipo')
      .select('tipo.nombre', 'tipo')
      .addSelect('COUNT(r.id)', 'total')
      .groupBy('tipo.nombre')
      .getRawMany();
  }

  /** Ingresos agrupados por franja horaria del día actual */
  async ingresosPorHora() {
    return this.reservaRepository
      .createQueryBuilder('r')
      .select('HOUR(r.fechaInicio)', 'hora')
      .addSelect('SUM(r.montoTotal)', 'total')
      .where('r.estado IN (:...estados)', {
        estados: [EstadoReserva.CONFIRMADA, EstadoReserva.COMPLETADA],
      })
      .groupBy('HOUR(r.fechaInicio)')
      .orderBy('hora', 'ASC')
      .getRawMany();
  }

  /** Ranking de canchas más reservadas */
  async canchasMasReservadas() {
    return this.reservaRepository
      .createQueryBuilder('r')
      .innerJoin('r.cancha', 'cancha')
      .select('cancha.nombre', 'nombre')
      .addSelect('COUNT(r.id)', 'totalReservas')
      .groupBy('cancha.id')
      .orderBy('totalReservas', 'DESC')
      .limit(5)
      .getRawMany();
  }
}
