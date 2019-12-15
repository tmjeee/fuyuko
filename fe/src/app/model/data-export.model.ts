import {Attribute} from './attribute.model';
import {Item, PricedItem} from './item.model';
import {PriceDataItem, PricingStructureItemWithPrice} from './pricing-structure.model';


export type DataExportType = 'ATTRIBUTE' | 'ITEM' | 'PRICE';

export interface DataExport {
    attributes: Attribute[];
    items: Item[];
}

export interface AttributeDataExport {
    type: 'ATTRIBUTE';
    attributes: Attribute[];
}

export interface ItemDataExport {
    type: 'ITEM';
    attributes: Attribute[];
    items: Item[];
}

export interface PriceDataExport {
    type: 'PRICE';
    attributes: Attribute[];
    pricedItems: PricedItem[];
}
