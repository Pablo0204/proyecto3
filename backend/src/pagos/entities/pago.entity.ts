import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Reserva } from '../../reservas/entities/reserva.entity';

export enum MetodoPago {
  TARJETA = 'tarjeta',
  TRANSFERENCIA = 'transferencia',
  EFECTIVO = 'efectivo',
}

export enum EstadoPago {
  PENDIENTE = 'pendiente',
  PAGADO = 'pagado',
  FALLIDO = 'fallido',
  REEMBOLSADO = 'reembolsado',
}

@Entity('pago')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Reserva, (reserva) => reserva.pago, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva;

  @Column({ type: 'decimal', precision: 10, scale: 0 })
  monto: number;

  @Column({ name: 'metodo_pago', type: 'enum', enum: MetodoPago })
  metodoPago: MetodoPago;

  @Column({
    name: 'estado_pago',
    type: 'enum',
    enum: EstadoPago,
    default: EstadoPago.PENDIENTE,
  })
  estadoPago: EstadoPago;

  @Column({ name: 'transaccion_id', length: 100, nullable: true })
  transaccionId: string;

  @CreateDateColumn({ name: 'fecha_pago' })
  fechaPago: Date;
}
