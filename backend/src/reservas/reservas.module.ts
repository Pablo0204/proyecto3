import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { Reserva } from './entities/reserva.entity';
import { Cancha } from '../canchas/entities/cancha.entity';
import { HorariosPeakModule } from '../horarios-peak/horarios-peak.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva, Cancha]),
    HorariosPeakModule,
  ],
  controllers: [ReservasController],
  providers: [ReservasService],
  exports: [ReservasService],
})
export class ReservasModule {}
