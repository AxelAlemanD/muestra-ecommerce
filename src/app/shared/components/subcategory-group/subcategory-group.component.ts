import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CategoryCardComponent } from '../category-card/category-card.component';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { ICategory } from '../../../interfaces/category.interface';
import { Router } from '@angular/router';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-subcategory-group',
  standalone: true,
  imports: [
    CommonModule,
    SlickCarouselModule,
    CustomButtonComponent,
    CategoryCardComponent
  ],
  templateUrl: './subcategory-group.component.html',
  styleUrl: './subcategory-group.component.scss',
})
export class SubcategoryGroupComponent implements OnInit {

  activeCategory!: ICategory;
  slideConfig!: any;
  showCarousel: boolean = false;
  @Input() title: string = '';
  @Input() autoplay: boolean = false;
  @Input({ required: true }) categories: ICategory[] = [];
  @ViewChild('slickModal', { static: false }) subcategoryGroupCarousel!: SlickCarouselComponent;

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.categories = this.categories.filter(category => category.subcategorias && category.subcategorias.length);
    this.activeCategory = this.categories[0];
    this._initCarousel();
  }

  changeActiveCategory(category: ICategory) {
    this.activeCategory = category;
    this.showCarousel = false;
    setTimeout(() => {
      this.showCarousel = true;
    }, 50);
  }

  prevSlide() {
    this.subcategoryGroupCarousel.slickPrev();
  }

  nextSlide() {
    this.subcategoryGroupCarousel.slickNext();
  }

  redirectToSubcategory(subcategory: ICategory) {
    this._router.navigateByUrl(`/categorias/${this.activeCategory.id}/subcategoria/${subcategory.id}`);
  }

  private _initCarousel() {
    this.showCarousel = true;
    this.slideConfig = {
      infinite: true,
      slidesToShow: 8,
      slidesToScroll: 1,
      autoplay: this.autoplay,
      autoplaySpeed: 2500,
      speed: 700,
      dots: false,
      arrows: false,
      responsive: [
        {
          breakpoint: 0,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 6
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 8
          }
        },
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: 10
          }
        }
      ]
    };
  }
}
