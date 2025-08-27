import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { UploadsPipe } from '../../pipes/uploads.pipe';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ICartPromotion } from '../../../interfaces/cart.interface';
import { IPromotion } from '../../../interfaces/promotion.interface';
import { CartRepo } from '../../repositories/cart.repository';
import { CartService } from '../../../services/cart.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertsService } from '../../../services/alerts.service';
import { RouterModule } from '@angular/router';
import { CustomQuantityControlComponent } from '../custom-quantity-control/custom-quantity-control.component';
import { PromotionQuickviewModalComponent } from '../promotion-quickview-modal/promotion-quickview-modal.component';
import { map, Observable, Subscription, tap } from 'rxjs';
import { DiscountTypeEnum } from '../../enums/discount-type.enum';
import { PromotionsRepo } from '../../repositories/promotions.repository';
import { LazyImageDirective } from '../../directives/lazy-image.directive';

@Component({
  selector: 'app-promotion-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    UploadsPipe,
    CustomButtonComponent,
    CustomQuantityControlComponent,
    LazyImageDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './promotion-card.component.html',
  styleUrl: './promotion-card.component.scss',
})
export class PromotionCardComponent {

  form: FormGroup = this._formBuilder.group({
    quantity: 0
  })
  cartItem$!: Observable<ICartPromotion | null>;
  isLoading: boolean = false;
  DiscountTypeEnum = DiscountTypeEnum;
  promotion!: IPromotion;
  @Input({ required: true }) promotionId!: number;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _cartRepo: CartRepo,
    private _cartService: CartService,
    private _formBuilder: FormBuilder,
    private _modalService: BsModalService,
    private _alertsService: AlertsService,
    private _promotionsRepo: PromotionsRepo
  ) { }

  ngOnInit() {
    this._subscriptions.push(
      this._promotionsRepo.getPromotion$(this.promotionId).subscribe(promotion => {
        if (promotion) {
          this.promotion = { ...promotion };
        }
      })
    );
    
    this.cartItem$ = this._cartRepo.cart$.pipe(
      map(cart => {
        if (!cart || !cart.promociones || !cart.promociones.length) {
          return null;
        }
        const itemIndex = cart.promociones.findIndex(item => item.promocion.id == this.promotion.id);
        return itemIndex >= 0 ? cart.promociones[itemIndex] : null;
      }),
      tap(cartItem => {
        if (cartItem) {
          this.form.patchValue({ quantity: cartItem.cantidad });
        } else {
          this.form.patchValue({ quantity: 0 });
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
    this.isLoading = true;
    await this._cartService.addPromotion({
      promocion: this.promotion,
      cantidad: 1,
      monto: this.promotion.total_con_descuento,
    });
    this.isLoading = false;
  }

  /*updateCartItem(quantity: number) {
    if (!this.cartItem) {
      return;
    }

    if (quantity == 0) {
      this.removeCartItem();
    } else {
      this.cartItem.cantidad = quantity;
      this._cartService.updatePromotion(this.cartItem);
    }
  }*/

  openQuickviewModal() {
    this._modalService.show(
      PromotionQuickviewModalComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        backdrop: 'static',
        initialState: {
          promotion: this.promotion
        }
      }
    );
  }

  removeCartItem(cartItem: ICartPromotion) {
    this._alertsService.showConfirmationAlert({
      title: 'Remover promoción',
      message: `¿Estas seguro que deseas remover la promoción <b>${cartItem.promocion.titulo}</b> de tu carrito de compras?`,
      confirmButtonText: 'Si, remover'
    }).then(async result => {
      if (result.isConfirmed) {
        const cart = await this._cartService.removePromotion(cartItem);
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
        // this.isLoading = false;
      } else {
        this.form.patchValue({
          quantity: 1
        });
        // this.isLoading = false;
      }
      this.isLoading = false;
    });
  }
}
