// this is the attribute form stored in db
import {ItemImage, Value} from "../../model/item.model";

export interface Attribute2 {
    id: number;
    type: string;
    name: string;
    description: string;
    metadatas: AttributeMetadata2[];
}

export interface AttributeMetadata2 {
    id: number;
    name: string;
    entries: AttributeMetadataEntry2[];
}

export interface AttributeMetadataEntry2 {
    id: number;
    key: string;
    value: string;
}


// this is the item metadata form stored in db
export interface Item2 {
    id: number;
    name: string;
    description: string;
    images: ItemImage[];
    parentId: number;
    values: ItemValue2[]
}

export interface ItemValue2 {
    id: number;
    attributeId: number;
    metadatas: ItemMetadata2[];
}

export interface ItemMetadata2 {
    id: number;
    attributeId: number;
    attributeType: string;
    name: string;
    entries: ItemMetadataEntry2[];
}

export interface ItemMetadataEntry2 {
    id: number;
    key: string;
    value: string;
    dataType: string;
}



