import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { CustomControlComponent } from '../../../shared/components/custom-control/custom-control.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../../utils/custom-validators';
import { CustomerRepo } from '../../../shared/repositories/customer.repository';
import { GenericService } from '../../../services/generic.service';
import { HttpEntitiesEnum } from '../../../shared/enums/http-entities.enum';
import { AlertsService } from '../../../services/alerts.service';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomButtonComponent,
    CustomControlComponent
  ],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss',
})
export class ProfileFormComponent implements OnDestroy {

  form: FormGroup = this._formBuilder.group({
    id: [null, Validators.required],
    nombre: [null, Validators.required],
    apellidos: [null, Validators.required],
    telefono: [
      null,
      Validators.compose([
        Validators.required,
        this._customValidators.phoneValidator()
      ])
    ],
    email: [
      null,
      Validators.compose([
        Validators.email,
        Validators.required
      ])
    ],
  });
  private _subscription!: Subscription;

  constructor(
    private _formBuilder: FormBuilder,
    private _customerRepo: CustomerRepo,
    private _genericService: GenericService,
    private _alertsService: AlertsService,
    private _customValidators: CustomValidators
  ) {
    this._subscription = this._customerRepo.customer$.subscribe(customer => {
      if (customer) {
        this.form.reset(customer);
      }
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  updateProfile() {
    const { id, ...data } = this.form.value;
    this._genericService.put<any>(`${HttpEntitiesEnum.CUSTOMERS}/update_cliente/${id}`, data)
      .pipe(take(1))
      .subscribe(resp => {
        if (resp.message == "success") {
          this._customerRepo.setCustomer(data);
          this._alertsService.showToast({
            icon: 'success',
            text: 'Se ha actualizado el perfil'
          });
        } else {
          this._alertsService.showToast({
            icon: 'error',
            text: 'Ocurrio un problema al actualizar el perfil'
          });
        }
      });
  }

}
