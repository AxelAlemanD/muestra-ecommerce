import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-testimonials-block',
  standalone: true,
  imports: [
    CommonModule,
    SlickCarouselModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './testimonials-block.component.html',
  styleUrl: './testimonials-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsBlockComponent {

  slideConfig = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
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
        breakpoint: 600,
        settings: {
          slidesToShow: 1
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      }
    ]
  };

  @Input() title: string = '';
  @Input({ required: true }) items!: any[];
}
