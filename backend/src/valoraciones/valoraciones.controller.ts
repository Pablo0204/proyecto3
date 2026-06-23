import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ValoracionesService } from './valoraciones.service';
import { CreateValoracionDto } from './dto/valoracion.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('valoraciones')
export class ValoracionesController {
  constructor(private readonly service: ValoracionesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user, @Body() dto: CreateValoracionDto) {
    return this.service.create(user.id, dto);
  }

  @Get('cancha/:canchaId')
  findByCancha(@Param('canchaId') canchaId: string) {
    return this.service.findByCancha(+canchaId);
  }
}
