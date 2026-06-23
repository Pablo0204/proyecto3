import { IsInt, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { EstadoReserva } from '../entities/reserva.entity';

export class CreateReservaDto {
  @IsInt()
  canchaId: number;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;
}

export class UpdateReservaDto {
  @IsOptional()
  @IsEnum(EstadoReserva)
  estado?: EstadoReserva;
}
