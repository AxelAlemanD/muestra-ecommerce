import { Injectable } from '@angular/core';
import { ICart, ICartProduct, ICartPromotion } from '../interfaces/cart.interface';
import { OrderStatusEnum } from '../shared/enums/order-status.enum';
import { CartRepo } from '../shared/repositories/cart.repository';

@Injectable({
  providedIn: 'root'
})
export class LocalCartService {

  constructor(
    private _cartRepo: CartRepo,
  ) { }

  getCart(): ICart {
    if (!this._cartRepo.getCart()) {
      this.createCart();
    }
    return this._cartRepo.getCart()!
  }

  createCart() {
    this._cartRepo.setCart(this.getNewCart());
  }

  updateCart(cart: ICart) {
    this._cartRepo.setCart(cart);
  }

  addProduct(cartProduct: ICartProduct) {
    let cart: ICart | null = this._cartRepo.getCart();
    if (!cart) {
      cart = this.getNewCart();
    }
    cart.productos.push(cartProduct);
    const UPDATED_CART = { ...cart, productos: [...cart.productos] };
    const { total, subtotal, descuento } = this.getTotals(UPDATED_CART);
    UPDATED_CART.subtotal = subtotal;
    UPDATED_CART.descuento = descuento;
    UPDATED_CART.costo_envio = 0;
    UPDATED_CART.total = total;
    // UPDATED_CART.costo_envio = this.calculateShippingCost(total);
    // UPDATED_CART.total = total + this.calculateShippingCost(total);
    this._cartRepo.setCart(UPDATED_CART);
  }

  updateProduct(cartProduct: ICartProduct) {
    cartProduct.monto = cartProduct.producto.precio * cartProduct.cantidad;
    let cart: ICart = this._cartRepo.getCart()!;

    const ITEM_INDEX = cart.productos.findIndex(item => {
      if (cartProduct.variante_id) {
        return item.producto.id == cartProduct.producto.id && item.variante_id == cartProduct.variante_id;
      }
      return item.producto.id == cartProduct.producto.id;
    });

    if (ITEM_INDEX >= 0) {
      cart.productos[ITEM_INDEX] = cartProduct;
    }

    /*if (cart.productos.some(item => item.producto.id == cartProduct.producto.id)) {
      // const ITEM_INDEX = cart.productos.findIndex(item => {item.producto.id == cartProduct.producto.id});
      cart.productos[ITEM_INDEX] = cartProduct;
    }*/
    const UPDATED_CART = { ...cart, productos: [...cart.productos] };
    const { total, subtotal, descuento } = this.getTotals(UPDATED_CART);
    UPDATED_CART.subtotal = subtotal;
    UPDATED_CART.descuento = descuento;
    UPDATED_CART.costo_envio = 0;
    UPDATED_CART.total = total;
    // UPDATED_CART.costo_envio = this.calculateShippingCost(total);
    // UPDATED_CART.total = total + this.calculateShippingCost(total);
    this._cartRepo.setCart(UPDATED_CART);
  }

  removeProduct(cartProduct: ICartProduct) {
    const CART: ICart = this._cartRepo.getCart()!;
    // const CART_PRODUCTS = CART.productos.filter(item => item.id != cartProduct.id);
    const CART_PRODUCTS = CART.productos.filter(item => {
      if (item.variante_id) {
        return item.producto.id != cartProduct.producto.id || item.variante_id != cartProduct.variante_id;
      }
      return item.producto.id != cartProduct.producto.id;
    });

    const UPDATED_CART = { ...CART, productos: [...CART_PRODUCTS] };
    const { total, subtotal, descuento } = this.getTotals(UPDATED_CART);
    UPDATED_CART.subtotal = subtotal;
    UPDATED_CART.descuento = descuento;
    UPDATED_CART.costo_envio = 0;
    UPDATED_CART.total = total;
    // UPDATED_CART.costo_envio = this.calculateShippingCost(total);
    // UPDATED_CART.total = total + this.calculateShippingCost(total);
    this._cartRepo.setCart(UPDATED_CART);
  }

