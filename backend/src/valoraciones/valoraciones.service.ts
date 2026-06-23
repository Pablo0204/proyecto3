import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Valoracion } from './entities/valoracion.entity';
import { Reserva, EstadoReserva } from '../reservas/entities/reserva.entity';
import { CanchasService } from '../canchas/canchas.service';
import { CreateValoracionDto } from './dto/valoracion.dto';

@Injectable()
export class ValoracionesService {
  constructor(
    @InjectRepository(Valoracion)
    private valoracionRepository: Repository<Valoracion>,
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    private canchasService: CanchasService,
  ) {}

  async create(usuarioId: number, dto: CreateValoracionDto) {
    const reserva = await this.reservaRepository.findOne({
      where: { id: dto.reservaId },
      relations: ['cancha', 'usuario'],
    });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');
    if (reserva.usuario.id !== usuarioId) {
      throw new BadRequestException('Solo puedes valorar tus propias reservas');
    }
    if (reserva.estado === EstadoReserva.CANCELADA) {
      throw new BadRequestException('No se puede valorar una reserva cancelada');
    }

    const valoracion = this.valoracionRepository.create({
      reserva,
      usuario: { id: usuarioId } as any,
      puntuacion: dto.puntuacion,
      comentario: dto.comentario,
    });
    const guardada = await this.valoracionRepository.save(valoracion);

    await this.recalcularPromedio(reserva.cancha.id);
    return guardada;
  }

  async recalcularPromedio(canchaId: number) {
    const valoraciones = await this.valoracionRepository
      .createQueryBuilder('valoracion')
      .innerJoin('valoracion.reserva', 'reserva')
      .where('reserva.canchaId = :canchaId', { canchaId })
      .getMany();

    if (valoraciones.length === 0) return;

    const promedio =
      valoraciones.reduce((sum, v) => sum + v.puntuacion, 0) /
      valoraciones.length;

    await this.canchasService.actualizarRating(
      canchaId,
      Math.round(promedio * 100) / 100,
    );
  }

  findByCancha(canchaId: number) {
    return this.valoracionRepository
      .createQueryBuilder('valoracion')
      .innerJoinAndSelect('valoracion.reserva', 'reserva')
      .innerJoinAndSelect('valoracion.usuario', 'usuario')
      .where('reserva.canchaId = :canchaId', { canchaId })
      .getMany();
  }
}
