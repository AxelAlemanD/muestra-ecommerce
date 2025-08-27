import { DiscountTypeEnum } from "../shared/enums/discount-type.enum";
import { IMedia } from "./media.interface";

export interface IPromotion {
    id: number;
    titulo: string;
    url: string;
    media: IMedia;
    fecha_inicio: string;
    fecha_expiracion: string;
    tipo_descuento: DiscountTypeEnum;
    cantidad_descuento: number;
    productos: any[];
    total_original: number;
    total_con_descuento: number;
    activo: boolean;
    imagen_promocion?: string;
    subtotal?: number;
}