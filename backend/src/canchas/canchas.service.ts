import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cancha } from './entities/cancha.entity';
import { CreateCanchaDto, UpdateCanchaDto } from './dto/cancha.dto';

@Injectable()
export class CanchasService {
  constructor(
    @InjectRepository(Cancha)
    private repo: Repository<Cancha>,
  ) {}

  create(dto: CreateCanchaDto) {
    const cancha = this.repo.create({
      nombre: dto.nombre,
      tipoCancha: { id: dto.tipoCanchaId } as any,
      precioHora: dto.precioHora,
      precioPeak: dto.precioPeak,
      estado: dto.estado,
      imagenUrl: dto.imagenUrl,
    });
    return this.repo.save(cancha);
  }

  findAll(tipo?: string, estado?: string) {
    const query = this.repo.createQueryBuilder('cancha')
      .leftJoinAndSelect('cancha.tipoCancha', 'tipoCancha');

    if (tipo) {
      query.andWhere('tipoCancha.nombre = :tipo', { tipo });
    }
    if (estado) {
      query.andWhere('cancha.estado = :estado', { estado });
    }
    return query.getMany();
  }

  async findOne(id: number) {
    const cancha = await this.repo.findOne({
      where: { id },
      relations: ['horariosPeak'],
    });
    if (!cancha) throw new NotFoundException('Cancha no encontrada');
    return cancha;
  }

  async update(id: number, dto: UpdateCanchaDto) {
    const cancha = await this.findOne(id);
    const { tipoCanchaId, ...resto } = dto;
    Object.assign(cancha, resto);
    if (tipoCanchaId) {
      cancha.tipoCancha = { id: tipoCanchaId } as any;
    }
    return this.repo.save(cancha);
  }

  async remove(id: number) {
    const cancha = await this.findOne(id);
    return this.repo.remove(cancha);
  }

  /** Recalcula el rating promedio de una cancha a partir de sus valoraciones */
  async actualizarRating(canchaId: number, nuevoPromedio: number) {
    await this.repo.update(canchaId, { ratingPromedio: nuevoPromedio });
  }
}
