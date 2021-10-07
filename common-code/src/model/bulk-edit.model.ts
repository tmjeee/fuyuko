import {ItemImage, ItemValTypes, Value} from './item.model';
import {Attribute} from './attribute.model';
import {OperatorType} from './operator.model';


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
    parentId?: number;
    changes: {
        [attributeId: number]: {
            old: Value,
            new: Value
        };
    };
    whens: {
        [attributeId: number]: {
            attributeId: number,
            operator: OperatorType,
            val: ItemValTypes
        }
    };

    children: BulkEditItem[];
}

export interface BulkEditTableItem {
    id: number;
    name: string;
    description: string;
    images: ItemImage[];
    parentId: number;
    depth: number;
    changes: {
        [attributeId: number]: {
            old: Value,
            new: Value
        };
    };
    whens: {
        [attributeId: number]: {
            attributeId: number,
            operator: OperatorType,
            val: ItemValTypes
        }
    };

    rootParentId: number;
}
