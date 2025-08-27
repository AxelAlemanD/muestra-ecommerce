import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CustomRadioComponent } from '../custom-radio/custom-radio.component';
import { CommonModule } from '@angular/common';
import { FiltersService } from '../../../services/filters.service';
import { IFilters } from '../../../interfaces/filters.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { IBrand } from '../../../interfaces/brand.interface';
import { BrandsRepo } from '../../repositories/brands.repository';

@Component({
  selector: 'app-active-filters',
  standalone: true,
  imports: [
    CommonModule,
    CustomRadioComponent
  ],
  templateUrl: './active-filters.component.html',
  styleUrl: './active-filters.component.scss',
})
export class ActiveFiltersComponent implements OnInit {

  range = '';
  activeBrands: IBrand[] = [];

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _filtersService: FiltersService,
    private _brandsRepo: BrandsRepo,
  ) {
    this._activatedRoute.queryParams.subscribe((params) => {
      if (params['marca']) {
        const BRAND_FILTERS = params['marca'].split(',').map(Number);
        const BRANDS = this._brandsRepo.getCurrentBrands();
        this.activeBrands = BRANDS.filter(brand => BRAND_FILTERS.includes(brand.id));
      } else {
        this.activeBrands = [];
      }

      this.range = (params['precio'])
      ? `$${params['precio'].split('-')[0]}-$${params['precio'].split('-')[1]}`
      : '';
      
    });
  }

  ngOnInit(): void { }

  changeSelectedBrands(brandId: number) {
    const UPDATED_BRANDS_ID = this.activeBrands
      .filter(brand => brand.id != brandId)
      .map(brand => brand.id);
    let queryParams = { ...this._activatedRoute.snapshot.queryParams };
    if (UPDATED_BRANDS_ID.length > 0) {
      this._filtersService.setOptionValues('brands', UPDATED_BRANDS_ID)
      queryParams['marca'] = UPDATED_BRANDS_ID.join(',');
    } else if (queryParams['marca']) {
      delete queryParams['marca'];
    }

    this._router.navigate([], { queryParams });
  }

  resetRange() {
    let queryParams = { ...this._activatedRoute.snapshot.queryParams };
    delete queryParams['precio'];
    this._router.navigate([], { queryParams });
  }

}
