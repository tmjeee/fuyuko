// this is the attribute form stored in db
import {ItemImage, ItemValTypes, Value} from "../model/item.model";
import {AttributeType} from "../model/attribute.model";
import {OperatorType} from "../model/operator.model";
import {RuleLevel} from "../model/rule.model";
import {Status} from "../model/status.model";



// csv parsed models
export interface CsvAttribute {
    name: string,
    description: string;
    type: AttributeType;
    format?: string;
    showCurrencyCountry?: string;
    pair1?: string;
    pair2?: string;
}

export interface CsvPrice {
    pricingStructureFormat: string;
    itemFormat: string;
    price: number;
    country: string;
    addToPricingStructureIfItemNotAlreadyAdded: boolean;
}

export interface CsvItem {
    parentName: string;
    name: string;
    description: string;
    [attFormat: string] : string;
}


// === Attribute2
export interface Attribute2 {
    id: number;
    type: string;
    name: string;
    description: string;
    creationDate: Date;
    lastUpdate: Date;
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
// ====== Item2
export interface Item2 {
    id: number;
    name: string;
    description: string;
    creationDate: Date;
    lastUpdate: Date;
    images: ItemImage[];
    parentId: number;
    values: ItemValue2[];
    children: Item2[];
}

export interface PricedItem2 {
    id: number;
    name: string;
    description: string;
    creationDate: Date;
    lastUpdate: Date;
    images: ItemImage[];
    parentId: number;
    values: ItemValue2[];
    children: PricedItem2[];
    price: number;
    country: string;
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
    dataType: 'string' | 'number';
}

// ======== Rule2
export interface Rule2 {
    id: number;
    name: string;
    status: Status;
    description: string;
    level: RuleLevel;
    validateClauses: ValidateClause2[];
    whenClauses: WhenClause2[];
}

export interface ValidateClause2 {
    id: number;
    attributeId: number;
    attributeName: string;
    attributeType: AttributeType;
    operator: OperatorType;
    metadatas: ValidateClauseMetadata2[]
}

export interface ValidateClauseMetadata2 {
    id: number;
    name: string;
    entries: ValidateClauseMetadataEntry2[];
}

export interface ValidateClauseMetadataEntry2 {
    id: number;
    key: string;
    value: string;
    dataType: string;
}

export interface WhenClause2 {
    id: number;
    attributeId: number;
    attributeName: string;
    attributeType: AttributeType;
    operator: OperatorType;
    metadatas: WhenClauseMetadata2[];
}

export interface WhenClauseMetadata2 {
    id: number;
    name: string;
    entries: WhenClauseMetadataEntry2[];
}

export interface WhenClauseMetadataEntry2 {
    id: number;
    key: string;
    value: string;
    dataType: string;
}





