import {ItemImage, PricedItem, StringValue, Value} from "../../src/model/item.model";
import {pricedItemConvert, pricedItemRevert} from "../../src/service/conversion-priced-item.service";
import {
    ItemMetadata2,
    ItemMetadataEntry2,
    ItemValue2,
    PricedItem2
} from "../../src/server-side-model/server-side.model";
import {setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";


describe(`conversion-priced-item.service.ts`, () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });
    it('pricedItemConvert', () => {
        const attributeId: number = 3;
        const d = new Date();
        const images: ItemImage[] = [];
        const i: PricedItem = pricedItemConvert({
            id: 1,
            parentId: 1,
            images,
            name: 'name',
            description: 'description',
            creationDate: d,
            lastUpdate: d,
            price: 10.10,
            country: 'AUD',
            values: [{
                id: -1, attributeId, metadatas: [{
                    id: -1, attributeId, attributeType: 'string', name: 'meta', entries: [
                        { id: -1, key: 'type', value: 'string', dataType: 'string'} as ItemMetadataEntry2,
                        { id: -1, key: 'value', value: 'test', dataType: 'string'} as ItemMetadataEntry2,
                    ]} as ItemMetadata2
                ]
            } as ItemValue2],
            children: [
                {
                    id: 1,
                    parentId: 1,
                    images,
                    name: 'name2',
                    description: 'description2',
                    creationDate: d,
                    lastUpdate: d,
                    values: [{
                        id: -1, attributeId, metadatas: [
                            { id: -1, attributeId, attributeType: 'string', name: 'meta', entries: [
                                    { id: -1, key: 'type', value: 'string', dataType: 'string'} as ItemMetadataEntry2,
                                    { id: -1, key: 'value', value: 'test2', dataType: 'string'} as ItemMetadataEntry2,
                                ]} as ItemMetadata2
                        ]
                    } as ItemValue2],
                    children: [],
                    price: 11.10,
                    country: 'AUD'
                } as PricedItem2
            ]
        } as PricedItem2) as PricedItem;

        expect(i.id).toBe(1);
        expect(i.parentId).toBe(1);
        expect(i.images).toBe(images);
        expect(i.name).toBe('name');
        expect(i.description).toBe('description');
        expect(i.creationDate).toBe(d);
        expect(i.lastUpdate).toBe(d);
        expect(i.price).toBe(10.10);
        expect(i.country).toBe('AUD')
        expect(i[attributeId].attributeId).toBe(attributeId);
        expect(((i[attributeId].val) as StringValue).type).toBe('string');
        expect(((i[attributeId].val) as StringValue).value).toBe('test');
        expect(i.children.length).toBe(1);
        expect(i.children[0].name).toBe('name2');
        expect(i.children[0].description).toBe('description2');
        expect(i.children[0].price).toBe(11.10);
        expect(i.children[0].country).toBe('AUD');
        expect(((i.children[0][attributeId].val) as StringValue).type).toBe('string');
        expect(((i.children[0][attributeId].val) as StringValue).value).toBe('test2');
        expect(i.children[0].children.length).toBe(0);
    });



    it('pricedItemRevert', () => {
        const attributeId: number = 99;
        const d = new Date();
        const i: PricedItem2 = pricedItemRevert({
            id: 1,
            name: 'name',
            description: 'description',
            lastUpdate: d,
            creationDate: d,
            images: [],
            parentId: 2,
            price: 10.11,
            country: 'AUD',
            children: [
                {
                    id: 3,
                    name: 'name2',
                    description: 'description2',
                    lastUpdate: d,
                    creationDate: d,
                    images: [],
                    parentId: 1,
                    children: [],
                    price: 11.11,
                    country: 'AUD',
                    [attributeId]: {
                        attributeId,
                        val: {
                            type: 'string',
                            value: 'test2'
                        } as StringValue
                    } as Value
                } as PricedItem
            ],
            [attributeId]: {
                attributeId,
                val: {
                    type: 'string',
                    value: 'test'
                } as StringValue
            } as Value,
        } as PricedItem) as PricedItem2;

        expect(i.name).toBe('name');
        expect(i.description).toBe('description');
        expect(i.parentId).toBe(2);
        expect(i.values.length).toBe(1);
        expect(i.price).toBe(10.11);
        expect(i.country).toBe('AUD');
        expect(i.values[0].attributeId).toBe(attributeId);
        expect(i.values[0].metadatas.length).toBe(1);
        expect(i.values[0].metadatas[0].entries.length).toBe(2);
        expect(i.values[0].metadatas[0].attributeId).toBe(attributeId);
        expect(i.values[0].metadatas[0].attributeType).toBe('string');
        expect(i.values[0].metadatas[0].entries.length).toBe(2);
        expect(i.values[0].metadatas[0].entries[0].key).toBe('type');
        expect(i.values[0].metadatas[0].entries[0].value).toBe('string');
        expect(i.values[0].metadatas[0].entries[0].dataType).toBe('string');
        expect(i.values[0].metadatas[0].entries[1].key).toBe('value');
        expect(i.values[0].metadatas[0].entries[1].value).toBe('test');
        expect(i.values[0].metadatas[0].entries[1].dataType).toBe('string');
        expect(i.children.length).toBe(1);
        expect(i.children[0].name).toBe('name2');
        expect(i.children[0].price).toBe(11.11);
        expect(i.children[0].country).toBe('AUD');
        expect(i.children[0].description).toBe('description2');
        expect(i.children[0].values[0].attributeId).toBe(attributeId);
        expect(i.children[0].values[0].metadatas.length).toBe(1);
        expect(i.children[0].values[0].metadatas[0].entries.length).toBe(2);
        expect(i.children[0].values[0].metadatas[0].attributeId).toBe(attributeId);
        expect(i.children[0].values[0].metadatas[0].attributeType).toBe('string');
        expect(i.children[0].values[0].metadatas[0].entries.length).toBe(2);
        expect(i.children[0].values[0].metadatas[0].entries[0].key).toBe('type');
        expect(i.children[0].values[0].metadatas[0].entries[0].value).toBe('string');
        expect(i.children[0].values[0].metadatas[0].entries[0].dataType).toBe('string');
        expect(i.children[0].values[0].metadatas[0].entries[1].key).toBe('value');
        expect(i.children[0].values[0].metadatas[0].entries[1].value).toBe('test2');
        expect(i.children[0].values[0].metadatas[0].entries[1].dataType).toBe('string');
    });
});