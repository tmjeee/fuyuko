import {Attribute, DEFAULT_DATE_FORMAT, DEFAULT_NUMERIC_FORMAT, Pair1, Pair2} from "../model/attribute.model";
import {
    AREA_FORMAT,
    DIMENSION_FORMAT,
    HEIGHT_FORMAT,
    LENGTH_FORMAT,
    VOLUME_FORMAT,
    WIDTH_FORMAT
} from "../model/item.model";

export const createStringAttribute = (name: string, description: string): Attribute => {
    return {
        id: -1,
        name,
        description,
        type: 'string'
    } as Attribute
};
export const createTextAttribute = (name: string, description: string): Attribute => {
    return {
        id: -1,
        name,
        description,
        type: 'text'
    } as Attribute
};
export const createNumberAttribute = (name: string, description: string, format: string = DEFAULT_NUMERIC_FORMAT): Attribute => {
    return {
       id: -1,
       type: 'number',
       name,
       description,
       format
    } as Attribute;
};
export const createDateAttribute = (name: string, description: string, format: string = DEFAULT_DATE_FORMAT): Attribute => {
    return {
        id: -1,
        type: 'date',
        name,
        description,
        format
    } as Attribute;
};
export const createCurrencyAttribute = (name: string, description: string, showCurrencyCountry: boolean = true): Attribute => {
    return {
        id: -1,
        type: 'currency',
        name,
        description,
        showCurrencyCountry
    } as Attribute
};
export const createVolumeAttribute = (name: string, description: string, format: string = VOLUME_FORMAT): Attribute => {
    return {
       id: -1,
       type: 'volume',
       name,
       description,
       format
    } as Attribute;
};
export const createDimensionAttribute = (name: string, description: string, format: string = DIMENSION_FORMAT): Attribute => {
    return {
        id: -1,
        type: 'dimension',
        name,
        description,
        format
    } as Attribute
};
export const createAreaAttribute = (name: string, description: string, format: string = AREA_FORMAT): Attribute => {
    return {
       id: -1,
       type: 'area',
       name,
       description,
       format
    } as Attribute
};
export const createWidthAttribute = (name: string, description: string, format: string = WIDTH_FORMAT): Attribute => {
    return {
        id: -1,
        type: 'width',
        name,
        description,
        format
    } as Attribute;
};
export const createLengthAttribute = (name: string, description: string, format: string = LENGTH_FORMAT): Attribute => {
    return {
        id: -1,
        type: 'length',
        name,
        description,
        format
    } as Attribute;
};
export const createHeightAttribute = (name: string, description: string, format: string = HEIGHT_FORMAT): Attribute => {
    return {
        id: -1,
        type: 'height',
        name,
        description,
        format
    } as Attribute;
};
export const createSelectAttribute = (name: string, description: string, pair1: Pair1[]): Attribute => {
    return {
        id: -1,
        type: 'select',
        name,
        description,
        pair1
    } as Attribute;
};
export const createDoubleSelectAttribute = (name: string, description: string, pair1: Pair1[], pair2: Pair2[]): Attribute => {
    return {
        id: -1,
        type: 'doubleselect',
        name,
        description,
        pair1,
        pair2
    } as Attribute;
};
