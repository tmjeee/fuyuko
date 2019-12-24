import { toItem, toTableItem } from './item-to-table-items.util';
import * as util from 'util';
describe('item-to-table-items.util.ts', () => {
    it('toTableItems() test', () => {
        const items = [
            { id: 1, parentId: undefined, name: '', description: '', images: [],
                1: { attributeId: 1, val: { type: 'string', value: 's1' } },
                2: { attributeId: 2, val: { type: 'string', value: 's2' } },
                children: [
                    { id: 100, parentId: 1, name: '', description: '', images: [],
                        1: { attributeId: 1, val: { type: 'string', value: 's3' } },
                        2: { attributeId: 2, val: { type: 'string', value: 's4' } },
                        children: [] },
                    { id: 101, parentId: 1,
                        1: { attributeId: 1, val: { type: 'string', value: 's5' } },
                        2: { attributeId: 2, val: { type: 'string', value: 's6' } },
                        children: [
                            { id: 1000, parentId: 101,
                                1: { attributeId: 1, val: { type: 'string', value: 's7' } },
                                2: { attributeId: 2, val: { type: 'string', value: 's8' } },
                                children: [] },
                            { id: 1001, parentId: 101,
                                1: { attributeId: 1, val: { type: 'string', value: 's9' } },
                                2: { attributeId: 2, val: { type: 'string', value: 's10' } },
                                children: [] }
                        ] }
                ] },
            { id: 2, parentId: undefined, name: '', description: '', images: [],
                1: { attributeId: 1, val: { type: 'string', value: 's11' } },
                2: { attributeId: 2, val: { type: 'string', value: 's12' } },
                children: [
                    { id: 100, parentId: 1, name: '', description: '', images: [], children: [] }
                ] },
        ];
        const tableItems = toTableItem(items);
        console.log(util.inspect(tableItems, { depth: 1000 }));
    });
    it('test toItems()', () => {
        const tableItems = [
            // tslint:disable-next-line:max-line-length
            { id: 1, name: '', description: '', images: [], depth: 0, rootParentId: undefined, parentId: undefined, 1: { attributeId: 1, val: { type: 'string', value: 's1' } } },
            // tslint:disable-next-line:max-line-length
            { id: 2, name: '', description: '', images: [], depth: 0, rootParentId: 1, parentId: 1, 1: { attributeId: 1, val: { type: 'string', value: 's11' } } },
            // tslint:disable-next-line:max-line-length
            { id: 3, name: '', description: '', images: [], depth: 0, rootParentId: 1, parentId: 1, 1: { attributeId: 1, val: { type: 'string', value: 's12' } } },
            // tslint:disable-next-line:max-line-length
            { id: 4, name: '', description: '', images: [], depth: 0, rootParentId: 1, parentId: 2, 1: { attributeId: 1, val: { type: 'string', value: 's111' } } },
            // tslint:disable-next-line:max-line-length
            { id: 5, name: '', description: '', images: [], depth: 0, rootParentId: 1, parentId: 2, 1: { attributeId: 1, val: { type: 'string', value: 's112' } } },
            // tslint:disable-next-line:max-line-length
            { id: 6, name: '', description: '', images: [], depth: 0, rootParentId: 1, parentId: 4, 1: { attributeId: 1, val: { type: 'string', value: 's1111' } } },
            // tslint:disable-next-line:max-line-length
            { id: 7, name: '', description: '', images: [], depth: 0, rootParentId: 1, parentId: 6, 1: { attributeId: 1, val: { type: 'string', value: 's11111' } } },
            // tslint:disable-next-line:max-line-length
            { id: 8, name: '', description: '', images: [], depth: 0, rootParentId: undefined, parentId: undefined, 1: { attributeId: 1, val: { type: 'string', value: 's2' } } },
        ];
        const items = toItem(tableItems);
        console.log(util.inspect(items, { depth: 100 }));
    });
});
//# sourceMappingURL=item-to-table-items.util.spec.js.map