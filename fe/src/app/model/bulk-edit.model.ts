import {ItemImage, Value} from './item.model';
import {Attribute} from './attribute.model';


export interface BulkEditPackage {
    changeAttributes: Attribute[];
    whenAttributes: Attribute[];
    bulkEditItems: BulkEditItem[];
}


export interface BulkEditItem {
    id: number;
    name: string;
    description: string;
    images: ItemImage[];
    parentId: number;
    changes: {
        [attributeId: number]: {
            old: Value,
            new: Value
        };
    };
    whens: {
        [attributeId: number]: Value;
    };
    children: BulkEditItem[];
}

export interface BulkEditTableItem {
    id: number;
    name: string;
    description: string;
    images: string[];
    parentId: number;
    depth: number;
    changes: {
        [attributeId: number]: {
            old: Value,
            new: Value
        };
    };
    whens: {
        [attributeId: number]: Value;
    };

    rootParentId: number;
}
