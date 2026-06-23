import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not } from 'typeorm';
import { Reserva, EstadoReserva } from './entities/reserva.entity';
import { Cancha } from '../canchas/entities/cancha.entity';
import { CreateReservaDto, UpdateReservaDto } from './dto/reserva.dto';
import { HorariosPeakService } from '../horarios-peak/horarios-peak.service';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    @InjectRepository(Cancha)
    private canchaRepository: Repository<Cancha>,
    private horariosPeakService: HorariosPeakService,
  ) {}

  async create(usuarioId: number, dto: CreateReservaDto) {
    const cancha = await this.canchaRepository.findOne({
      where: { id: dto.canchaId },
    });
    if (!cancha) throw new NotFoundException('Cancha no encontrada');

    const inicio = new Date(dto.fechaInicio);
    const fin = new Date(dto.fechaFin);

    if (inicio >= fin) {
      throw new BadRequestException(
        'La fecha de inicio debe ser anterior a la fecha de fin',
      );
    }
    if (inicio < new Date()) {
      throw new BadRequestException('No se puede reservar en el pasado');
    }

    const traslapo = await this.reservaRepository
      .createQueryBuilder('reserva')
      .where('reserva.cancha_id = :canchaId', { canchaId: dto.canchaId })
      .andWhere('reserva.estado IN (:...estados)', {
        estados: [EstadoReserva.PENDIENTE, EstadoReserva.CONFIRMADA],
      })
      .andWhere('reserva.fechaInicio < :fin AND reserva.fechaFin > :inicio', {
        inicio,
        fin,
      })
      .getOne();

    if (traslapo) {
      throw new ConflictException(
        'La cancha ya está reservada en ese horario',
      );
    }

    const esPeak = await this.horariosPeakService.esHorarioPeak(
      cancha.id,
      inicio,
    );
    const horas =
      (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
    const precioUnitario = esPeak ? cancha.precioPeak : cancha.precioHora;
    const montoTotal = Number(precioUnitario) * horas;

    const reserva = this.reservaRepository.create({
      usuario: { id: usuarioId } as any,
      cancha,
      fechaInicio: inicio,
      fechaFin: fin,
      estado: EstadoReserva.PENDIENTE,
      montoTotal,
    });

    return this.reservaRepository.save(reserva);
  }

  findAll(usuarioId?: number, estado?: EstadoReserva) {
    const query = this.reservaRepository
      .createQueryBuilder('reserva')
      .leftJoinAndSelect('reserva.cancha', 'cancha')
      .leftJoinAndSelect('cancha.tipoCancha', 'tipoCancha')
      .leftJoinAndSelect('reserva.usuario', 'usuario');

    if (usuarioId) {
      query.andWhere('usuario.id = :usuarioId', { usuarioId });
    }
    if (estado) {
      query.andWhere('reserva.estado = :estado', { estado });
    }
    return query.orderBy('reserva.fechaInicio', 'DESC').getMany();
  }

  async findOne(id: number) {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
      relations: ['cancha', 'cancha.tipoCancha', 'usuario', 'pago'],
    });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');
    return reserva;
  }

  async disponibilidad(canchaId: number, desde: string, hasta: string) {
    const reservas = await this.reservaRepository.find({
      where: {
        cancha: { id: canchaId },
        fechaInicio: Between(new Date(desde), new Date(hasta)),
        estado: Not(EstadoReserva.CANCELADA),
      },
      select: ['id', 'fechaInicio', 'fechaFin', 'estado'],
    });
    return reservas;
  }

  async cancelar(id: number, usuarioId: number, esAdmin: boolean) {
    const reserva = await this.findOne(id);

    if (!esAdmin && reserva.usuario.id !== usuarioId) {
      throw new ForbiddenException('No puedes cancelar esta reserva');
    }

    const horasRestantes =
      (new Date(reserva.fechaInicio).getTime() - Date.now()) /
      (1000 * 60 * 60);
    if (horasRestantes < 24 && !esAdmin) {
      throw new BadRequestException(
        'Solo se puede cancelar con al menos 24 horas de anticipación',
      );
    }

    reserva.estado = EstadoReserva.CANCELADA;
    return this.reservaRepository.save(reserva);
  }

  async update(id: number, dto: UpdateReservaDto) {
    const reserva = await this.findOne(id);
    Object.assign(reserva, dto);
    return this.reservaRepository.save(reserva);
  }
}
