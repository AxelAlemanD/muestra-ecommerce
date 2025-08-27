import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
import { SubcategoryGroupComponent } from '../../shared/components/subcategory-group/subcategory-group.component';
import { ProductGroupComponent } from '../../shared/components/product-group/product-group.component';
import { ICategory } from '../../interfaces/category.interface';
import { IProductsGroupByCategory } from '../../interfaces/product-group-by-category.interface';
import { BrandCarouselComponent } from './components/brand-carousel/brand-carousel.component';
import { IBrand } from '../../interfaces/brand.interface';
import { SliderComponent } from './components/slider/slider.component';
import { PromotionsBlockComponent } from './components/promotions-block/promotions-block.component';
import { IPromotion } from '../../interfaces/promotion.interface';
import { TestimonialsBlockComponent } from './components/testimonials-block/testimonials-block.component';
import { FaqBlockComponent } from './components/faq-block/faq-block.component';
import { GenericService } from '../../services/generic.service';
import { BrandsRepo } from '../../shared/repositories/brands.repository';
import { ProductsRepo } from '../../shared/repositories/products.repository';
import { PromotionsRepo } from '../../shared/repositories/promotions.repository';
import { CategoriesRepo } from '../../shared/repositories/categories.repository';
import { SlidersRepo } from '../../shared/repositories/sliders.repository';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProductGroupComponent,
    SubcategoryGroupComponent,
    BrandCarouselComponent,
    SliderComponent,
    PromotionsBlockComponent,
    TestimonialsBlockComponent,
    FaqBlockComponent
  ],
  providers: [GenericService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnDestroy {

  questions: any[] = [
    {
      id: 1,
      question: '¿Los productos son originales?',
      answer: 'Si, todos los productos que ofrecemos en este sitio web son originales y cuentan con sello de garantía de calidad por los proveedores de las mismas.',
    },
    {
      id: 2,
      question: '¿Realizan envíos a domicilio?',
      answer: 'Contamos con envío a domicilio en muchas de nuestras sucursales, asegurando una entrega segura y de calidad.',
    },
    {
      id: 3,
      question: 'Qué métodos de pago aceptan?',
      answer: 'Aceptamos pagos con tarjetas MasterCard, AmericanExpress y Visa, por lo que puedes realizar tus compras sin ningún contratiempo.',
    },
  ]
  testimonials: any[] = [
    {
      id: 1,
      customer: 'Axel Alemán',
      opinion: `Los productos son de muy buena calidad y el envío a domicilio es muy rápido. Sin duda volvería a comprar aquí.`,
      rate: 4,
      date: new Date()
    },
    {
      id: 2,
      customer: 'Edgar Ramos',
      opinion: `Estuve buscando alimento de calidad para mis perros y este fue el único sitio en donde logré encontrarlo. Estoy encantado con el servicio que brindan`,
      rate: 5,
      date: new Date()
    },
    {
      id: 3,
      customer: 'Enrique Segoviano',
      opinion: `Al principio dudé de la veracidad del sitio, pero realicé una compra a domicilio y todo llegó muy rápido y en buen estado.`,
      rate: 4,
      date: new Date()
    }
  ];
  promotions: IPromotion[] = [];
  sliderItems: IPromotion[] = [];
  brands: IBrand[] = [];
  categories: ICategory[] = [];
  popularProducts: IProductsGroupByCategory[] = [];
  bestSellingProductsOfTheDay: IProductsGroupByCategory[] = [];
  private _subscriptions: Subscription[] = [];

  constructor(
    private _brandsRepo: BrandsRepo,
    private _promotionsRepo: PromotionsRepo,
    private _categoriesRepo: CategoriesRepo,
    private _productsRepo: ProductsRepo,
    private _slidersRepo: SlidersRepo,
  ) {
    this._subscriptions.push(
      this._brandsRepo.brands$.subscribe(brands => this.brands = brands)
    );
    this._subscriptions.push(
      this._categoriesRepo.categories$.subscribe(categories => {
        this.categories = categories.filter(category => {
          return category.subcategorias && category.subcategorias.length
        });
      })
    );
    this._subscriptions.push(
      this._promotionsRepo.promotions$.subscribe(promotions => this.promotions = promotions)
    );
    this._subscriptions.push(
      this._slidersRepo.sliders$.subscribe(sliders => this.sliderItems = sliders)
    );
    this._subscriptions.push(
      this._productsRepo.products$.subscribe(products => {
        const GROUPED_BY_CATEGORY: IProductsGroupByCategory[] = [];
        products.filter(product => product && product.es_destacado).forEach(product => {
          const GROUP = GROUPED_BY_CATEGORY.find(group => group.category.id == product.categorias[0].id);
          if (GROUP) {
            GROUP.products.push(product);
          } else {
            GROUPED_BY_CATEGORY.push({
              category: product.categorias[0],
              products: [product]
            })
          }
        });
        this.popularProducts = [...GROUPED_BY_CATEGORY];
        this.bestSellingProductsOfTheDay = [...GROUPED_BY_CATEGORY];
      })
    );
  }

  ngOnDestroy() {
    if (this._subscriptions.length) {
      this._subscriptions.forEach(subscription => subscription.unsubscribe())
    }
  }
}