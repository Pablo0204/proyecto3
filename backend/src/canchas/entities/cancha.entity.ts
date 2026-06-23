import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { TipoCancha } from '../../tipos-cancha/entities/tipo-cancha.entity';
import { Reserva } from '../../reservas/entities/reserva.entity';
import { HorarioPeak } from '../../horarios-peak/entities/horario-peak.entity';

export enum EstadoCancha {
  ACTIVA = 'activa',
  MANTENCION = 'mantencion',
  INACTIVA = 'inactiva',
}

@Entity('cancha')
export class Cancha {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @ManyToOne(() => TipoCancha, (tipo) => tipo.canchas, { eager: true })
  @JoinColumn({ name: 'tipo_cancha_id' })
  tipoCancha: TipoCancha;

  @Column({ name: 'precio_hora', type: 'decimal', precision: 10, scale: 0 })
  precioHora: number;

  @Column({ name: 'precio_peak', type: 'decimal', precision: 10, scale: 0 })
  precioPeak: number;

  @Column({ type: 'enum', enum: EstadoCancha, default: EstadoCancha.ACTIVA })
  estado: EstadoCancha;

  @Column({ name: 'imagen_url', length: 255, nullable: true })
  imagenUrl: string;

  @Column({
    name: 'rating_promedio',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0,
  })
  ratingPromedio: number;

  @OneToMany(() => Reserva, (reserva) => reserva.cancha)
  reservas: Reserva[];

  @OneToMany(() => HorarioPeak, (horario) => horario.cancha)
  horariosPeak: HorarioPeak[];
}
