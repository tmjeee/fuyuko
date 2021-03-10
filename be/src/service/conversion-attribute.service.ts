import {
    Attribute,
    Pair1,
    Pair2
} from '@fuyuko-common/model/attribute.model';
import {Attribute2, AttributeMetadata2, AttributeMetadataEntry2} from '../server-side-model/server-side.model';
import {DATE_FORMAT, NUMBER_FORMAT, SHOW_COUNTRY_CURRENCY} from '@fuyuko-common/model/item.model';


class ConversionAttributeService {

    attributesRevert(attributes: Attribute[]) : Attribute2[] {
        return (attributes ? attributes.map(attributeRevert) : []);
    }

    attributeRevert(attribute: Attribute) : Attribute2 {
        const att: Attribute2 = {
            id: attribute.id,
            name: attribute.name,
            description: attribute.description,
            type: attribute.type,
            creationDate: attribute.creationDate,
            lastUpdate: attribute.lastUpdate,
            metadatas: []
        } as Attribute2;

        switch(att.type) {
            case 'number':
            case 'area':
            case 'dimension':
            case 'width':
            case 'length':
            case 'height':
            case 'weight':
            case "volume":
                att.metadatas.push({
                    id: -1,
                    name: `${attribute.type} metadata`,
                    entries:[{
                        id: -1,
                        key: 'format',
                        value: (attribute.format ? attribute.format : NUMBER_FORMAT)
                    } as AttributeMetadataEntry2]
                } as AttributeMetadata2);
                break;
            case 'date':
                // att.format = getMetadataEntry('format', attribute2, DEFAULT_DATE_FORMAT);
                att.metadatas.push({
                    id: -1,
                    name: `${attribute.type} metadata`,
                    entries:[{
                        id: -1,
                        key: 'format',
                        value: (attribute.format ? attribute.format : DATE_FORMAT)
                    } as AttributeMetadataEntry2]
                } as AttributeMetadata2);
                break;
            case 'currency':
                // att.showCurrencyCountry = Boolean(getMetadataEntry('showCurrencyCountry', attribute2, 'true'));
                att.metadatas.push({
                    id: -1,
                    name: `${attribute.type} metadata`,
                    entries:[{
                        id: -1,
                        key: 'showCurrencyCountry',
                        value: (attribute.showCurrencyCountry ? String(attribute.showCurrencyCountry) : String(SHOW_COUNTRY_CURRENCY))
                    } as AttributeMetadataEntry2]
                } as AttributeMetadata2);
                break;
            case 'select':
                // att.pair1 = getMetadataPair1Entry(attribute2);
                att.metadatas.push({
                    id: -1,
                    name: `pair1`,
                    entries: attribute.pair1 ? attribute.pair1.reduce((acc: AttributeMetadataEntry2[], c: Pair1) => {
                        acc.push({
                            id: -1,
                            key: c.key,
                            value: c.value
                        } as AttributeMetadataEntry2)
                        return acc;
                    }, []) : []
                } as AttributeMetadata2);
                break;
            case 'doubleselect':
                // att.pair1 = getMetadataPair1Entry(attribute2);
                // att.pair2 = getMetadataPair2Entry(attribute2);
                att.metadatas.push({
                    id: -1,
                    name: `pair1`,
                    entries: attribute.pair1 ? attribute.pair1.reduce((acc: AttributeMetadataEntry2[], c: Pair1) => {
                        acc.push({
                            id: -1,
                            key: c.key,
                            value: c.value
                        } as AttributeMetadataEntry2)
                        return acc;
                    }, []) : []
                } as AttributeMetadata2);
                att.metadatas.push({
                    id: -1,
                    name: `pair2`,
                    entries: attribute.pair2 ? attribute.pair2.reduce((acc: AttributeMetadataEntry2[], c: Pair2) => {
                        acc.push({
                            id: -1,
                            key: c.key1,
                            value: `${c.key2}=${c.value}`
                        } as AttributeMetadataEntry2);
                        return acc;
                    }, []) : []
                } as AttributeMetadata2);
                break;
            case 'string':
            case 'text':
            default:
                break;
        }
        return att;
    }


    attributesConvert(attribute2s: Attribute2[]) : Attribute[] {
        return (attribute2s ? attribute2s.map(attributeConvert) : []);
    }

    attributeConvert(attribute2: Attribute2): Attribute  {
        const att: Attribute = {
            id: attribute2.id,
            name: attribute2.name,
            description: attribute2.description,
            type: attribute2.type,
            creationDate: attribute2.creationDate,
            lastUpdate: attribute2.lastUpdate,
        } as Attribute;

        switch(att.type) {
            case 'number':
            case 'area':
            case 'dimension':
            case 'width':
            case 'length':
            case 'height':
            case 'weight':
            case "volume":
                att.format = this.getMetadataEntry('format', attribute2, NUMBER_FORMAT);
                break;
            case 'date':
                att.format = this.getMetadataEntry('format', attribute2, DATE_FORMAT);
                break;
            case 'currency':
                att.showCurrencyCountry = Boolean(this.getMetadataEntry('showCurrencyCountry', attribute2, 'true'));
                break;
            case 'select':
                att.pair1 = this.getMetadataPair1Entry(attribute2);
                break;
            case 'doubleselect':
                att.pair1 = this.getMetadataPair1Entry(attribute2);
                att.pair2 = this.getMetadataPair2Entry(attribute2);
                break;
            case 'string':
            case 'text':
            default:
                break;
        }

        return att;
    }

    getMetadataPair1Entry(attribute2: Attribute2): Pair1[] {
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

    getMetadataPair2Entry(attribute2: Attribute2): Pair2[] {
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

    getMetadataEntry(key: string, attribute2: Attribute2, defValue: string): string {
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
}

const s = new ConversionAttributeService()
export const
    attributesRevert = s.attributesRevert.bind(s),
    attributeRevert = s.attributeRevert.bind(s),
    attributesConvert = s.attributesConvert.bind(s),
    attributeConvert = s.attributeConvert.bind(s);