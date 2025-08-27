import { Pipe, type PipeTransform } from '@angular/core';
import { DeliveryTypeEnum } from '../enums/delivery-type.enum';

@Pipe({
  name: 'deliveryType',
  standalone: true,
})
export class DeliveryTypePipe implements PipeTransform {

  transform(deliveryType: number): string {
    if(deliveryType == DeliveryTypeEnum.DELIVERY) {
      return 'Entrega a domicilio'
    } else if (deliveryType == DeliveryTypeEnum.PICK_UP) {
      return 'Recoger en sucursal'
    }
    return '';
  }

}
