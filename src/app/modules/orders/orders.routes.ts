import { Routes } from '@angular/router';
import { OrderListPage } from './order-list/order-list.page';
import { OrderDetailsPage } from './order-details/order-details.page';
import { OrderSuccessfulPage } from './order-successful/order-successful.page';

export default [
  {
    path: '',
    component: OrderListPage,
  },
  {
      path: ':id',
      component: OrderDetailsPage,
  },
  {
    path: ':id/pedido-satisfactorio',
    component: OrderSuccessfulPage,
},
] as Routes;

