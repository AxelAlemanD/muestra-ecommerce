import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IProduct } from '../../../interfaces/product.interface';
import { CartRepo } from '../../repositories/cart.repository';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { CartService } from '../../../services/cart.service';
import { CustomQuantityControlComponent } from '../custom-quantity-control/custom-quantity-control.component';
import { ICart, ICartProduct } from '../../../interfaces/cart.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ProductQuickviewModalComponent } from '../product-quickview-modal/product-quickview-modal.component';
import { RouterModule } from '@angular/router';
import { UploadsPipe } from '../../pipes/uploads.pipe';
import { AlertsService } from '../../../services/alerts.service';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../../services/products.service';
import { ProductsRepo } from '../../repositories/products.repository';
import { LazyImageDirective } from '../../directives/lazy-image.directive';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CustomButtonComponent,
    CustomQuantityControlComponent,
    UploadsPipe,
    LazyImageDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent implements OnInit, OnDestroy {

  form: FormGroup = this._formBuilder.group({
    quantity: 0,
    variant: null,
  });
  isLoading: boolean = false;
  availableStock: number = 0;
  product!: IProduct;
  cartItem: ICartProduct | null = null;
  @Input({ required: true }) productId!: number;
  @Output() onAddToCartClick: EventEmitter<null> = new EventEmitter();

  private _cart: ICart | null = null;
  private _subscriptions: Subscription[] = [];

  constructor(
    private _cartRepo: CartRepo,
    private _cartService: CartService,
    private _formBuilder: FormBuilder,
    private _modalService: BsModalService,
    private _alertsService: AlertsService,
    private _productsService: ProductsService,
    private _productsRepo: ProductsRepo,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this._subscriptions.push(
      this._productsRepo.getProduct$(this.productId).subscribe(product => {
        if (product) {
          this.product = { ...product };
          if (this.product && this.product.variantes && this.product.variantes.length) {
            this.setSelectedVariant(this.product.variantes[0].id);
          }
          this._loadStock();
          this._subscribeToQuantityChange();
        }
      })
    );
  }

  ngOnDestroy() {
    if (this._subscriptions.length) {
      this._subscriptions.forEach(subscription => subscription.unsubscribe())
    }
  }

  async addToCart() {
    const PRODUCT_TO_ADD: ICartProduct = {
      producto: this.selectedVariant
        ? {
          ...this.product,
          nombre: `${this.product.nombre} ${this.selectedVariant.variante.size}`,
          precio: this.selectedVariant.precio,
        }
        : this.product,
      cantidad: 1,
      monto: (this.selectedVariant) ? this.selectedVariant.precio_con_descuento : this.product.precio_con_descuento,
      variante_id: this.form.value['variant'],
      promocion_id: (this.selectedVariant) ? this.selectedVariant.promocion_id : this.product.promocion_id
    };
    this._cartService.addProduct(PRODUCT_TO_ADD).then(() => {
      this.form.patchValue({ quantity: 1 });
      this.onAddToCartClick.emit();
    });
  }

  async updateCartItem(quantity: number) {
    if (!this.cartItem) {
      return;
    }

    if (quantity == 0) {
      this._removeCartItem();
    } else {
      this.isLoading = true;
      await this._cartService.updateProduct({
        ...this.cartItem,
        cantidad: quantity,
        variante_id: this.form.value['variant'],
        promocion_id: (this.selectedVariant) ? this.selectedVariant.promocion_id : this.product.promocion_id
      });
      setTimeout(() => {
        this.isLoading = false;
        this.cd.markForCheck();
      }, 1000);
    }
  }

  openQuickviewModal() {
    this._modalService.show(
      ProductQuickviewModalComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        backdrop: 'static',
        initialState: {
          productId: this.product.id
        }
      }
    );
  }

  setSelectedVariant(variantId: number) {
    if (this.isLoading) {
      return;
    }
    this.form.patchValue({
      variant: variantId
    });
    this._loadStock();
    this._loadCartItem();
  }

  get selectedVariant() {
    if (this.product && this.product.variantes && this.product && this.product.variantes.length) {
      return this.product.variantes?.find(variant => variant.id == this.form.value['variant']);
    }
    return null
  }

  private _subscribeToQuantityChange() {
    this._subscriptions.push(
      this._cartRepo.cart$.subscribe(cart => {
        this._cart = cart;
        this._loadCartItem();
      })
    );
  }

  private _loadCartItem() {
    if (!this._cart || !this._cart.productos || !this._cart.productos.length) {
      this.cartItem = null;
      return;
    }
    const ITEM_INDEX = this._cart?.productos.findIndex(item => {
      if (item.variante_id) {
        return item.producto.id == this.product.id && item.variante_id == this.form.value['variant'];
      }
      return item.producto.id == this.product.id;
    });
    if (ITEM_INDEX != undefined && ITEM_INDEX >= 0) {
      this.cartItem = this._cart?.productos[ITEM_INDEX] ?? null;
      this.form.patchValue({
        quantity: this.cartItem ? this.cartItem.cantidad : 0,
        variante_id: this.cartItem ? this.cartItem.variante_id : null
      });
    } else {
      this.cartItem = null;
    }
    this.cd.markForCheck();
  }

  private _removeCartItem() {
    this.isLoading = false;
    this.form.patchValue({
      quantity: 1
    });
    this._alertsService.showConfirmationAlert({
      title: 'Remover producto',
      message: `¿Estas seguro que deseas remover el producto <b>${this.cartItem!.producto.nombre}</b> de tu carrito de compras?`,
      confirmButtonText: 'Si, remover'
    }).then(async result => {
      if (result.isConfirmed) {
        const cart = await this._cartService.removeProduct({
          ...this.cartItem!,
          variante_id: this.form.value['variant']
        });
        if (cart) {
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
      }
    });
  }

  private _loadStock() {
    this.availableStock = this._productsService.getProductStock(this.product.id, (this.selectedVariant) ? this.selectedVariant.id : null);
    this.form.controls['quantity'].setValidators([
      Validators.max(this.availableStock)
    ]);
    this.cd.markForCheck();
  }
}