export type RolUsuario = 'cliente' | 'admin' | 'encargado';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: RolUsuario;
  telefono?: string;
}

export interface TipoCancha {
  id: number;
  nombre: string;
  descripcion?: string;
  jugadoresMax: number;
}

export type EstadoCancha = 'activa' | 'mantencion' | 'inactiva';

export interface Cancha {
  id: number;
  nombre: string;
  tipoCancha: TipoCancha;
  precioHora: number;
  precioPeak: number;
  estado: EstadoCancha;
  imagenUrl?: string;
  ratingPromedio: number;
}

export type EstadoReserva = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

export interface Reserva {
  id: number;
  usuario?: Usuario;
  cancha: Cancha;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoReserva;
  montoTotal: number;
  createdAt: string;
}

export type MetodoPago = 'tarjeta' | 'transferencia' | 'efectivo';
export type EstadoPago = 'pendiente' | 'pagado' | 'fallido' | 'reembolsado';

export interface Pago {
  id: number;
  monto: number;
  metodoPago: MetodoPago;
  estadoPago: EstadoPago;
  transaccionId: string;
}

export interface AuthResponse {
  access_token: string;
  usuario: Usuario;
}
