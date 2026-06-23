import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/pago.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('pagos')
@UseGuards(JwtAuthGuard)
export class PagosController {
  constructor(private readonly service: PagosService) {}

  @Post()
  create(@Body() dto: CreatePagoDto) {
    return this.service.create(dto);
  }

  @Get('reserva/:reservaId')
  findByReserva(@Param('reservaId') reservaId: string) {
    return this.service.findByReserva(+reservaId);
  }
}
