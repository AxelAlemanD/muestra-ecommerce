import { CommonModule, NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IBranch } from '../../../interfaces/branch.interface';
import { ICartPromotion } from '../../../interfaces/cart.interface';
import { CartService } from '../../../services/cart.service';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { CustomQuantityControlComponent } from '../../../shared/components/custom-quantity-control/custom-quantity-control.component';
import { ProductGalleryComponent } from '../../../shared/components/product-gallery/product-gallery.component';
import { BranchRepo } from '../../../shared/repositories/branch.repository';
import { CartRepo } from '../../../shared/repositories/cart.repository';
import { GenericService } from '../../../services/generic.service';
import { HttpEntitiesEnum } from '../../../shared/enums/http-entities.enum';
import { IPromotion } from '../../../interfaces/promotion.interface';
import { IMedia } from '../../../interfaces/media.interface';
import { AlertsService } from '../../../services/alerts.service';
import { QuickCartRepo } from '../../../shared/repositories/quick-cart.repository';
import { LocalCartService } from '../../../services/local-cart.service';
import { Subscription, take } from 'rxjs';
import { PromotionsRepo } from '../../../shared/repositories/promotions.repository';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ProductGalleryComponent,
    CustomButtonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './promotion-details.page.html',
  styleUrl: './promotion-details.page.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PromotionDetailsPage implements OnInit, OnDestroy {

  form: FormGroup = this._formBuilder.group({
    quantity: 0,
    variant: null,
  })
  cartItem: ICartPromotion | null = null;
  selectedBranch: IBranch | null = null;
  promotion!: IPromotion;
  medias: IMedia[] = [];
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  intervalId: any;
  isLoading: boolean = false;
  // showGallery: boolean = false;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _branchRepo: BranchRepo,
    private _cartRepo: CartRepo,
    private _cartService: CartService,
    private _activatedRoute: ActivatedRoute,
    private _genericService: GenericService,
    private _alertsService: AlertsService,
    private _router: Router,
    private _localCartService: LocalCartService,
    private _quickCartRepo: QuickCartRepo,
    private _promotionsRepo: PromotionsRepo
  ) {
    this._subscriptions.push(
      this._branchRepo.branch$.subscribe(selectedBranch => {
        this.selectedBranch = selectedBranch;
      })
    );
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      const PROMOTION_ID = params['id'];
      this._loadPromotionDetails(PROMOTION_ID);
      /*const PROMOTION_ID = params['id'];
      if (PROMOTION_ID) {
        this.form.reset();
        this._subscriptions.push(
          this._promotionsRepo.getPromotion$(PROMOTION_ID).subscribe(promotion => {
            this.showGallery = false;
            if (promotion) {
              this.promotion = promotion;
              this._subscribeToQuantityChange();
              this._loadCounter();
            }
            setTimeout(() => this.showGallery = true, 500);
          })
        );
      }*/
    });
    // this._subscribeToQuantityChange();
  }

  ngOnDestroy() {
    if (this._subscriptions.length) {
      this._subscriptions.forEach(subscription => subscription.unsubscribe())
    }
  }

  async addToCart() {
    this.isLoading = true;
    await this._cartService.addPromotion({
      promocion: this.promotion,
      cantidad: 1,
      monto: this.promotion.total_con_descuento,
    });
    this.isLoading = false;
  }

  updateCartItem(quantity: number) {
    if (!this.cartItem) {
      return;
    }

    if (quantity == 0) {
      this.removeCartItem();
    } else {
      this.cartItem.cantidad = quantity;
      this._cartService.updatePromotion(this.cartItem);
    }
  }

  removeCartItem() {
    this._alertsService.showConfirmationAlert({
      title: 'Remover promoción',
      message: `¿Estas seguro que deseas remover la promoción <b>${this.cartItem!.promocion.titulo}</b> de tu carrito de compras?`,
      confirmButtonText: 'Si, remover'
    }).then(async result => {
      if (result.isConfirmed) {
        const cart = await this._cartService.removePromotion(this.cartItem!);
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

  purchaseNow() {
    const CART = this._localCartService.getNewCart();
    const TOTAL_WITH_DISCOUNT = this.promotion.total_con_descuento;
    this._quickCartRepo.setCart({
      ...CART,
      total: TOTAL_WITH_DISCOUNT + this._cartService.calculateShippingCost(TOTAL_WITH_DISCOUNT),
      costo_envio: this._cartService.calculateShippingCost(TOTAL_WITH_DISCOUNT),
      subtotal: this.promotion.total_original,
      descuento: this.promotion.total_original - TOTAL_WITH_DISCOUNT,
      productos: [],
      promociones: [{
        promocion: this.promotion,
        cantidad: 1,
        monto: TOTAL_WITH_DISCOUNT,
      }]
    });
    this._router.navigate(['/compra-rapida']);
  }

  private _loadPromotionDetails(id: string) {
    this._genericService.getOne<any>(`${HttpEntitiesEnum.PROMOTIONS}/get_promociones_for_id`, id)
      .pipe(take(1))
      .subscribe(resp => {
        this.promotion = {
          ...resp.data[0],
          productos: resp.data[0].productos.map((product: any) => ({
            ...product,
            nombre: (product.variante)
              ? `${product.nombre} ${product.variante.detalles.size}`
              : product.nombre,
          }))
        };
        this.medias = [
          this.promotion.media,
          ...this.promotion.productos.map((item, index) => ({
            id: index + 1,
            nombre: '',
            media_url: item.imagen
          })
          )
        ];
        this._loadCounter();
        this._subscribeToQuantityChange();
      });
  }

  private _loadCounter() {
    const finalDate = new Date(`${this.promotion.fecha_expiracion}T23:59:59`).getTime();

    this.intervalId = setInterval(() => {
      const now = new Date().getTime();
      const difference = finalDate - now;

      if (difference <= 0) {
        clearInterval(this.intervalId);
        return;
      }

      this.days = Math.floor(difference / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      this.minutes = Math.floor((difference / (1000 * 60)) % 60);
      this.seconds = Math.floor((difference / 1000) % 60);
    }, 1000);
  }

  private _subscribeToQuantityChange() {
    this._subscriptions.push(
      this._cartRepo.cart$.subscribe(cart => {
        if (!cart || !cart.promociones || !cart.promociones.length) {
          this.cartItem = null;
          return;
        }
        const ITEM_INDEX = cart?.promociones!.findIndex(item => item.promocion.id == this.promotion.id);
        if (ITEM_INDEX != undefined && ITEM_INDEX >= 0) {
          this.cartItem = cart?.promociones![ITEM_INDEX] ?? null;
          this.form.patchValue({
            quantity: this.cartItem ? this.cartItem.cantidad : 0
          });
        } else this.cartItem = null;
      })
    );
  }

}
