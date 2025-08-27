import { Injectable } from '@angular/core';
import { ICart, ICartConfirmation, ICartProduct, ICartPromotion } from '../interfaces/cart.interface';
import { OrderStatusEnum } from '../shared/enums/order-status.enum';
import { CartRepo } from '../shared/repositories/cart.repository';
import { GenericService } from './generic.service';
import { HttpEntitiesEnum } from '../shared/enums/http-entities.enum';
import { AuthService } from './auth.service';
import { OrdersRepo } from '../shared/repositories/orders.repository';
import { DiscountTypeEnum } from '../shared/enums/discount-type.enum';
import { LocalCartService } from './local-cart.service';
import { take } from 'rxjs';
import { ProductsRepo } from '../shared/repositories/products.repository';
import { PromotionsRepo } from '../shared/repositories/promotions.repository';
import { AlertsService } from './alerts.service';
import { ProductsService } from './products.service';
import { IProduct } from '../interfaces/product.interface';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IPromotion } from '../interfaces/promotion.interface';
import { PromotionsService } from './promotions.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private _cartRepo: CartRepo,
    private _ordersRepo: OrdersRepo,
    private _genericService: GenericService,
    private _authService: AuthService,
    private _localCartService: LocalCartService,
    private _productsRepo: ProductsRepo,
    private _promotionsRepo: PromotionsRepo,
    private _alertsService: AlertsService,
    private _productsService: ProductsService,
    private _modalService: BsModalService,
    private _promotionsService: PromotionsService
  ) { }

  getCart() {
    return this._cartRepo.getCart();
  }

  async addProduct(cartProduct: ICartProduct): Promise<ICart> {
    if (!this._authService.authenticatedValue) {
      return new Promise<ICart>((resolve) => {
        this._localCartService.addProduct(cartProduct);
        resolve(this.getCart()!)
      });
    }

    let cart: ICart | null = this.getCart();
    if (!cart) {
      // cart = await this.createCart([cartProduct]);
      const TEMP_CART = this._getEmptyCart();
      TEMP_CART.productos?.push(cartProduct)
      cart = await this.createCart(TEMP_CART);
      cart.productos = [cartProduct];
      this._cartRepo.setCart(cart);
      return new Promise<ICart>((resolve) => resolve(cart!));
    }

    return new Promise<ICart>((resolve) => {
      this._genericService.put<ICart>(`${HttpEntitiesEnum.CART}/actualizar_carrito/${cart.id}`, {
        cliente_id: parseInt(this._authService.userId),
        sucursal_id: 1,
        producto_ids: [
          {
            id: cartProduct.producto.id,
            cantidad: cartProduct.cantidad,
            variante_id: cartProduct.variante_id,
            promocion_id: cartProduct.promocion_id
          }
        ],
        paquete_promociones: []
      })
        .pipe(take(1))
        .subscribe((resp: any) => {
          if (resp.message == "success") {
            // cart.productos.push(cartProduct);
            const UPDATED_CART = {
              ...cart,
              productos: [...cart.productos, cartProduct],
              subtotal: resp.data.subtotal_orden,
              descuento: resp.data.descuento_cupon + resp.data.descuento_promocion,
              total: resp.data.total,
              costo_envio: 0,
              // total: resp.data.total + this.calculateShippingCost(resp.data.total),
              // costo_envio: this.calculateShippingCost(resp.data.total),
            };
            resolve(UPDATED_CART);
            this._cartRepo.setCart(UPDATED_CART);
          }
        });
    });
  }

  async updateProduct(cartProduct: ICartProduct): Promise<ICart> {
    if (!this._authService.authenticatedValue) {
      return new Promise<ICart>((resolve) => {
        this._localCartService.updateProduct(cartProduct);
        resolve(this.getCart()!)
      });
    }
    const CART: ICart = this.getCart()!;
    return new Promise<ICart>((resolve) => {
      this._genericService.put<any>(`${HttpEntitiesEnum.CART}/actualizar_carrito/${CART.id}`, {
        cliente_id: parseInt(this._authService.userId),
        sucursal_id: 1,
        producto_ids: [
          {
            id: cartProduct.producto.id,
            cantidad: cartProduct.cantidad,
            variante_id: cartProduct.variante_id,
            promocion_id: cartProduct.promocion_id
          }
        ],
        paquete_promociones: []
      })
        .pipe(take(1))
        .subscribe(resp => {
          if (resp.message == "success") {
            const CART_PRODUCT_INDEX = CART.productos.findIndex(item => {
              if (cartProduct.variante_id) {
                return cartProduct.producto.id == item.producto.id && item.variante_id == cartProduct.variante_id;
              }
              return cartProduct.producto.id == item.producto.id;
            });
            CART.productos[CART_PRODUCT_INDEX] = {
              ...cartProduct,
              monto: this._productsService.getProductAmount(cartProduct.cantidad, cartProduct.producto.id, cartProduct.variante_id, cartProduct.promocion_id)
            };
            CART.subtotal = resp.data.subtotal_orden;
            CART.descuento = resp.data.descuento_cupon + resp.data.descuento_promocion;
            CART.total = resp.data.total;
            CART.costo_envio = 0;
            // CART.total = resp.data.total + this.calculateShippingCost(resp.data.total);
            // CART.costo_envio = this.calculateShippingCost(resp.data.total);
            this._cartRepo.setCart(CART);
            resolve(CART);
          }
        });
    });
  }

  async removeProduct(cartProduct: ICartProduct): Promise<ICart> {
    if (!this._authService.authenticatedValue) {
      return new Promise<ICart>((resolve) => {
        this._localCartService.removeProduct(cartProduct);
        resolve(this.getCart()!)
      });
    }
    const CART: ICart = this.getCart()!;
    const URL = `${HttpEntitiesEnum.CART}/orden/${CART.id}/${cartProduct.producto.id}/${cartProduct.variante_id}/${cartProduct.promocion_id || null}`
    return new Promise<ICart>((resolve) => {
      this._genericService.delete<any>(URL, '')
        .pipe(take(1))
        .subscribe(resp => {
          if (resp.message == "success") {
            const CART_PRODUCTS = CART.productos.filter(item => {
              if (cartProduct.variante_id) {
                return item.producto.id != cartProduct.producto.id || (item.producto.id == cartProduct.producto.id && item.variante_id != cartProduct.variante_id)
              } else {
                return item.producto.id != cartProduct.producto.id
              }
            });
            const UPDATED_CART = {
              ...CART,
              productos: [...CART_PRODUCTS],
              subtotal: resp.data.subtotal_orden,
              descuento: resp.data.descuento_cupon + resp.data.descuento_promocion,
              total: resp.data.total,
              costo_envio: 0,
              // total: resp.data.total + this.calculateShippingCost(resp.data.total),
              // costo_envio: this.calculateShippingCost(resp.data.total),
            };
            this._cartRepo.setCart(UPDATED_CART);
            resolve(UPDATED_CART);
          }
        });
    });
  }

  async addPromotion(cartPromotion: ICartPromotion): Promise<ICart> {
    if (!this._authService.authenticatedValue) {
      return new Promise<ICart>((resolve) => {
        this._localCartService.addPromotion(cartPromotion);
        resolve(this.getCart()!)
      });
    }

    let cart: ICart | null = this.getCart();
    if (!cart) {
      const TEMP_CART = this._getEmptyCart();
      TEMP_CART.promociones?.push(cartPromotion)
      cart = await this.createCart(TEMP_CART);
      this._cartRepo.setCart(cart);
      return new Promise<ICart>((resolve) => resolve(cart!));
    }
    return new Promise<ICart>((resolve) => {
      this._genericService.put<ICart>(`${HttpEntitiesEnum.CART}/actualizar_carrito/${cart.id}`, {
        cliente_id: parseInt(this._authService.userId),
        sucursal_id: 1,
        producto_ids: [],
        paquete_promociones: [
          { promocion_id: cartPromotion.promocion.id }
        ]
      })
        .pipe(take(1))
        .subscribe((resp: any) => {
          if (resp.message == "success") {
            cartPromotion.promocion.imagen_promocion = cartPromotion.promocion.media.media_url;
            if (cart.promociones) {
              cart.promociones!.push(cartPromotion);
            } else {
              cart.promociones = [cartPromotion];
            }
            const UPDATED_CART = {
              ...cart,
              promociones: [...cart.promociones!],
              subtotal: resp.data.subtotal_orden,
              descuento: resp.data.descuento_cupon + resp.data.descuento_promocion,
              total: resp.data.total,
              costo_envio: 0,
              // total: resp.data.total + this.calculateShippingCost(resp.data.total),
              // costo_envio: this.calculateShippingCost(resp.data.total),
            };
            this._cartRepo.setCart(UPDATED_CART);
          }
        });
    });
  }

  async updatePromotion(cartPromotion: ICartPromotion): Promise<ICart> {
    if (!this._authService.authenticatedValue) {
      return new Promise<ICart>((resolve) => {
        this._localCartService.updatePromotion(cartPromotion);
        resolve(this.getCart()!)
      });
    }
    const CART: ICart = this.getCart()!;
    return new Promise<ICart>((resolve) => {
      this._genericService.put<ICart>(`${HttpEntitiesEnum.CART}/actualizar_carrito/${CART.id}`, {
        cliente_id: parseInt(this._authService.userId),
        sucursal_id: 1,
        producto_ids: [],
        paquete_promociones: [
          {
            promocion_id: cartPromotion.promocion.id,
            cantidad: cartPromotion.cantidad
          }
        ]
      })
        .pipe(take(1))
        .subscribe(resp => {
          if (resp.message == "success") {
            const CART_PROMOTION_INDEX = CART.promociones!.findIndex(item => item.promocion.id === cartPromotion.promocion.id);
            CART.promociones![CART_PROMOTION_INDEX] = cartPromotion;
            CART.total = resp.data.total;
            CART.subtotal = resp.data.subtotal;
            this._cartRepo.setCart(CART);
            resolve(CART);
          }
        });
    });
  }

  async removePromotion(cartPromotion: ICartPromotion): Promise<ICart> {
    if (!this._authService.authenticatedValue) {
      return new Promise<ICart>((resolve) => {
        this._localCartService.removePromotion(cartPromotion);
        resolve(this.getCart()!)
      });
    }
    const CART: ICart = this.getCart()!;
    return new Promise<ICart>((resolve) => {
      const URL = `${HttpEntitiesEnum.CART}/orden/${CART.id}/null/null/${cartPromotion.promocion.id}`;
      this._genericService.delete<any>(URL, '')
        .pipe(take(1))
        .subscribe(resp => {
          if (resp.message == "success") {
            const CART_PROMOTIONS = CART.promociones!.filter(item => item.promocion.id != cartPromotion.promocion.id);
            const UPDATED_CART = {
              ...CART,
              promociones: [...CART_PROMOTIONS],
              subtotal: resp.data.subtotal_orden,
              descuento: resp.data.descuento_cupon + resp.data.descuento_promocion,
              total: resp.data.total,
              costo_envio: 0,
              // total: resp.data.total + this.calculateShippingCost(resp.data.total),
              // costo_envio: this.calculateShippingCost(resp.data.total),
            };
            this._cartRepo.setCart(UPDATED_CART);
            resolve(UPDATED_CART);
          }
        });
    });
  }

  async clearCart(): Promise<void> {
    if (!this._authService.authenticatedValue) {
      return new Promise<void>((resolve) => {
        this._cartRepo.resetCart();
        resolve()
      });
    }
    const CART: ICart = this.getCart()!;
    return new Promise<void>((resolve) => {
      this._genericService.delete<ICart>(`${HttpEntitiesEnum.CART}`, CART.id)
        .pipe(take(1))
        .subscribe(resp => {
          if (resp.message == "success") {
            this._cartRepo.resetCart();
            resolve()
          }
        });
    });
  }

  async confirmPurchase(cart: ICart, cartConfirmation: ICartConfirmation, isQuickCart: boolean = false): Promise<number> {
    return new Promise<number>((resolve) => {
      this._genericService.put<ICart>(`${HttpEntitiesEnum.ORDERS}/completar_orden_cliente/${cart.id}`, cartConfirmation)
        .pipe(take(1))
        .subscribe(resp => {
          if (resp.message == "success") {
            if (!isQuickCart) {
              this._cartRepo.resetCart();
            }
            resolve(cart.id);
          }
        });
    });
  }

  async applyCoupon(code: string): Promise<ICart> {
    const CART: ICart = this.getCart()!;
    return new Promise<ICart>((resolve) => {
      this._genericService.put<any>(`${HttpEntitiesEnum.CART}/validar_cupon/${CART.id}`, { cupon_nombre: code })
        .pipe(take(1))
        .subscribe({
          next: (resp) => {
            if (resp.message == "success") {
              CART.cupon = {
                id: 0,
                nombre: code,
                productos: [],
                sucursales: [],
                tipo_descuento: DiscountTypeEnum.AMOUNT,
                valor: resp.data[0].descuento,
                cantidad_descuento: resp.data[0].descuento,
              };
              CART.total = resp.data[0].total_con_descuento;
              this._cartRepo.setCart(CART);
              resolve(CART);
            } else if (resp.message == 404) {
              this._alertsService.showToast({
                icon: 'error',
                text: resp.data[0]
              });
            }
          },
          error: (error) => {
            this._alertsService.showToast({
              icon: 'error',
              text: 'El cupon ingresado no es válido'
            });
          }
        });
    });
  }

  async removeCoupon(orderId: number): Promise<ICart> {
    const CART: ICart = this.getCart()!;
    return new Promise<ICart>((resolve) => {
      this._genericService.delete<any>(`${HttpEntitiesEnum.CART}/cupon`, orderId)
        .pipe(take(1))
        .subscribe(resp => {
          if (resp.message == "success") {
            CART.cupon = undefined;
            CART.total = resp.data[0].total_restaurado
            this._cartRepo.setCart(CART);
            resolve(CART)
          }
        });
    });
  }

  createCart(cart: ICart): Promise<ICart> {
    return new Promise<ICart>((resolve) => {
      this._genericService.post<ICart>(`${HttpEntitiesEnum.CART}/create_carrito`, {
        cliente_id: this._authService.userId,
        sucursal_id: 1,
        producto_ids: [
          ...cart.productos.map(item => {
            return {
              id: item.producto.id,
              cantidad: item.cantidad,
              variante_id: item.variante_id,
              promocion_id: item.promocion_id
            }
          }),
        ],
        paquete_promociones: cart.promociones!.map(item => {
          return {
            promocion_id: item.promocion.id,
          }
        })
      })
        .pipe(take(1))
        .subscribe(resp => {
          resolve(this._getParsedCart(resp.data));
        });
    });
  }

  updateCart(cart: ICart): Promise<ICart> {
    return new Promise<ICart>((resolve) => {
      this._genericService.put<any>(`${HttpEntitiesEnum.CART}/actualizar_carrito/${cart.id}`, {
        cliente_id: this._authService.userId,
        sucursal_id: 1,
        producto_ids: [
          ...cart.productos.map(item => {
            return {
              id: item.producto.id,
              cantidad: item.cantidad,
              variante_id: item.variante_id,
              promocion_id: item.promocion_id
            }
          }),
        ],
        paquete_promociones: cart.promociones!.map(item => {
          return {
            promocion_id: item.promocion.id,
          }
        })
      })
        .pipe(take(1))
        .subscribe(resp => {
          const UPDATED_CART = {
            ...cart,
            promociones: [...cart.promociones!],
            subtotal: resp.data.subtotal_orden,
            descuento: resp.data.descuento_cupon + resp.data.descuento_promocion,
            total: resp.data.total,
            costo_envio: 0,
            // total: resp.data.total + this.calculateShippingCost(resp.data.total),
            // costo_envio: this.calculateShippingCost(resp.data.total),
          };
          resolve(UPDATED_CART);
        });
    });
  }

  calculateShippingCost(orderTotal: number): number {
    if (orderTotal < 400) {
      return 250;
    } else if (orderTotal >= 400 && orderTotal < 1000) {
      return 150;
    }
    return 0;
  }


  async validateCartPromotions() {
    const CART: ICart | null = this.getCart();

    if (!CART || !CART.promociones || !CART.promociones.length) {
      return;
    }

    const PROMOTIONS_NOT_AVAILABLE = CART.promociones.filter(cartPromotion => {
      return !this._promotionsService.validatePromotionAvailability(cartPromotion.promocion);
    });

    if (PROMOTIONS_NOT_AVAILABLE && PROMOTIONS_NOT_AVAILABLE.length) {
      for (const cartPromotion of PROMOTIONS_NOT_AVAILABLE) {
        this._promotionsRepo.updatePromotion(cartPromotion.promocion.id, { activo: false });
        await this.removePromotion(cartPromotion);
      }
      const { PromotionModificationAlertModalComponent } = await import(
        '../shared/components/promotion-modification-alert-modal/promotion-modification-alert-modal.component'
      );
      this._modalService.show(
        PromotionModificationAlertModalComponent,
        {
          class: 'modal-lg modal-dialog-centered',
          backdrop: 'static',
          initialState: {
            promotions: PROMOTIONS_NOT_AVAILABLE.map(item => ({ ...item.promocion })),
            message: `Las siguientes promociones no se encuentran disponible por el momento, por lo tanto se removieron de tu carrito de compras`
          }
        }
      );
    }
  }

  async validateCartProducts() {
    const CART: ICart | null = this.getCart();

    if (!CART || !CART.productos || !CART.productos.length) {
      return;
    }

    for (const cartProduct of CART.productos) {
      await this.validateCartProduct(cartProduct.producto, cartProduct.variante_id); 
    }
  }

  async validateCartProduct(product: IProduct, variantId: number | null = null): Promise<void> {
    const CART: ICart | null = this.getCart();

    if (!CART || !product) {
      return new Promise<void>((resolve) => resolve());
    }

    const PRODUCT = this._productsRepo.getProductById(product.id);

    const CART_PRODUCT = CART?.productos.find(cartProduct => {
      if (variantId) {
        return PRODUCT!.id == cartProduct.producto.id && variantId == cartProduct.variante_id;
      }
      return PRODUCT!.id == cartProduct.producto.id;
    });

    if (!CART_PRODUCT) {
      return new Promise<void>((resolve) => resolve());
    }

    let variant = null;
    if (variantId) {
      variant = PRODUCT!.variantes?.find(variant => variant.id == variantId);
    }

    const IS_VALID_STOCK = await this._validateStock(PRODUCT!, CART_PRODUCT, variant);

    if (!IS_VALID_STOCK) {
      return new Promise<void>((resolve) => resolve());
    }

    await this._validatePrice(PRODUCT!, CART_PRODUCT, variant);
    return new Promise<void>((resolve) => resolve());
  }

  private async _validateStock(product: IProduct, cartProduct: ICartProduct, variant: any): Promise<boolean> {
    const { ProductModificationAlertModalComponent } = await import(
      '../shared/components/product-modification-alert-modal/product-modification-alert-modal.component'
    );
    let isValid = true;
    if (variant) {
      isValid = variant.stock >= cartProduct.cantidad;
    } else {
      isValid = product.sucursales[0].stock >= cartProduct.cantidad;
    }

    if (!isValid) {
      this.removeProduct(cartProduct);
      this._modalService.show(
        ProductModificationAlertModalComponent,
        {
          class: 'modal-lg modal-dialog-centered',
          backdrop: 'static',
          initialState: {
            product: cartProduct.producto,
            message: `Por el momento, el producto <b> ${cartProduct.producto.nombre} </b> no cuenta con stock suficiente, por lo tanto se removio de tu carrito de compras`
          }
        }
      );
    }

    return new Promise<boolean>((resolve) => resolve(isValid));
  }

  private async _validatePrice(product: IProduct, cartProduct: ICartProduct, variant: any): Promise<boolean> {
    const { ProductModificationAlertModalComponent } = await import(
      '../shared/components/product-modification-alert-modal/product-modification-alert-modal.component'
    );

    let isValid = true;
    if (variant) {
      isValid = variant.precio_con_descuento == cartProduct.producto.precio_con_descuento;
    } else {
      isValid = product.precio_con_descuento == cartProduct.producto.precio_con_descuento;
    }

    if (!isValid) {
      this.removeProduct(cartProduct);
      this._modalService.show(
        ProductModificationAlertModalComponent,
        {
          class: 'modal-lg modal-dialog-centered',
          backdrop: 'static',
          initialState: {
            product: cartProduct.producto,
            message: `El precio del producto <b>${cartProduct.producto.nombre}</b> ha sido modificado y por lo tanto se removio de tu carrito de compras, si lo requires puedes agregarlo a continuación:`
          }
        }
      );
    }

    return new Promise<boolean>((resolve) => resolve(isValid));
  }

  private _getParsedCart(cart: any): ICart {
    const PARSED_PRODUCTS = cart.productos.map((item: any) => {
      return {
        producto: this._productsRepo.getProductById(item.id),
        cantidad: item.cantidad,
        monto: parseFloat(item.subtotal),
        variante_id: (item.variante) ? item.variante.id : null,
      }
    });

    const PARSED_PROMOTIONS = cart.paquete_promociones.map((item: any) => {
      const PROMOTION = this._promotionsRepo.getPromotionById(item.promocion_id);
      return {
        promocion: {
          ...PROMOTION,
          imagen_promocion: PROMOTION!.media.media_url
        },
        cantidad: 1,
        monto: item.subtotal_con_descuento_paquete,
      }
    });

    return {
      id: cart.orden_id,
      tipo_envio: null,
      estado: OrderStatusEnum.EDITING,
      forma_pago: null,
      // costo_envio: this.calculateShippingCost(cart.total),
      // total: parseFloat(cart.total) + this.calculateShippingCost(cart.total),
      costo_envio: 0,
      total: parseFloat(cart.total),
      subtotal: parseFloat(cart.subtotal),
      descuento: parseFloat(cart.descuento),
      plataforma: 'web',
      folio: '',
      fecha_elaboracion: '',
      hora_elaboracion: '',
      productos: PARSED_PRODUCTS,
      promociones: PARSED_PROMOTIONS
    }
  }

  private _getEmptyCart(): ICart {
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
}