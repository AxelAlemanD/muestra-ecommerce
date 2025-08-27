import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { IProduct } from '../../../interfaces/product.interface';
import { IProductsGroupByCategory } from '../../../interfaces/product-group-by-category.interface';
import { debounceTime, Subject } from 'rxjs';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-product-group',
  standalone: true,
  imports: [
    CommonModule,
    SlickCarouselModule,
    CustomButtonComponent,
    ProductCardComponent
  ],
  templateUrl: './product-group.component.html',
  styleUrl: './product-group.component.scss',
})
export class ProductGroupComponent implements OnInit {

  activeGroup!: IProductsGroupByCategory;
  slideConfig!: any;
  showCarousel: boolean = false;
  @Input() title: string = '';
  @Input() autoplay: boolean = false;
  @Input({ required: true }) groups: IProductsGroupByCategory[] = [];
  @Input() style: 'grid' | 'carousel' = 'grid';
  @ViewChild('slickModal', { static: false }) productsGroupCarousel!: SlickCarouselComponent;


  ngOnInit(): void {
    this.groups.unshift({
      category: { id: 0, nombre: 'Todos', media: { id: 0, nombre: '', media_url: '' } },
      products: this.groups.flatMap(group => group.products)
    });
    this.activeGroup = this.groups[0];
    this._initCarousel();
  }

  changeActiveGroup(group: IProductsGroupByCategory) {
    this.activeGroup = group;
    this.showCarousel = false;
    setTimeout(() => {
      this.showCarousel = true;  
    }, 50);
  }

  prevSlide() {
    this.productsGroupCarousel.slickPrev();
  }

  nextSlide() {
    this.productsGroupCarousel.slickNext();
  }

  private _initCarousel() {
    this.showCarousel = true;

    this.slideConfig = {
      infinite: false,
      slidesToShow: 8,
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
            slidesToShow: 2
          }
        },
        {
          breakpoint: 670,
          settings: {
            slidesToShow: 2
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
            slidesToShow: 3
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4
          }
        },
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: 5
          }
        },
        {
          breakpoint: 1800,
          settings: {
            slidesToShow: 6
          }
        }
      ]
    };
  }
}
