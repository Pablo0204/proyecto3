import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cancha } from '../../canchas/entities/cancha.entity';

@Entity('horario_peak')
export class HorarioPeak {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cancha, (cancha) => cancha.horariosPeak, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cancha_id' })
  cancha: Cancha;

  // 0 = Domingo ... 6 = Sábado
  @Column({ name: 'dia_semana', type: 'tinyint' })
  diaSemana: number;

  @Column({ name: 'hora_inicio', type: 'time' })
  horaInicio: string;

  @Column({ name: 'hora_fin', type: 'time' })
  horaFin: string;
}
