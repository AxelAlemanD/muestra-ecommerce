import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomQuantityControlComponent } from '../custom-quantity-control/custom-quantity-control.component';
import { CartService } from '../../../services/cart.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICart, ICartProduct, ICartPromotion } from '../../../interfaces/cart.interface';
import { Router, RouterModule } from '@angular/router';
import { UploadsPipe } from '../../pipes/uploads.pipe';
import { AlertsService } from '../../../services/alerts.service';
import { OrderStatusPipe } from '../../pipes/order-status.pipe';
import { OrderStatusEnum } from '../../enums/order-status.enum';
import { ProductsService } from '../../../services/products.service';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { DiscountTypeEnum } from '../../enums/discount-type.enum';
import { LazyImageDirective } from '../../directives/lazy-image.directive';

export interface IColumn {
  label: string;
  path?: string;
  type: 'text' | 'number' | 'currency' | 'product' | 'quantity' | 'status';
  align?: 'start' | 'center' | 'end';
  color?: string;
}

@Component({
  selector: 'app-cart-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UploadsPipe,
    OrderStatusPipe,
    CustomQuantityControlComponent,
    CustomButtonComponent,
    LazyImageDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './cart-table.component.html',
  styleUrl: './cart-table.component.scss',
})
export class CartTableComponent implements OnChanges {

  OrderStatusEnum = OrderStatusEnum;
  DiscountTypeEnum = DiscountTypeEnum;
  @Input({ required: true }) columns: IColumn[] = [];
  @Input({ required: true }) cart: ICart | null = null;
  form: FormGroup = this._formBuilder.group({
    cartItems: this._formBuilder.array([]),
    cartPromotions: this._formBuilder.array([])
  });

  constructor(
    private _router: Router,
    private _cartService: CartService,
    private _formBuilder: FormBuilder,
    private _alertsService: AlertsService,
    private _productsService: ProductsService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cart'] && changes['cart'].currentValue) {
      const CURRENT_CART: ICart = changes['cart'].currentValue;
      const PREVIOUS_CART: ICart = changes['cart'].previousValue;
      const PRODUCTS_TO_UPDATE = CURRENT_CART?.productos.filter(product => {
        return PREVIOUS_CART?.productos.some(item => product.producto.id == item.producto.id)
      }) || [];
      const PRODUCTS_ADDED = CURRENT_CART?.productos.filter(product => {
        return !PREVIOUS_CART || !PREVIOUS_CART.productos.some(item => product.producto.id == item.producto.id)
      }) || [];
      const PRODUCTS_REMOVED = (!PREVIOUS_CART)
        ? []
        : PREVIOUS_CART.productos.filter(item => {
          return !CURRENT_CART?.productos.some(product => item.producto.id == product.producto.id)
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

      this.cartPromotions.clear();
      if (CURRENT_CART.promociones && CURRENT_CART.promociones.length) {
        CURRENT_CART.promociones.forEach(cartPromotion => {
          this._addCartPromotion(cartPromotion);
        })

      }
    }
  }

  redirectTo(route: string) {
    this._router.navigate([route]);
  }

  updateCartItem(index: number, quantity: number) {
    if (quantity <= 0) {
      this._removeCartItem(index);
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

  removePromotion(id: number) {
    const CART_PROMOTION = this.cart!.promociones!.find(item => item.promocion.id == id)!;
    this._alertsService.showConfirmationAlert({
      title: 'Remover promoción',
      message: `¿Estas seguro que deseas remover la promoción <b>${CART_PROMOTION.promocion.titulo}</b> de tu carrito de compras?`,
      confirmButtonText: 'Si, remover'
    }).then(async result => {
      if (result.isConfirmed) {
        const cart = await this._cartService.removePromotion(CART_PROMOTION);
        if (cart) {
          this._alertsService.showToast({
            icon: 'success',
            text: 'Se removio la promoción de tu carrito'
          });
        } else {
          this._alertsService.showToast({
            icon: 'error',
            text: 'No se pudo remover la promoción, intenta nuevamente'
          });
        }
      } else {
        this.form.patchValue({
          quantity: 1
        });
      }
    });
  }

  get cartItems(): FormArray {
    return this.form.get('cartItems') as FormArray;
  }

  get cartPromotions(): FormArray {
    return this.form.get('cartPromotions') as FormArray;
  }

  get total(): number {
    if (this.cart && this.cart.productos) {
      return this.cart.productos.reduce((total, item) => item.monto + total, 0);
    }
    return 0;
  }

  private _addCartItem(cartItem: ICartProduct) {
    let variant = null;
    if (cartItem.variante_id) {
      variant = cartItem.producto.variantes!.find(item => item.id == cartItem.variante_id);
    }

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
      precio: [cartItem.producto.precio, Validators.required],
      nombre: [cartItem.producto.nombre, Validators.required],
      sku: [cartItem.producto.sku, Validators.required],
      media: (cartItem.producto.media && cartItem.producto.media.length)
        ? cartItem.producto.media[0].media_url
        : null,
      variante_id: [cartItem.variante_id],
      estado_id: [cartItem.estado_id],
      promocion_id: [cartItem.promocion_id],
      tipo_descuento: [
        (variant && variant.contiene_promocion)
          ? variant.descuento_variante.tipo
          : (cartItem.producto.descuento)
            ? cartItem.producto.descuento.tipo
            : null
      ],
      cantidad_descuento: [
        (variant && variant.contiene_promocion)
          ? variant.descuento_variante.valor
          : (cartItem.producto.descuento)
            ? cartItem.producto.descuento.valor
            : null
      ],
      stock
    });
    this.cartItems.push(NEW_CART_ITEM);
  }

  private _updateCartItem(cartItem: ICartProduct, index: number) {
    const productForm = this.cartItems.at(index);
    productForm.patchValue({
      cantidad: cartItem.cantidad,
      monto: cartItem.monto,
      precio: cartItem.producto.precio,
    });
  }

  private _removeCartItem(index: number) {
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

  private _addCartPromotion(cartPromotion: ICartPromotion) {
    const NEW_CART_PROMOTION = this._formBuilder.group({
      id: [cartPromotion.id, Validators.required],
      cantidad: [
        cartPromotion.cantidad,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(1)
        ])
      ],
      monto: [cartPromotion.monto, Validators.required],
      producto_id: [cartPromotion.promocion.id, Validators.required],
      precio: [cartPromotion.promocion.total_original, Validators.required],
      nombre: [cartPromotion.promocion.titulo, Validators.required],
      media: (cartPromotion.promocion.media)
        ? cartPromotion.promocion.media.media_url
        : null,
      estado_id: [cartPromotion.estado_id],
      tipo_descuento: [cartPromotion.promocion.tipo_descuento],
      cantidad_descuento: [cartPromotion.promocion.cantidad_descuento],
    });
    this.cartPromotions.push(NEW_CART_PROMOTION);
  }
}
