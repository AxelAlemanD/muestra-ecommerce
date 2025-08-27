
import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { PromotionsBlockComponent } from '../../home/components/promotions-block/promotions-block.component';
import { SliderComponent } from '../../home/components/slider/slider.component';
import { IProduct } from '../../../interfaces/product.interface';
import { ProductGridComponent } from '../../../shared/components/product-grid/product-grid.component';
import { IPromotion } from '../../../interfaces/promotion.interface';
import { ProductsRepo } from '../../../shared/repositories/products.repository';
import { PromotionsRepo } from '../../../shared/repositories/promotions.repository';
import { SlidersRepo } from '../../../shared/repositories/sliders.repository';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { IBreadcrumbItem } from '../../../interfaces/breadcrumb.interface';
import { CustomerCouponsRepo } from '../../../shared/repositories/customer-coupons.repository';
import { ICoupon } from '../../../interfaces/coupon.interface';
import { GeneralCouponsRepo } from '../../../shared/repositories/general-coupons.repository';
import { CouponCarouselComponent } from '../../../shared/components/coupon-carousel/coupon-carousel.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-promotion-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductGridComponent,
    SliderComponent,
    PromotionsBlockComponent,
    BreadcrumbComponent,
    CouponCarouselComponent
  ],
  templateUrl: './promotion-list.page.html',
  styleUrl: './promotion-list.page.scss',
})
export class PromotionListPage implements OnDestroy {

  customerCoupons: ICoupon[] = [];
  generalCoupons: ICoupon[] = [];
  promotions: IPromotion[] = [];
  sliderItems: IPromotion[] = [];
  promotionProducts: IProduct[] = [];
  breadcrumb: IBreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Promociones', url: '/promociones' },
  ];

  private _subscriptions: Subscription[] = [];

  constructor(
    private _promotionsRepo: PromotionsRepo,
    private _productsRepo: ProductsRepo,
    private _slidersRepo: SlidersRepo,
    private _generalCouponsRepo: GeneralCouponsRepo,
    private _customerCouponsRepo: CustomerCouponsRepo,
  ) {
    this._subscriptions.push(
      this._customerCouponsRepo.coupons$.subscribe(coupons => this.customerCoupons = coupons)
    );
    this._subscriptions.push(
      this._generalCouponsRepo.coupons$.subscribe(coupons => this.generalCoupons = coupons)
    );
    this._subscriptions.push(
      this._promotionsRepo.promotions$.subscribe(promotions => this.promotions = promotions)
    );
    this._subscriptions.push(
      this._slidersRepo.sliders$.subscribe(sliders => this.sliderItems = sliders)
    );
    this._subscriptions.push(
      this._productsRepo.products$.subscribe(products => {
        this.promotionProducts = products.filter(product => product.contiene_promocion);
      })
    );
  }
  
  ngOnDestroy() {
    if (this._subscriptions.length) {
      this._subscriptions.forEach(subscription => subscription.unsubscribe())
    }
  }
}
