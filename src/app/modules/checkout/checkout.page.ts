import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { CartRepo } from '../../shared/repositories/cart.repository';
import { ICart } from '../../interfaces/cart.interface';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { IColumn, CartTableComponent } from '../../shared/components/cart-table/cart-table.component';
import "ionicons";
import { CustomControlComponent } from '../../shared/components/custom-control/custom-control.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SelectDeliveryTypeModalComponent } from './components/select-delivery-type-modal/select-delivery-type-modal.component';
import { DeliveryTypePipe } from '../../shared/pipes/delivery-type.pipe';
import { DeliveryTypeEnum } from '../../shared/enums/delivery-type.enum';
import { PaymentMethodPipe } from '../../shared/pipes/payment-method.pipe';
import { SelectPaymentMethodModalComponent } from './components/select-payment-method-modal/select-payment-method-modal.component';
import { SelectDeliveryAddressModalComponent } from './components/select-delivery-address-modal/select-delivery-address-modal.component';
import { AddressesRepo } from '../../shared/repositories/addresses.repository';
import { IAddress } from '../../interfaces/address.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AlertsService } from '../../services/alerts.service';
import { AddPaymentCardModalComponent } from './components/add-payment-card-modal/add-payment-card-modal.component';
import { PaymentMethodEnum } from '../../shared/enums/payment-method.enum';
import { HttpEntitiesEnum } from '../../shared/enums/http-entities.enum';
import { IBreadcrumbItem } from '../../interfaces/breadcrumb.interface';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { QuickCartRepo } from '../../shared/repositories/quick-cart.repository';
import { Subscription, take } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CartTableComponent,
    CustomButtonComponent,
    CustomControlComponent,
    DeliveryTypePipe,
    PaymentMethodPipe,
    BreadcrumbComponent
  ],
  providers: [GenericService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './checkout.page.html',
  styleUrl: './checkout.page.scss',
})
export class CheckoutPage implements OnDestroy {

