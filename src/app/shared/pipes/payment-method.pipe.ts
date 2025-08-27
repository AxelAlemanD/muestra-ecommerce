import { Pipe, type PipeTransform } from '@angular/core';
import { PaymentMethodEnum } from '../enums/payment-method.enum';

@Pipe({
  name: 'paymentMethod',
  standalone: true,
})
export class PaymentMethodPipe implements PipeTransform {

  transform(paymentMethod: number): string {
    if(paymentMethod == PaymentMethodEnum.CASH) {
      return 'Efectivo'
    } else if (paymentMethod == PaymentMethodEnum.CARD) {
      return 'Tarjeta de crédito / débito'
    }
    return '';
  }

}
