import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AddressListComponent } from './my-addresses/components/address-list/address-list.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PetListComponent } from './my-pets/components/pet-list/pet-list.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { IBreadcrumbItem } from '../../interfaces/breadcrumb.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProfileFormComponent,
    AddressListComponent,
    PetListComponent,
    ChangePasswordComponent,
    BreadcrumbComponent
  ],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage {

  currentPath: string = '';
  breadcrumb: IBreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Perfil', url: '/perfil' },
  ];

  constructor(
    private _activatedRoute: ActivatedRoute
  ) {
    this._activatedRoute.data.subscribe(data => {
      this.currentPath = data['path'];
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

}
