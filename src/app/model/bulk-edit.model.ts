import {Value} from './item.model';

export interface BulkEditItem {
    id: number;
    name: string;
    description: string;
    images: string[];
    parentId: number;
    changes: {
        [attributeId: number]: Value;
    };
    [attributeId: number]: Value;

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
        [attributeId: number]: Value;
    };
    [attributeId: number]: { old: Value, new: Value};

    rootParentId: number;
}
