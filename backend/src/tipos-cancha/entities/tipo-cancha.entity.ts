import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cancha } from '../../canchas/entities/cancha.entity';

@Entity('tipo_cancha')
export class TipoCancha {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string; // Fútbol, Tenis, Pádel, Básquetbol, Vóleibol

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'jugadores_max', type: 'int', default: 2 })
  jugadoresMax: number;

  @OneToMany(() => Cancha, (cancha) => cancha.tipoCancha)
  canchas: Cancha[];
}
