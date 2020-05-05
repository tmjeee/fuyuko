import {Status} from "./status.model";
import {Item} from "./item.model";

export interface Category {
    id: number;
    name: string;
    description: string;
    status: Status;
    creationDate: Date;
    lastUpdate: Date;
    children: Category[];
};

export interface CategoryWithItems {
    id: number;
    name: string;
    description: string;
    status: Status;
    items: {id: number, name: string, description: string}[],
    creationDate: Date;
    lastUpdate: Date;
    children: CategoryWithItems[];
}


export interface CategoryAndItems {
    id: number;         // category id
    name: string;       // category name
    items: Item[];
}