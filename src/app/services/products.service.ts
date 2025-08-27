import { Injectable } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';
import { ProductsRepo } from '../shared/repositories/products.repository';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private _products: IProduct[] = [];

  constructor(
    private _productsRepo: ProductsRepo
  ) {
    this._productsRepo.products$.subscribe(products => {
      this._products = products;
    });
  }

  getAll() {
    return this._products;
  }

  filter(query: string): IProduct[] {
    const queryParams: { [key: string]: string } = {};
    new URLSearchParams(query).forEach((value, key) => {
      queryParams[key] = value;
    });
    let filteredProducts = [...this._products];
    if (queryParams) {
      if (queryParams['busqueda']) {
        filteredProducts = filteredProducts.filter(product => {
          if (!product) {
            return false;
          }
          return product.nombre.toLowerCase().includes(queryParams['busqueda'].toLowerCase()) ||
            product.sku.toLowerCase().includes(queryParams['busqueda'].toLowerCase()) ||
            product.marca.nombre.toLowerCase().includes(queryParams['busqueda'].toLowerCase());
        });
      }
      if (queryParams['marca']) {
        const BRANDS = queryParams['marca'].split(',').map(Number);
        filteredProducts = filteredProducts.filter(product => {
          return product.marca && BRANDS.includes(product.marca.id)
        })
      }
      if (queryParams['categoria']) {
        const CATEGORY_ID = parseInt(queryParams['categoria']);
        filteredProducts = filteredProducts.filter(product => product.categorias[0].id == CATEGORY_ID);
        // filteredProducts = filteredProducts.filter(product => product.categorias.some(category => category.id == CATEGORY_ID));
      }
      if (queryParams['subcategoria']) {
        const SUBCATEGORY_ID = parseInt(queryParams['subcategoria']);
        filteredProducts = filteredProducts.filter(product => product.categorias
          .slice(1)
          .some(category => category.id == SUBCATEGORY_ID));
      }
      if (queryParams['promocion']) {
        const IS_PROMOTION = queryParams['promocion'] === 'true';
        filteredProducts = filteredProducts.filter(product => {
          if (product.variantes && product.variantes.length) {
            if (queryParams['tipo-promocion'] && product.variantes[0].descuento) {
              return product.variantes[0].descuento.tipo == queryParams['tipo-promocion']
            }
            return product.variantes[0].contiene_promocion == IS_PROMOTION;
          }
          if (queryParams['tipo-promocion'] && product.descuento) {
            return product.descuento.tipo == queryParams['tipo-promocion']
          }
          return product.contiene_promocion == IS_PROMOTION;
        });
      }
      if (queryParams['precio']) {
        const RANGE = queryParams['precio'].split('-').map(Number);
        filteredProducts = filteredProducts.filter(product => product.precio > RANGE[0] && product.precio < RANGE[1]);
      }
    }
    return filteredProducts;
  }

  getProductStock(product_id: number, variant_id?: number): number {
    const PRODUCT = this._productsRepo.getProductById(product_id);
    if (!PRODUCT) {
      return 0;
    }
    if (PRODUCT.variantes && PRODUCT.variantes.length) {
      if (variant_id) {
        const VARIANT = PRODUCT.variantes.find(variant => variant.id == variant_id);
        return (VARIANT && VARIANT.stock > 0) ? VARIANT.stock : 0;
      }
    }
    return PRODUCT.stock;
  }

  getProductAmount(quantity: number, product_id: number, variant_id?: number, promotion_id?: number): number {
    const PRODUCT = this._products.find(product => product.id === product_id);
    if (variant_id && PRODUCT!.variantes) {
      const VARIANT = PRODUCT!.variantes!.find(variant => variant.id === variant_id);
      if (VARIANT) {
        return VARIANT.precio_con_descuento * quantity;
      }
    }
    return PRODUCT!.precio_con_descuento * quantity;
  }

}