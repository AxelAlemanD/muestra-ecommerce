import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { CustomButtonComponent } from '../../../custom-button/custom-button.component';
import { CartRepo } from '../../../../repositories/cart.repository';
import { ICart, ICartProduct } from '../../../../../interfaces/cart.interface';
import { CustomQuantityControlComponent } from '../../../custom-quantity-control/custom-quantity-control.component';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../../../../services/cart.service';
import { UploadsPipe } from '../../../../pipes/uploads.pipe';
import { Router, RouterModule } from '@angular/router';
import { AlertsService } from '../../../../../services/alerts.service';
import { ProductsService } from '../../../../../services/products.service';
import { Subscription } from 'rxjs';
import { LazyImageDirective } from '../../../../directives/lazy-image.directive';

@Component({
  selector: 'app-cart-preview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CustomButtonComponent,
    CustomQuantityControlComponent,
    UploadsPipe,
    LazyImageDirective
  ],
  templateUrl: './cart-preview.component.html',
  styleUrl: './cart-preview.component.scss',
})
export class CartPreviewComponent implements OnDestroy {

  cart: ICart | null = null;
  form: FormGroup = this._formBuilder.group({
    cartItems: this._formBuilder.array([])
  });
  private _subscription!: Subscription;

  constructor(
    private _router: Router,
    private _cartService: CartService,
    private _cartRepo: CartRepo,
    private _formBuilder: FormBuilder,
    private _alertsService: AlertsService,
    private _productsService: ProductsService,
  ) {
    this._subscription = this._cartRepo.cart$.subscribe(cart => {
      const PRODUCTS_TO_UPDATE = cart?.productos.filter(product => {
        return cart?.productos.some(item => product.producto.id == item.producto.id)
      }) || [];
      const PRODUCTS_ADDED = cart?.productos.filter(product => {
        return !this.cart?.productos.some(item => product.producto.id == item.producto.id)
      }) || [];
      const PRODUCTS_REMOVED = this.cart?.productos.filter(item => {
        return !cart?.productos.some(product => item.producto.id == product.producto.id)
      }) || [];

      PRODUCTS_REMOVED.forEach(product => {
        const index = this.cartItems.controls.findIndex(control => {
          if (product.variante_id) {
            return control.value['producto_id'] == product.producto.id && control.value['variante_id'] == product.variante_id;
          } else {
            return control.value['producto_id'] == product.producto.id;
          }
        });
        if (index !== -1) {
          this.cartItems.removeAt(index);
        }
      });

      PRODUCTS_ADDED.forEach(item => this._addCartItem(item));

      PRODUCTS_TO_UPDATE.forEach(product => {
        const index = this.cartItems.controls.findIndex(control => {
          if (product.variante_id) {
            return control.value['producto_id'] == product.producto.id && control.value['variante_id'] == product.variante_id;
          } else {
            return control.value['producto_id'] == product.producto.id;
          }
        });
        if (index !== -1) {
          this._updateCartItem(product, index);
        }
      });

      this.cart = cart ? { ...cart, productos: [...cart.productos] } : null;
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  redirectTo(route: string) {
    this._router.navigate([route]);
  }

  updateCartItem(index: number, quantity: number) {
    if (quantity <= 0) {
      this.removeCartItem(index);
    } else {
      const FORM_GROUP = this.cartItems.controls[index];
      const CART_ITEM = this.cart!.productos.find(item => {
        if (item.variante_id) {
          return item.producto.id == FORM_GROUP.value['producto_id'] && FORM_GROUP.value['variante_id'] == item.variante_id;
        } else {
          return item.producto.id == FORM_GROUP.value['producto_id']
        }
      });
      const UPDATED_CART_ITEM = {
        ...CART_ITEM!,
        cantidad: quantity,
      };
      this._cartService.updateProduct(UPDATED_CART_ITEM);
    }
  }

  removeCartItem(index: number) {
    const FORM_GROUP = this.cartItems.controls[index];
    const CART_ITEM = this.cart!.productos.find(item => {
      if (item.variante_id) {
        return item.producto.id == FORM_GROUP.value['producto_id'] && FORM_GROUP.value['variante_id'] == item.variante_id;
      } else {
        return item.producto.id == FORM_GROUP.value['producto_id']
      }
    })!;
    this._alertsService.showConfirmationAlert({
      title: 'Remover producto',
      message: `¿Estas seguro que deseas remover el producto <b>${CART_ITEM.producto.nombre}</b> de tu carrito de compras?`,
      confirmButtonText: 'Si, remover'
    }).then(async result => {
      if (result.isConfirmed) {
        const cart = await this._cartService.removeProduct(CART_ITEM);
        if (cart) {
          this.cartItems.removeAt(index);
          this._alertsService.showToast({
            icon: 'success',
            text: 'Se removio el producto de tu carrito'
          });
        } else {
          this._alertsService.showToast({
            icon: 'error',
            text: 'No se pudo remover el producto, intenta nuevamente'
          });
        }
      } else {
        FORM_GROUP.patchValue({
          cantidad: 1
        });
      }
    });
  }

  get cartItems(): FormArray {
    return this.form.get('cartItems') as FormArray;
  }

  get total(): number {
    let total = 0;
    total = (this.cart && this.cart.productos) ? this.cart.productos.reduce((total, item) => item.monto + total, 0) : 0;
    total += (this.cart && this.cart.promociones) ? this.cart.promociones.reduce((total, item) => item.monto + total, 0) : 0;
    return total;
  }

  private _addCartItem(cartItem: ICartProduct) {
    const stock = this._productsService.getProductStock(cartItem.producto.id, cartItem.variante_id);
    const NEW_CART_ITEM = this._formBuilder.group({
      id: [cartItem.id, Validators.required],
      cantidad: [
        cartItem.cantidad,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(stock)
        ])
      ],
      monto: [cartItem.monto, Validators.required],
      producto_id: [cartItem.producto.id, Validators.required],
      producto_precio: [cartItem.producto.precio, Validators.required],
      producto_nombre: [cartItem.producto.nombre, Validators.required],
      producto_media: (cartItem.producto.media && cartItem.producto.media.length)
        ? cartItem.producto.media[0].media_url
        : null,
      variante_id: [cartItem.variante_id],
      stock
    });
    this.cartItems.push(NEW_CART_ITEM);
  }

  private _updateCartItem(cartItem: ICartProduct, index: number) {
    const productForm = this.cartItems.at(index);
    productForm.patchValue({
      cantidad: cartItem.cantidad,
      monto: cartItem.monto,
      producto_precio: cartItem.producto.precio,
    });
  }
}
