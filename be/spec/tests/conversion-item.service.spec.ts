import {itemConvert, itemRevert} from '../../src/service';
import {
    Item2,
    ItemMetadata2,
    ItemMetadataEntry2,
    ItemValue2,
} from '../../src/server-side-model/server-side.model';
import {Item, ItemImage, StringValue, Value} from '@fuyuko-common/model/item.model';
import {setupTestDatabase} from '../helpers/test-helper';

describe('conversion-item.service.ts', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });

    it('itemConvert', () => {
        const attributeId: number = 3;
        const d = new Date();
        const images: ItemImage[] = [];
        const i: Item = itemConvert({
            id: 1,
            parentId: 1,
            images,
            name: 'name',
            description: 'description',
            creationDate: d,
            lastUpdate: d,
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
                    children: []
                } as Item2
            ]
        } as Item2);

        expect(i.id).toBe(1);
        expect(i.parentId).toBe(1);
        expect(i.images).toBe(images);
        expect(i.name).toBe('name');
        expect(i.description).toBe('description');
        expect(i.creationDate).toBe(d);
        expect(i.lastUpdate).toBe(d);
        expect(i[attributeId].attributeId).toBe(attributeId);
        expect(((i[attributeId].val) as StringValue).type).toBe('string');
        expect(((i[attributeId].val) as StringValue).value).toBe('test');
        expect(i.children.length).toBe(1);
        expect(i.children[0].name).toBe('name2');
        expect(i.children[0].description).toBe('description2');
        expect(((i.children[0][attributeId].val) as StringValue).type).toBe('string');
        expect(((i.children[0][attributeId].val) as StringValue).value).toBe('test2');
        expect(i.children[0].children.length).toBe(0);
    });




    it('itemRevert', () => {
        const attributeId: number = 99;
        const d = new Date();
        const i: Item2 = itemRevert({
            id: 1,
            name: 'name',
            description: 'description',
            lastUpdate: d,
            creationDate: d,
            images: [],
            parentId: 2,
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
                    [attributeId]: {
                        attributeId,
                        val: {
                            type: 'string',
                            value: 'test2'
                        } as StringValue
                    } as Value
                } as Item
            ],
            [attributeId]: {
                attributeId,
                val: {
                    type: 'string',
                    value: 'test'
                } as StringValue
            } as Value,
        } as Item);

        expect(i.name).toBe('name');
        expect(i.description).toBe('description');
        expect(i.parentId).toBe(2);
        expect(i.values.length).toBe(1);
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