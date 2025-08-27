import { Injectable } from "@angular/core"
import { createStore } from '@ngneat/elf';
import { IProduct } from "../../interfaces/product.interface";
import { addEntities, deleteEntities, getAllEntities, getEntity, selectAllEntities, selectEntity, setEntities, updateEntities, withEntities } from "@ngneat/elf-entities";
import { Observable } from "rxjs";

const store = createStore({ name: 'products' }, withEntities<IProduct>());

@Injectable({
  providedIn: 'root',
})
export class ProductsRepo {

  products$ = store.pipe(selectAllEntities());

  setProducts(products: IProduct[]) {
    store.update(setEntities(products));
  }

  addProduct(product: IProduct) {
    store.update(addEntities(product));
  }

  updateProduct(id: IProduct['id'], product: Partial<any>) {
    if (product['categorias'] && product['categorias'].categoria_principal && product['categorias'].subcategorias) {
      product = {
        ...product,
        categorias: [...product['categorias'].categoria_principal, ...product['categorias'].subcategorias]
      }
    }
    if (product['variantes'] && product['variantes'].length) {
      product = {
        ...product,
        variantes: product['variantes'].map((item: any) => {
          return {
            ...item,
            variante: JSON.parse(item.variante)
          }
        })
      }
    }
    store.update(updateEntities(id, product));
  }

  deleteProduct(id: IProduct['id']) {
    store.update(deleteEntities(id));
  }

  getCurrentProducts(): IProduct[] {
    return store.query(getAllEntities());
  }

  getProductById(id: IProduct['id']): IProduct | undefined {
    const PRODUCT = store.query(getEntity(id));
    return (PRODUCT) ? { ...PRODUCT } : undefined;
  }

  getProduct$(id: IProduct['id']): Observable<IProduct | undefined> {
    return store.pipe(selectEntity(id));
  }

  reset() {
    store.reset();
  }
}