import { IBrand } from "./brand.interface";
import { ICategory } from "./category.interface";
import { IMedia } from "./media.interface";

export interface IProduct {
    id: number;
    nombre: string;
    descripcion: string;
    caracteristicas: string;
    sku: string;
    unidad_medida: string;
    precio: number;
    precio_con_descuento: number;
    marca: IBrand;
    es_destacado: boolean;
    categorias: ICategory[];
    media: IMedia[];
    stock: number;
    variantes?: any[];
    contiene_promocion: boolean;
    promocion_id?: number;
    descuento?: { tipo: string; valor: number };
    sucursales: any[];
}