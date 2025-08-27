import { Injectable } from "@angular/core"
import { createStore } from '@ngneat/elf';
import { addEntities, deleteEntities, getAllEntities, selectAllEntities, setEntities, updateEntities, withEntities } from "@ngneat/elf-entities";
import { IBrand } from "../../interfaces/brand.interface";

const store = createStore({ name: 'brands' }, withEntities<IBrand>());

@Injectable({
  providedIn: 'root',
})
export class BrandsRepo {

  brands$ = store.pipe(selectAllEntities());

  setBrands(brands: IBrand[]) {
    store.update(setEntities(brands));
  }

  addBrand(brand: IBrand) {
    store.update(addEntities(brand));
  }

  updateBrand(id: IBrand['id'], brand: Partial<IBrand>) {
    store.update(updateEntities(id, brand));
  }

  deleteBrand(id: IBrand['id']) {
    const BRANDS = store.query(getAllEntities());
    const FILTERED_BRANDS = BRANDS.filter(brand => brand.id != id);
    this.setBrands(FILTERED_BRANDS);
  }

  reset() {
    store.reset();
  }

  getCurrentBrands(): IBrand[] {
    return store.query(getAllEntities());
  }
}