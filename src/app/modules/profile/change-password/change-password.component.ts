import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { CustomControlComponent } from '../../../shared/components/custom-control/custom-control.component';
import { CustomValidators } from '../../../utils/custom-validators';
import { HttpEntitiesEnum } from '../../../shared/enums/http-entities.enum';
import { GenericService } from '../../../services/generic.service';
import { AlertsService } from '../../../services/alerts.service';
import { CustomerRepo } from '../../../shared/repositories/customer.repository';
import { ICustomer } from '../../../interfaces/customer.interface';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomButtonComponent,
    CustomControlComponent
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnDestroy {

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  form: FormGroup = this._formBuilder.group({
    currentPassword: [
      null,
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        this._customValidators.password()
      ])
    ],
    newPassword: [
      null,
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        this._customValidators.password()
      ])
    ],
    confirmPassword: [
      null,
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        this._customValidators.password()
      ])
    ],
  });

  private _customer: ICustomer | null = null;
  private _subscription!: Subscription;

  constructor(
    private _formBuilder: FormBuilder,
    private _genericService: GenericService,
    private _alertsService: AlertsService,
    private _customerRepo: CustomerRepo,
    private _customValidators: CustomValidators
  ) {
    this._subscription = this._customerRepo.customer$.subscribe(customer => {
      if (customer) {
        this._customer = customer;
      }
    });
    this.form.controls['confirmPassword'].setValidators([
      Validators.required,
      this._customValidators.passwordMatch(this.form.controls['newPassword'], this.form.controls['confirmPassword']),
    ]);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  updatePassword() {
    if (!this._customer) {
      return;
    }
    this._genericService.put<any>(`${HttpEntitiesEnum.CUSTOMERS}/update_password/${this._customer.id}`, {
      current_password: this.form.value['currentPassword'],
      password: this.form.value['confirmPassword']
    })
      .pipe(take(1))
      .subscribe(resp => {
        if (resp.message == "success") {
          this._alertsService.showToast({
            icon: 'success',
            text: 'Se ha actualizado la contraseña'
          });
          this.form.reset();
        } else {
          this._alertsService.showToast({
            icon: 'error',
            text: resp.data[0]
          });
        }
      });
  }
}