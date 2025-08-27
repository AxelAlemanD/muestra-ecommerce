import { Injectable } from "@angular/core"
import { createStore, select, withProps } from '@ngneat/elf';
import { Observable } from "rxjs";
import { ICustomer } from "../../interfaces/customer.interface";

interface CustomerState {
  customer: ICustomer | null;
}

const store = createStore(
  { name: 'customer' },
  withProps<CustomerState>({ customer: null })
);

@Injectable({
  providedIn: 'root',
})
export class CustomerRepo {

  customer$: Observable<ICustomer | null> = store.pipe(select((state) => state.customer));

  setCustomer(customer: ICustomer) {
    store.update((state) => ({ ...state, customer }));
  }

  getCustomer(): ICustomer | null {
    return store.getValue().customer;
  }

  resetCustomer() {
    store.update((state) => ({ ...state, customer: null }));
  }
}

