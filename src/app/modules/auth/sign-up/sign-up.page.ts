import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { CustomControlComponent } from '../../../shared/components/custom-control/custom-control.component';
import { TimelineComponent } from '../../../shared/components/timeline/timeline.component';
import { ITimelineItem } from '../../../interfaces/timeline.interface';
import { CustomCheckboxComponent } from '../../../shared/components/custom-checkbox/custom-checkbox.component';
import { CustomValidators } from '../../../utils/custom-validators';
import 'ionicons';
import { GenericService } from '../../../services/generic.service';
import { ICustomer } from '../../../interfaces/customer.interface';
import { HttpEntitiesEnum } from '../../../shared/enums/http-entities.enum';
import { AuthService } from '../../../services/auth.service';
import { IAuthResponse } from '../../../interfaces/auth.interface';
import { take } from 'rxjs';
import { AlertsService } from '../../../services/alerts.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CustomControlComponent,
    CustomButtonComponent,
    TimelineComponent,
    CustomCheckboxComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sign-up.page.html',
  styleUrl: './sign-up.page.scss',
})
export class SignUpPage implements OnInit {
  form: FormGroup = this._formBuilder.group({
    generalData: this._formBuilder.group({
      firstName: [
        null,
        Validators.required
      ],
      lastName: [
        null,
        Validators.required
      ],
      phone: [
        null,
        Validators.compose([
          Validators.required,
          this._customValidators.phoneValidator()
        ])
      ],
    }),
    credentials: this._formBuilder.group({
      email: [
        null,
        Validators.compose([
          Validators.email,
          Validators.required
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
      confirmPassword: [null],
    }),
    agreements: [
      false,
      Validators.requiredTrue
    ],
  });

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  timeline: ITimelineItem[] = [
    {
      id: 1,
      icon: 'person-circle',
      title: 'Datos Generales'
    },
    {
      id: 2,
      icon: 'key',
      title: 'Credenciales de acceso'
    },
    {
      id: 3,
      icon: 'receipt',
      title: 'Términos y condiciones'
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
    private _authService: AuthService,
    private _genericService: GenericService,
    private _customValidators: CustomValidators,
    private _alertsService: AlertsService,
  ) { }

  ngOnInit() {
    this.form.get('credentials')?.setValidators([
      this._customValidators.passwordMatch(this.form.get('credentials.confirmPassword')!, this.form.get('credentials.password')!),
    ]);
    this.form.get('credentials.confirmPassword')?.setValidators([
      Validators.required,
      Validators.minLength(8),
      this._customValidators.password(),
      this._customValidators.passwordMatch(this.form.get('credentials.password')!, this.form.get('credentials.confirmPassword')!),
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

  previousStep() {
    const CURRENT_INDEX = this.timeline.findIndex(step => step.id === this.currentStep.id);
    if (CURRENT_INDEX > 0) {
      this.currentStep = this.timeline[CURRENT_INDEX - 1];
    }
  }

  createAccount() {
    this._genericService
      .post<IAuthResponse>(
        `${HttpEntitiesEnum.CUSTOMERS}/new_clientes`,
        {
          nombre: this.form.get('generalData.firstName')!.value,
          apellidos: this.form.get('generalData.lastName')!.value,
          email: this.form.get('credentials.email')!.value,
          password: this.form.get('credentials.password')!.value,
          telefono: this.form.get('generalData.phone')!.value
        })
      .pipe(take(1))
      .subscribe({
        next: async (res) => {
          this._authService.login({
            clientes: this.form.get('credentials.email')!.value,
            password: this.form.get('credentials.password')!.value
          }).subscribe(resp => {
            this.nextStep();
            this.startCountdown();
          });
        },
        error: async (err) => {
          if (err.error.message == "The email has already been taken.") {
            this._alertsService.showToast({
              icon: 'error',
              text: 'Esta dirección de correo ya se encuentra registrada, intenta iniciar sesión o restablecer tu contraseña'
            });
          }
        },
      });
  }

  startCountdown(): void {
    this._intervalId = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else {
        clearInterval(this.seconds);
        this._router.navigate(['/']);
      }
    }, 1000);
  }
}
