import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricasService } from './metricas.service';
import { MetricasController } from './metricas.controller';
import { Reserva } from '../reservas/entities/reserva.entity';
import { Cancha } from '../canchas/entities/cancha.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Cancha])],
  controllers: [MetricasController],
  providers: [MetricasService],
})
export class MetricasModule {}
