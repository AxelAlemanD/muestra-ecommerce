import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomControlComponent } from '../../../../../shared/components/custom-control/custom-control.component';
import { CustomSelectComponent } from '../../../../../shared/components/custom-select/custom-select.component';
import { CustomButtonComponent } from '../../../../../shared/components/custom-button/custom-button.component';
import { MapComponent } from '../../../../../shared/components/map/map.component';
import { GenericService } from '../../../../../services/generic.service';
import { HttpEntitiesEnum } from '../../../../../shared/enums/http-entities.enum';
import { IAddress, IColony, IState } from '../../../../../interfaces/address.interface';
import { AlertsService } from '../../../../../services/alerts.service';
import { CustomValidators } from '../../../../../utils/custom-validators';
import { AddressesRepo } from '../../../../../shared/repositories/addresses.repository';
import { AuthService } from '../../../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalBaseComponent } from '../../../../../shared/components/modal-base/modal-base.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IBreadcrumbItem } from '../../../../../interfaces/breadcrumb.interface';
import { BreadcrumbComponent } from '../../../../../shared/components/breadcrumb/breadcrumb.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomControlComponent,
    CustomSelectComponent,
    CustomButtonComponent,
    MapComponent,
    ModalBaseComponent,
    BreadcrumbComponent
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
})
export class AddressFormComponent {
  address!: IAddress;
  colonies: IColony[] = [];
  states: IState[] = [];
  showMap: boolean = false;
  form: FormGroup = this._formBuilder.group({
    alias: [null, Validators.required],
    nombre_recibidor: [null, Validators.required],
    numero_recibidor: [
      null,
      Validators.compose([
        Validators.required,
        this._customValidators.phoneValidator()
      ])
    ],
    calle: [null, Validators.required],
    numero_exterior: [null, Validators.required],
    numero_interior: [null],
    referencias: [null, Validators.required],
    codigo_postal: [null, Validators.required],
    estado_id: [null, Validators.required],
    colonia_id: [null, Validators.required],
    latitud: [null, Validators.required],
    longitud: [null, Validators.required],
  });
  breadcrumb: IBreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Perfil', url: '/perfil' },
    { label: 'Mis direcciones', url: '/perfil/mis-direcciones' },
  ];
  @Input() isModal: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _modalRef: BsModalRef,
    private _addressesRepo: AddressesRepo,
    private _genericService: GenericService,
    private _alertsService: AlertsService,
    private _authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _customValidators: CustomValidators
  ) { }

  ngOnInit() {
    this._activatedRoute.params.subscribe((params) => {
      const ADDRESS_ID = params['id'];
      if (ADDRESS_ID) {
        this._loadAddressDetails(ADDRESS_ID);
      } else {
        this.showMap = true;
      }
    });
  }

  goBack() {
    if (this.isModal) {
      this._modalRef.hide();
    } else {
      this._router.navigate(['/perfil/mis-direcciones']);
    }
  }

  loadColonies(cp: number) {
    if (cp.toString().length != 5) {
      return;
    }
    this._genericService.getAll<any>(`${HttpEntitiesEnum.LOCATIONS}/${cp}`)
      .pipe(take(1))
      .subscribe((resp) => {
        if (resp.data) {
          this.colonies = resp.data.colonias || [];
          this.states = [{
            estado_id: resp.data.estado_id,
            estado_nombre: resp.data.estado_nombre,
            codigo_postal: resp.data.codigo_postal,
          }];
          this.form.patchValue({
            estado_id: resp.data.estado_id
          });
        }
      });
  }

  saveAddress() {
    if (!this.form.valid) {
      return;
    }
    this._genericService.post<any>(`${HttpEntitiesEnum.LOCATIONS}/create_address_client`, {
      ...this.form.value,
      codigo_postal: this.form.value['codigo_postal'].toString(),
      latitud: this.form.value['latitud'].toString(),
      longitud: this.form.value['longitud'].toString(),
      cliente_id: this._authService.userId
    })
      .pipe(take(1))
      .subscribe(resp => {
        if (resp.message == "success") {
          this._alertsService.showToast({
            icon: 'success',
            text: 'Se agregó una nueva dirección'
          });
          this._addressesRepo.addAddress(this._getParsedAddress(resp.data[0].direccion))
          this.goBack();
        } else {
          this._alertsService.showToast({
            icon: 'error',
            text: 'Hubo un problema al guardar la drección, intente de nuevo'
          });
        }
      });
  }

  updateAddress() {
    if (!this.form.valid) {
      return;
    }
    this._genericService.put<any>(`${HttpEntitiesEnum.LOCATIONS}/update/${this._authService.userId}/direccion/${this.address.id}`, {
      ...this.form.value,
      codigo_postal: this.form.value['codigo_postal'].toString(),
      latitud: this.form.value['latitud'].toString(),
      longitud: this.form.value['longitud'].toString(),
      cliente_id: this._authService.userId
    })
      .pipe(take(1))
      .subscribe(resp => {
        if (resp.message == "success") {
          this._alertsService.showToast({
            icon: 'success',
            text: 'Se actualizó la dirección'
          });
          this._addressesRepo.updateAddress(this.address.id, this._getParsedAddress(resp.data[0].direccion));
          this.goBack();
        } else {
          this._alertsService.showToast({
            icon: 'error',
            text: 'Ocurrio un problema al actualizar la dirección'
          });
        }
      });
  }

  loadSelectedAddress(address: any) {
    this.form.patchValue({
      latitud: address.lat,
      longitud: address.lng
    });
    this.form.markAsDirty();
  }

  get selectedColony(): IColony | undefined {
    return this.colonies.find(colony => colony.colonia_id == this.form.value['colonia_id']);
  }

  get selectedState(): IState | undefined {
    return this.states.find(state => state.estado_id == this.form.value['estado_id']);
  }

  private _loadAddressDetails(id: any) {
    this._genericService.getOne<any>(`${HttpEntitiesEnum.LOCATIONS}/get_address_id`, id)
      .pipe(take(1))
      .subscribe(resp => {
        this.address = resp.data;
        this.loadColonies(resp.data.codigo_postal);
        this.form.patchValue({
          alias: resp.data.alias,
          nombre_recibidor: resp.data.nombre_recibidor,
          numero_recibidor: resp.data.numero_recibidor.toString(),
          calle: resp.data.calle,
          numero_exterior: resp.data.numero_exterior.toString(),
          numero_interior: resp.data.numero_interior.toString(),
          referencias: resp.data.referencias,
          codigo_postal: resp.data.codigo_postal,
          estado_id: resp.data.estado.id,
          colonia_id: resp.data.colonia.id,
          latitud: resp.data.latitud,
          longitud: resp.data.longitud,
        });
        this.showMap = true;
      });
  }

  private _getParsedAddress(data: any): IAddress {
    return {
      ...data,
      num_exterior: data.numero_exterior,
      num_interior: data.numero_interior,
      estado: {
        id: this.selectedState!.estado_id,
        nombre: this.selectedState!.estado_nombre,
      },
      colonia: {
        id: this.selectedColony!.colonia_id,
        nombre: this.selectedColony!.colonia_nombre,
      },
    }
  }
}
