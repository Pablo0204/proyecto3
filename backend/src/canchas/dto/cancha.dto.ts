import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoCancha } from '../entities/cancha.entity';

export class CreateCanchaDto {
  @IsString()
  nombre: string;

  @IsNumber()
  @Type(() => Number)
  tipoCanchaId: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  precioHora: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  precioPeak: number;

  @IsOptional()
  @IsEnum(EstadoCancha)
  estado?: EstadoCancha;

  @IsOptional()
  @IsString()
  imagenUrl?: string;
}

export class UpdateCanchaDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  tipoCanchaId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  precioHora?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  precioPeak?: number;

  @IsOptional()
  @IsEnum(EstadoCancha)
  estado?: EstadoCancha;

  @IsOptional()
  @IsString()
  imagenUrl?: string;
}
