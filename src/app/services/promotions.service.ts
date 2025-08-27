import { Injectable } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';
import { IPromotion } from '../interfaces/promotion.interface';
import { ProductsRepo } from '../shared/repositories/products.repository';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PromotionsService {

  constructor(
    private _productsRepo: ProductsRepo,
  ) { }

  validatePromotionAvailability(promotion: IPromotion) {
    return this.validatePromotionDate(promotion) && this.hasPromotionSufficientStock(promotion);
  }

  validatePromotionDate(promotion: IPromotion): Boolean {
    const CURRENT_DATE = moment();
    const START = moment(promotion.fecha_inicio, 'DD-MM-YYYY');
    const END = moment(promotion.fecha_expiracion, 'DD-MM-YYYY');
    return CURRENT_DATE.isBetween(START, END, 'days', '[]')
  }

  hasPromotionSufficientStock(promotion: IPromotion) {
    for (const PRODUCT_PROMOTION of promotion.productos) {
      const PRODUCT = this._productsRepo.getProductById(PRODUCT_PROMOTION.id);
      
      if (!PRODUCT) {
        return false;
      }

      if (PRODUCT_PROMOTION.variante) {
        const VARIANT = PRODUCT.variantes?.find(variant => variant.id == PRODUCT_PROMOTION.variante.id);
        if (VARIANT.stock < PRODUCT_PROMOTION.cantidad) {
          return false;
        }
      }


      if (PRODUCT.sucursales[0].stock < PRODUCT_PROMOTION.cantidad_producto) {
        return false;
      }
    }
    return true;
  }

}