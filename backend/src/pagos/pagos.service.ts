import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago, EstadoPago } from './entities/pago.entity';
import { Reserva, EstadoReserva } from '../reservas/entities/reserva.entity';
import { CreatePagoDto } from './dto/pago.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private pagoRepository: Repository<Pago>,
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
  ) {}

  async create(dto: CreatePagoDto) {
    const reserva = await this.reservaRepository.findOne({
      where: { id: dto.reservaId },
    });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');

    const pago = this.pagoRepository.create({
      reserva,
      monto: reserva.montoTotal,
      metodoPago: dto.metodoPago,
      estadoPago: EstadoPago.PAGADO, // simulación de pasarela exitosa
      transaccionId: dto.transaccionId ?? `SIM-${Date.now()}`,
    });

    const guardado = await this.pagoRepository.save(pago);

    // Al pagar, la reserva pasa a confirmada
    reserva.estado = EstadoReserva.CONFIRMADA;
    await this.reservaRepository.save(reserva);

    return guardado;
  }

  findByReserva(reservaId: number) {
    return this.pagoRepository.findOne({
      where: { reserva: { id: reservaId } },
    });
  }
}
