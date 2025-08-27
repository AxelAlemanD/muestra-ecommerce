import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnDestroy } from '@angular/core';
import 'ionicons';
import { SidePanelService } from '../../../../../services/side-panel.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomButtonComponent } from '../../../../../shared/components/custom-button/custom-button.component';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { FormGroup, UntypedFormControl, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IBrand } from '../../../../../interfaces/brand.interface';
import { ICategory } from '../../../../../interfaces/category.interface';
import { IFilterOption } from '../../../../../interfaces/filters.interface';
import { BrandsRepo } from '../../../../../shared/repositories/brands.repository';
import { CategoriesRepo } from '../../../../../shared/repositories/categories.repository';
import { CustomControlComponent } from '../../../../../shared/components/custom-control/custom-control.component';
import { CustomRadioComponent } from '../../../../../shared/components/custom-radio/custom-radio.component';
import { QueryParamsService } from '../../../../../services/query-params.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mobile-side-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CustomRadioComponent,
    NgxSliderModule,
    CustomButtonComponent,
    CustomControlComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './mobile-side-filters.component.html',
  styleUrl: './mobile-side-filters.component.scss',
})
export class MobileSideFiltersComponent implements OnDestroy {

  @Input() brands: IBrand[] = [];
  categories: ICategory[] = [];
  form: FormGroup = this._formBuilder.group({
    category: null,
    brands: [[]],
    range: new UntypedFormControl([0, 10000]),
    minPrice: 0,
    maxPrice: 10000,
    promotion: 'any',
    promotionType: 'any',
  });
  rangeOptions: Options = {
    floor: 0,
    ceil: 10000,
    step: 5,
  };
  @Input() filters: IFilterOption[] = [];
  @Input() isOpen: boolean = false;
  @Input() showCategories: boolean = true;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _brandsRepo: BrandsRepo,
    private _categoriesRepo: CategoriesRepo,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _sidePanelService: SidePanelService,
    private _queryParamsService: QueryParamsService,
  ) {
    this._subscriptions.push(
      this._sidePanelService.openSidePanel$.subscribe(panel => {
        this.isOpen = panel === 'mobile-side-filters';
      })
    );
    if (!this.brands.length) {
      this._subscriptions.push(
        this._brandsRepo.brands$.subscribe(brands => this.brands = brands)
      );
    }
    this._subscriptions.push(
      this._categoriesRepo.categories$.subscribe(categories => this.categories = categories)
    );
    this._activatedRoute.queryParams.subscribe((params) => {
      if (params['marca']) {
        const BRAND_FILTERS = params['marca'].split(',');
        this.form.patchValue({ brands: BRAND_FILTERS });
      } else {
        this.form.patchValue({ brands: [] });
      }

      this.form.patchValue({
        promotions: (params['promocion']) ? params['promocion'] : 'any'
      });

      this.form.patchValue({
        promotions: (params['tipo-promocion']) ? params['tipo-promocion'] : 'any'
      });

      if (!params['promocion']) {
        this._queryParamsService.removeParam('tipo-promocion')
      }

      if (!params['precio']) {
        this.form.patchValue({
          range: [0, 10000],
          minPrice: 0,
          maxPrice: 10000,
        });
      }
    });
  }

  ngOnInit() {
    if (this.filters) {
      const CATEGORY = this.filters.find(filter => filter.type == 'category');
      const BRANDS = this.filters.find(filter => filter.type == 'brands');
      const RANGE = this.filters.find(filter => filter.type == 'range');
      const PROMOTION = this.filters.find(filter => filter.type == 'promotion');
      const PROMOTION_TYPE = this.filters.find(filter => filter.type == 'promotion-type');
      this.form.patchValue({
        category: (CATEGORY && CATEGORY.value.length) ? CATEGORY.value[0] : null,
        brands: (BRANDS && BRANDS.value.length) ? BRANDS.value.map(item => item.toString()) : [],
        range: (RANGE && RANGE.value.length) ? RANGE.value : this.form.value['range'],
        minPrice: (RANGE && RANGE.value.length) ? RANGE.value[0] : 0,
        maxPrice: (RANGE && RANGE.value.length) ? RANGE.value[1] : 10000,
        promotion: (PROMOTION && PROMOTION.value.length) ? PROMOTION.value[0] : 'any',
        promotionType: (PROMOTION_TYPE && PROMOTION_TYPE.value.length) ? PROMOTION_TYPE.value[0] : 'any',
      });
    }
  }

  ngOnDestroy() {
    if (this._subscriptions.length) {
      this._subscriptions.forEach(subscription => subscription.unsubscribe())
    }
  }

  changeSelectedBrands(brandId: string) {
    const SELECTED_BRANDS = this.form.value['brands'];
    if (SELECTED_BRANDS.includes(brandId)) {
      this.form.patchValue({
        brands: SELECTED_BRANDS.filter((item: any) => item != brandId)
      });
    } else {
      this.form.patchValue({
        brands: [...SELECTED_BRANDS, brandId]
      });
    }

    let queryParams = { ...this._activatedRoute.snapshot.queryParams };
    if (this.form.value['brands'] && this.form.value['brands'].length > 0) {
      queryParams['marca'] = this.form.value['brands'].join(',');
    } else if (queryParams['marca']) {
      delete queryParams['marca'];
    }

    this._router.navigate([], { queryParams });
  }

  changePromotionStatus(option: 'any' | 'true' | 'false') {
    let queryParams = { ...this._activatedRoute.snapshot.queryParams };
    if (option === 'any') {
      delete queryParams['promocion'];
    } else {
      queryParams['promocion'] = option === 'true';
    }
    this._router.navigate([], { queryParams });
  }

  changePromotionType(type: 'any' | '$' | '%') {
    let queryParams = { ...this._activatedRoute.snapshot.queryParams };
    if (type === 'any') {
      delete queryParams['tipo-promocion'];
    } else {
      queryParams['tipo-promocion'] = type;
    }
    this._router.navigate([], { queryParams });
  }


  changeSelectedRange() {
    this.form.patchValue({
      range: [this.form.value['minPrice'], this.form.value['maxPrice']]
    });
    let queryParams = { ...this._activatedRoute.snapshot.queryParams };
    queryParams['precio'] = `${this.form.value['minPrice']}-${this.form.value['maxPrice']}`;
    this._router.navigate([], { queryParams });
  }

  updateRangeControls(event: any) {
    this.form.patchValue({
      minPrice: event.value,
      maxPrice: event.highValue,
    });
  }

  resetForm() {
    this.form.reset({
      brands: [],
      range: [0, 10000],
      minPrice: 0,
      maxPrice: 10000,
    });
    this._router.navigate([], { queryParams: {} });
  }

  emitClose() {
    this._sidePanelService.close()
  }
}
