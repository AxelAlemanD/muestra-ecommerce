import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomControlComponent } from '../../../shared/components/custom-control/custom-control.component';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomCheckboxComponent } from '../../../shared/components/custom-checkbox/custom-checkbox.component';
import { AuthService } from '../../../services/auth.service';
import { AlertsService } from '../../../services/alerts.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CustomControlComponent,
    CustomButtonComponent,
    CustomCheckboxComponent
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage implements OnInit {

  form: FormGroup = this._formBuilder.group({
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
        Validators.minLength(8)
      ])
    ],
    remember: [true]
  });

  showPassword: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _alertsService: AlertsService,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() { }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this._authService.login({
      clientes: this.form.value['email'],
      password: this.form.value['password'],
    }, this.form.value['remember']).subscribe({
      next: (resp) => {
        this._alertsService.showToast({
          icon: 'success',
          text: 'Haz iniciado sesión en tu cuenta'
        });
        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL');
        if (redirectURL) {
          this._router.navigateByUrl(redirectURL);
          return;
        }
        this._router.navigate(['/']);
      },
      error: (error) => {
        this._alertsService.showToast({
          icon: 'error',
          text: error.message
        });
        this.form.setErrors({
          invalidCredentials: true
        });
        this.form.controls['email'].setErrors({
          required: true
        });
        this.form.controls['password'].setErrors({
          required: true
        });
      }
    });
  }
}
