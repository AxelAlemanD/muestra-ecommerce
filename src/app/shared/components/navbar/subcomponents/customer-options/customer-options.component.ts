import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../../../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-options',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './customer-options.component.html',
  styleUrl: './customer-options.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerOptionsComponent {

  constructor(
    private _authService: AuthService
  ) { }

  logout() {
    this._authService.logout()
  }
}
