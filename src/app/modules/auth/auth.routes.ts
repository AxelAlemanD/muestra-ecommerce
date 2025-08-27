import { Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { SignUpPage } from './sign-up/sign-up.page';
import { ResetPasswordPage } from './reset-password/reset-password.page';

export default [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'sign-up',
    component: SignUpPage,
  },
  {
    path: 'reset-password',
    component: ResetPasswordPage,
  },
] as Routes;

