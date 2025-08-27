import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
import { CustomButtonComponent } from '../../../custom-button/custom-button.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BranchRepo } from '../../../../repositories/branch.repository';
import { CartRepo } from '../../../../repositories/cart.repository';
import { CustomerRepo } from '../../../../repositories/customer.repository';
import { IBranch } from '../../../../../interfaces/branch.interface';
import { ICustomer } from '../../../../../interfaces/customer.interface';
import 'ionicons';
import { SelectBranchModalComponent } from '../../../navbar/subcomponents/select-branch-modal/select-branch-modal.component';
import { ISidemenuItem, ISidemenuPanel } from '../../../../../interfaces/sidemenu-panel.interface';
import { SidePanelService } from '../../../../../services/side-panel.service';
import { Router, RouterModule } from '@angular/router';
import { BrandsRepo } from '../../../../repositories/brands.repository';
import { CategoriesRepo } from '../../../../repositories/categories.repository';
import { AuthService } from '../../../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mobile-sidemenu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CustomButtonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './mobile-sidemenu.component.html',
  styleUrl: './mobile-sidemenu.component.scss',
})
export class MobileSidemenuComponent implements OnDestroy {

  customer: ICustomer | null = null;
  selectedBranch: IBranch | null = null;
  productsQuantityInCart: number = 0;
  panels: ISidemenuPanel[] = [
    {
      title: 'Menu',
      buttons: [
        {
          color: 'dark',
          fill: 'clear',
          icon: 'close',
          position: 'right',
          action: () => this.emitClose()
        }
      ],
      items: [
        {
          name: 'Inicio',
          link: '/'
        },
        // {
        //   name: 'Sucursales',
        //   link: 'sucursales'
        // },
        {
          name: 'Ofertas',
          link: '/promociones'
        },
        {
          name: 'Categorías',
          subitems: []
        },
        {
          name: 'Marcas',
          subitems: []
        },
        {
          name: 'Mis pedidos',
          link: '/mis-pedidos'
        },
        {
          name: 'Mis mascotas',
          link: '/perfil/mis-mascotas'
        },
        {
          name: 'Mis direcciones',
          link: '/perfil/mis-direcciones'
        },
        {
          name: 'Cambiar contraseña',
          link: '/perfil/cambiar-credenciales'
        },
      ]
    }
  ];
  isOpen: boolean = false;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _router: Router,
    private _modalService: BsModalService,
    private _branchRepo: BranchRepo,
    private _cartRepo: CartRepo,
    private _customerRepo: CustomerRepo,
    private _categoriesRepo: CategoriesRepo,
    private _brandsRepo: BrandsRepo,
    private _sidePanelService: SidePanelService,
    private _authService: AuthService,
  ) {
    this._subscriptions.push(
      this._sidePanelService.openSidePanel$.subscribe(panel => {
        this.isOpen = panel === 'mobile-sidemenu';
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
      this._categoriesRepo.categories$.subscribe(categories => {
        const categoriesPanelItem = this.panels[0].items.find(item => item.name === 'Categorías');
        if (categoriesPanelItem) {
          categoriesPanelItem.subitems = categories.map(category => {
            return {
              name: category.nombre,
              subitems: (category.subcategorias && category.subcategorias.length)
                ? category.subcategorias.map(subcategory => ({
                  link: `/categorias/${category.id}/subcategoria/${subcategory.id}`,
                  name: subcategory.nombre,
                })
                ) : []
            }
          });
        }
      })
    );
    this._subscriptions.push(
      this._brandsRepo.brands$.subscribe(brands => {
        const brandsPanelItem = this.panels[0].items.find(item => item.name === 'Marcas');
        if (brandsPanelItem) {
          brandsPanelItem.subitems = brands.map(brand => {
            return {
              name: brand.nombre,
              link: `/productos?marca=${brand.id}`,
            }
          });
        }
      })
    );
    this._subscriptions.push(
      this._cartRepo.cart$.subscribe(cart => {
        if (cart) {
          this.productsQuantityInCart = (cart) ? cart.productos.length : 0;
          this.productsQuantityInCart += (cart && cart.promociones) ? cart.promociones.length : 0;
        }
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

  redirectTo(route: string) {
    this._router.navigate([route]);
    this.emitClose();
  }

  openPanel(item: ISidemenuItem) {
    if (item.subitems && item.subitems.length > 0) {
      this.panels.push({
        title: item.name,
        items: item.subitems,
        buttons: [
          {
            color: 'dark',
            fill: 'clear',
            icon: 'chevron-back',
            position: 'left',
            action: () => this.goToPreviousPanel()
          },
          {
            color: 'dark',
            fill: 'clear',
            icon: 'close',
            position: 'right',
            action: () => this.emitClose()
          }
        ],
      });
    }
  }

  // Método para regresar al menú anterior
  goToPreviousPanel() {
    if (this.panels.length > 1) {
      this.panels.pop();
    }
  }

  openLink(link: string) {
    this._router.navigateByUrl(link);
  }

  emitClose() {
    this.panels = [
      { ...this.panels[0] }
    ];
    this._sidePanelService.close()
    // this.onClose.emit();
  }

  logout() {
    this._authService.logout()
  }

  get currentPanel(): ISidemenuPanel {
    return this.panels[this.panels.length - 1];
  }
}
