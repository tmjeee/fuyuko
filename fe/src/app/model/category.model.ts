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


export interface CategoryAndItems {
    id: number;         // category id
    name: string;       // category name
    items: Item[];
}