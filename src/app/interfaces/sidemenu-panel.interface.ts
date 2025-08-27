import { ICustomButtonSidemenu } from "./custom-button.interface";

export interface ISidemenuItem {
    name: string;
    link?: string;
    subitems?: ISidemenuItem[]
}

export interface ISidemenuPanel {
    title: string;
    buttons: ICustomButtonSidemenu[];
    items: ISidemenuItem[];
}