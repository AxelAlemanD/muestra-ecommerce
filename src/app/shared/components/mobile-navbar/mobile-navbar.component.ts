import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
import 'ionicons';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IBranch } from '../../../interfaces/branch.interface';
import { ICustomer } from '../../../interfaces/customer.interface';
import { BranchRepo } from '../../repositories/branch.repository';
import { CartRepo } from '../../repositories/cart.repository';
import { CustomerRepo } from '../../repositories/customer.repository';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { CustomControlComponent } from '../custom-control/custom-control.component';
import { SelectBranchModalComponent } from '../navbar/subcomponents/select-branch-modal/select-branch-modal.component';
import { MobileSidemenuComponent } from './subcomponents/mobile-sidemenu/mobile-sidemenu.component';
import { SidePanelService } from '../../../services/side-panel.service';
import { Router, RouterModule } from '@angular/router';
import { SearchProductComponent } from '../navbar/subcomponents/search-product/search-product.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mobile-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CustomButtonComponent,
    MobileSidemenuComponent,
    SearchProductComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './mobile-navbar.component.html',
  styleUrl: './mobile-navbar.component.scss',
})
export class MobileNavbarComponent implements OnDestroy {

  showSidemenu: boolean = false;
  customer: ICustomer | null = null;
  selectedBranch: IBranch | null = null;
  productsQuantityInCart: number = 0;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _router: Router,
    private _modalService: BsModalService,
    private _branchRepo: BranchRepo,
    private _cartRepo: CartRepo,
    private _customerRepo: CustomerRepo,
    private _sidePanelService: SidePanelService,
  ) {
    this._subscriptions.push(
      this._sidePanelService.openSidePanel$.subscribe(panel => {
        this.showSidemenu = panel === 'mobile-sidemenu';
      })
    );
    this._subscriptions.push(
      this._customerRepo.customer$.subscribe(customer => {
        this.customer = customer;
      })
    );
    this._subscriptions.push(
      this._branchRepo.branch$.subscribe(selectedBranch => {
        this.selectedBranch = selectedBranch;
      })
    );
    this._subscriptions.push(
      this._cartRepo.cart$.subscribe(cart => {
        this.productsQuantityInCart = (cart) ? cart.productos.length : 0;
        this.productsQuantityInCart += (cart && cart.promociones) ? cart.promociones.length : 0;
      })
    );
  }

  ngOnDestroy() {
    if (this._subscriptions.length) {
      this._subscriptions.forEach(subscription => subscription.unsubscribe())
    }
  }

  openSelectBranchModal() {
    this._modalService.show(
      SelectBranchModalComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        backdrop: 'static',
      }
    );
  }

  openSearchBar() {
    alert('Abrir barra de busqueda');
  }

  openSidemenu() {
    this._sidePanelService.open('mobile-sidemenu');
  }

  redirectTo(route: string) {
    this._router.navigate([route]);
  }
}
