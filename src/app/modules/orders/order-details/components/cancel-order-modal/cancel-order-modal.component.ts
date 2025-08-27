import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalBaseComponent } from '../../../../../shared/components/modal-base/modal-base.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GenericService } from '../../../../../services/generic.service';
import { AlertsService } from '../../../../../services/alerts.service';
import { HttpEntitiesEnum } from '../../../../../shared/enums/http-entities.enum';
import { OrderStatusEnum } from '../../../../../shared/enums/order-status.enum';
import { ICart } from '../../../../../interfaces/cart.interface';
import { CustomControlComponent } from '../../../../../shared/components/custom-control/custom-control.component';
import { OrdersRepo } from '../../../../../shared/repositories/orders.repository';
import { take } from 'rxjs';

@Component({
  selector: 'app-cancel-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalBaseComponent,
    CustomControlComponent
  ],
  templateUrl: './cancel-order-modal.component.html',
  styleUrl: './cancel-order-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelOrderModalComponent implements OnInit {

  isLooadingConfirmation: boolean = false;
  form: FormGroup = this._formBuilder.group({
    code: [
      null,
      Validators.compose([
        Validators.required,
        Validators.minLength(4)
      ])
    ]
  });
  folio: string = '';
  @Input({ required: true }) order!: ICart;
  @Output() onCancel: EventEmitter<null> = new EventEmitter();

  constructor(
    private _formBuilder: FormBuilder,
    private _modalRef: BsModalRef,
    private _genericService: GenericService,
    private _alertsService: AlertsService,
    private _ordersRepo: OrdersRepo
  ) { }

  ngOnInit() {

    this.folio = this.order.folio!.toString().slice(-4);
  }

  cancelOrder() {
    if (this.form.value['code'] != this.folio) {
      this._alertsService.showToast({
        icon: 'error',
        text: 'El valor ingresado es incorrecto'
      });
      this.form.controls['code'].setErrors({
        required: true
      });
      return;
    }
    this._alertsService.showConfirmationAlert({
      title: 'Cancelar orden',
      message: `¿Estás seguro de que deseas cancelar tu orden?`,
      confirmButtonText: 'Si, cancelar orden'
    }).then(result => {
      if (result.isConfirmed) {
        this._genericService.put<any>(`${HttpEntitiesEnum.ORDERS}/cancelar_orden/${this.order.id}`, {})
          .pipe(take(1))
          .subscribe({
            next: (resp) => {
              if (resp.message == "success") {
                this._alertsService.showToast({
                  icon: 'success',
                  text: 'Se ha cancelado tu pedido orden'
                });
                this.order.estado = OrderStatusEnum.CANCELLED;
                this._ordersRepo.updateOrder(this.order.id, this.order);
                this.onCancel.emit();
                this._modalRef.hide();
              } else {
                this._alertsService.showToast({
                  icon: 'error',
                  text: 'Algo salio mal al actualizar tu pedido, intenta nuevamente'
                });
              }
            },
            error: (error) => {
              this._alertsService.showToast({
                icon: 'error',
                text: 'Algo salio mal al actualizar tu pedido, intenta nuevamente'
              });
            }
          });
      }
    });
  }
}
