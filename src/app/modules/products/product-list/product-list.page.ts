import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FiltersWidgetComponent } from './components/filters-widget/filters-widget.component';
import { CommonModule } from '@angular/common';
import { FiltersService } from '../../../services/filters.service';
import { IFilters } from '../../../interfaces/filters.interface';
import { ProductGridComponent } from '../../../shared/components/product-grid/product-grid.component';
import { ProductsRepo } from '../../../shared/repositories/products.repository';
import { first, Subscription } from 'rxjs';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { IProduct } from '../../../interfaces/product.interface';
import { PaginationService } from '../../../services/pagination.service';
import { MobileSideFiltersComponent } from './components/mobile-side-filters/mobile-side-filters.component';
import { ActiveFiltersComponent } from '../../../shared/components/active-filters/active-filters.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { IBreadcrumbItem } from '../../../interfaces/breadcrumb.interface';
import { QueryParamsService } from '../../../services/query-params.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductGridComponent,
    FiltersWidgetComponent,
    PaginatorComponent,
    MobileSideFiltersComponent,
    BreadcrumbComponent,
    ActiveFiltersComponent
  ],
  templateUrl: './product-list.page.html',
  styleUrl: './product-list.page.scss',
})
export class ProductListPage implements OnInit, OnDestroy {

  filters: IFilters | null = null;
  showSideFilters: boolean = false;
  breadcrumb: IBreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Productos', url: '/productos' },
  ];

  private _subscription!: Subscription;

  constructor(
    private _filtersService: FiltersService,
    private _productsRepo: ProductsRepo,
    private _productsService: ProductsService,
    private _activatedRoute: ActivatedRoute,
    private _paginationService: PaginationService,
    private _router: Router,
    private _queryParamsService: QueryParamsService
  ) { }

  ngOnInit() {
    this._queryParamsService.sanitize();
    this._productsRepo.products$.pipe(
      first(products => products !== null && products.length > 0)
    ).subscribe(products => {
      this._filtersService.setItems(products);
      this._listenQueryParamsChanges();
    });

    this._subscription = this._filtersService.availableFilters$.subscribe(filters => {
      this.filters = filters;
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  private _listenQueryParamsChanges() {
    this._activatedRoute.queryParams.subscribe((params) => {
      let page = 1;
      let limit = 16;
      if (params['busqueda']) {
        this._filtersService.setOptionValues('search', params['busqueda']);
      } else if (Object.hasOwn(params, 'busqueda') && !params['busqueda'].length) {
        this._queryParamsService.removeParam('busqueda');
      }
      if (params['marca']) {
        const BRANDS = params['marca'].split(',').map(Number);
        this._filtersService.setOptionValues('brands', BRANDS);
      }
      if (params['categoria']) {
        const CATEGORY = params['categoria'];
        this._filtersService.setOptionValues('category', [CATEGORY]);
      }
      if (params['subcategoria']) {
        const SUBCATEGORY = params['subcategoria'];
        this._filtersService.setOptionValues('subcategory', [SUBCATEGORY]);
      }
      if (params['precio']) {
        const PRICE = params['precio'].split('-').map(Number);
        this._filtersService.setOptionValues('range', PRICE);
      }
      if (params['promocion']) {
        this._filtersService.setOptionValues('promotion', [params['promocion']]);
      }
      if (params['tipo-promocion']) {
        this._filtersService.setOptionValues('promotion-type', [params['tipo-promocion']]);
      }
      if (params['orden']) {
        const SORT: 'default' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' = params['orden'];
        this._filtersService.setSort(SORT)
      }
      if (params['limite']) {
        const LIMIT: number = parseInt(params['limite']);
        limit = LIMIT;
        this._filtersService.setLimit(LIMIT);
      }
      if (params['pagina']) {
        const PAGE: number = parseInt(params['pagina']);
        page = PAGE;
        this._filtersService.setPage(PAGE);
        this._scrollToTop();
      } else {
        this._filtersService.setPage(page);
      }

      const QUERY_STRING = new URLSearchParams(params).toString();
      const FILTERED_PRODUCTS: IProduct[] = this._productsService.filter(QUERY_STRING);
      this._filtersService.setTotal(FILTERED_PRODUCTS.length);
      this._filtersService.setPages(Math.ceil(FILTERED_PRODUCTS.length / (this.filters?.limit || limit)));
      const PRODUCT_PAGE_TO_SHOW: IProduct[] = this._paginationService.paginate(FILTERED_PRODUCTS, this.filters?.limit || limit, this.filters?.page || page);
      this._filtersService.setItems(PRODUCT_PAGE_TO_SHOW);
    });
  }

  private _scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}
