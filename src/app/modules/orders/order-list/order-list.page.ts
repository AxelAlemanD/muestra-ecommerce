import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICart } from '../../../interfaces/cart.interface';
import { OrdersRepo } from '../../../shared/repositories/orders.repository';
import 'ionicons';
import { OrderStatusEnum } from '../../../shared/enums/order-status.enum';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { OrderStatusPipe } from '../../../shared/pipes/order-status.pipe';
import { Router, RouterModule } from '@angular/router';
import { UploadsPipe } from '../../../shared/pipes/uploads.pipe';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { IBreadcrumbItem } from '../../../interfaces/breadcrumb.interface';
import { LocalCartService } from '../../../services/local-cart.service';
import { QuickCartRepo } from '../../../shared/repositories/quick-cart.repository';
import { Subscription } from 'rxjs';
import { LazyImageDirective } from '../../../shared/directives/lazy-image.directive';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    OrderStatusPipe,
    CustomButtonComponent,
    RouterModule,
    UploadsPipe,
    BreadcrumbComponent,
    LazyImageDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './order-list.page.html',
  styleUrl: './order-list.page.scss',
})
export class OrderListPage implements OnInit, OnDestroy {

  statuses: { id: number; label: string }[] = [
    { id: 0, label: 'Todos' },
    { id: OrderStatusEnum.PENDING, label: 'Pendientes' },
    { id: OrderStatusEnum.SENT, label: 'Enviados' },
    { id: OrderStatusEnum.DELIVERED, label: 'Entregados' },
    { id: OrderStatusEnum.CANCELLED, label: 'Cancelados' },
  ];
  activeStatus: { id: number; label: string } = this.statuses[0];
  breadcrumb: IBreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Mis pedidos', url: '/mis-pedidos' },
  ];
  OrderStatusEnum = OrderStatusEnum;
  private _orders: ICart[] = [];
  private _subscription!: Subscription;

  constructor(
    private _router: Router,
    private _ordersRepo: OrdersRepo,
    private _localCartService: LocalCartService,
    private _quickCartRepo: QuickCartRepo,
  ) { }

  ngOnInit() {
    this._subscription = this._ordersRepo.orders$.subscribe(orders => {
      this._orders = orders;
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  changeActiveStatus(status: { id: number; label: string }) {
    this.activeStatus = status;
  }

  redirectTo(route: string) {
    this._router.navigateByUrl(route);
  }

  purchaseNow(order: ICart) {
    const QUICK_CART = {
      ...this._localCartService.getNewCart(),
      productos: order.productos,
      promociones: order.promociones,
      total: order.total,
      subtotal: order.subtotal,
      descuento: order.descuento,
    };
    const { total, subtotal, descuento } = this._localCartService.getTotals(QUICK_CART);
    this._quickCartRepo.setCart({
      ...QUICK_CART,
      subtotal: subtotal,
      descuento: descuento,
      costo_envio: this._localCartService.calculateShippingCost(total),
      total: total + this._localCartService.calculateShippingCost(total),
    });
    this._router.navigate(['/compra-rapida']);
  }

  get orders(): ICart[] {
    switch (this.activeStatus.id) {
      case OrderStatusEnum.PENDING:
        return this._orders.filter(order => [
          OrderStatusEnum.PENDING,
          OrderStatusEnum.IN_PROCESS,
          OrderStatusEnum.READY,
        ].includes(order.estado));
      case OrderStatusEnum.SENT:
        return this._orders.filter(order => OrderStatusEnum.SENT == order.estado);
      case OrderStatusEnum.DELIVERED:
        return this._orders.filter(order => OrderStatusEnum.DELIVERED == order.estado);
      case OrderStatusEnum.CANCELLED:
        return this._orders.filter(order => OrderStatusEnum.CANCELLED == order.estado);
      default:
        return this._orders;
    }
  }
}
