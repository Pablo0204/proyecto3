import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiposCanchaService } from './tipos-cancha.service';
import { TiposCanchaController } from './tipos-cancha.controller';
import { TipoCancha } from './entities/tipo-cancha.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoCancha])],
  controllers: [TiposCanchaController],
  providers: [TiposCanchaService],
  exports: [TiposCanchaService],
})
export class TiposCanchaModule {}
