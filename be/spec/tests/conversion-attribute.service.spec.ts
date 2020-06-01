import {attributeRevert} from "../../src/service/conversion-attribute.service";
import {Attribute, AttributeType, Pair1} from "../../src/model/attribute.model";
import {Attribute2} from "../../src/server-side-model/server-side.model";

describe(`conversion-attribute.service.spec`, () => {

    // 'string' | 'text' | 'number' | 'date' | 'currency' | 'volume' | 'dimension' | 'area' | 'width' | 'length' | 'height' | 'select' | 'doubleselect' | 'weight';
    it(`[string] convert work`, () => { });
    it(`[text] convert work`, () => { });
    it(`[number] convert work`, () => { });
    it(`[date] convert work`, () => { });
    it(`[currency] convert work`, () => { });
    it(`[volume] convert work`, () => { });
    it(`[dimension] convert work`, () => { });
    it(`[area] convert work`, () => { });
    it(`[width] convert work`, () => { });
    it(`[length] convert work`, () => { });
    it(`[height] convert work`, () => { });
    it(`[select] convert work`, () => { });
    it(`[doubleselect] convert work`, () => { });
    it(`[weight] convert work`, () => { });
    it(`[string] convert work`, () => { });
    it(`[string] convert work`, () => { });

    it (`[string] revert works`, () => {
        const date = new Date();
        const attribute2: Attribute2 = attributeRevert({
            id: 1,
            type: 'string',
            name: 'string attribute',
            description: 'string attribute description',
            creationDate: date,
            lastUpdate: date,
        } as Attribute);

        expect(attribute2.id).toBe(1);
        expect(attribute2.type).toBe(`string`);
        expect(attribute2.name).toBe(`string attribute`);
        expect(attribute2.description).toBe(`string attribute description`);
        expect(attribute2.creationDate).toBe(date);
        expect(attribute2.lastUpdate).toBe(date);
        expect(attribute2.metadatas).toBeDefined();
        expect(attribute2.metadatas.length).toBe(0);
    });

    it (`[text] revert works`, () => {
        const date = new Date();
        const attribute2: Attribute2 = attributeRevert({
            id: 1,
            type: 'text',
            name: 'text attribute',
            description: 'text attribute description',
            creationDate: date,
            lastUpdate: date,
        } as Attribute);

        expect(attribute2.id).toBe(1);
        expect(attribute2.type).toBe(`text`);
        expect(attribute2.name).toBe(`text attribute`);
        expect(attribute2.description).toBe(`text attribute description`);
        expect(attribute2.creationDate).toBe(date);
        expect(attribute2.lastUpdate).toBe(date);
        expect(attribute2.metadatas).toBeDefined();
        expect(attribute2.metadatas.length).toBe(0);
    });

    it (`[number] revert works`, () => {
        const date = new Date();
        const attribute2: Attribute2 = attributeRevert({
            id: 1,
            type: 'number',
            name: 'number attribute',
            description: 'number attribute description',
            creationDate: date,
            lastUpdate: date,
            format: '0.00'
        } as Attribute);

        expect(attribute2.id).toBe(1);
        expect(attribute2.type).toBe(`number`);
        expect(attribute2.name).toBe(`number attribute`);
        expect(attribute2.description).toBe(`number attribute description`);
        expect(attribute2.creationDate).toBe(date);
        expect(attribute2.lastUpdate).toBe(date);
        expect(attribute2.metadatas).toBeDefined();
        expect(attribute2.metadatas.length).toBe(1);
        expect(attribute2.metadatas[0].id).toBe(-1);
        expect(attribute2.metadatas[0].name).toBe(`number metadata`);
        expect(attribute2.metadatas[0].entries).toBeDefined();
        expect(attribute2.metadatas[0].entries[0].id).toBe(-1);
        expect(attribute2.metadatas[0].entries[0].key).toBe('format');
        expect(attribute2.metadatas[0].entries[0].value).toBe('0.00');
    });

    it (`[date] revert works`, () => {
        const date = new Date();
        const attribute2: Attribute2 = attributeRevert({
            id: 1,
            type: 'date',
            name: 'date attribute',
            description: 'date attribute description',
            creationDate: date,
            lastUpdate: date,
            format: 'DD-MM-YYYY'
        } as Attribute);

        expect(attribute2.id).toBe(1);
        expect(attribute2.type).toBe(`date`);
        expect(attribute2.name).toBe(`date attribute`);
        expect(attribute2.description).toBe(`date attribute description`);
        expect(attribute2.creationDate).toBe(date);
        expect(attribute2.lastUpdate).toBe(date);
        expect(attribute2.metadatas).toBeDefined();
        expect(attribute2.metadatas.length).toBe(1);
        expect(attribute2.metadatas[0].id).toBe(-1);
        expect(attribute2.metadatas[0].name).toBe(`date metadata`);
        expect(attribute2.metadatas[0].entries).toBeDefined();
        expect(attribute2.metadatas[0].entries[0].id).toBe(-1);
        expect(attribute2.metadatas[0].entries[0].key).toBe('format');
        expect(attribute2.metadatas[0].entries[0].value).toBe('DD-MM-YYYY');
    });

    it (`[currency] revert works`, () => {
        const date = new Date();
        const attribute2: Attribute2 = attributeRevert({
            id: 1,
            type: 'currency',
            name: 'currency attribute',
            description: 'currency attribute description',
            creationDate: date,
            lastUpdate: date,
            showCurrencyCountry: true
        } as Attribute);

        expect(attribute2.id).toBe(1);
        expect(attribute2.type).toBe(`currency`);
        expect(attribute2.name).toBe(`currency attribute`);
        expect(attribute2.description).toBe(`currency attribute description`);
        expect(attribute2.creationDate).toBe(date);
        expect(attribute2.lastUpdate).toBe(date);
        expect(attribute2.metadatas).toBeDefined();
        expect(attribute2.metadatas.length).toBe(1);
        expect(attribute2.metadatas[0].id).toBe(-1);
        expect(attribute2.metadatas[0].name).toBe(`currency metadata`);
        expect(attribute2.metadatas[0].entries).toBeDefined();
        expect(attribute2.metadatas[0].entries[0].id).toBe(-1);
        expect(attribute2.metadatas[0].entries[0].key).toBe('showCurrencyCountry');
        expect(attribute2.metadatas[0].entries[0].value).toBe('true');
    });

    it (`[volume] revert works`, () => {
        const date = new Date();
        const attribute2: Attribute2 = attributeRevert({
            id: 1,
            type: 'volume',
            name: 'volume attribute',
            description: 'volume attribute description',
            creationDate: date,
            lastUpdate: date,
            format: '0.00'
        } as Attribute);

        expect(attribute2.id).toBe(1);
        expect(attribute2.type).toBe(`volume`);
        expect(attribute2.name).toBe(`volume attribute`);
        expect(attribute2.description).toBe(`volume attribute description`);
        expect(attribute2.creationDate).toBe(date);
        expect(attribute2.lastUpdate).toBe(date);
        expect(attribute2.metadatas).toBeDefined();
        expect(attribute2.metadatas.length).toBe(1);
        expect(attribute2.metadatas[0].id).toBe(-1);
        expect(attribute2.metadatas[0].name).toBe(`volume metadata`);
        expect(attribute2.metadatas[0].entries).toBeDefined();
        expect(attribute2.metadatas[0].entries[0].id).toBe(-1);
        expect(attribute2.metadatas[0].entries[0].key).toBe('format');
        expect(attribute2.metadatas[0].entries[0].value).toBe('0.00');
    });

    it (`[dimension] revert works`, () => {
        const date = new Date();
        const attribute2: Attribute2 = attributeRevert({
            id: 1,
            type: 'dimension',
            name: 'dimension attribute',
            description: 'dimension attribute description',
            creationDate: date,
            lastUpdate: date,
            format: '0.00'
        } as Attribute);

        expect(attribute2.id).toBe(1);
        expect(attribute2.type).toBe(`dimension`);
        expect(attribute2.name).toBe(`dimension attribute`);
        expect(attribute2.description).toBe(`dimension attribute description`);
        expect(attribute2.creationDate).toBe(date);
        expect(attribute2.lastUpdate).toBe(date);
        expect(attribute2.metadatas).toBeDefined();
        expect(attribute2.metadatas.length).toBe(1);
        expect(attribute2.metadatas[0].id).toBe(-1);
        expect(attribute2.metadatas[0].name).toBe(`dimension metadata`);
        expect(attribute2.metadatas[0].entries).toBeDefined();
        expect(attribute2.metadatas[0].entries[0].id).toBe(-1);
        expect(attribute2.metadatas[0].entries[0].key).toBe('format');
        expect(attribute2.metadatas[0].entries[0].value).toBe('0.00');
    });

    it (`[area] revert works`, () => {
        const date = new Date();
        const attribute2: Attribute2 = attributeRevert({
            id: 1,
            type: 'area',
            name: 'area attribute',
            description: 'area attribute description',
            creationDate: date,
            lastUpdate: date,
            format: '0.00'
        } as Attribute);

        expect(attribute2.id).toBe(1);
        expect(attribute2.type).toBe(`area`);
        expect(attribute2.name).toBe(`area attribute`);
        expect(attribute2.description).toBe(`area attribute description`);
        expect(attribute2.creationDate).toBe(date);
        expect(attribute2.lastUpdate).toBe(date);
        expect(attribute2.metadatas).toBeDefined();
        expect(attribute2.metadatas.length).toBe(1);
        expect(attribute2.metadatas[0].id).toBe(-1);
        expect(attribute2.metadatas[0].name).toBe(`area metadata`);
        expect(attribute2.metadatas[0].entries).toBeDefined();
        expect(attribute2.metadatas[0].entries[0].id).toBe(-1);
        expect(attribute2.metadatas[0].entries[0].key).toBe('format');
        expect(attribute2.metadatas[0].entries[0].value).toBe('0.00');
    });

    it (`[width] revert works`, () => {
        const date = new Date();
        const attribute2: Attribute2 = attributeRevert({
            id: 1,
            type: 'width',
            name: 'width attribute',
            description: 'width attribute description',
            creationDate: date,
            lastUpdate: date,
            format: '0.00'
        } as Attribute);

        expect(attribute2.id).toBe(1);
        expect(attribute2.type).toBe(`width`);
        expect(attribute2.name).toBe(`width attribute`);
        expect(attribute2.description).toBe(`width attribute description`);
        expect(attribute2.creationDate).toBe(date);
        expect(attribute2.lastUpdate).toBe(date);
        expect(attribute2.metadatas).toBeDefined();
        expect(attribute2.metadatas.length).toBe(1);
        expect(attribute2.metadatas[0].id).toBe(-1);
        expect(attribute2.metadatas[0].name).toBe(`width metadata`);
        expect(attribute2.metadatas[0].entries).toBeDefined();
        expect(attribute2.metadatas[0].entries[0].id).toBe(-1);
        expect(attribute2.metadatas[0].entries[0].key).toBe('format');
        expect(attribute2.metadatas[0].entries[0].value).toBe('0.00');
    });

    it (`[length] revert works`, () => {
        const date = new Date();
        const attribute2: Attribute2 = attributeRevert({
            id: 1,
            type: 'length',
            name: 'length attribute',
            description: 'length attribute description',
            creationDate: date,
            lastUpdate: date,
        } as Attribute);

        expect(attribute2.id).toBe(1);
        expect(attribute2.type).toBe(`length`);
        expect(attribute2.name).toBe(`length attribute`);
        expect(attribute2.description).toBe(`length attribute description`);
        expect(attribute2.creationDate).toBe(date);
        expect(attribute2.lastUpdate).toBe(date);
        expect(attribute2.metadatas).toBeDefined();
        expect(attribute2.metadatas.length).toBe(1);
        expect(attribute2.metadatas[0].id).toBe(-1);
        expect(attribute2.metadatas[0].name).toBe(`length metadata`);
        expect(attribute2.metadatas[0].entries).toBeDefined();
        expect(attribute2.metadatas[0].entries[0].id).toBe(-1);
        expect(attribute2.metadatas[0].entries[0].key).toBe('format');
        expect(attribute2.metadatas[0].entries[0].value).toBe('0.00');
    });

    it (`[height] revert works`, () => {
        const date = new Date();
        const attribute2: Attribute2 = attributeRevert({
            id: 1,
            type: 'height',
            name: 'height attribute',
            description: 'height attribute description',
            creationDate: date,
            lastUpdate: date,
            format: '0.00'
        } as Attribute);

        expect(attribute2.id).toBe(1);
        expect(attribute2.type).toBe(`height`);
        expect(attribute2.name).toBe(`height attribute`);
        expect(attribute2.description).toBe(`height attribute description`);
        expect(attribute2.creationDate).toBe(date);
        expect(attribute2.lastUpdate).toBe(date);
        expect(attribute2.metadatas).toBeDefined();
        expect(attribute2.metadatas.length).toBe(1);
        expect(attribute2.metadatas[0].id).toBe(-1);
        expect(attribute2.metadatas[0].name).toBe(`height metadata`);
        expect(attribute2.metadatas[0].entries).toBeDefined();
        expect(attribute2.metadatas[0].entries[0].id).toBe(-1);
        expect(attribute2.metadatas[0].entries[0].key).toBe('format');
        expect(attribute2.metadatas[0].entries[0].value).toBe('0.00');
    });

    it (`[select] revert works`, () => {
        const date = new Date();
        const attribute2: Attribute2 = attributeRevert({
            id: 1,
            type: 'select',
            name: 'select attribute',
            description: 'select attribute description',
            creationDate: date,
            lastUpdate: date,
            pair1: [
                { id: -1, key: 'key1', value: 'value1'} as Pair1,
                { id: -1, key: 'key2', value: 'value2'} as Pair1
            ]
        } as Attribute);

        expect(attribute2.id).toBe(1);
        expect(attribute2.type).toBe(`select`);
        expect(attribute2.name).toBe(`select attribute`);
        expect(attribute2.description).toBe(`select attribute description`);
        expect(attribute2.creationDate).toBe(date);
        expect(attribute2.lastUpdate).toBe(date);
        expect(attribute2.metadatas).toBeDefined();
        expect(attribute2.metadatas.length).toBe(1);
        expect(attribute2.metadatas[0].id).toBe(-1);
        expect(attribute2.metadatas[0].name).toBe(`select pair1 metadata`);
        expect(attribute2.metadatas[0].entries).toBeDefined();
        expect(attribute2.metadatas[0].entries.length).toBe(2);
        expect(attribute2.metadatas[0].entries[0].id).toBe(-1);
        expect(attribute2.metadatas[0].entries[0].key).toBe('key1');
        expect(attribute2.metadatas[0].entries[0].value).toBe('value1');
        expect(attribute2.metadatas[0].entries[1].id).toBe(-1);
        expect(attribute2.metadatas[0].entries[1].key).toBe('key2');
        expect(attribute2.metadatas[0].entries[1].value).toBe('value2');
    });

    it (`[doubleselect] revert works`, () => {
        const date = new Date();
        const attribute2: Attribute2 = attributeRevert({
            id: 1,
            type: 'doubleselect',
            name: 'doubleselect attribute',
            description: 'doubleselect attribute description',
            creationDate: date,
            lastUpdate: date,
            pair1: [
                {id:-1, key: 'key1', value: 'value1'},
                {id:-1, key: 'key2', value: 'value2'},
            ],
            pair2: [
                {id: -1, key1: 'key1', key2: 'kkey11', value: 'vvalue11'},
                {id: -1, key1: 'key1', key2: 'kkey12', value: 'vvalue12'},
                {id: -1, key1: 'key1', key2: 'kkey13', value: 'vvalue13'},
                {id: -1, key1: 'key2', key2: 'kkey21', value: 'vvalue21'},
                {id: -1, key1: 'key2', key2: 'kkey22', value: 'vvalue22'},
                {id: -1, key1: 'key2', key2: 'kkey23', value: 'vvalue23'},
            ]
        } as Attribute);

        expect(attribute2.id).toBe(1);
        expect(attribute2.type).toBe(`doubleselect`);
        expect(attribute2.name).toBe(`doubleselect attribute`);
        expect(attribute2.description).toBe(`doubleselect attribute description`);
        expect(attribute2.creationDate).toBe(date);
        expect(attribute2.lastUpdate).toBe(date);
        expect(attribute2.metadatas).toBeDefined();
        expect(attribute2.metadatas.length).toBe(2);
        expect(attribute2.metadatas[0].id).toBe(-1);
        expect(attribute2.metadatas[0].name).toBe(`doubleselect pair1 metadata`);
        expect(attribute2.metadatas[0].entries).toBeDefined();
        expect(attribute2.metadatas[0].entries.length).toBe(2);
        expect(attribute2.metadatas[0].entries[0].id).toBe(-1);
        expect(attribute2.metadatas[0].entries[0].key).toBe('key1');
        expect(attribute2.metadatas[0].entries[0].value).toBe('value1');
        expect(attribute2.metadatas[0].entries[1].id).toBe(-1);
        expect(attribute2.metadatas[0].entries[1].key).toBe('key2');
        expect(attribute2.metadatas[0].entries[1].value).toBe('value2');

        expect(attribute2.metadatas[1].id).toBe(-1);
        expect(attribute2.metadatas[1].name).toBe(`doubleselect pair2 metadata`);
        expect(attribute2.metadatas[1].entries).toBeDefined();
        expect(attribute2.metadatas[1].entries.length).toBe(6);

        expect(attribute2.metadatas[1].entries[0].id).toBe(-1);
        expect(attribute2.metadatas[1].entries[0].key).toBe('key1');
        expect(attribute2.metadatas[1].entries[0].value).toBe('kkey11=vvalue11');
        expect(attribute2.metadatas[1].entries[1].id).toBe(-1);
        expect(attribute2.metadatas[1].entries[1].key).toBe('key1');
        expect(attribute2.metadatas[1].entries[1].value).toBe('kkey12=vvalue12');
        expect(attribute2.metadatas[1].entries[2].id).toBe(-1);
        expect(attribute2.metadatas[1].entries[2].key).toBe('key1');
        expect(attribute2.metadatas[1].entries[2].value).toBe('kkey13=vvalue13');

        expect(attribute2.metadatas[1].entries[3].id).toBe(-1);
        expect(attribute2.metadatas[1].entries[3].key).toBe('key2');
        expect(attribute2.metadatas[1].entries[3].value).toBe('kkey21=vvalue21');
        expect(attribute2.metadatas[1].entries[4].id).toBe(-1);
        expect(attribute2.metadatas[1].entries[4].key).toBe('key2');
        expect(attribute2.metadatas[1].entries[4].value).toBe('kkey22=vvalue22');
        expect(attribute2.metadatas[1].entries[5].id).toBe(-1);
        expect(attribute2.metadatas[1].entries[5].key).toBe('key2');
        expect(attribute2.metadatas[1].entries[5].value).toBe('kkey23=vvalue23');
    });

    it (`[weight] revert works`, () => {
        const date = new Date();
        const attribute2: Attribute2 = attributeRevert({
            id: 1,
            type: 'weight',
            name: 'weight attribute',
            description: 'weight attribute description',
            creationDate: date,
            lastUpdate: date,
            format: '0.00'
        } as Attribute);

        expect(attribute2.id).toBe(1);
        expect(attribute2.type).toBe(`weight`);
        expect(attribute2.name).toBe(`weight attribute`);
        expect(attribute2.description).toBe(`weight attribute description`);
        expect(attribute2.creationDate).toBe(date);
        expect(attribute2.lastUpdate).toBe(date);
        expect(attribute2.metadatas).toBeDefined();
        expect(attribute2.metadatas.length).toBe(1);
        expect(attribute2.metadatas[0].id).toBe(-1);
        expect(attribute2.metadatas[0].name).toBe(`weight metadata`);
        expect(attribute2.metadatas[0].entries).toBeDefined();
        expect(attribute2.metadatas[0].entries[0].id).toBe(-1);
        expect(attribute2.metadatas[0].entries[0].key).toBe('format');
        expect(attribute2.metadatas[0].entries[0].value).toBe('0.00');
    });

});