import { IMedia } from "./media.interface";

export interface ICategory {
    id: number;
    nombre: string;
    media: IMedia;
    subcategorias?: ICategory[];
}