import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './modules/home/home.page';
import { CartPage } from './modules/cart/cart.page';
import { CheckoutPage } from './modules/checkout/checkout.page';
import { AuthGuard } from './shared/guards/auth.guard';
import { NoAuthGuard } from './shared/guards/no-auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePage,
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes'),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'productos',
    loadChildren: () => import('./modules/products/products.routes'),
  },
  {
    path: 'promociones',
    loadChildren: () => import('./modules/promotions/promotions.routes'),
  },
  {
    path: 'categorias',
    loadChildren: () => import('./modules/categories/categories.routes'),
  },
  {
    path: 'mis-pedidos',
    loadChildren: () => import('./modules/orders/orders.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: 'mi-carrito',
    pathMatch: 'full',
    component: CartPage,
  },
  {
    path: 'checkout',
    pathMatch: 'full',
    component: CheckoutPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'compra-rapida',
    pathMatch: 'full',
    component: CheckoutPage,
    data: {
      path: 'compra-rapida'
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'perfil',
    loadChildren: () => import('./modules/profile/profile.routes'),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
