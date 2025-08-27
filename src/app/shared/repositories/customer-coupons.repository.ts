import { Injectable } from "@angular/core"
import { createStore } from '@ngneat/elf';
import { addEntities, deleteEntities, selectAllEntities, setEntities, updateEntities, withEntities } from "@ngneat/elf-entities";
import { ICoupon } from "../../interfaces/coupon.interface";

const store = createStore({ name: 'customerCoupons' }, withEntities<ICoupon>());

@Injectable({
  providedIn: 'root',
})
export class CustomerCouponsRepo {

  coupons$ = store.pipe(selectAllEntities());

  setCoupons(coupons: ICoupon[]) {
    store.update(setEntities(coupons));
  }

  addCoupon(coupon: ICoupon) {
    store.update(addEntities(coupon));
  }

  updateCoupon(id: ICoupon['id'], coupon: Partial<ICoupon>) {
    store.update(updateEntities(id, coupon));
  }

  deleteCoupon(id: ICoupon['id']) {
    store.update(deleteEntities(id));
  }

  reset() {
    store.reset();
  }
}