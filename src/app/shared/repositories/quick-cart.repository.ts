import { Injectable } from "@angular/core"
import { createStore, select, withProps } from '@ngneat/elf';
import { Observable } from "rxjs";
import { ICart } from "../../interfaces/cart.interface";

interface QuickCartState {
  cart: ICart | null;
}

const store = createStore(
  { name: 'quickcart' },
  withProps<QuickCartState>({ cart: null })
);

@Injectable({
  providedIn: 'root',
})
export class QuickCartRepo {

  cart$: Observable<ICart | null> = store.pipe(select((state) => state.cart));

  setCart(cart: ICart) {
    store.update((state) => ({ ...state, cart: { ...cart } }));
  }

  getCart(): ICart | null {
    return store.getValue().cart;
  }

  resetCart() {
    store.update((state) => ({ ...state, cart: null }));
  }
}

