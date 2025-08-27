import { ICustomer } from "./customer.interface";

export interface IAuthResponse {
    cliente_info: ICustomer,
    token: string;
}