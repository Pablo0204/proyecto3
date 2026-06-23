import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateTipoCanchaDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  jugadoresMax?: number;
}

export class UpdateTipoCanchaDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  jugadoresMax?: number;
}
