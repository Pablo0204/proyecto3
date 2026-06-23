import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Cancha } from '../../canchas/entities/cancha.entity';
import { Pago } from '../../pagos/entities/pago.entity';
import { Valoracion } from '../../valoraciones/entities/valoracion.entity';

export enum EstadoReserva {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
  COMPLETADA = 'completada',
}

@Entity('reserva')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.reservas)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Cancha, (cancha) => cancha.reservas, { eager: true })
  @JoinColumn({ name: 'cancha_id' })
  cancha: Cancha;

  @Column({ name: 'fecha_inicio', type: 'datetime' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'datetime' })
  fechaFin: Date;

  @Column({
    type: 'enum',
    enum: EstadoReserva,
    default: EstadoReserva.PENDIENTE,
  })
  estado: EstadoReserva;

  @Column({ name: 'monto_total', type: 'decimal', precision: 10, scale: 0 })
  montoTotal: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Pago, (pago) => pago.reserva)
  pago: Pago;

  @OneToOne(() => Valoracion, (valoracion) => valoracion.reserva)
  valoracion: Valoracion;
}
