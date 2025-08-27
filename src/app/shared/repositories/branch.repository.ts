import { Injectable } from "@angular/core"
import { createStore, select, withProps } from '@ngneat/elf';
import { IBranch } from "../../interfaces/branch.interface";
import { Observable } from "rxjs";

interface BranchState {
  branch: IBranch | null;
}

const store = createStore(
  { name: 'branch' },
  withProps<BranchState>({ branch: null })
);

@Injectable({
  providedIn: 'root',
})
export class BranchRepo {

  branch$: Observable<IBranch | null> = store.pipe(select((state) => state.branch));

  setBranch(branch: IBranch) {
    store.update((state) => ({ ...state, branch }));
  }

  getBranch(): IBranch | null {
    return store.getValue().branch;
  }

  resetBranch() {
    store.update((state) => ({ ...state, branch: null }));
  }
}