  productsQuantityInCart: number = 0;
  form: FormGroup = this._formBuilder.group({
    tipo_envio: [null, Validators.required],
    forma_pago: [null, Validators.required],
    total: [null, Validators.required],
    plataforma: ['web', Validators.required],
    direccion_id: [null],
    coupon: [null],
  });
  isLoading: boolean = false;
  isLoadingShippingCost: boolean = false;
  isQuickCart: boolean = false;
  addresses: IAddress[] = [];
  DeliveryTypeEnum = DeliveryTypeEnum;
  PaymentMethodEnum = PaymentMethodEnum;
  cart: ICart | null = null;
  columns: IColumn[] = [
    {
      label: 'Producto',
      type: 'product',
      align: 'start',
    },
    {
      label: 'Cantidad',
      path: 'cantidad',
      type: 'number',
      align: 'end',
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
    { label: 'Checkout', url: '/checkout' },
  ];

  private _subscriptions: Subscription[] = [];

  constructor(
    private _router: Router,
    private _cartService: CartService,
    private _cartRepo: CartRepo,
    private _modalService: BsModalService,
    private _addressesRepo: AddressesRepo,
    private _formBuilder: FormBuilder,
    private _alertsService: AlertsService,
    private _genericService: GenericService,
    private _quickCartRepo: QuickCartRepo,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
  ) {

    const CURRENT_PATH = this._activatedRoute.snapshot.data['path'];
    if (CURRENT_PATH === 'compra-rapida') {
      this.isQuickCart = true;
      this._subscriptions.push(
        this._quickCartRepo.cart$.subscribe(cart => this._setCartDetails(cart))
      );
    } else {
      this._subscriptions.push(
        this._cartRepo.cart$.subscribe(cart => this._setCartDetails(cart))
      );
    }
    this._subscriptions.push(
      this._addressesRepo.addresses$.subscribe(addresses => {
        this.addresses = addresses;
      })
    );
  }

  ngOnDestroy() {
    this._quickCartRepo.resetCart();
    if (this._subscriptions.length) {
      this._subscriptions.forEach(subscription => subscription.unsubscribe())
    }
  }

  redirectTo(route: string) {
    this._router.navigateByUrl(route);
  }

  async applyCoupon() {
    if (!this.form.value['coupon']) {
      return;
    }

    if (this.cart?.id === 0) {
      this.cart = await this._cartService.createCart(this.cart);
    }

    const CART = await this._cartService.applyCoupon(this.form.value['coupon']);
    if (CART) {
      this._alertsService.showToast({
        icon: 'success',
        text: 'Se aplicó un cupon a tu carrito de compras'
      });
    }
  }

  async removeCoupon() {
    const CART = await this._cartService.removeCoupon(this.cart?.id!);
    if (CART) {
      this._alertsService.showToast({
        icon: 'success',
        text: 'Se removió el cupon de tu carrito de compras'
      });
    }
  }

  async confirmPurchase() {
    if (!this.form.valid) {
      return;
    }
    this.isLoading = true;

    if (this.cart?.id === 0) {
      this.cart = await this._cartService.createCart(this.cart);
    }

    const { coupon, ...values } = this.form.value;
    const ID = await this._cartService.confirmPurchase(this.cart!, values, this.isQuickCart);
    if (ID) {
      this.redirectTo(`/mis-pedidos/${ID}/pedido-satisfactorio`);
    }
    this.isLoading = false;
  }

  openSelectDeliveryTypeModal() {
    const SELECT_DELIVERY_TYPE_REF = this._modalService.show(
      SelectDeliveryTypeModalComponent,
      {
        class: 'modal-md modal-dialog-centered',
        backdrop: 'static',
        initialState: {
          selectedDeliveryType: this.cart?.tipo_envio
        }
      }
    );
    SELECT_DELIVERY_TYPE_REF.content?.onConfirm.subscribe(deliveryType => {
      if (this.cart) {
        this.cart.tipo_envio = deliveryType;
        if (!this.isQuickCart) {
          this._cartRepo.setCart(this.cart);
        }
      }
      this.form.patchValue({
        tipo_envio: deliveryType
      });
    });
  }

  openSelectPaymentMethodModal() {
    const SELECT_PAYMENT_METHOD_REF = this._modalService.show(
      SelectPaymentMethodModalComponent,
      {
        class: 'modal-md modal-dialog-centered',
        backdrop: 'static',
        initialState: {
          selectedPaymentMethod: this.cart?.forma_pago
        }
      }
    );
    SELECT_PAYMENT_METHOD_REF.content?.onConfirm.subscribe(paymentMethod => {
      if (this.cart) {
        this.cart.forma_pago = paymentMethod;
        if (!this.isQuickCart) {
          this._cartRepo.setCart(this.cart);
        }
      }
      this.form.patchValue({
        forma_pago: paymentMethod
      });
    });
  }

  openSelectDeliveryAddressModal() {
    const SELECT_DELIVERY_ADDRESS_REF = this._modalService.show(
      SelectDeliveryAddressModalComponent,
      {
        class: 'modal-md modal-dialog-centered',
        backdrop: 'static',
        initialState: {
          selectedDeliveryAddress: (this.cart?.direccion) ? this.cart?.direccion.id : null
        }
      }
    );
    SELECT_DELIVERY_ADDRESS_REF.content?.onConfirm.subscribe((deliveryAddress: any) => {
      if (this.cart) {
        this.cart.direccion = deliveryAddress;
        this._loadShippingCost(deliveryAddress.colonia.id);
        if (!this.isQuickCart) {
          this._cartRepo.setCart(this.cart);
        }
      }
      this.form.patchValue({
        direccion_id: deliveryAddress.id
      });
    });
  }

  async openAddPaymentCardModal() {
    if (!this.form.valid) {
      return;
    }
    this.isLoading = true;

    if (this.cart?.id === 0) {
      this.cart = await this._cartService.createCart(this.cart);
    }

    this._genericService.post<any>(`${HttpEntitiesEnum.PAYMENTS}/create-payment-intent`, {
      amount: this.cart?.total! * 100,
      description: `Cliente ${this._authService.userId} - Casa Luca - Orden #${this.cart?.id}`
    })
      .pipe(take(1))
      .subscribe({
        next: (resp: any) => {
          const ADD_PAYMENT_REF = this._modalService.show(
            AddPaymentCardModalComponent,
            {
              class: 'modal-md modal-dialog-centered',
              backdrop: 'static',
              initialState: {
                client_secret: resp.clientSecret
              }
            }
          );
          ADD_PAYMENT_REF.content?.onSuccessPayment.subscribe(paymentIntent => {
            this.confirmPurchase();
          });
          ADD_PAYMENT_REF.onHide?.subscribe(() => {
            this.isLoading = false;
          });
        },
        complete: () => this.isLoading = false
      });
  }

  get selectedAddress(): IAddress | undefined {
    if (this.cart && this.cart.direccion && this.addresses.length) {
      return this.addresses.find(address => address.id === this.cart?.direccion!.id);
    }
    return undefined;
  }

  private _setCartDetails(cart: ICart | null) {
    this.cart = cart;
    this.productsQuantityInCart = (cart) ? cart.productos.length : 0;
    this.productsQuantityInCart += (cart && cart.promociones) ? cart.promociones.length : 0;
    this.form.patchValue({
      tipo_envio: (this.cart) ? this.cart.tipo_envio : null,
      forma_pago: (this.cart) ? this.cart.forma_pago : null,
      total: (this.cart) ? this.cart.total : null,
      coupon: (this.cart && this.cart.cupon) ? this.cart.cupon.nombre : null,
    });
  }

  private _loadShippingCost(colonyId: number) {
    this.isLoadingShippingCost = true;
    this._genericService.getOne<any>(`${HttpEntitiesEnum.DELIVERY_COST}/obtener_tarifa`, colonyId)
      .pipe(take(1))
      .subscribe({
        next: (resp: any) => {
          let shippingCost = this._cartService.calculateShippingCost(this.cart!.total);
          if (resp.data && resp.data.length) {
            const SHIPPING_COST_ITEM = resp.data.find((item: any) => {
              item.limite_inferior >= this.cart!.total && item.limite_inferior <= this.cart!.total;
            });
            if (SHIPPING_COST_ITEM) {
              shippingCost = SHIPPING_COST_ITEM.costo;
            }
          }
          this.cart!.total = this.cart!.total + shippingCost;
          this.cart!.costo_envio = shippingCost;
        },
        complete: () => this.isLoadingShippingCost = false
      });
  }
}
