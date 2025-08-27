export interface IState {
    estado_id: number;
    estado_nombre: string;
    codigo_postal: string;
}

export interface IColony {
    colonia_id: number;
    colonia_nombre: string;
    tipo: string;
    municipio: string;
}

export interface IAddress {
    id: number;
    alias: string;
    nombre_recibidor: string;
    numero_recibidor: string;
    calle: string;
    num_exterior: string;
    num_interior: string;
    referencias: string;
    codigo_postal: string;
    estado: IState;
    colonia: IColony;
    latitud: number;
    longitud: number;
    resumen?: string;
}