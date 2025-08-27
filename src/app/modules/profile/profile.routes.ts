import { Routes } from '@angular/router';
import { AddressFormComponent } from './my-addresses/components/address-form/address-form.component';
import { ProfilePage } from './profile.page';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PetFormComponent } from './my-pets/components/pet-form/pet-form.component';

export default [
  {
    path: '',
    component: ProfilePage,
    data: {
      path: 'mi-perfil'
    }
  },
  {
    path: 'mis-direcciones',
    component: ProfilePage,
    data: {
      path: 'mis-direcciones'
    }
  },
  {
    path: 'mis-direcciones/agregar',
    component: AddressFormComponent,
    data: {
      path: 'mis-direcciones/agregar'
    }
  },
  {
    path: 'mis-direcciones/editar/:id',
    component: AddressFormComponent,
    data: {
      path: 'mis-direcciones/editar'
    }
  },
  {
    path: 'mis-mascotas',
    component: ProfilePage,
    data: {
      path: 'mis-mascotas'
    }
  },
  {
    path: 'mis-mascotas/agregar',
    component: PetFormComponent,
    data: {
      path: 'mis-mascotas/agregar'
    }
  },
  {
    path: 'mis-mascotas/editar/:id',
    component: PetFormComponent,
    data: {
      path: 'mis-mascotas/editar'
    }
  },
  {
    path: 'cambiar-credenciales',
    component: ProfilePage,
    data: {
      path: 'cambiar-credenciales'
    }
  },
] as Routes;

