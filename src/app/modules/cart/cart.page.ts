import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { CartRepo } from '../../shared/repositories/cart.repository';
import { ICart } from '../../interfaces/cart.interface';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { Router, RouterModule } from '@angular/router';
import { IColumn, CartTableComponent } from '../../shared/components/cart-table/cart-table.component';
import { AlertsService } from '../../services/alerts.service';
import { CartService } from '../../services/cart.service';
import { IBreadcrumbItem } from '../../interfaces/breadcrumb.interface';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    CartTableComponent,
    CustomButtonComponent,
    BreadcrumbComponent,
    RouterModule
  ],
  providers: [GenericService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss',
})
export class CartPage implements OnDestroy {

  cart: ICart | null = null;
  productsQuantityInCart: number = 0;
  columns: IColumn[] = [
    {
      label: 'Producto',
      type: 'product',
      align: 'start',
    },
    {
      label: 'Cantidad',
      type: 'quantity',
      align: 'start',
    }
    ,
    {
      label: 'Precio',
      path: 'precio',
      type: 'currency',
      align: 'end',
    }
    ,
    {
      label: 'Importe',
      path: 'monto',
      type: 'currency',
      align: 'end',
      color: 'primary'
    }
  ];
  breadcrumb: IBreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Carrito', url: '/mi-carrito' },
  ];
  isAuth: boolean = true;
  private _subscription!: Subscription;

  constructor(
    private _router: Router,
    private _cartRepo: CartRepo,
    private _cartService: CartService,
    private _alertsService: AlertsService,
    private _authService: AuthService
  ) {
    this._subscription = this._cartRepo.cart$.subscribe(cart => {
      this.cart = cart;
      this.productsQuantityInCart = (cart) ? cart.productos.length : 0;
      this.productsQuantityInCart += (cart && cart.promociones) ? cart.promociones.length : 0;
    });
    this.isAuth = this._authService.authenticatedValue;
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  redirectTo(route: string) {
    this._router.navigate([route]);
  }

  clearCart() {
    this._alertsService.showConfirmationAlert({
      title: 'Vaciar carrito',
      message: '¿Estas seguro que deseas vaciar tu carrito de compras?',
      confirmButtonText: 'Si, vaciar'
    }).then(async result => {
      if (result.isConfirmed) {
        await this._cartService.clearCart();
        this._alertsService.showToast({
          icon: 'success',
          text: 'Se ha vaciado carrito'
        });
      }
    });
  }
}
