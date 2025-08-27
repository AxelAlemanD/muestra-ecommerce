import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ProductCarouselComponent } from '../product-carousel/product-carousel.component';
import { IProduct } from '../../../interfaces/product.interface';
import { ProductsService } from '../../../services/products.service';
import { RouterModule } from '@angular/router';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlertsService } from '../../../services/alerts.service';
import { ICustomButtonModal } from '../../../interfaces/custom-button.interface';

@Component({
  selector: 'app-product-modification-alert-modal',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ModalBaseComponent,
    ProductCarouselComponent,
    ProductCardComponent
  ],
  templateUrl: './product-modification-alert-modal.component.html',
  styleUrl: './product-modification-alert-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductModificationAlertModalComponent implements OnInit {

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
  @Input({ required: true }) product!: IProduct;

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
    if (this.product.marca) {
      this.relatedProducts = this._productsService.filter(`marca=${this.product.marca.id}`)
        .filter(product => product.id != this.product.id);
    }
  }
}
