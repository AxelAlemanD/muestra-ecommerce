import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomControlComponent } from '../../../../../shared/components/custom-control/custom-control.component';
import { CustomSelectComponent } from '../../../../../shared/components/custom-select/custom-select.component';
import { CustomButtonComponent } from '../../../../../shared/components/custom-button/custom-button.component';
import { GenericService } from '../../../../../services/generic.service';
import { AlertsService } from '../../../../../services/alerts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IBreadcrumbItem } from '../../../../../interfaces/breadcrumb.interface';
import { BreadcrumbComponent } from '../../../../../shared/components/breadcrumb/breadcrumb.component';
import { Subscription, take } from 'rxjs';
import { HttpEntitiesEnum } from '../../../../../shared/enums/http-entities.enum';
import { PetsRepo } from '../../../../../shared/repositories/pets.repository';
import { AuthService } from '../../../../../services/auth.service';
import { UploadsPipe } from '../../../../../shared/pipes/uploads.pipe';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomControlComponent,
    CustomSelectComponent,
    CustomButtonComponent,
    BreadcrumbComponent,
    UploadsPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss',
})
export class PetFormComponent {

  genres: any[] = [
    { label: 'Macho', value: 'macho' },
    { label: 'Hembra', value: 'hembra' },
  ];
  species: any[] = [
    { label: 'Perro', value: 'perro' },
    { label: 'Gato', value: 'gato' },
    { label: 'Conejo', value: 'conejo' },
    { label: 'Hamster', value: 'hamster' },
  ];
  sizes: any[] = [
    { label: 'Pequeño', value: 'pequeño' },
    { label: 'Mediano', value: 'mediano' },
    { label: 'Grande', value: 'grande' },
  ];
  form: FormGroup = this._formBuilder.group({
    nombreFoto: [null, Validators.required],
    srcFoto: [null],
    nombre: [null, Validators.required],
    genero: [null, Validators.required],
    especie: [null, Validators.required],
    tamaño: [null, Validators.required],
    fecha_nacimiento: [null, Validators.required],
    edad: [null, Validators.required],
  });
  breadcrumb: IBreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Perfil', url: '/perfil' },
    { label: 'Mis mascotas', url: '/perfil/mis-mascotas' },
  ];
  selectedImage: any;
  petId!: number;
  private _subscription!: Subscription;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _petsRepo: PetsRepo,
    private _genericService: GenericService,
    private _alertsService: AlertsService,
    private _authService: AuthService,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this._activatedRoute.params.subscribe((params) => {
      this.petId = params['id'];
      if (this.petId) {
        this._subscription = this._petsRepo.getPet$(this.petId).subscribe(pet => {
          if (pet) {
            this.form.patchValue({
              nombreFoto: pet.media_url,
              srcFoto: pet.media_url,
              nombre: pet.nombre,
              genero: pet.genero,
              especie: pet.especie,
              tamaño: pet.tamaño,
              fecha_nacimiento: pet.fecha_nacimiento,
              edad: pet.edad,
            });
          }
        });
      }
    });
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  goBack() {
    this._router.navigate(['/perfil/mis-mascotas']);
  }

  openFilePicker() {
    const FILE_PICKER: any = document.querySelector('#pet-photo-picker');
    FILE_PICKER?.click();
  }

  onImageChange(event: any) {
    if (!event.target.files || !event.target.files.length) {
      return;
    }
    this.selectedImage = event.target.files[0];
    this.form.patchValue({
      nombreFoto: this.selectedImage.name
    });
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const result =
          this.form.patchValue({
            srcFoto: reader.result as string
          });
      }
    };
    reader.readAsDataURL(this.selectedImage);
  }

  async savePet() {
    if (!this.form.valid) {
      return;
    }

    const FORM_DATA = new FormData();
    FORM_DATA.append('nombre', this.form.value['nombre']);
    FORM_DATA.append('especie', this.form.value['especie']);
    FORM_DATA.append('tamaño', this.form.value['tamaño']);
    FORM_DATA.append('genero', this.form.value['genero']);
    FORM_DATA.append('fecha_nacimiento', this.form.value['fecha_nacimiento']);
    FORM_DATA.append('edad', this.form.value['edad']);
    FORM_DATA.append('imagen_mascota', this.selectedImage);
    FORM_DATA.append('cliente_id', this._authService.userId);

    if (!this.petId) {
      this._addPet(FORM_DATA);
    } else {
      this._updatePet(FORM_DATA);
    }
  }

  private _addPet(formData: FormData) {
    this._genericService.post<any>(`${HttpEntitiesEnum.PETS}/upload_encuesta_mascota`, formData)
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          if (resp.message === 'success') {
            this._alertsService.showToast({
              icon: 'success',
              text: 'Se agregó una nueva mascota'
            });
            resp.data.media_url = resp.data.media_url.replace('https://api.test.casaluca.com.mx', '');
            resp.data.media_url = resp.data.media_url.replace('https://api.casaluca.com.mx', '');
            this._petsRepo.addPet(resp.data)
            this.goBack();
          } else {
            this._alertsService.showToast({
              icon: 'error',
              text: 'Ocurrió un problema al agregar tu mascota'
            });
          }
        },
        error: (error) => {
          this._alertsService.showToast({
            icon: 'error',
            text: 'Ocurrió un problema al agregar tu mascota'
          });
        }
      });
  }

  private _updatePet(formData: FormData) {
    this._genericService.put<any>(`${HttpEntitiesEnum.PETS}/update_encuesta_mascota/${this.petId}`, {
      nombre: this.form.value['nombre'],
      especie: this.form.value['especie'],
      tamaño: this.form.value['tamaño'],
      fecha_nacimiento: this.form.value['fecha_nacimiento'],
      edad: this.form.value['edad'],
      genero: this.form.value['genero'],
      cliente_id: this._authService.userId,
    })
      .pipe(take(1))
      .subscribe({
        next: (resp) => {
          if (resp.message === 'success') {
            this._alertsService.showToast({
              icon: 'success',
              text: 'Se actualizó tu mascota'
            });
            delete resp.data.media_url;
            this._petsRepo.updatePet(this.petId, resp.data);
            this.goBack();
          } else {
            this._alertsService.showToast({
              icon: 'error',
              text: 'Ocurrió un problema al actualizar tu mascota'
            });
          }
        },
        error: (error) => {
          this._alertsService.showToast({
            icon: 'error',
            text: 'Ocurrió un problema al actualizar tu mascota'
          });
        }
      });
  }
}
