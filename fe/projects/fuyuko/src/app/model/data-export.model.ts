import {Attribute} from './attribute.model';
import {Item, PricedItem} from './item.model';
import {PriceDataItem, PricingStructure, PricingStructureItemWithPrice} from './pricing-structure.model';
import {View} from "./view.model";


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
    pricingStructure: PricingStructure;
    attributes: Attribute[];
    pricedItems: PricedItem[];
}


export interface DataExportArtifact {
    id: number;
    view: View;
    name: string;
    type: DataExportType;
    creationDate: Date;
    lastUpdate: Date;
    fileName: string;
    mimeType: string;
    size: number;
}
