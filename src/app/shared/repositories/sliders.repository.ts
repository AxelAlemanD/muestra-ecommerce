import { Injectable } from "@angular/core"
import { createStore } from '@ngneat/elf';
import { addEntities, deleteEntities, selectAllEntities, setEntities, updateEntities, withEntities } from "@ngneat/elf-entities";
import { IPromotion } from "../../interfaces/promotion.interface";

const store = createStore({ name: 'sliders' }, withEntities<IPromotion>());

@Injectable({
  providedIn: 'root',
})
export class SlidersRepo {

  sliders$ = store.pipe(selectAllEntities());

  setSliders(sliders: IPromotion[]) {
    store.update(setEntities(sliders));
  }

  addSlider(slider: IPromotion) {
    store.update(addEntities(slider));
  }

  updateSlider(id: IPromotion['id'], slider: Partial<IPromotion>) {
    store.update(updateEntities(id, slider));
  }

  deleteSlider(id: IPromotion['id']) {
    store.update(deleteEntities(id));
  }

  reset() {
    store.reset();
  }
}