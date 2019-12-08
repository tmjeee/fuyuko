import {Item} from './item.model';
import {Attribute} from './attribute.model';
import {Messages} from './notification-listing.model';
import {PricingStructureItemWithPrice} from './pricing-structure.model';


export interface DataImport {
    messages: Messages;
    attributes: Attribute[];
    items: Item[];
}

export type DataImportType = 'ATTRIBUTE' | 'ITEM' | 'PRICE';

export interface AttributeDataImport {
    type: 'ATTRIBUTE';
    attributeDataImportId?: number;
    messages: Messages;
    attributes: Attribute[];
}

export interface ItemDataImport {
    type: 'ITEM';
    messages: Messages;
    itemDataImportId?: number;
    attributes: Attribute[];
    items: Item[];
}

export interface PriceDataImport {
    type: 'PRICE';
    priceDataImportId?: number;
    messages: Messages;
    items: PricingStructureItemWithPrice[];
}

