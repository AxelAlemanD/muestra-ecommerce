import { DeliveryTypeEnum } from "../shared/enums/delivery-type.enum";
import { OrderStatusEnum } from "../shared/enums/order-status.enum";
import { PaymentMethodEnum } from "../shared/enums/payment-method.enum";
import { IAddress } from "./address.interface";
import { IBranch } from "./branch.interface";
import { ICoupon } from "./coupon.interface";
import { ICustomer } from "./customer.interface";
import { IProduct } from "./product.interface";
import { IPromotion } from "./promotion.interface";

export interface ICartConfirmation {
    tipo_envio: number;
    forma_pago: number;
    total: number;
    plataforma: string;
    direccion_id: string;
}

export interface ICartProduct {
    id?: number;
    producto: IProduct;
    cantidad: number;
    monto: number;
    variante_id?: number;
    estado_id?: OrderStatusEnum;
    promocion_id?: number;
}

export interface ICartPromotion {
    id?: number;
    promocion: IPromotion;
    cantidad: number;
    monto: number;
    variante_id?: number;
    estado_id?: OrderStatusEnum;
}

export interface ICart {
    id: number;
    cliente?: ICustomer | null;
    sucursal?: IBranch;
    tipo_envio: DeliveryTypeEnum | null;
    estado: OrderStatusEnum;
    forma_pago: PaymentMethodEnum | null;
    total: number;
    subtotal: number;
    descuento: number;
    costo_envio: number;
    plataforma: string;
    productos: ICartProduct[];
    promociones?: ICartPromotion[];
    pin?: number;
    direccion?: IAddress;
    cupon?: ICoupon;
    motivo_reagendar?: string;
    fecha_elaboracion?: string;
    hora_elaboracion?: string;
    folio?: string;
}