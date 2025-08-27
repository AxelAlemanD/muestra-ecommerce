import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IFilterOption, IFilters } from '../interfaces/filters.interface';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  availableFilters: IFilters = {
    page: 1,
    limit: 16,
    sort: "default",
    total: 0,
    pages: 0,
    from: 1,
    to: 16,
    activeFiltersCount: 0,
    items: [],
    filters: [
      {
        type: 'search',
        items: [],
        value: [],
      },
      {
        type: 'category',
        items: [],
        value: [],
      },
      {
        type: 'subcategory',
        items: [],
        value: [],
      },
      {
        type: 'brands',
        items: [],
        value: [],
      },
      {
        type: 'range',
        items: [0, 100000],
        value: [0, 10000],
      },
      {
        type: 'color',
        items: [],
        value: [],
      },
      {
        type: 'promotion',
        items: [],
        value: [],
      },
      {
        type: 'promotion-type',
        items: [],
        value: [],
      },
    ]
  };
  private filters: BehaviorSubject<IFilters | any> = new BehaviorSubject(null);
  availableFilters$ = this.filters.asObservable();

  private itemsChange: BehaviorSubject<any> = new BehaviorSubject(null);
  onItemsChange$ = this.itemsChange.asObservable();

  constructor() { }

  get(): IFilters {
    return this.availableFilters;
  }

  set(filters: IFilters) {
    this.availableFilters = filters;
    this.availableFilters.items = this.getSort(filters.sort);
    this.availableFilters.total = filters.items.length;
    this.availableFilters.pages = filters.items.length / this.availableFilters.limit;
    this.filters.next(this.availableFilters);
  }

  reset() {
    this.availableFilters.filters = this.availableFilters.filters.map(filter => {
      let value: any;
      if (filter.type === 'range') {
        value = [0, 10000];
      } else {
        value = [];
      }
      return {
        ...filter,
        value
      }
    });
    this.availableFilters.activeFiltersCount = 0;
    this.set(this.availableFilters);
  }

  setItems(products: IProduct[]) {
    this.availableFilters.items = products;
    this.availableFilters.items = this.getSort(this.availableFilters.sort);
    this.filters.next(this.availableFilters);
  }

  setOption(option: IFilterOption) {
    const INDEX_OF_OLD_OPTION = this.availableFilters.filters.findIndex(filter => filter.type === option.type);
    if (INDEX_OF_OLD_OPTION >= 0) {
      this.availableFilters.filters[INDEX_OF_OLD_OPTION] = option;
    } else {
      this.availableFilters.filters.push(option);
    }
    this.filters.next(this.availableFilters);
  }

  setOptionValues(type: 'category' | 'subcategory' | 'range' | 'brands' | 'color' | 'search' | 'promotion' | 'promotion-type', value: any[]) {
    const INDEX_OF_OLD_OPTION = this.availableFilters.filters.findIndex(filter => filter.type === type);
    if (INDEX_OF_OLD_OPTION >= 0) {
      this.availableFilters.filters[INDEX_OF_OLD_OPTION].value = value;
    } else {
      this.availableFilters.filters.push({
        type,
        value,
        items: []
      });
    }
    this.filters.next(this.availableFilters);
  }

  setOptionItems(type: 'category' | 'subcategory' | 'range' | 'brands' | 'color' | 'promotion' | 'promotion-type', items: any[]) {
    const INDEX_OF_OLD_OPTION = this.availableFilters.filters.findIndex(filter => filter.type === type);
    if (INDEX_OF_OLD_OPTION >= 0) {
      this.availableFilters.filters[INDEX_OF_OLD_OPTION].items = items;
    } else {
      this.availableFilters.filters.push({
        type,
        value: [],
        items
      });
    }
    this.filters.next(this.availableFilters);
  }

  setLimit(limit: number) {
    // this.availableFilters.page = 1;
    this.availableFilters.limit = limit;
    this.availableFilters.items = this.getSort(this.availableFilters.sort);
    this.filters.next(this.availableFilters);
  }

  setSort(sort: 'default' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc') {
    this.availableFilters.sort = sort;
    this.availableFilters.items = this.getSort(this.availableFilters.sort);
    this.filters.next(this.availableFilters);
  }

  setPage(page: number) {
    this.availableFilters.page = page;
    this.filters.next(this.availableFilters);
  }

  setPages(pages: number) {
    this.availableFilters.pages = pages;
    this.filters.next(this.availableFilters);
  }

  setTotal(total: number) {
    this.availableFilters.total = total;
    this.filters.next(this.availableFilters);
  }

  private getSort(sort: 'default' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc') {
    switch (sort) {
      case 'name_desc':
        return this.availableFilters.items.sort((a, b) => b.nombre.localeCompare(a.nombre));
      case 'price_asc':
        return this.availableFilters.items.sort((a, b) => a.precio - b.precio);
      case 'price_desc':
        return this.availableFilters.items.sort((a, b) => b.precio - a.precio);
      default:
        return this.availableFilters.items.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
  }
}
