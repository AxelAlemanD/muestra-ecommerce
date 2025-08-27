import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnDestroy, OnInit } from '@angular/core';
import { ProductGalleryComponent } from '../product-gallery/product-gallery.component';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { CartService } from '../../../services/cart.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ICartPromotion } from '../../../interfaces/cart.interface';
import { CustomQuantityControlComponent } from '../custom-quantity-control/custom-quantity-control.component';
import { CartRepo } from '../../repositories/cart.repository';
import { Router } from '@angular/router';
import { IPromotion } from '../../../interfaces/promotion.interface';
import { HttpEntitiesEnum } from '../../enums/http-entities.enum';
import { GenericService } from '../../../services/generic.service';
import { AlertsService } from '../../../services/alerts.service';
import { LocalCartService } from '../../../services/local-cart.service';
import { QuickCartRepo } from '../../repositories/quick-cart.repository';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-promotion-quickview-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalBaseComponent,
    ProductGalleryComponent,
    CustomButtonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './promotion-quickview-modal.component.html',
  styleUrl: './promotion-quickview-modal.component.scss',
})
export class PromotionQuickviewModalComponent implements OnInit, OnDestroy {

  showGallery: boolean = false;
  form: FormGroup = this._formBuilder.group({
    quantity: 0
  })
  cartItem: ICartPromotion | null = null;
  medias: any[] = [];
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  intervalId: any;
  isLoading: boolean = false;
  @Input({ required: true }) promotion!: IPromotion;
  private _subscription!: Subscription;

  constructor(
    private _router: Router,
    private _cartRepo: CartRepo,
    private _cartService: CartService,
    private _formBuilder: FormBuilder,
    private _modalService: BsModalService,
    private _genericService: GenericService,
    private _alertsService: AlertsService,
    private _localCartService: LocalCartService,
    private _quickCartRepo: QuickCartRepo,
  ) { }

  ngOnInit() {
    this._loadPromotionDetails(this.promotion.id!);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  goToShowPromotion() {
    this._modalService.hide();
    this._router.navigate(['promociones', this.promotion.id]);
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

  private _loadPromotionDetails(id: number) {
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
        setTimeout(() => {
          this.showGallery = true;
        }, 100);
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
    this._subscription = this._cartRepo.cart$.subscribe(cart => {
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
    });
  }
}
