import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IBrand } from '../../../../interfaces/brand.interface';
import { UploadsPipe } from '../../../../shared/pipes/uploads.pipe';
import { RouterModule } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { LazyImageDirective } from '../../../../shared/directives/lazy-image.directive';

@Component({
  selector: 'app-brand-carousel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SlickCarouselModule,
    UploadsPipe,
    LazyImageDirective
  ],
  templateUrl: './brand-carousel.component.html',
  styleUrl: './brand-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandCarouselComponent {
  slideConfig = {
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 5000,
    cssEase: 'linear',
    dots: false,
    arrows: false,
    draggable: true,
    swipeToSlide: true,
    touchMove: true,
    responsive: [
      {
        breakpoint: 0,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 5
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6
        }
      }
    ]
  };
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input({ required: true }) brands: IBrand[] = []
}
