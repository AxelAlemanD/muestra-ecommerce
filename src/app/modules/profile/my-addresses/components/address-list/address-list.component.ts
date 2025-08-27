import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { AddressesRepo } from '../../../../../shared/repositories/addresses.repository';
import { IAddress } from '../../../../../interfaces/address.interface';
import { CustomButtonComponent } from '../../../../../shared/components/custom-button/custom-button.component';
import { Router } from '@angular/router';
import { AlertsService } from '../../../../../services/alerts.service';
import { GenericService } from '../../../../../services/generic.service';
import { HttpEntitiesEnum } from '../../../../../shared/enums/http-entities.enum';
import { AuthService } from '../../../../../services/auth.service';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [
    CommonModule,
    CustomButtonComponent
  ],
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.scss',
})
export class AddressListComponent implements OnDestroy {

  addresses: IAddress[] = [];
  private _subscription!: Subscription;

  constructor(
    private _router: Router,
    private _addressesRepo: AddressesRepo,
    private _alertsService: AlertsService,
    private _genericService: GenericService,
    private _authService: AuthService,
  ) {
    this._subscription = this._addressesRepo.addresses$.subscribe(addresses => {
      this.addresses = addresses;
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  redirectTo(route: string) {
    this._router.navigateByUrl(route);
  }

  deleteAddress(address: IAddress) {
    this._alertsService.showConfirmationAlert({
      title: 'Eliminar dirección',
      message: `¿Estas seguro que deseas eliminar la dirección ${address.alias}?`,
      confirmButtonText: 'Si, eliminar'
    }).then(result => {
      if (result.isConfirmed) {
        this._genericService.delete(`${HttpEntitiesEnum.LOCATIONS}/cliente/${this._authService.userId}/direccion`, address.id)
          .pipe(take(1))
          .subscribe(resp => {
            if (resp.message == "success") {
              this._addressesRepo.deleteAddress(address.id);
              this.addresses = this.addresses.filter(item => item.id != address.id);
              this._alertsService.showToast({
                icon: 'success',
                text: 'Se ha eliminado la dirección'
              });
            } else {
              this._alertsService.showToast({
                icon: 'error',
                text: 'Ocurrio un problema al eliminar la dirección'
              });
            }
          });
      }
    });
  }

}
