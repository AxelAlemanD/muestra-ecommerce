import { Injectable } from "@angular/core"
import { createStore } from '@ngneat/elf';
import { addEntities, deleteEntities, selectAllEntities, setEntities, updateEntities, withEntities } from "@ngneat/elf-entities";
import { IBranch } from "../../interfaces/branch.interface";

const store = createStore({ name: 'branches' }, withEntities<IBranch>());

@Injectable({
  providedIn: 'root',
})
export class BranchesRepo {

  branches$ = store.pipe(selectAllEntities());

  setBranches(branches: IBranch[]) {
    store.update(setEntities(branches));
  }

  addBranch(branch: IBranch) {
    store.update(addEntities(branch));
  }

  updateBranch(id: IBranch['id'], branch: Partial<IBranch>) {
    store.update(updateEntities(id, branch));
  }

  deleteBranch(id: IBranch['id']) {
    store.update(deleteEntities(id));
  }

  reset() {
    store.reset();
  }
}