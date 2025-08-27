import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalBaseComponent } from '../../../../shared/components/modal-base/modal-base.component';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomRadioItemComponent } from '../../../../shared/components/custom-radio-item/custom-radio-item.component';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { IAddress } from '../../../../interfaces/address.interface';
import { AddressesRepo } from '../../../../shared/repositories/addresses.repository';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddressFormComponent } from '../../../profile/my-addresses/components/address-form/address-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select-delivery-address-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalBaseComponent,
    CustomRadioItemComponent,
    CustomButtonComponent
  ],
  templateUrl: './select-delivery-address-modal.component.html',
  styleUrl: './select-delivery-address-modal.component.scss',
})
export class SelectDeliveryAddressModalComponent implements OnInit, OnDestroy {

  @Input() selectedDeliveryAddress: number | null = null;
  @Output() onConfirm: EventEmitter<IAddress> = new EventEmitter();

  options: IAddress[] = [];
  form: FormGroup = this._formBuilder.group({
    option: [null, Validators.required]
  });

  private _subscription!: Subscription;

  constructor(
    private _router: Router,
    private _modalRef: BsModalRef,
    private _formBuilder: FormBuilder,
    private _addressesRepo: AddressesRepo,
    private _modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this._subscription = this._addressesRepo.addresses$.subscribe(addresses => {
      this.options = addresses;
    });

    if (this.selectedDeliveryAddress) {
      this.form.patchValue({
        option: this.selectedDeliveryAddress
      });
    }
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
  
  openAddressFormModal() {
    this._modalService.show(
      AddressFormComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        backdrop: 'static',
        initialState: {
          isModal: true
        }
      }
    );
  }

  confirmSelected() {
    const SELECTED: any | undefined = this.options.find(option => option.id == this.form.value['option']);
    if (SELECTED) {
      this.onConfirm.emit(SELECTED);
      this._modalRef.hide();
    }
  }
}
