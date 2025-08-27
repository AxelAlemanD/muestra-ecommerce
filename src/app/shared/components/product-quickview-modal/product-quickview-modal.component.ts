import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { IProduct } from '../../../interfaces/product.interface';
import { ProductGalleryComponent } from '../product-gallery/product-gallery.component';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { CartService } from '../../../services/cart.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ICart, ICartProduct } from '../../../interfaces/cart.interface';
import { CustomQuantityControlComponent } from '../custom-quantity-control/custom-quantity-control.component';
import { CartRepo } from '../../repositories/cart.repository';
import { Router, RouterModule } from '@angular/router';
import { ProductVariantsFormComponent } from '../../../modules/products/product-details/components/product-variants-form/product-variants-form.component';
import { LocalCartService } from '../../../services/local-cart.service';
import { QuickCartRepo } from '../../repositories/quick-cart.repository';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { ProductsService } from '../../../services/products.service';
import { ProductsRepo } from '../../repositories/products.repository';
import { Subscription } from 'rxjs';
import { AlertsService } from '../../../services/alerts.service';

@Component({
  selector: 'app-product-quickview-modal',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ModalBaseComponent,
    ProductGalleryComponent,
    CustomButtonComponent,
    CustomQuantityControlComponent,
    ProductVariantsFormComponent,
    SafeHtmlPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-quickview-modal.component.html',
  styleUrl: './product-quickview-modal.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProductQuickviewModalComponent implements OnInit, OnDestroy {

  // showGallery: boolean = false;
  form: FormGroup = this._formBuilder.group({
    quantity: 0,
    variant: null,
  })
  cartItem: ICartProduct | null = null;
  availableStock: number = 0;
  product!: IProduct;
  isLoading: boolean = false;
  @Input({ required: true }) productId!: number;
  private _cart: ICart | null = null;
  private _productSubscription!: Subscription;
  private _cartSubscription!: Subscription;

  constructor(
    private _router: Router,
    private _cartRepo: CartRepo,
    private _cartService: CartService,
    private _formBuilder: FormBuilder,
    private _modalService: BsModalService,
    private _localCartService: LocalCartService,
    private _quickCartRepo: QuickCartRepo,
    private _productsService: ProductsService,
    private _productsRepo: ProductsRepo,
    private _alertsService: AlertsService,
  ) { }

  ngOnInit() {
    this._productSubscription = this._productsRepo.getProduct$(this.productId).subscribe(product => {
      if (product) {
        this.product = product;
        if (this.product && this.product.variantes && this.product.variantes.length) {
          this.setSelectedVariant(this.product.variantes[0].id);
        }
        this._loadStock();
        this._subscribeToQuantityChange();
      }
    });
  }

  ngOnDestroy() {
    this._productSubscription.unsubscribe();
    if (this._cartSubscription) {
      this._cartSubscription.unsubscribe();
    }
  }

  goToShowProduct() {
    this._router.navigate(['/productos', this.product.id])
    this.hideModal();
  }

  addToCart() {
    this._cartService.addProduct({
      producto: (this.selectedVariant)
        ? {
          ...this.product,
          nombre: `${this.product.nombre} ${this.selectedVariant.variante.size}`,
          precio: (this.selectedVariant) ? this.selectedVariant.precio : this.product.precio,
        }
        : this.product,
      cantidad: 1,
      monto: (this.selectedVariant) ? this.selectedVariant.precio_con_descuento : this.product.precio_con_descuento,
      variante_id: (this.selectedVariant) ? this.selectedVariant.id : null,
      promocion_id: (this.selectedVariant) ? this.selectedVariant.promocion_id : this.product.promocion_id
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
      }, 1000);
    }
  }

  setSelectedVariant(variantId: number) {
    this.form.patchValue({
      variant: variantId
    });
    this._loadStock();
    this._loadCartItem();
  }

  hideModal() {
    this._modalService.hide();
  }

  purchaseNow() {
    const CART = this._localCartService.getNewCart();
    const SUBTOTAL = (this.selectedVariant) ? this.selectedVariant.precio_con_descuento : this.product.precio_con_descuento;
    this._quickCartRepo.setCart({
      ...CART,
      total: SUBTOTAL + this._cartService.calculateShippingCost(SUBTOTAL),
      costo_envio: this._cartService.calculateShippingCost(SUBTOTAL),
      subtotal: SUBTOTAL,
      descuento: 0,
      productos: [{
        producto: (this.selectedVariant)
          ? {
            ...this.product,
            nombre: `${this.product.nombre} ${this.selectedVariant.variante.size}`,
            precio: SUBTOTAL,
          }
          : this.product,
        cantidad: 1,
        monto: SUBTOTAL,
        variante_id: (this.selectedVariant) ? this.selectedVariant.id : null,
        promocion_id: (this.selectedVariant) ? this.selectedVariant.promocion_id : this.product.promocion_id,
      }]
    });
    this._router.navigate(['/compra-rapida']);
  }

  get selectedVariant() {
    if (this.product.variantes && this.product.variantes.length) {
      return this.product.variantes?.find(variant => variant.id == this.form.value['variant']);
    }
    return null
  }

  private _subscribeToQuantityChange() {
    this._cartSubscription = this._cartRepo.cart$.subscribe(cart => {
      this._cart = cart;
      this._loadCartItem();
    });
  }

  private _loadCartItem() {
    if (!this._cart || !this._cart.productos || !this._cart.productos.length) {
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
  }
}
