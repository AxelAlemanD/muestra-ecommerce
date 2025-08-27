import { ICategory } from "./category.interface";
import { IProduct } from "./product.interface";

export interface IProductsGroupByCategory {
    category: ICategory;
    products: IProduct[];
}