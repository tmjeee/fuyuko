import {Item} from './item.model';
import {Attribute} from './attribute.model';
import {Messages} from './notification-listing.model';
import {PriceDataItem } from './pricing-structure.model';

export type DataImportType = 'ATTRIBUTE' | 'ITEM' | 'PRICE';

export interface AttributeDataImport {
    type: 'ATTRIBUTE';
    dataImportId?: number;
    messages: Messages;
    attributes: Attribute[];
}

export interface ItemDataImport {
    type: 'ITEM';
    messages: Messages;
    dataImportId?: number;
    attributes: Attribute[];
    items: Item[];
}

export interface PriceDataImport {
    type: 'PRICE';
    dataImportId?: number;
    messages: Messages;
    items: PriceDataItem[];
}

