import { Injectable } from "@angular/core"
import { createStore } from '@ngneat/elf';
import { addEntities, deleteEntities, getEntity, selectAllEntities, selectEntity, setEntities, updateEntities, withEntities, getAllEntities } from "@ngneat/elf-entities";
import { IPromotion } from "../../interfaces/promotion.interface";
import { Observable } from "rxjs";

const store = createStore({ name: 'promotions' }, withEntities<IPromotion>());

@Injectable({
  providedIn: 'root',
})
export class PromotionsRepo {

  promotions$ = store.pipe(selectAllEntities());

  setPromotions(promotions: IPromotion[]) {
    store.update(setEntities(promotions));
  }

  addPromotion(promotion: IPromotion) {
    store.update(addEntities(promotion));
  }

  updatePromotion(id: IPromotion['id'], promotion: Partial<IPromotion>) {
    store.update(updateEntities(id, promotion));
  }

  deletePromotion(id: IPromotion['id']) {
    const PROMOTIONS = store.query(getAllEntities());
    const FILTERED_PROMOTIONS = PROMOTIONS.filter(promotion => promotion.id != id);
    this.setPromotions(FILTERED_PROMOTIONS);
  }

  getPromotionById(id: IPromotion['id']): IPromotion | undefined {
    return store.query(getEntity(id));
  }

  getPromotion$(id: IPromotion['id']): Observable<IPromotion | undefined> {
    return store.pipe(selectEntity(id));
  }

  reset() {
    store.reset();
  }
}