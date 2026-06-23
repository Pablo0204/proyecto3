import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reserva } from '../../reservas/entities/reserva.entity';
import { Valoracion } from '../../valoraciones/entities/valoracion.entity';

export enum RolUsuario {
  CLIENTE = 'cliente',
  ADMIN = 'admin',
  ENCARGADO = 'encargado',
}

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ name: 'password_hash', length: 255, select: false })
  passwordHash: string;

  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.CLIENTE })
  rol: RolUsuario;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Reserva, (reserva) => reserva.usuario)
  reservas: Reserva[];

  @OneToMany(() => Valoracion, (valoracion) => valoracion.usuario)
  valoraciones: Valoracion[];
}
