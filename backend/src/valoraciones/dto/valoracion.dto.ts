import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateValoracionDto {
  @IsInt()
  reservaId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  puntuacion: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}
