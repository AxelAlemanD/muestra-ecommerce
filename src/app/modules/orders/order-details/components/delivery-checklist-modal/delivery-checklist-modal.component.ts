import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, Input } from '@angular/core';
import { ModalBaseComponent } from '../../../../../shared/components/modal-base/modal-base.component';
import { CustomButtonComponent } from '../../../../../shared/components/custom-button/custom-button.component';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomCheckboxComponent } from '../../../../../shared/components/custom-checkbox/custom-checkbox.component';
import { UploadsPipe } from '../../../../../shared/pipes/uploads.pipe';
import { RouterModule } from '@angular/router';
import { ICustomButtonModal } from '../../../../../interfaces/custom-button.interface';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GenericService } from '../../../../../services/generic.service';
import { HttpEntitiesEnum } from '../../../../../shared/enums/http-entities.enum';
import { AlertsService } from '../../../../../services/alerts.service';
import { OrderStatusEnum } from '../../../../../shared/enums/order-status.enum';
import { take } from 'rxjs';

@Component({
  selector: 'app-delivery-checklist-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ModalBaseComponent,
    CustomCheckboxComponent,
    CustomButtonComponent,
    UploadsPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './delivery-checklist-modal.component.html',
  styleUrl: './delivery-checklist-modal.component.scss',
})
export class DeliveryChecklistModalComponent implements OnInit {

  isLooadingConfirmation: boolean = false;
  form: FormGroup = this._formBuilder.group({
    items: this._formBuilder.array([])
  });
  buttons: ICustomButtonModal[] = [
    {
      color: 'dark',
      text: 'Volver',
      fill: 'clear',
      role: 'cancel',
      action: () => this._modalRef.hide()
    },
    {
      color: 'danger',
      text: 'Pedido incompleto',
      fill: 'clear',
      role: 'cancel',
      action: () => this.markAsIncompleteOrder()
    },
    {
      color: 'primary',
      text: 'Confirmar entrega',
      fill: 'solid',
      role: 'confirm',
      action: () => {
        this.confirmOrderDelivery();
      }
    }
  ];
  @Input({ required: true }) order: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _modalRef: BsModalRef,
    private _genericService: GenericService,
    private _alertsService: AlertsService,
  ) { }

  ngOnInit() {
    this.order.productos.forEach((product: any) => {
      this._addItem(product);
    });
  }

  markAsIncompleteOrder() {
    this._alertsService.showConfirmationAlert({
      title: 'Pedido incompleto',
      message: `Marcaremos tu pedido como incompleto y nos pondremos en contacto contigo mediante tu número telefónico`,
      confirmButtonText: 'Marcar como incompleto'
    }).then(result => {
      if (result.isConfirmed) {
        this._genericService.put<any>(`${HttpEntitiesEnum.ORDERS}/actualizar_orden/${this.order.id}`, {
          estado: OrderStatusEnum.INCOMPLETE
        })
          .pipe(take(1))
          .subscribe({
            next: (resp) => {
              this._alertsService.showToast({
                icon: 'success',
                text: 'Se ha marcado tu pedido como incompleto, en breve nos pondremos en contacto contigo'
              });
              this._modalRef.hide();
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

  confirmOrderDelivery() {
    this._alertsService.showConfirmationAlert({
      title: 'Confirmar recibido',
      message: `Al confirmar de recibido estas asegurando que recibiste todos los productos marcados en este checklist`,
      confirmButtonText: 'Confirmar recibido'
    }).then(result => {
      if (result.isConfirmed) {
        this.isLooadingConfirmation = true;
        this._genericService.put<any>(`${HttpEntitiesEnum.ORDERS}/finalizar_orden/${this.order.id}`, {
          producto_ids: this.items.value.map((item: any) => {
            return {
              id: item.producto_id,
              recibido: item.recibido
            }
          })
        })
          .pipe(take(1))
          .subscribe({
            next: (resp) => {
              this._alertsService.showToast({
                icon: 'success',
                text: 'Se ha marcado tu pedido como recibido'
              });
              this._modalRef.hide();
            },
            error: (error) => {
              this._alertsService.showToast({
                icon: 'error',
                text: 'Algo salio mal al actualizar tu pedido, intenta nuevamente'
              });
            },
            complete: () => this.isLooadingConfirmation = false
          });
      }
    });
  }

  get items(): any {
    return this.form.get('items') as any;
  }


  private _addItem(item: any) {
    const NEW_CART_ITEM = this._formBuilder.group({
      cantidad: [item.cantidad],
      producto_id: [item.producto.id, Validators.required],
      nombre: [item.producto.nombre, Validators.required],
      media: item.producto.media[0].media_url,
      recibido: [true],
    });
    this.items.push(NEW_CART_ITEM);
  }

}
