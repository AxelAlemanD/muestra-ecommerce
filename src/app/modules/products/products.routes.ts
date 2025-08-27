import { Routes } from '@angular/router';
import { ProductDetailsPage } from './product-details/product-details.page';
import { ProductListPage } from './product-list/product-list.page';

export default [
  {
    path: '',
    component: ProductListPage,
  },
  {
      path: ':id',
      component: ProductDetailsPage,
  },
] as Routes;

