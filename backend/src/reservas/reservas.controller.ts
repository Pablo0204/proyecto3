import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto, UpdateReservaDto } from './dto/reserva.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { EstadoReserva } from './entities/reserva.entity';

@Controller('reservas')
@UseGuards(JwtAuthGuard)
export class ReservasController {
  constructor(private readonly service: ReservasService) {}

  @Post()
  create(@CurrentUser() user, @Body() dto: CreateReservaDto) {
    return this.service.create(user.id, dto);
  }

  // GET /reservas -> admin ve todas, cliente ve solo las suyas
  @Get()
  findAll(@CurrentUser() user, @Query('estado') estado?: EstadoReserva) {
    const usuarioId = user.rol === 'admin' ? undefined : user.id;
    return this.service.findAll(usuarioId, estado);
  }

  // GET /reservas/disponibilidad?canchaId=1&desde=2026-06-16&hasta=2026-06-22
  @Get('disponibilidad')
  disponibilidad(
    @Query('canchaId') canchaId: string,
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    return this.service.disponibilidad(+canchaId, desde, hasta);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id') id: string, @CurrentUser() user) {
    return this.service.cancelar(+id, user.id, user.rol === 'admin');
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'encargado')
  update(@Param('id') id: string, @Body() dto: UpdateReservaDto) {
    return this.service.update(+id, dto);
  }
}
