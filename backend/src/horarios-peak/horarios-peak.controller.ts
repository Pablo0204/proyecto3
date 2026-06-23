import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HorariosPeakService } from './horarios-peak.service';
import { CreateHorarioPeakDto } from './dto/horario-peak.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('horarios-peak')
export class HorariosPeakController {
  constructor(private readonly service: HorariosPeakService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateHorarioPeakDto) {
    return this.service.create(dto);
  }

  @Get('cancha/:canchaId')
  findByCancha(@Param('canchaId') canchaId: string) {
    return this.service.findByCancha(+canchaId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
