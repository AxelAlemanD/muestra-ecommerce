import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalBaseComponent } from '../../../../shared/components/modal-base/modal-base.component';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomRadioItemComponent } from '../../../../shared/components/custom-radio-item/custom-radio-item.component';
import { PaymentMethodEnum } from '../../../../shared/enums/payment-method.enum';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-select-payment-method-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalBaseComponent,
    CustomRadioItemComponent,
  ],
  templateUrl: './select-payment-method-modal.component.html',
  styleUrl: './select-payment-method-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPaymentMethodModalComponent implements OnInit {

  @Input() selectedPaymentMethod: PaymentMethodEnum | null = null;
  @Output() onConfirm: EventEmitter<PaymentMethodEnum> = new EventEmitter();
  
  options: any[] = [
    {
      id: PaymentMethodEnum.CARD,
      label: 'Tarjeta de crédito / débito',
    },
    {
      id: PaymentMethodEnum.CASH,
      label: 'Efectivo',
    }
  ];
  form: FormGroup = this._formBuilder.group({
    option: [null, Validators.required]
  });

  constructor(
    private _formBuilder: FormBuilder,
    private _modalRef: BsModalRef,
  ) { }

  ngOnInit(): void {
    if(this.selectedPaymentMethod) {
      this.form.patchValue({
        option: this.selectedPaymentMethod
      });
    }
  }

  confirmSelected() {
    const SELECTED: any | undefined = this.options.find(option => option.id == this.form.value['option']);
    if (SELECTED) {
      this.onConfirm.emit(SELECTED.id);
      this._modalRef.hide();
    }
  }
}
