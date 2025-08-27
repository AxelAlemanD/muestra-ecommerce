import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { CustomButtonComponent } from '../../../../../shared/components/custom-button/custom-button.component';
import { Router } from '@angular/router';
import { AlertsService } from '../../../../../services/alerts.service';
import { PetsRepo } from '../../../../../shared/repositories/pets.repository';
import { IPet } from '../../../../../interfaces/pet.interface';
import { UploadsPipe } from '../../../../../shared/pipes/uploads.pipe';
import { HttpEntitiesEnum } from '../../../../../shared/enums/http-entities.enum';
import { GenericService } from '../../../../../services/generic.service';
import { LazyImageDirective } from '../../../../../shared/directives/lazy-image.directive';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    CommonModule,
    CustomButtonComponent,
    UploadsPipe,
    LazyImageDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetListComponent implements OnDestroy {

  pets: IPet[] = [];
  private _subscription!: Subscription;

  constructor(
    private _router: Router,
    private _petsRepo: PetsRepo,
    private _alertsService: AlertsService,
    private _genericService: GenericService,
    private cd: ChangeDetectorRef
  ) {
    this._subscription = this._petsRepo.pets$.subscribe(pets => this.pets = pets);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  redirectTo(route: string) {
    this._router.navigateByUrl(route);
  }

  deletePet(pet: IPet) {
    this._alertsService.showConfirmationAlert({
      title: 'Eliminar mascota',
      message: `¿Estas seguro que deseas eliminar la mascota ${pet.nombre}?`,
      confirmButtonText: 'Si, eliminar'
    }).then(result => {
      if (result.isConfirmed) {
        this._genericService.delete(`${HttpEntitiesEnum.PETS}`, pet.id)
          .pipe(take(1))
          .subscribe(resp => {
            if (resp.message == "Mascota eliminada exitosamente.") {
              this._petsRepo.deletePet(pet.id);
              this.pets = this.pets.filter(item => item.id != pet.id);
              this._alertsService.showToast({
                icon: 'success',
                text: 'Se ha eliminado la mascota'
              });
              this.cd.markForCheck();
            } else {
              this._alertsService.showToast({
                icon: 'error',
                text: 'Ocurrio un problema al eliminar la mascota'
              });
            }
          });

      }
    });
  }

}
