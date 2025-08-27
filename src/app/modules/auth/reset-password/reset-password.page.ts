import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITimelineItem } from '../../../interfaces/timeline.interface';
import { CustomValidators } from '../../../utils/custom-validators';
import { Router, RouterModule } from '@angular/router';
import { GenericService } from '../../../services/generic.service';
import { HttpEntitiesEnum } from '../../../shared/enums/http-entities.enum';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { CustomControlComponent } from '../../../shared/components/custom-control/custom-control.component';
import { OtpInputComponent } from './components/otp-input/otp-input.component';
import { AlertsService } from '../../../services/alerts.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CustomControlComponent,
    CustomButtonComponent,
    OtpInputComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './reset-password.page.html',
  styleUrl: './reset-password.page.scss',
})
export class ResetPasswordPage {
  form: FormGroup = this._formBuilder.group({
    email: [
      null,
      Validators.compose([
        Validators.email,
        Validators.required
      ])
    ],
    pin: [
      null,
      Validators.compose([
        Validators.required,
        Validators.minLength(4)
      ])
    ],
    password: [
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
    token: [null, Validators.required]
  });

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  timeline: ITimelineItem[] = [
    {
      id: 1,
      icon: '',
      title: 'Restablecer contraseña'
    },
    {
      id: 2,
      icon: '',
      title: 'Restablecer contraseña'
    },
    {
      id: 3,
      icon: '',
      title: 'Restablecer contraseña'
    },
    {
      id: 4,
      icon: 'checkmark-circle',
      title: 'Tu cuenta ha sido creada exitosamente'
    }
  ];
  currentStep: ITimelineItem = this.timeline[0];
  seconds: number = 3;
  private _intervalId: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _genericService: GenericService,
    private _alertsService: AlertsService,
    private _customValidators: CustomValidators
  ) { }

  ngOnInit() {
    this.form.get('confirmPassword')?.setValidators([
      Validators.required,
      this._customValidators.passwordMatch(this.form.get('password')!, this.form.get('confirmPassword')!),
    ]);
  }

  ngOnDestroy(): void {
    clearInterval(this._intervalId);
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  nextStep() {
    const CURRENT_INDEX = this.timeline.findIndex(step => step.id === this.currentStep.id);
    if (CURRENT_INDEX <= this.timeline.length - 1) {
      this.currentStep = this.timeline[CURRENT_INDEX + 1];
    }
  }

  startCountdown(): void {
    this._intervalId = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else {
        clearInterval(this._intervalId);
        this._router.navigate(['/auth/login']);
      }
    }, 1000);
  }

  setPin(pin: number) {
    this.form.patchValue({ pin });
  }

  requestResetPassword(changeStep: boolean = true) {
    this._genericService
      .post<any>(
        `${HttpEntitiesEnum.AUTH}/sendResetPin`,
        {
          email: this.form.value['email'],
        })
      .pipe(take(1))
      .subscribe({
        next: async (resp) => {
          if (resp.message == "success") {
            this._alertsService.showToast({
              icon: 'success',
              text: 'Se ha enviado el PIN al correo'
            });
            if (changeStep) {
              this.nextStep();
            }
          } else {
            this._alertsService.showToast({
              icon: 'error',
              text: 'Ocurrio un problema al enviar el PIN, verifica tu dirección de correo'
            });
          }
        },
        error: (error: any) => {
          if (error.error.errors.email[0] == "The selected email is invalid.") {
            this.form.controls['email'].setErrors({
              email: true
            });
            this._alertsService.showToast({
              icon: 'error',
              text: 'Esta dirección de correo no se encuentra registrada'
            });
          }
        }
      });
  }

  verifyPin() {
    this._genericService
      .post<any>(
        `${HttpEntitiesEnum.AUTH}/verify-pin`,
        {
          email: this.form.value['email'],
          pin: this.form.value['pin'],
        })
      .pipe(take(1))
      .subscribe({
        next: async (resp) => {
          if (resp.message == "success") {
            this.form.patchValue({
              token: resp.data.token
            });
            this.nextStep();
          } else {
            this._alertsService.showToast({
              icon: 'error',
              text: 'El PIN ingresado es incorrecto o ya expiró'
            });
          }
        },
      });
  }

  resetPassword() {
    this._genericService
      .post<any>(
        `${HttpEntitiesEnum.AUTH}/reset-password`,
        {
          email: this.form.value['email'],
          new_password: this.form.value['confirmPassword'],
          token: this.form.value['token'],
        })
      .pipe(take(1))
      .subscribe({
        next: async (resp) => {
          if (resp.message == "success") {
            this._alertsService.showToast({
              icon: 'success',
              text: 'Contraseña restablecida'
            });
            this.nextStep();
            this.startCountdown();
          } else {
            this._alertsService.showToast({
              icon: 'error',
              text: 'Ocurrio un problema al restablecer contraseña'
            });
          }
        }
      });
  }
}
