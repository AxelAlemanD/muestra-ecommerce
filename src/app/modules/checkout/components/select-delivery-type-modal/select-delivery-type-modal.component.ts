import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalBaseComponent } from '../../../../shared/components/modal-base/modal-base.component';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomRadioItemComponent } from '../../../../shared/components/custom-radio-item/custom-radio-item.component';
import { DeliveryTypeEnum } from '../../../../shared/enums/delivery-type.enum';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-select-delivery-type-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalBaseComponent,
    CustomRadioItemComponent,
  ],
  templateUrl: './select-delivery-type-modal.component.html',
  styleUrl: './select-delivery-type-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDeliveryTypeModalComponent implements OnInit {

  @Input() selectedDeliveryType: DeliveryTypeEnum | null = null;
  @Output() onConfirm: EventEmitter<DeliveryTypeEnum> = new EventEmitter();
  
  options: any[] = [
    {
      id: DeliveryTypeEnum.DELIVERY,
      label: 'Entrega a domiclio',
    },
    /*{
      id: DeliveryTypeEnum.PICK_UP,
      label: 'Recoger en sucursal',
    }*/
  ];
  form: FormGroup = this._formBuilder.group({
    option: [null, Validators.required]
  });

  constructor(
    private _formBuilder: FormBuilder,
    private _modalRef: BsModalRef,
  ) { }

  ngOnInit(): void {
    if(this.selectedDeliveryType) {
      this.form.patchValue({
        option: this.selectedDeliveryType
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
