import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
import { CustomControlComponent } from '../custom-control/custom-control.component';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import 'ionicons';
import { MegamenuComponent } from './subcomponents/megamenu/megamenu.component';
import { ImageGridComponent } from './subcomponents/image-grid/image-grid.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SelectBranchModalComponent } from './subcomponents/select-branch-modal/select-branch-modal.component';
import { BranchRepo } from '../../repositories/branch.repository';
import { IBranch } from '../../../interfaces/branch.interface';
import { CartPreviewComponent } from './subcomponents/cart-preview/cart-preview.component';
import { CartRepo } from '../../repositories/cart.repository';
import { CustomerRepo } from '../../repositories/customer.repository';
import { ICustomer } from '../../../interfaces/customer.interface';
import { CustomerOptionsComponent } from './subcomponents/customer-options/customer-options.component';
import { Router, RouterModule } from '@angular/router';
import { BrandsRepo } from '../../repositories/brands.repository';
import { IBrand } from '../../../interfaces/brand.interface';
import { ICategory } from '../../../interfaces/category.interface';
import { CategoriesRepo } from '../../repositories/categories.repository';
import { IMegaMenuItem } from '../../../interfaces/megamenu-item.interface';
import { SearchProductComponent } from './subcomponents/search-product/search-product.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    CustomButtonComponent,
    // CustomControlComponent,
    SearchProductComponent,
    MegamenuComponent,
    ImageGridComponent,
    CartPreviewComponent,
    CustomerOptionsComponent,
    RouterModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnDestroy {

  brands: IBrand[] = [];
  categoriesForMegaMenu: IMegaMenuItem[] = [];
  customer: ICustomer | null = null;
  selectedBranch: IBranch | null = null;
  productsQuantityInCart: number = 0;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _modalService: BsModalService,
    private _branchRepo: BranchRepo,
    private _cartRepo: CartRepo,
    private _customerRepo: CustomerRepo,
    private _brandsRepo: BrandsRepo,
    private _categoriesRepo: CategoriesRepo,
    private _router: Router
  ) {
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
      this._categoriesRepo.categories$.subscribe(categories => {
        this.categoriesForMegaMenu = categories.map(category => {
          return {
            link: `categorias/${category.id}`,
            label: category.nombre,
            subitems: (category.subcategorias && category.subcategorias.length)
              ? category.subcategorias.map(subcategory => ({
                link: `categorias/${category.id}/subcategoria/${subcategory.id}`,
                label: subcategory.nombre,
              })
              )
              : []
          }
        })
      })
    );
    this._subscriptions.push(
      this._cartRepo.cart$.subscribe(cart => {
        this.productsQuantityInCart = (cart) ? cart.productos.length : 0;
        this.productsQuantityInCart += (cart && cart.promociones) ? cart.promociones.length : 0;
      })
    );
    this._subscriptions.push(
      this._brandsRepo.brands$.subscribe(brands => this.brands = brands)
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
        class: 'modal-md modal-dialog-centered',
        backdrop: 'static',
        initialState: {
          selectedBranch: this.selectedBranch
        }
      }
    );
  }

  redirectTo(route: string) {
    this._router.navigate([route]);
  }
}
