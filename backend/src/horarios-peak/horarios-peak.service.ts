import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioPeak } from './entities/horario-peak.entity';
import { CreateHorarioPeakDto } from './dto/horario-peak.dto';

@Injectable()
export class HorariosPeakService {
  constructor(
    @InjectRepository(HorarioPeak)
    private repo: Repository<HorarioPeak>,
  ) {}

  create(dto: CreateHorarioPeakDto) {
    const horario = this.repo.create({
      cancha: { id: dto.canchaId } as any,
      diaSemana: dto.diaSemana,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
    });
    return this.repo.save(horario);
  }

  findByCancha(canchaId: number) {
    return this.repo.find({ where: { cancha: { id: canchaId } } });
  }

  async remove(id: number) {
    const horario = await this.repo.findOne({ where: { id } });
    if (!horario) throw new NotFoundException('Horario no encontrado');
    return this.repo.remove(horario);
  }

  /** Determina si una fecha/hora cae dentro de un horario peak configurado para la cancha */
  async esHorarioPeak(canchaId: number, fecha: Date): Promise<boolean> {
    const horarios = await this.findByCancha(canchaId);
    const dia = fecha.getDay();
    const horaStr = fecha.toTimeString().substring(0, 5);

    return horarios.some(
      (h) =>
        h.diaSemana === dia &&
        horaStr >= h.horaInicio.substring(0, 5) &&
        horaStr < h.horaFin.substring(0, 5),
    );
  }
}
