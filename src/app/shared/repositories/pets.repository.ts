import { Injectable } from "@angular/core"
import { createStore } from '@ngneat/elf';
import { addEntities, deleteEntities, getEntity, selectAllEntities, selectEntity, setEntities, updateEntities, withEntities } from "@ngneat/elf-entities";
import { IPet } from "../../interfaces/pet.interface";
import { Observable } from "rxjs";


const store = createStore({ name: 'pets' }, withEntities<IPet>());

@Injectable({
  providedIn: 'root',
})
export class PetsRepo {

  pets$ = store.pipe(selectAllEntities());

  setPets(pets: IPet[]) {
    store.update(setEntities(pets));
  }

  addPet(pet: IPet) {
    store.update(addEntities(pet));
  }

  updatePet(id: IPet['id'], pet: Partial<IPet>) {
    store.update(updateEntities(id, pet));
  }

  deletePet(id: IPet['id']) {
    store.update(deleteEntities(id));
  }

  getPet$(id: IPet['id']): Observable<IPet | undefined> {
    return store.pipe(selectEntity(id));
  }

  reset() {
    store.reset();
  }
}