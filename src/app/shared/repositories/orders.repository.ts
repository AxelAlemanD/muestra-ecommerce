import { Injectable } from "@angular/core"
import { createStore } from '@ngneat/elf';
import { addEntities, deleteEntities, getEntity, selectAllEntities, selectEntity, setEntities, updateEntities, withEntities } from "@ngneat/elf-entities";
import { ICart } from "../../interfaces/cart.interface";
import { Observable } from "rxjs";

const store = createStore({ name: 'orders' }, withEntities<ICart>());

@Injectable({
  providedIn: 'root',
})
export class OrdersRepo {

  orders$ = store.pipe(selectAllEntities());

  setOrders(orders: ICart[]) {
    store.update(setEntities(orders));
  }

  addOrder(order: ICart) {
    store.update(addEntities(order));
  }

  updateOrder(id: ICart['id'], order: Partial<ICart>) {
    store.update(updateEntities(id, order));
  }

  deleteOrder(id: ICart['id']) {
    store.update(deleteEntities(id));
  }

  getOrderById(id: ICart['id']): ICart | undefined {
    const ORDER = store.query(getEntity(id));
    return (ORDER) ? { ...ORDER } : undefined;
  }

  getOrder$(id: ICart['id']): Observable<ICart | undefined> {
    return store.pipe(selectEntity(id));
  }

  reset() {
    store.reset();
  }
}