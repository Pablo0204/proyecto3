import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCancha } from './entities/tipo-cancha.entity';
import { CreateTipoCanchaDto, UpdateTipoCanchaDto } from './dto/tipo-cancha.dto';

@Injectable()
export class TiposCanchaService {
  constructor(
    @InjectRepository(TipoCancha)
    private repo: Repository<TipoCancha>,
  ) {}

  create(dto: CreateTipoCanchaDto) {
    const tipo = this.repo.create(dto);
    return this.repo.save(tipo);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const tipo = await this.repo.findOne({ where: { id } });
    if (!tipo) throw new NotFoundException('Tipo de cancha no encontrado');
    return tipo;
  }

  async update(id: number, dto: UpdateTipoCanchaDto) {
    const tipo = await this.findOne(id);
    Object.assign(tipo, dto);
    return this.repo.save(tipo);
  }

  async remove(id: number) {
    const tipo = await this.findOne(id);
    return this.repo.remove(tipo);
  }
}
