import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersService } from '../../../services/filters.service';
import { IFilters } from '../../../interfaces/filters.interface';
import { ProductGridComponent } from '../../../shared/components/product-grid/product-grid.component';
import { ProductsRepo } from '../../../shared/repositories/products.repository';
import { first, Subscription, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { IProduct } from '../../../interfaces/product.interface';
import { PaginationService } from '../../../services/pagination.service';
import { FiltersWidgetComponent } from '../../products/product-list/components/filters-widget/filters-widget.component';
import { MobileSideFiltersComponent } from '../../products/product-list/components/mobile-side-filters/mobile-side-filters.component';
import { PaginatorComponent } from '../../products/product-list/components/paginator/paginator.component';
import { GenericService } from '../../../services/generic.service';
import { HttpEntitiesEnum } from '../../../shared/enums/http-entities.enum';
import { ICategory } from '../../../interfaces/category.interface';
import { CategoryCardComponent } from '../../../shared/components/category-card/category-card.component';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { IBreadcrumbItem } from '../../../interfaces/breadcrumb.interface';
import { CategoriesRepo } from '../../../shared/repositories/categories.repository';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ActiveFiltersComponent } from '../../../shared/components/active-filters/active-filters.component';
import { QueryParamsService } from '../../../services/query-params.service';
import { IBrand } from '../../../interfaces/brand.interface';

@Component({
  selector: 'app-categories-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductGridComponent,
    FiltersWidgetComponent,
    PaginatorComponent,
    MobileSideFiltersComponent,
    SlickCarouselModule,
    CategoryCardComponent,
    BreadcrumbComponent,
    ActiveFiltersComponent
  ],
  templateUrl: './categories-product-list.page.html',
  styleUrl: './categories-product-list.page.scss',
})
export class CategoriesProductListPage implements OnInit, OnDestroy {

  filters: IFilters | null = null;
  showSideFilters: boolean = false;
  showSubcategories: boolean = false;
  category!: ICategory;
  categoryId!: number;
  subcategoryId!: number;
  slideConfig = {
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    speed: 700,
    dots: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 0,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 6
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 8
        }
      }
    ]
  };
  breadcrumb: IBreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
  ];
  brandsToShow: IBrand[] = [];
  isCategoryChange: boolean = false;

  private _subscription!: Subscription;

  constructor(
    private _filtersService: FiltersService,
    private _productsRepo: ProductsRepo,
    private _productsService: ProductsService,
    private _activatedRoute: ActivatedRoute,
    private _paginationService: PaginationService,
    private _router: Router,
    private _genericService: GenericService,
    private _categoriesRepo: CategoriesRepo,
    private _queryParamsService: QueryParamsService
  ) { }

  ngOnInit() {
    this._queryParamsService.sanitize();
    this._activatedRoute.params.subscribe((params) => {
      this.breadcrumb = [
        { label: 'Inicio', url: '/' },
      ];
      this.categoryId = params['id'];
      this.subcategoryId = params['subcategoryId'];
      if (this.categoryId && this.subcategoryId) {
        const CATEGORY = this._categoriesRepo.getCategoryById(this.categoryId)
        if (CATEGORY) {
          this.breadcrumb.push({
            label: CATEGORY.nombre, url: `/categorias/${this.categoryId}`
          });
        }
      }
      this.isCategoryChange = true;
      this._filtersService.reset();
      this._loadCategoryDetails(this.subcategoryId ?? this.categoryId);
      this._filtersService.setOptionValues('category', [this.categoryId]);
    });

    this._activatedRoute.queryParams.subscribe((params) => {
      this._filterProducts(params);
    });

    this._productsRepo.products$.pipe(
      first(products => products !== null && products.length > 0)
    ).subscribe(products => {
      this._filtersService.setItems(products);
    });

    this._subscription = this._filtersService.availableFilters$.subscribe(filters => {
      this.filters = filters;
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  redirectToSubcategory(subcategory: ICategory) {
    this._router.navigateByUrl(`/categorias/${this.categoryId}/subcategoria/${subcategory.id}`);
  }

  private _filterProducts(params: any) {
    params = {
      ...params,
      categoria: this.categoryId,
    };
    if (this.subcategoryId) {
      params = {
        ...params,
        subcategoria: this.subcategoryId,
      };
    }
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
    if (params['precio']) {
      const PRICE = params['precio'].split('-').map(Number);
      this._filtersService.setOptionValues('range', PRICE);
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
    if (this.isCategoryChange) {
      this._loadBrandsToShow(FILTERED_PRODUCTS);
      this.isCategoryChange = false;
    }
    this._filtersService.setItems(PRODUCT_PAGE_TO_SHOW);
  }

  private _loadCategoryDetails(id: number) {
    this._genericService.getOne<any>(`${HttpEntitiesEnum.CATEGORY}/get_categoria_subcategorias_id`, id)
      .pipe(take(1))
      .subscribe(resp => {
        this.category = {
          ...resp.data,
          subcategorias: (resp.data.subcategorias && resp.data.subcategorias.length)
            ? resp.data.subcategorias.map((subcategory: any) => ({
              ...subcategory,
              media_url: subcategory.media.media_url || null
            }))
            : []
        };

        this.showSubcategories = false;
        setTimeout(() => {
          this.showSubcategories = true;
        }, 1000);

        this.breadcrumb.push({
          label: this.category.nombre,
          url: (this.subcategoryId) ? `/categorias/${this.categoryId}/subcategoria/${this.category.id}` : `/categorias/${this.category.id}`
        });


        let params: any = {
          categoria: this.categoryId
        };
        if (this.subcategoryId) {
          params['subcategoria'] = this.subcategoryId;
        }
        this._filterProducts(params);
      });
  }

  private _loadBrandsToShow(products: IProduct[]) {
    this.brandsToShow = Array.from(
      new Map(products.map(p => [p.marca.id, p.marca])).values()
    );
  }

  private _scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
