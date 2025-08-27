import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ProductCarouselComponent } from '../product-carousel/product-carousel.component';
import { IProduct } from '../../../interfaces/product.interface';
import { ProductsService } from '../../../services/products.service';
import { RouterModule } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlertsService } from '../../../services/alerts.service';
import { ICustomButtonModal } from '../../../interfaces/custom-button.interface';
import { IPromotion } from '../../../interfaces/promotion.interface';
import { PromotionCardComponent } from '../promotion-card/promotion-card.component';

@Component({
  selector: 'app-promotion-modification-alert-modal',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ModalBaseComponent,
    ProductCarouselComponent,
    PromotionCardComponent
  ],
  templateUrl: './promotion-modification-alert-modal.component.html',
  styleUrl: './promotion-modification-alert-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionModificationAlertModalComponent implements OnInit {

  relatedProducts: IProduct[] = [];
  buttons: ICustomButtonModal[] = [
    {
      color: 'medium',
      text: 'Ignorar',
      fill: 'solid',
      role: 'cancel',
      action: () => this._modalRef.hide()
    },
  ];
  @Input({ required: true }) message: string = '';
  @Input({ required: true }) promotions: IPromotion[] = [];

  constructor(
    private _alertsService: AlertsService,
    private _modalRef: BsModalRef,
    private _productsService: ProductsService,
  ) { }

  ngOnInit() {
    this._loadRelatedProducts();
  }

  showProductAddAlert() {
    this._alertsService.showToast({
      icon: 'success',
      text: 'Se ha agreado el producto a tu carrito'
    });
    this._modalRef.hide();
  }

  private _loadRelatedProducts() {
    // if (this.product.marca) {
    //   this.relatedProducts = this._productsService.filter(`marca=${this.product.marca.id}`)
    //     .filter(product => product.id != this.product.id);
    // }
  }
}
