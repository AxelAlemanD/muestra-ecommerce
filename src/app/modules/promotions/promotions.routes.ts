import { Routes } from '@angular/router';
import { PromotionDetailsPage } from './promotion-details/promotion-details.page';
import { PromotionListPage } from './promotion-list/promotion-list.page';

export default [
  {
    path: '',
    component: PromotionListPage,
  },
  {
    path: ':id',
    component: PromotionDetailsPage,
  },
] as Routes;

