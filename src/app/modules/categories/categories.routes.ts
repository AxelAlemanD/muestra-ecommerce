import { Routes } from '@angular/router';
import { CategoriesProductListPage } from './categories-product-list/categories-product-list.page';

export default [
  {
    path: ':id',
    component: CategoriesProductListPage,
  },
  {
    path: ':id/subcategoria/:subcategoryId',
    component: CategoriesProductListPage,
  }
] as Routes;

