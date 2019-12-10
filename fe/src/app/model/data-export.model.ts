import {Attribute} from './attribute.model';
import {Item} from './item.model';
import {PricingStructureItemWithPrice} from './pricing-structure.model';


export type DataExportType = 'ATTRIBUTE' | 'ITEM' | 'PRICE';

export interface DataExport {
    attributes: Attribute[];
    items: Item[];
}

export interface AttributeDataExport {
    attributes: Attribute[];
}

export interface ItemDataExport {
    attributes: Attribute[];
    items: Item[];
}

export interface PriceDataExport {
    attributes: Attribute[];
    items: Item[];
    price: PricingStructureItemWithPrice[];
}
