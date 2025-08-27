import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { IProduct } from '../../../interfaces/product.interface';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [
    CommonModule,
    SlickCarouselModule,
    CustomButtonComponent,
    ProductCardComponent
  ],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.scss',
})
export class ProductCarouselComponent implements OnInit {

  slideConfig!: any;

  @Input() title: string = '';
  @Input() autoplay: boolean = false;
  @Input() size: 'default' | 'small' = 'default';
  @Input({ required: true }) products: IProduct[] = [];
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
      slidesToShow: (this.size === 'default') ? 8 : 4,
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
            slidesToShow: (this.size === 'default') ? 2 : 1
          }
        },
        {
          breakpoint: 670,
          settings: {
            slidesToShow: (this.size === 'default') ? 2 : 1
          }
        },
        {
          breakpoint: 760,
          settings: {
            slidesToShow: (this.size === 'default') ? 2 : 1
          }
        },
        {
          breakpoint: 860,
          settings: {
            slidesToShow: (this.size === 'default') ? 3 : 3
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: (this.size === 'default') ? 4 : 3
          }
        },
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: (this.size === 'default') ? 5 : 3
          }
        },
        {
          breakpoint: 1800,
          settings: {
            slidesToShow: (this.size === 'default') ? 6 : 4
          }
        }
      ]
    };
  }
}
