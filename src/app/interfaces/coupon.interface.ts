import { DiscountTypeEnum } from "../shared/enums/discount-type.enum";

export interface ICoupon {
    id: number;
    nombre: string;
    descripcion?: string;
    fecha_inicio?: string;
    fecha_expiracion?: string;
    tipo_descuento: DiscountTypeEnum;
    valor: number;
    productos: { id: number; nombre: string }[];
    sucursales: { id: number; nombre: string }[];
    cantidad_descuento?: number;
    terminos_condiciones?: string;
    cantidad_usos_original?: number;
    cantidad_usos?: number;
}