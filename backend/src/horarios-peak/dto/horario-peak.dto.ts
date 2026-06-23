import { IsInt, IsString, Min, Max } from 'class-validator';

export class CreateHorarioPeakDto {
  @IsInt()
  canchaId: number;

  @IsInt()
  @Min(0)
  @Max(6)
  diaSemana: number;

  @IsString()
  horaInicio: string; // formato HH:mm

  @IsString()
  horaFin: string;
}
