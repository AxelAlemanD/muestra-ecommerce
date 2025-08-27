import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { DeliveryTypeEnum } from '../../../shared/enums/delivery-type.enum';
import { IAddress } from '../../../interfaces/address.interface';
import { CartTableComponent, IColumn } from '../../../shared/components/cart-table/cart-table.component';
import { AddressesRepo } from '../../../shared/repositories/addresses.repository';
import { PaymentMethodPipe } from '../../../shared/pipes/payment-method.pipe';
import { DeliveryTypePipe } from '../../../shared/pipes/delivery-type.pipe';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import 'ionicons';
import { DeliveryMapComponent } from '../../../shared/components/delivery-map/delivery-map.component';
import { UploadsPipe } from '../../../shared/pipes/uploads.pipe';
import { OrderStatusPipe } from '../../../shared/pipes/order-status.pipe';
import { ITimelineItem } from '../../../interfaces/timeline.interface';
import { TimelineComponent } from '../../../shared/components/timeline/timeline.component';
import { OrderStatusEnum } from '../../../shared/enums/order-status.enum';
import { DeliveryChecklistModalComponent } from './components/delivery-checklist-modal/delivery-checklist-modal.component';
import { CancelOrderModalComponent } from './components/cancel-order-modal/cancel-order-modal.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { IBreadcrumbItem } from '../../../interfaces/breadcrumb.interface';
import { Subscription } from 'rxjs';
import { OrdersRepo } from '../../../shared/repositories/orders.repository';
import { DeliveryManLocationService } from '../../../services/delivery-man-location.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CustomButtonComponent,
    PaymentMethodPipe,
    DeliveryTypePipe,
    UploadsPipe,
    OrderStatusPipe,
    DeliveryMapComponent,
    TimelineComponent,
    BreadcrumbComponent,
    CartTableComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './order-details.page.html',
  styleUrl: './order-details.page.scss',
})
export class OrderDetailsPage implements OnInit, OnDestroy {

  deliveryAddress!: { lat: number; lng: number };
  addresses: IAddress[] = [];
  DeliveryTypeEnum = DeliveryTypeEnum;
  OrderStatusEnum = OrderStatusEnum;
  order!: any;
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
    },
    {
      label: 'Subtotal',
      path: 'precio',
      type: 'currency',
      align: 'end',
    },
    {
      label: 'Estado',
      path: 'estado',
      type: 'status',
      align: 'center'
    }
  ];
  timeline: ITimelineItem[] = [
    {
      id: OrderStatusEnum.PENDING,
      icon: 'timer',
      title: 'Pendiente'
    },
    {
      id: OrderStatusEnum.IN_PROCESS,
      icon: 'hammer',
      title: 'En poceso'
    },
    {
      id: OrderStatusEnum.READY,
      icon: 'checkmark',
      title: 'Listo'
    },
    {
      id: OrderStatusEnum.SENT,
      icon: 'send',
      title: 'Enviado'
    },
    {
      id: OrderStatusEnum.DELIVERED,
      icon: 'checkmark-done-circle',
      title: 'Entregado'
    }
  ];
  currentStatus: ITimelineItem = this.timeline[0];
  breadcrumb: IBreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Mis pedidos', url: '/mis-pedidos' },
  ];

  private _subscriptions: Subscription[] = [];

  constructor(
    private _addressesRepo: AddressesRepo,
    private _activatedRoute: ActivatedRoute,
    private _modalService: BsModalService,
    private _ordersRepo: OrdersRepo,
    private _deliveryManLocationService: DeliveryManLocationService
  ) {
    this._subscriptions.push(
      this._addressesRepo.addresses$.subscribe(addresses => {
        this.addresses = addresses;
      })
    );
    this._deliveryManLocationService.currentLocation.subscribe(resp => {
      this.deliveryAddress = resp!;
    });
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      const ORDER_ID = params['id'];
      this._subscriptions.push(
        this._ordersRepo.getOrder$(ORDER_ID).subscribe(order => {
          this.order = order;
          if (this.order.estado === OrderStatusEnum.PENDING) {
            this.currentStatus = this.timeline[0];
          } else if (this.order.estado === OrderStatusEnum.IN_PROCESS) {
            this.currentStatus = this.timeline[1];
          } else if (this.order.estado === OrderStatusEnum.READY) {
            this.currentStatus = this.timeline[2];
          } else if (this.order.estado === OrderStatusEnum.DELIVERED) {
            this.currentStatus = this.timeline[4];
          } else {
            this.currentStatus = this.timeline[3];
          }
        })
      );
    });
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
    this._subscriptions = [];
  }

  openDeliveryChecklistModal() {
    const DELIVERY_CHECKLIST_REF = this._modalService.show(
      DeliveryChecklistModalComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        backdrop: 'static',
        initialState: {
          order: this.order
        }
      }
    );
  }

  openCancelOrderModal() {
    const CANCEL_ORDER_REF = this._modalService.show(
      CancelOrderModalComponent,
      {
        class: 'modal-md modal-dialog-centered',
        backdrop: 'static',
        initialState: {
          order: this.order
        }
      }
    );
    CANCEL_ORDER_REF.content?.onCancel.subscribe(() => {
      this.order.estado = OrderStatusEnum.CANCELLED;
    });
  }

  openPhoneDialer(phoneNumber: string) {
    const formattedPhone = phoneNumber.replace(' ', '');
    window.open(`tel:${formattedPhone}`, '_system');
  }

  openWhatsApp(phoneNumber: string) {
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    if (cleanedNumber.length < 10) {
      return;
    }
    const whatsappUrl = `https://wa.me/${cleanedNumber}`;
    window.open(whatsappUrl, '_blank');
  }

  get pin(): string[] {
    if (this.order.pin) {
      return this.order.pin.toString().split('');
    }
    return []
  }

  get selectedAddress(): IAddress | undefined {
    if (this.order && this.addresses.length) {
      return this.addresses.find(address => address.id === this.order?.direccion!.direccion_id);
    }
    return undefined;
  }

}
