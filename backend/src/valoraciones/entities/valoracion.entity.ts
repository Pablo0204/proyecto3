import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Reserva } from '../../reservas/entities/reserva.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('valoracion')
export class Valoracion {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Reserva, (reserva) => reserva.valoracion, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reserva_id' })
  reserva: Reserva;

  @ManyToOne(() => Usuario, (usuario) => usuario.valoraciones)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ type: 'tinyint' })
  puntuacion: number; // 1 a 5

  @Column({ type: 'text', nullable: true })
  comentario: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
