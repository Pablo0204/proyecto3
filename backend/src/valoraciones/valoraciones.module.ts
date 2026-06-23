import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValoracionesService } from './valoraciones.service';
import { ValoracionesController } from './valoraciones.controller';
import { Valoracion } from './entities/valoracion.entity';
import { Reserva } from '../reservas/entities/reserva.entity';
import { CanchasModule } from '../canchas/canchas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Valoracion, Reserva]),
    CanchasModule,
  ],
  controllers: [ValoracionesController],
  providers: [ValoracionesService],
  exports: [ValoracionesService],
})
export class ValoracionesModule {}
