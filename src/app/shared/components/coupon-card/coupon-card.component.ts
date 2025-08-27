import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ICoupon } from '../../../interfaces/coupon.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coupon-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './coupon-card.component.html',
  styleUrl: './coupon-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouponCardComponent {

  @Input({ required: true }) coupon!: any;

}
