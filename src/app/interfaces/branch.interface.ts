import { DeliveryTypeEnum  } from "../shared/enums/delivery-type.enum";

export interface IBranch {
    id: number;
    nombre: string;
    direccion: any;
    rfc: string;
    envios_soportados: DeliveryTypeEnum ;
}