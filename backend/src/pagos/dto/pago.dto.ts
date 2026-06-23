import { IsInt, IsEnum, IsOptional, IsString } from 'class-validator';
import { MetodoPago } from '../entities/pago.entity';

export class CreatePagoDto {
  @IsInt()
  reservaId: number;

  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @IsOptional()
  @IsString()
  transaccionId?: string;
}
