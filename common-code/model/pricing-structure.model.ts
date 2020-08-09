import {PaginableApiResponse} from "./api-response.model";
import {CountryCurrencyUnits} from "./unit.model";
import {Group} from "./group.model";
import {Status} from "./status.model";

export interface PricingStructure {     // pricing structure
    id: number; // pricing structure id
    viewId: number;
    viewName: string;
    name: string;
    status: Status;
    description: string;
    creationDate: Date;
    lastUpdate: Date;
}

export interface PricingStructureWithItems { // pricing structure
    id: number; // pricing structure id
    viewId: number;
    name: string;
    description: string;
    status: Status;
    items: PaginableApiResponse<PricingStructureItemWithPrice[]>;
    creationDate: Date;
    lastUpdate: Date;
}

export interface PricingStructureItemWithPrice {  // pricing structure item
    id: number;     // pricing structure item id
    itemId: number;
    itemName: string;
    itemDescription: string;
    price: number;
    country: CountryCurrencyUnits;
    creationDate: Date;
    lastUpdate: Date;

    parentId: number;
    children: PricingStructureItemWithPrice[];
}

export interface TablePricingStructureItemWithPrice {  // pricing structure item
    id: number;         // pricing structure item id
    itemId: number;
    itemName: string;
    itemDescription: string;
    price: number;
    country: CountryCurrencyUnits;
    creationDate: Date;
    lastUpdate: Date;

    depth: number;
    parentId: number;
    rootParentId: number;
}

export interface PriceDataItem {
    pricingStructureId: number;
    pricingStructureName: string;
    viewId: number;
    viewName: string;
    item: PricingStructureItemWithPrice;
}


export interface PricingStructureGroupAssociation {
   pricingStructure: PricingStructure,
   groups: Group[]
}

