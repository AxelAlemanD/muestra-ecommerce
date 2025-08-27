import { IProduct } from "./product.interface";

export interface IFilterOption {
  type: 'category' | 'subcategory' | 'range' | 'brands' | 'color' | 'search' | 'promotion' | 'promotion-type';
  items: any[];
  value: any[];
}

export interface IFilters {
    page: number;
    limit: number;
    sort: 'default' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc';
    total: number;
    pages: number;
    from: number;
    to: number;
    activeFiltersCount: number;
    filters: IFilterOption[];
    items: IProduct[];
  }