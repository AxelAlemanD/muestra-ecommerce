import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { ICoupon } from '../../../interfaces/coupon.interface';
import { CouponCardComponent } from '../coupon-card/coupon-card.component';
import { CustomButtonComponent } from '../custom-button/custom-button.component';

@Component({
  selector: 'app-coupon-carousel',
  standalone: true,
  imports: [
    CommonModule,
    CommonModule,
    SlickCarouselModule,
    CustomButtonComponent,
    CouponCardComponent
  ],
  templateUrl: './coupon-carousel.component.html',
  styleUrl: './coupon-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouponCarouselComponent implements OnInit {

  slideConfig!: any;

  @Input() title: string = '';
  @Input() autoplay: boolean = false;
  @Input({ required: true }) coupons: ICoupon[] = [];
  @ViewChild('slickModal', { static: false }) slickCarousel!: SlickCarouselComponent;

  ngOnInit(): void {
    this._initCarousel();
  }

  prevSlide() {
    this.slickCarousel.slickPrev();
  }

  nextSlide() {
    this.slickCarousel.slickNext();
  }

  private _initCarousel() {
    this.slideConfig = {
      infinite: false,
      slidesToShow: 5,
      slidesToScroll: 1,
      // autoplay: this.autoplay,
      autoplaySpeed: 2500,
      speed: 700,
      dots: false,
      arrows: false,
      responsive: [
        {
          breakpoint: 0,
          settings: {
            slidesToShow: 1
          }
        },
        {
          breakpoint: 700,
          settings: {
            slidesToShow: 1
          }
        },
        {
          breakpoint: 760,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 860,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 1800,
          settings: {
            slidesToShow: 4
          }
        }
      ]
    };
  }
}
