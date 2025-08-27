import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { UploadsPipe } from '../../../../shared/pipes/uploads.pipe';
import { IPromotion } from '../../../../interfaces/promotion.interface';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { LazyImageDirective } from '../../../../shared/directives/lazy-image.directive';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [
    CommonModule,
    SlickCarouselModule,
    CustomButtonComponent,
    UploadsPipe,
    LazyImageDirective
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent {

  slideConfig = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 2500,
    speed: 700,
    dots: true,
    arrows: false,
  };
  @Input({ required: true }) items: IPromotion[] = [];
  @ViewChild('slickModal', { static: false }) slickCarousel!: SlickCarouselComponent;

  prevSlide() {
    this.slickCarousel.slickPrev();
  }

  nextSlide() {
    this.slickCarousel.slickNext();
  }
}
