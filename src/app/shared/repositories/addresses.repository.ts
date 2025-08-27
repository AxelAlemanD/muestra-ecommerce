import { Injectable } from "@angular/core"
import { createStore } from '@ngneat/elf';
import { addEntities, deleteEntities, selectAllEntities, setEntities, updateEntities, withEntities } from "@ngneat/elf-entities";
import { IAddress } from "../../interfaces/address.interface";

const store = createStore({ name: 'addresses' }, withEntities<IAddress>());

@Injectable({
  providedIn: 'root',
})
export class AddressesRepo {

  addresses$ = store.pipe(selectAllEntities());

  setAddresses(addresses: IAddress[]) {
    const PARSED_ADDRESSES = addresses.map(address => {
      return this._getParsedAddress(address);
    });
    store.update(setEntities(PARSED_ADDRESSES));
  }

  addAddress(address: IAddress) {
    store.update(addEntities(this._getParsedAddress(address)));
  }

  updateAddress(id: IAddress['id'], address: Partial<IAddress>) {
    store.update(updateEntities(id, address));
  }

  deleteAddress(id: IAddress['id']) {
    store.update(deleteEntities(id));
  }

  reset() {
    store.reset();
  }

  private _getParsedAddress(address: any): IAddress {
    return {
      ...address,
      resumen: `${address.calle}${(address.numero_exterior) ? ' '+address.numero_exterior : ''}, ${address.codigo_postal}, ${address.colonia.nombre}, ${address.estado.nombre}`
    }
  }
}