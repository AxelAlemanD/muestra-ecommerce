import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IBranch } from '../../../interfaces/branch.interface';
import { ICart, ICartProduct } from '../../../interfaces/cart.interface';
import { IProduct } from '../../../interfaces/product.interface';
import { CartService } from '../../../services/cart.service';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { CustomQuantityControlComponent } from '../../../shared/components/custom-quantity-control/custom-quantity-control.component';
import { ProductGalleryComponent } from '../../../shared/components/product-gallery/product-gallery.component';
import { BranchRepo } from '../../../shared/repositories/branch.repository';
import { CartRepo } from '../../../shared/repositories/cart.repository';
import { GenericService } from '../../../services/generic.service';
import { SelectAvailabilityModalComponent } from './components/select-availability-modal/select-availability-modal.component';
import { ProductCarouselComponent } from '../../../shared/components/product-carousel/product-carousel.component';
import { ProductsRepo } from '../../../shared/repositories/products.repository';
import { HttpEntitiesEnum } from '../../../shared/enums/http-entities.enum';
import { ProductVariantsFormComponent } from './components/product-variants-form/product-variants-form.component';
import { AlertsService } from '../../../services/alerts.service';
import { IBreadcrumbItem } from '../../../interfaces/breadcrumb.interface';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { LocalCartService } from '../../../services/local-cart.service';
import { QuickCartRepo } from '../../../shared/repositories/quick-cart.repository';
import { Subscription, take } from 'rxjs';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ProductGalleryComponent,
    ProductCarouselComponent,
    CustomButtonComponent,
    CustomQuantityControlComponent,
    ProductVariantsFormComponent,
    BreadcrumbComponent,
    SafeHtmlPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './product-details.page.html',
  styleUrl: './product-details.page.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProductDetailsPage implements OnInit, OnDestroy {

  form: FormGroup = this._formBuilder.group({
    quantity: 0,
    variant: null,
  });
  cartItem: ICartProduct | null = null;
  selectedBranch: IBranch | null = null;
  product!: IProduct;
  relatedProducts: IProduct[] = [];
  breadcrumb: IBreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
  ];
  showGallery: boolean = false;
  availableStock: number = 0;
  isLoading: boolean = false;
  private _cart: ICart | null = null;
  private _subscriptions: Subscription[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _modalService: BsModalService,
    private _branchRepo: BranchRepo,
    private _cartRepo: CartRepo,
    private _cartService: CartService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _genericService: GenericService,
    private _productsRepo: ProductsRepo,
    private _alertsService: AlertsService,
    private _localCartService: LocalCartService,
    private _quickCartRepo: QuickCartRepo,
    private _productsService: ProductsService,
  ) {
    this._subscriptions.push(
      this._branchRepo.branch$.subscribe(selectedBranch => {
        this.selectedBranch = selectedBranch;
      })
    );
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      this.breadcrumb = [
        { label: 'Inicio', url: '/' },
      ];
      const PRODUCT_ID = params['id'];
      if (PRODUCT_ID) {
        this.form.reset();
        this.scrollToTop();
        this._subscriptions.push(
          this._productsRepo.getProduct$(PRODUCT_ID).subscribe(product => {
            this.showGallery = false;
            if (product) {
              this.product = product;
              if (!this.form.value['variant'] && this.product.variantes && this.product.variantes.length) {
                this.setSelectedVariant(this.product.variantes[0].id);
              }
              this._loadStock();
              this._loadBreadcumb();
              this._loadRelatedProducts();
              this._subscribeToQuantityChange();
            }
            setTimeout(() => this.showGallery = true, 500);
          })
        );
      }
    });
    this._activatedRoute.queryParams.subscribe((params) => {
      if (params['variante']) {
        this.setSelectedVariant(params['variante']);
      }
    });
  }

  ngOnDestroy() {
    if (this._subscriptions.length) {
      this._subscriptions.forEach(subscription => subscription.unsubscribe())
    }
  }

  addToCart() {
    const PRODUCT_TO_ADD = {
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
    };
    this._cartService.addProduct(PRODUCT_TO_ADD);
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

  openSelectAvailabilityModal() {
    this._modalService.show(
      SelectAvailabilityModalComponent,
      {
        class: 'modal-md modal-dialog-centered',
        backdrop: 'static',
        initialState: {
          selectedBranch: this.selectedBranch
        }
      }
    );
  }

  setSelectedVariant(variantId: number) {
    this.form.patchValue({
      variant: variantId
    });
    this._router.navigate([], {
      queryParams: { variante: variantId }
    });
    this._loadStock();
    this._loadCartItem();
  }

  scrollToTop() {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 1000);
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
        promocion_id: (this.selectedVariant) ? this.selectedVariant.promocion_id : this.product.promocion_id
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

  private _loadBreadcumb() {
    this.breadcrumb = [
      {
        label: 'Inicio',
        url: '/'
      },
      {
        label: this.product.categorias[0].nombre,
        url: `/categorias/${this.product.categorias[0].id}`
      }
    ];
    if (this.product.categorias.length > 1) {
      this.breadcrumb.push({
        label: this.product.categorias[1].nombre,
        url: `/categorias/${this.product.categorias[0].id}/subcategoria/${this.product.categorias[1].id}`
      });
    }
  }

  private _loadRelatedProducts() {
    if (this.product.marca) {
      this.relatedProducts = this._productsService.filter(`marca=${this.product.marca.id}`)
        .filter(product => product.id != this.product.id);
    }
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
  }

  private _removeCartItem() {
    this.isLoading = false;
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
      } else {
        this.form.patchValue({
          quantity: 1
        });
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
