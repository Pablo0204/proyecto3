import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TiposCanchaModule } from './tipos-cancha/tipos-cancha.module';
import { CanchasModule } from './canchas/canchas.module';
import { HorariosPeakModule } from './horarios-peak/horarios-peak.module';
import { ReservasModule } from './reservas/reservas.module';
import { PagosModule } from './pagos/pagos.module';
import { ValoracionesModule } from './valoraciones/valoraciones.module';
import { MetricasModule } from './metricas/metricas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 30, // máx 30 requests por minuto por IP (RNF-02: rate limiting)
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    AuthModule,
    UsuariosModule,
    TiposCanchaModule,
    CanchasModule,
    HorariosPeakModule,
    ReservasModule,
    PagosModule,
    ValoracionesModule,
    MetricasModule,
  ],
})
export class AppModule {}
