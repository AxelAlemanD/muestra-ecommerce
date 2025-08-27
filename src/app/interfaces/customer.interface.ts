import { IAddress } from "./address.interface";

export interface ICustomer {
    id: number;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    direccion?: IAddress;
}