  addPromotion(cartPromotion: ICartPromotion) {
    let cart: ICart | null = this._cartRepo.getCart();
    if (!cart) {
      cart = this.getNewCart();
    }
    cartPromotion.promocion.imagen_promocion = cartPromotion.promocion.media.media_url;
    cart.promociones!.push(cartPromotion);
    const UPDATED_CART = { ...cart, promociones: [...cart.promociones!] };
    const { total, subtotal, descuento } = this.getTotals(UPDATED_CART);
    UPDATED_CART.subtotal = subtotal;
    UPDATED_CART.descuento = descuento;
    UPDATED_CART.costo_envio = 0;
    UPDATED_CART.total = total;
    // UPDATED_CART.costo_envio = this.calculateShippingCost(total);
    // UPDATED_CART.total = total + this.calculateShippingCost(total);
    this._cartRepo.setCart(UPDATED_CART);
  }

  updatePromotion(cartPromotion: ICartPromotion) {
    cartPromotion.monto = cartPromotion.promocion.total_con_descuento * cartPromotion.cantidad;
    let cart: ICart = this._cartRepo.getCart()!;
    if (cart.promociones!.some(item => item.promocion.id == cartPromotion.promocion.id)) {
      const ITEM_INDEX = cart.promociones!.findIndex(item => item.promocion.id == cartPromotion.promocion.id);
      cart.promociones![ITEM_INDEX] = cartPromotion;
    }
    const UPDATED_CART = { ...cart, promociones: [...cart.promociones!] };
    this._cartRepo.setCart(UPDATED_CART);
  }

  removePromotion(cartPromotion: ICartPromotion) {
    const CART: ICart = this._cartRepo.getCart()!;
    const CART_PROMOTIONS = CART.promociones!.filter(item => item.id != cartPromotion.id);

    const UPDATED_CART = { ...CART, promociones: [...CART_PROMOTIONS] };
    const { total, subtotal, descuento } = this.getTotals(UPDATED_CART);
    UPDATED_CART.subtotal = subtotal;
    UPDATED_CART.descuento = descuento;
    UPDATED_CART.costo_envio = 0;
    UPDATED_CART.total = total;
    // UPDATED_CART.costo_envio = this.calculateShippingCost(total);
    // UPDATED_CART.total = total + this.calculateShippingCost(total);
    this._cartRepo.setCart(UPDATED_CART);
  }

  getNewCart(): ICart {
    return {
      id: 0,
      tipo_envio: null,
      estado: OrderStatusEnum.EDITING,
      forma_pago: null,
      total: 0,
      subtotal: 0,
      descuento: 0,
      costo_envio: 0,
      plataforma: 'web',
      folio: '',
      fecha_elaboracion: '',
      hora_elaboracion: '',
      productos: [],
      promociones: []
    }
  }

  getTotals(cart: ICart): { subtotal: number; descuento: number; total: number } {
    const TOTAL_PRODUCTS = (cart.productos && cart.productos.length)
      ? cart.productos.reduce((total: number, item: any) => total += item.monto, 0)
      : 0;
    const DISCOUNT = (cart.promociones && cart.promociones.length)
      ? cart.promociones.reduce((total: number, item: any) => total += (item.promocion.total_original - item.promocion.total_con_descuento), 0)
      : 0;
    const TOTAL_PROMOTIONS = (cart.promociones && cart.promociones.length)
      ? cart.promociones.reduce((total: number, item: any) => total += item.monto, 0)
      : 0;
    return {
      subtotal: TOTAL_PRODUCTS + TOTAL_PROMOTIONS + DISCOUNT,
      descuento: DISCOUNT,
      total: TOTAL_PRODUCTS + TOTAL_PROMOTIONS
    }
  }

  calculateShippingCost(orderTotal: number): number {
    if (orderTotal < 400) {
      return 250;
    } else if (orderTotal >= 400 && orderTotal < 1000) {
      return 150;
    }
    return 0;
  }


}