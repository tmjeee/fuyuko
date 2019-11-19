import {Attribute, Pair1, Pair2} from "../model/attribute.model";


// this is the form stored in db
export interface Attribute2 {
    id: number;
    type: string;
    name: string;
    description: string;
    metadatas: Metadata2[];
}

export interface Metadata2 {
    id: number;
    name: string;
    entries: MetadataEntry2[];
}

export interface MetadataEntry2 {
    id: number;
    key: string;
    value: string;
}


export const convert = (attribute2s: Attribute2[]) : Attribute[] => {
    return attribute2s.map(_convert);
}

export const _convert = (attribute2: Attribute2): Attribute => {
    const att: Attribute = {
        id: attribute2.id,
        name: attribute2.name,
        description: attribute2.description,
        type: attribute2.type,
    } as Attribute;

    switch(att.type) {
        case 'number':
        case 'area':
        case 'dimension':
        case 'width':
        case 'length':
        case 'height':
        case "volume":
            att.format = getMetadataEntry('format', attribute2, '0.0');
            break;
        case 'date':
            att.format = getMetadataEntry('format', attribute2, 'DD-MM-YYYY');
            break;
        case 'currency':
            att.showCurrencyCountry = Boolean(getMetadataEntry('showCurrencyCountry', attribute2, 'true'));
            break;
        case 'select':
            att.pair1 = getMetadataPair1Entry(attribute2);
            break;
        case 'doubleselect':
            att.pair1 = getMetadataPair1Entry(attribute2);
            att.pair2 = getMetadataPair2Entry(attribute2);
            break;
        case 'string':
        case 'text':
        default:
            break;
    }

    return att;
}

const getMetadataPair1Entry = (attribute2: Attribute2): Pair1[] => {
    const r: Pair1[] = [];
    if (attribute2.metadatas &&
        attribute2.metadatas.length) {
        for (const metadata of attribute2.metadatas) {
            if (metadata.name === 'pair1') {
                for (const entry of metadata.entries) {
                    r.push({
                        id: entry.id,
                        key: entry.key,
                        value: entry.value
                    } as Pair1)
                }
            }
        }
    }
    return r;
}

const getMetadataPair2Entry = (attribute2: Attribute2): Pair2[] => {
    const r: Pair2[] = [];
    if (attribute2.metadatas &&
        attribute2.metadatas.length) {
        for (const metadata of attribute2.metadatas) {
            if (metadata.name === 'pair2') {
                for (const entry of metadata.entries) {
                    const p: string[] = entry.value.split('=');
                    r.push({
                        id: entry.id,
                        key1: entry.key,
                        key2: p[0],
                        value: p[1]
                    } as Pair2)
                }
            }
        }
    }
    return r;
}



const getMetadataEntry = (key: string, attribute2: Attribute2, defValue: string): string => {
    if (attribute2.metadatas &&
        attribute2.metadatas.length) {
        for (const metadata of attribute2.metadatas) {
            for (const entry of metadata.entries) {
                if (entry.key === key) {
                    return entry.value;
                }
            }
        }
    }
    return defValue;
}






