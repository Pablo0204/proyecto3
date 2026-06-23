import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorariosPeakService } from './horarios-peak.service';
import { HorariosPeakController } from './horarios-peak.controller';
import { HorarioPeak } from './entities/horario-peak.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioPeak])],
  controllers: [HorariosPeakController],
  providers: [HorariosPeakService],
  exports: [HorariosPeakService],
})
export class HorariosPeakModule {}
