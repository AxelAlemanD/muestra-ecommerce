import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from '../../../services/generic.service';
import { HttpEntitiesEnum } from '../../../shared/enums/http-entities.enum';
import { CustomerRepo } from '../../../shared/repositories/customer.repository';
import { CommonModule } from '@angular/common';
import { OrdersRepo } from '../../../shared/repositories/orders.repository';
import { Subscription, take } from 'rxjs';
import { AlertsService } from '../../../services/alerts.service';

@Component({
  selector: 'app-order-successful',
  standalone: true,
  imports: [
    CommonModule,
    CustomButtonComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './order-successful.page.html',
  styleUrl: './order-successful.page.scss',
})
export class OrderSuccessfulPage implements OnInit, OnDestroy {

  order!: any;
  customer!: any;
  private _subscription!: Subscription;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _customerRepo: CustomerRepo,
    private _ordersRepo: OrdersRepo,
    private _alertsService: AlertsService,
    private _genericService: GenericService,
  ) { }

  ngOnInit(): void {
    this._subscription = this._customerRepo.customer$.subscribe(customer => {
      this.customer = customer!;
    });
    this._activatedRoute.params.subscribe((params) => {
      const ORDER_ID = params['id'];
      this.order = this._ordersRepo.getOrderById(ORDER_ID);
      this.requestInvoice(ORDER_ID);
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  redirectTo(route: string) {
    this._router.navigateByUrl(route);
  }

  requestInvoice(orderId: any) {
    this._alertsService.showConfirmationAlert({
      title: 'Solicitar factura',
      message: '¿Deseas solicitar la factura de tu compra?',
      confirmButtonText: 'Si, solicitar'
    }).then(async result => {
      if (result.isConfirmed) {
        this._genericService.put<any>(`${HttpEntitiesEnum.INVOICE}/facturar/${orderId}`, {})
          .pipe(take(1))
          .subscribe({
            next: resp => {
              if (resp.message === 'success') {
                this._alertsService.showToast({
                  icon: 'success',
                  text: 'Se ha solicitado la factura de tu compra'
                });
              } else {
                this._alertsService.showToast({
                  icon: 'error',
                  text: 'Ocurrio un problema al solicitar tu factura'
                });
                this.requestInvoice(orderId);
              }
            },
            error: error => {
              this._alertsService.showToast({
                icon: 'error',
                text: 'Ocurrio un problema al solicitar tu factura'
              });
              this.requestInvoice(orderId);
            }
          })
      }
    });
  }

  get shortName(): string {
    if (this.customer) {
      return `${this.customer.nombre.split(' ')[0]} ${this.customer.apellidos.split(' ')[0]}`
    }
    return '';
  }

}
