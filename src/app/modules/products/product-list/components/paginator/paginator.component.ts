import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CustomButtonComponent } from '../../../../../shared/components/custom-button/custom-button.component';
import { CommonModule } from '@angular/common';
import 'ionicons';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomSelectComponent } from '../../../../../shared/components/custom-select/custom-select.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidePanelService } from '../../../../../services/side-panel.service';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomSelectComponent,
    CustomButtonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  orderOptions = [
    {
      label: 'Por defecto',
      value: 'default'
    },
    {
      label: 'Nombre (A-Z)',
      value: 'name_asc'
    },
    {
      label: 'Nombre (Z-A)',
      value: 'name_desc'
    },
    {
      label: 'Precio (menor a mayor)',
      value: 'price_asc'
    },
    {
      label: 'Precio (mayor a menor)',
      value: 'price_desc'
    }
  ];
  limitOptions = [
    {
      label: 8,
      value: 8,
    },
    {
      label: 16,
      value: 16,
    },
    {
      label: 24,
      value: 24,
    },
    {
      label: 32,
      value: 32,
    }
  ];

  form: FormGroup = this._formBuilder.group({
    order: ['default', Validators.required],
    limit: [16, Validators.required],
  });
  @Input({ required: true }) pages!: number;
  @Input({ required: true }) limit!: number;
  @Input({ required: true }) currentPage!: number;
  @Input({ required: true }) items!: any[];
  @Input({ required: true }) total: number = 0;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _sidePanelService: SidePanelService,
  ) { }

  changeOrder() {
    let queryParams = { ...this._activatedRoute.snapshot.queryParams };
    queryParams['orden'] = this.form.value['order'];
    this._router.navigate([], { queryParams });
  }

  changeLimit() {
    let queryParams = { ...this._activatedRoute.snapshot.queryParams };
    queryParams['limite'] = this.form.value['limit'];
    queryParams['pagina'] = 1;
    this._router.navigate([], { queryParams });
  }

  changePage(page: any) {
    if (page >= 1 && page <= this.pages && page != this.currentPage) {
      this.currentPage = page;
      let queryParams = { ...this._activatedRoute.snapshot.queryParams };
      queryParams['pagina'] = page;
      this._router.navigate([], { queryParams });
    }
  }

  openSideFilters() {
    this._sidePanelService.open('mobile-side-filters');
  }

  get pagesToShow(): (number | string)[] {
    const range = 5;
    const pages: (number | string)[] = [];
  
    if (this.pages <= range) {
      // Mostrar todas las páginas si son <= 5
      for (let i = 1; i <= this.pages; i++) {
        pages.push(i);
      }
    } else if (this.currentPage <= 4) {
      // Mostrar las primeras 5 páginas + separador + última página
      for (let i = 1; i <= range; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(this.pages);
    } else if (this.currentPage > 4 && this.currentPage <= this.pages - range) {
      // Mostrar las páginas alrededor de la página actual
      for (let i = this.currentPage; i < this.currentPage + range && i <= this.pages; i++) {
        pages.push(i);
      }
      if (this.currentPage + range < this.pages) {
        pages.push('...');
        pages.push(this.pages);
      }
    } else {
      // Mostrar las últimas 5 páginas
      for (let i = this.pages - range + 1; i <= this.pages; i++) {
        pages.push(i);
      }
    }
  
    return pages;
  }
}
