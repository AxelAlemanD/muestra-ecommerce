import { Pipe, type PipeTransform } from '@angular/core';
import { OrderStatusEnum } from '../enums/order-status.enum';

@Pipe({
  name: 'orderStatus',
  standalone: true,
})
export class OrderStatusPipe implements PipeTransform {

  transform(orderStatus: number): string {
    if (orderStatus == OrderStatusEnum.PENDING) {
      return 'Pendiente'
    } else if (orderStatus == OrderStatusEnum.IN_PROCESS) {
      return 'En proceso'
    } else if (orderStatus == OrderStatusEnum.READY) {
      return 'Listo'
    } else if (orderStatus == OrderStatusEnum.SENT) {
      return 'Enviado'
    } else if (orderStatus == OrderStatusEnum.DELIVERY_STARTED) {
      return 'Viaje iniciado'
    } else if (orderStatus == OrderStatusEnum.ON_HOLD) {
      return 'En espera'
    } else if (orderStatus == OrderStatusEnum.RESCHEDULED) {
      return 'Reagendado'
    } else if (orderStatus == OrderStatusEnum.DELIVERED) {
      return 'Entregado'
    } else if (orderStatus == OrderStatusEnum.CANCELLED) {
      return 'Cancelado'
    } else if (orderStatus == OrderStatusEnum.RETURNED) {
      return 'Devuelto'
    } else if (orderStatus == OrderStatusEnum.INCOMPLETE) {
      return 'Incompleto'
    }
    return '';
  }

}
