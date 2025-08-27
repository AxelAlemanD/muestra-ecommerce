import { Injectable } from "@angular/core"
import { createStore } from '@ngneat/elf';
import { addEntities, deleteEntities, getAllEntities, getEntity, selectAllEntities, setEntities, updateEntities, withEntities } from "@ngneat/elf-entities";
import { ICategory } from "../../interfaces/category.interface";

const store = createStore({ name: 'categories' }, withEntities<ICategory>());

@Injectable({
  providedIn: 'root',
})
export class CategoriesRepo {

  categories$ = store.pipe(selectAllEntities());

  setCategories(categories: ICategory[]) {
    store.update(setEntities(categories));
  }

  addCategory(category: ICategory) {
    store.update(addEntities(category));
  }

  updateCategory(id: ICategory['id'], category: Partial<ICategory>) {
    store.update(updateEntities(id, category));
  }

  deleteCategory(id: ICategory['id']) {
    const CATEGORIES = store.query(getAllEntities());
    const FILTERED_CATEGORIES = CATEGORIES.filter(category => category.id != id);
    this.setCategories(FILTERED_CATEGORIES);
  }

  getCategoryById(id: ICategory['id']): ICategory | undefined {
    return store.query(getEntity(id));
  }
  
  reset() {
    store.reset();
  }
}