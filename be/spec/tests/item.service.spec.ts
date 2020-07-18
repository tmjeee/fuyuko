import {
    addFavouriteItemIds,
    addItem, addOrUpdateItem, getAllFavouriteItemIdsInView, getAllFavouriteItemsInView, getAllItemsInView,
    getAttributeInViewByName,
    getItemById,
    getItemByName, getUserByUsername, removeFavouriteItemIds, searchForItemsInView,
    updateItem, updateItemsStatus,
    updateItemValue
} from "../../src/service";
import {
    AreaValue,
    CurrencyValue,
    DateValue, DimensionValue, DoubleSelectValue, HeightValue,
    Item, LengthValue,
    NumberValue, SelectValue,
    StringValue,
    TextValue,
    Value,
    VolumeValue, WeightValue, WidthValue
} from "../../src/model/item.model";
import {Attribute} from "../../src/model/attribute.model";
import {JASMINE_TIMEOUT, setupBeforeAll, setupTestDatabase} from "../helpers/test-helper";
import {User} from "../../src/model/user.model";


describe('item.service', () => {
    const viewId = 2;

    let user: User;

    let item1: Item;
    let item2: Item;
    let item3: Item;
    let item4: Item;
    let item5: Item;
    let item6: Item;
    let item7: Item;

    let stringAtt: Attribute;
    let textAtt: Attribute;
    let numberAtt: Attribute;
    let dateAtt: Attribute;
    let currencyAtt: Attribute;
    let volumeAtt: Attribute;
    let dimensionAtt: Attribute;
    let areaAtt: Attribute;
    let lengthAtt: Attribute;
    let widthAtt: Attribute;
    let heightAtt: Attribute;
    let weightAtt: Attribute;
    let selectAtt: Attribute;
    let doubleSelectAtt: Attribute;

    beforeAll(() => {
        setupTestDatabase();
    });
    beforeAll((done: DoneFn) => {
        setupBeforeAll(done);
    }, JASMINE_TIMEOUT);

    beforeAll(async () => {
        user = await getUserByUsername('cypress');
        
        item1 = await getItemByName(viewId, 'Item-1');
        item2 = await getItemByName(viewId, 'Item-2');
        item3 = await getItemByName(viewId, 'Item-3');
        item4 = await getItemByName(viewId, 'Item-4');
        item5 = await getItemByName(viewId, 'Item-5');
        item6 = await getItemByName(viewId, 'Item-6');
        item7 = await getItemByName(viewId, 'Item-7');

        stringAtt = await getAttributeInViewByName(viewId, 'string attribute');
        textAtt = await getAttributeInViewByName(viewId, 'text attribute');
        numberAtt = await getAttributeInViewByName(viewId, 'number attribute');
        dateAtt = await getAttributeInViewByName(viewId, 'date attribute');
        currencyAtt = await getAttributeInViewByName(viewId, 'currency attribute');
        volumeAtt = await getAttributeInViewByName(viewId, 'volume attribute');
        dimensionAtt = await getAttributeInViewByName(viewId, 'dimension attribute');
        areaAtt = await getAttributeInViewByName(viewId, 'area attribute');
        lengthAtt = await getAttributeInViewByName(viewId, 'length attribute');
        widthAtt = await getAttributeInViewByName(viewId, 'width attribute');
        heightAtt = await getAttributeInViewByName(viewId, 'height attribute');
        weightAtt = await getAttributeInViewByName(viewId, 'weight attribute');
        selectAtt = await getAttributeInViewByName(viewId, 'select attribute');
        doubleSelectAtt = await getAttributeInViewByName(viewId, 'doubleselect attribute');
    });
    
    it(`favourite items`, async () => {

        const errors: string[] = await addFavouriteItemIds(user.id, [item1.id, item3.id]);
        expect(errors.length).toBe(0);
        
        const favItemIds: number[] = await getAllFavouriteItemIdsInView(viewId, user.id);
        expect(favItemIds).toContain(item1.id);
        expect(favItemIds).not.toContain(item2.id);
        expect(favItemIds).toContain(item3.id);
        expect(favItemIds).not.toContain(item4.id);
        expect(favItemIds).not.toContain(item5.id);
        expect(favItemIds).not.toContain(item6.id);
        expect(favItemIds).not.toContain(item7.id);
        
        const _items: Item[] = await getAllFavouriteItemsInView(viewId, user.id, {limit: 100, offset: 0});
        const _itemNames: string[] = await _items.map((i: Item) => i.name);
        expect(_items.length).toBe(2);
        expect(_itemNames).toContain(item1.name);
        expect(_itemNames).not.toContain(item2.name);
        expect(_itemNames).toContain(item3.name);
        expect(_itemNames).not.toContain(item4.name);
        expect(_itemNames).not.toContain(item5.name);
        expect(_itemNames).not.toContain(item6.name);
        expect(_itemNames).not.toContain(item7.name);
        
        const errors1: string[] = await removeFavouriteItemIds(user.id, [item1.id]);
        const __items: Item[] = await getAllFavouriteItemsInView(viewId, user.id, {limit: 100, offset: 0});
        const __itemNames: string[] = await __items.map((i: Item) => i.name);
        expect(errors1.length).toBe(0);
        expect(__items.length).toBe(1);
        expect(__itemNames).not.toContain(item1.name);
        expect(__itemNames).not.toContain(item2.name);
        expect(__itemNames).toContain(item3.name);
        expect(__itemNames).not.toContain(item4.name);
        expect(__itemNames).not.toContain(item5.name);
        expect(__itemNames).not.toContain(item6.name);
        expect(__itemNames).not.toContain(item7.name);
    });

    it(`search / find items `, async () => {
        const items: Item[] = await getAllItemsInView(viewId, true, {limit: 2, offset: 0});
        expect(items).toBeDefined();
        expect(items.length).toBe(2);
        
        const _items: Item[] = await searchForItemsInView(viewId, 'basic', 'item', {limit: 2, offset: 0});
        expect(_items).toBeDefined();
        expect(_items.length).toBe(2);
        for (const i of _items) {
           expect(i.name.toLowerCase()).toContain('item'); 
        }
    });


    it('add / edit item', async () => {
        const itemName = `item-${new Date()}`;
        const newItemName = `newItem-${new Date()}`;
        
        // create item
        await addItem(viewId, {
           id: -1,
            name: itemName,
            description: itemName
        } as Item);


        const item: Item = await getItemByName(viewId, itemName);
        expect(item.name).toBe(itemName);
        expect(item.description).toBe(itemName);

        // update item value
        // stringAtt: Attribute;
        await updateItemValue(viewId, item.id, {
           attributeId: stringAtt.id,
            val: {
              type: "string",
              value: 'xxxxx'
            } as StringValue
        } as Value);

        // textAtt: Attribute;
        await updateItemValue(viewId, item.id, {
           attributeId: textAtt.id,
           val: {
              type: "text",
              value: 'yyyyy'
           } as TextValue
        } as Value);

        // numberAtt: Attribute;
        await updateItemValue(viewId, item.id, {
            attributeId: numberAtt.id,
            val: {
               type: "number",
               value: 8888
            } as NumberValue
        });

        // dateAtt: Attribute;
        await updateItemValue(viewId, item.id, {
            attributeId: dateAtt.id,
            val: {
                type: "date",
                value: '10-12-1999'
            } as DateValue
        });

        // currencyAtt: Attribute;
        await updateItemValue(viewId, item.id, {
            attributeId: currencyAtt.id,
            val: {
               type: "currency",
               country: "AUD",
               value: 88.88
            } as CurrencyValue
        });

        // volumeAtt: Attribute;
        await updateItemValue(viewId, item.id, {
            attributeId: volumeAtt.id,
            val: {
               type: 'volume',
                unit: 'ml',
               value: 88.88
            } as VolumeValue
        });

        // dimensionAtt: Attribute;
        await updateItemValue(viewId, item.id, {
            attributeId: dimensionAtt.id,
            val: {
               type: "dimension",
               length: 88.88,
               width: 99.99,
               height: 10.10,
               unit: 'cm'
            } as DimensionValue
        });

        // areaAtt: Attribute;
        await updateItemValue(viewId, item.id, {
            attributeId: areaAtt.id,
            val: {
               type: "area",
               unit: "cm2",
               value: 88.88
            } as AreaValue
        });

        // lengthAtt: Attribute;
        await updateItemValue(viewId, item.id, {
            attributeId: lengthAtt.id,
            val: {
                type: "length",
                unit: "cm",
                value: 88.88
            } as LengthValue
        });

        // widthAtt: Attribute;
        await updateItemValue(viewId, item.id, {
            attributeId: widthAtt.id,
            val: {
               type: "width",
               unit: 'cm',
               value: 88.88
            } as WidthValue
        });

        // heightAtt: Attribute;
        await updateItemValue(viewId, item.id, {
            attributeId: heightAtt.id,
            val: {
               type: "height",
               unit: "cm",
               value: 88.88
            } as HeightValue
        });

        // weightAtt: Attribute;
        await updateItemValue(viewId, item.id, {
            attributeId: weightAtt.id,
            val: {
               type: "weight",
               unit: "kg",
               value: 88.88
            } as WeightValue
        });

        // selectAtt: Attribute;
        await updateItemValue(viewId, item.id, {
            attributeId: selectAtt.id,
            val: {
                type: "select",
                key: 'key3'
            } as SelectValue
        });

        // doubleSelectAtt: Attribute;
        await updateItemValue(viewId, item.id, {
            attributeId: doubleSelectAtt.id,
            val: {
               type: "doubleselect",
               key1: 'key3',
               key2: 'xkey33'

            } as DoubleSelectValue
        });

        // get item and verify item
        const item2: Item = await getItemById(viewId, item.id);
        
        expect(item2.id).toBe(item.id);
        expect(item2.name).toBe(itemName);
        expect(item2.description).toBe(itemName);
        
        // stringAtt
        expect(item2[stringAtt.id].attributeId).toBe(stringAtt.id);
        expect((item2[stringAtt.id].val as StringValue).type).toBe('string');
        expect((item2[stringAtt.id].val as StringValue).value).toBe('xxxxx');

        // textAtt: Attribute;
        expect(item2[textAtt.id].attributeId).toBe(textAtt.id);
        expect((item2[textAtt.id].val as TextValue).type).toBe('text');
        expect((item2[textAtt.id].val as TextValue).value).toBe('yyyyy');
        
        // numberAtt: Attribute;
        expect((item2[numberAtt.id].attributeId)).toBe(numberAtt.id);
        expect((item2[numberAtt.id].val as NumberValue).type).toBe('number');
        expect((item2[numberAtt.id].val as NumberValue).value).toBe(8888);

        // dateAtt: Attribute;
        expect((item2[dateAtt.id].attributeId)).toBe(dateAtt.id);
        expect((item2[dateAtt.id].val as DateValue).type).toBe('date');
        expect((item2[dateAtt.id].val as DateValue).value).toBe('10-12-1999');

        // currencyAtt: Attribute;
        expect((item2[currencyAtt.id].attributeId)).toBe(currencyAtt.id);
        expect((item2[currencyAtt.id].val as CurrencyValue).type).toBe('currency');
        expect((item2[currencyAtt.id].val as CurrencyValue).value).toBe(88.88);

        // volumeAtt: Attribute;
        expect((item2[volumeAtt.id].attributeId)).toBe(volumeAtt.id);
        expect((item2[volumeAtt.id].val as VolumeValue).type).toBe('volume');
        expect((item2[volumeAtt.id].val as VolumeValue).unit).toBe('ml');
        expect((item2[volumeAtt.id].val as VolumeValue).value).toBe(88.88);
        
        // dimensionAtt: Attribute;
        expect((item2[dimensionAtt.id].attributeId)).toBe(dimensionAtt.id);
        expect((item2[dimensionAtt.id].val as DimensionValue).type).toBe('dimension');
        expect((item2[dimensionAtt.id].val as DimensionValue).length).toBe(88.88);
        expect((item2[dimensionAtt.id].val as DimensionValue).width).toBe(99.99);
        expect((item2[dimensionAtt.id].val as DimensionValue).height).toBe(10.10);
        expect((item2[dimensionAtt.id].val as DimensionValue).unit).toBe('cm');
        
        // areaAtt: Attribute;
        expect((item2[areaAtt.id].attributeId)).toBe(areaAtt.id);
        expect((item2[areaAtt.id].val as AreaValue).type).toBe('area');
        expect((item2[areaAtt.id].val as AreaValue).value).toBe(88.88);
        expect((item2[areaAtt.id].val as AreaValue).unit).toBe('cm2');
        
        // lengthAtt: Attribute;
        expect((item2[lengthAtt.id].attributeId)).toBe(lengthAtt.id);
        expect((item2[lengthAtt.id].val as LengthValue).type).toBe('length');
        expect((item2[lengthAtt.id].val as LengthValue).value).toBe(88.88);
        expect((item2[lengthAtt.id].val as LengthValue).unit).toBe('cm');
        
        // widthAtt: Attribute;
        expect((item2[widthAtt.id].attributeId)).toBe(widthAtt.id);
        expect((item2[widthAtt.id].val as WidthValue).type).toBe('width');
        expect((item2[widthAtt.id].val as WidthValue).value).toBe(88.88);
        expect((item2[widthAtt.id].val as WidthValue).unit).toBe('cm');
        
        // heightAtt: Attribute;
        expect((item2[heightAtt.id].attributeId)).toBe(heightAtt.id);
        expect((item2[heightAtt.id].val as HeightValue).type).toBe('height');
        expect((item2[heightAtt.id].val as HeightValue).value).toBe(88.88);
        expect((item2[heightAtt.id].val as HeightValue).unit).toBe('cm');
        
        // weightAtt: Attribute;
        expect((item2[weightAtt.id].attributeId)).toBe(weightAtt.id);
        expect((item2[weightAtt.id].val as WeightValue).type).toBe('weight');
        expect((item2[weightAtt.id].val as WeightValue).value).toBe(88.88);
        expect((item2[weightAtt.id].val as WeightValue).unit).toBe('kg');
        
        // selectAtt: Attribute;
        expect((item2[selectAtt.id].attributeId)).toBe(selectAtt.id);
        expect((item2[selectAtt.id].val as SelectValue).type).toBe('select');
        expect((item2[selectAtt.id].val as SelectValue).key).toBe('key3');
        
        // doubleSelectAtt: Attribute;
        expect((item2[doubleSelectAtt.id].attributeId)).toBe(doubleSelectAtt.id);
        expect((item2[doubleSelectAtt.id].val as DoubleSelectValue).type).toBe('doubleselect');
        expect((item2[doubleSelectAtt.id].val as DoubleSelectValue).key1).toBe('key3');
        expect((item2[doubleSelectAtt.id].val as DoubleSelectValue).key2).toBe('xkey33');
        
        
        // update item
        item2.name = newItemName;
        item2.description = newItemName;
        
        // stringAtt: Attribute
        item2[stringAtt.id] = {
            attributeId: stringAtt.id,
            val: {
               type: "string",
               value: 'aaaaa' 
            } as StringValue
        } as Value;
        
        // textAtt: Attribute;
        item2[textAtt.id] = {
            attributeId: textAtt.id,
            val: {
               type: "text",
               value: 'bbbbb' 
            } as TextValue
        } as Value;

        // numberAtt: Attribute;
        item2[numberAtt.id] = {
            attributeId: numberAtt.id,
            val: {
                type: "number",
                value: 3333
            } as NumberValue
        };

        // dateAtt: Attribute;
        item2[dateAtt.id] = {
            attributeId: dateAtt.id,
            val: {
                type: "date",
                value: '09-03-1980'
            } as DateValue
        };

        // currencyAtt: Attribute;
        item2[currencyAtt.id] = {
            attributeId: currencyAtt.id,
            val: {
                type: 'currency',
                value: 33.33,
                country: 'MYR'
            } as CurrencyValue
        };
        
        // volumeAtt: Attribute;
        item2[volumeAtt.id] = {
            attributeId: volumeAtt.id,
            val: {
                type: "volume",
                value: 33.33,
                unit: "l"
            } as VolumeValue
        };
        
        // dimensionAtt: Attribute;
        item2[dimensionAtt.id] = {
            attributeId: dimensionAtt.id,
            val: {
                type: 'dimension',
                unit: "m",
                length: 33.33,
                width: 44.44,
                height: 55.55
            } as DimensionValue
        };
        
        // areaAtt: Attribute;
        item2[areaAtt.id] = {
            attributeId: areaAtt.id,
            val: {
                type: "area",
                unit: "m2",
                value: 33.33 
            } as AreaValue
        };
        
        // lengthAtt: Attribute;
        item2[lengthAtt.id] = {
            attributeId: lengthAtt.id,
            val: {
               type: "length",
               unit: "m",
               value: 33.33 
            } as LengthValue
        };

        // widthAtt: Attribute;
        item2[widthAtt.id] = {
            attributeId: widthAtt.id,
            val: {
                type: "width",
                unit: "m",
                value: 33.33
            } as WidthValue
        };

        // heightAtt: Attribute;
        item2[heightAtt.id] = {
            attributeId: heightAtt.id,
            val: {
               type: "height",
               unit: "m",
               value: 33.33
            } as HeightValue
        };

        // weightAtt: Attribute;
        item2[weightAtt.id] = {
            attributeId: weightAtt.id,
            val: {
               type: "weight",
               unit: "g",
               value: 33.33 
            } as WeightValue
        };
        
        // selectAtt: Attribute;
        item2[selectAtt.id] = {
            attributeId: selectAtt.id,
            val: {
               type: "select",
               key: 'key5' 
            } as SelectValue
        };
        
        // doubleSelectAtt: Attribute;
        item2[doubleSelectAtt.id] = {
           attributeId: doubleSelectAtt.id,
           val: {
               type: "doubleselect",
               key1: 'key5',
               key2: 'xkey55'
           } 
        }
        await updateItem(viewId, item2);


        // get item and verify item
        const item3: Item = await getItemById(viewId, item.id);

        expect(item3.id).toBe(item.id);
        expect(item3.name).toBe(newItemName);
        expect(item3.description).toBe(newItemName);

        // stringAtt
        expect(item3[stringAtt.id].attributeId).toBe(stringAtt.id);
        expect((item3[stringAtt.id].val as StringValue).type).toBe('string');
        expect((item3[stringAtt.id].val as StringValue).value).toBe('aaaaa');

        // textAtt: Attribute;
        expect(item3[textAtt.id].attributeId).toBe(textAtt.id);
        expect((item3[textAtt.id].val as TextValue).type).toBe('text');
        expect((item3[textAtt.id].val as TextValue).value).toBe('bbbbb');

        // numberAtt: Attribute;
        expect((item3[numberAtt.id].attributeId)).toBe(numberAtt.id);
        expect((item3[numberAtt.id].val as NumberValue).type).toBe('number');
        expect((item3[numberAtt.id].val as NumberValue).value).toBe(3333);

        // dateAtt: Attribute;
        expect((item3[dateAtt.id].attributeId)).toBe(dateAtt.id);
        expect((item3[dateAtt.id].val as DateValue).type).toBe('date');
        expect((item3[dateAtt.id].val as DateValue).value).toBe('09-03-1980');

        // currencyAtt: Attribute;
        expect((item3[currencyAtt.id].attributeId)).toBe(currencyAtt.id);
        expect((item3[currencyAtt.id].val as CurrencyValue).type).toBe('currency');
        expect((item3[currencyAtt.id].val as CurrencyValue).value).toBe(33.33);

        // volumeAtt: Attribute;
        expect((item3[volumeAtt.id].attributeId)).toBe(volumeAtt.id);
        expect((item3[volumeAtt.id].val as VolumeValue).type).toBe('volume');
        expect((item3[volumeAtt.id].val as VolumeValue).unit).toBe('l');
        expect((item3[volumeAtt.id].val as VolumeValue).value).toBe(33.33);

        // dimensionAtt: Attribute;
        expect((item3[dimensionAtt.id].attributeId)).toBe(dimensionAtt.id);
        expect((item3[dimensionAtt.id].val as DimensionValue).type).toBe('dimension');
        expect((item3[dimensionAtt.id].val as DimensionValue).length).toBe(33.33);
        expect((item3[dimensionAtt.id].val as DimensionValue).width).toBe(44.44);
        expect((item3[dimensionAtt.id].val as DimensionValue).height).toBe(55.55);
        expect((item3[dimensionAtt.id].val as DimensionValue).unit).toBe('m');

        // areaAtt: Attribute;
        expect((item3[areaAtt.id].attributeId)).toBe(areaAtt.id);
        expect((item3[areaAtt.id].val as AreaValue).type).toBe('area');
        expect((item3[areaAtt.id].val as AreaValue).value).toBe(33.33);
        expect((item3[areaAtt.id].val as AreaValue).unit).toBe('m2');

        // lengthAtt: Attribute;
        expect((item3[lengthAtt.id].attributeId)).toBe(lengthAtt.id);
        expect((item3[lengthAtt.id].val as LengthValue).type).toBe('length');
        expect((item3[lengthAtt.id].val as LengthValue).value).toBe(33.33);
        expect((item3[lengthAtt.id].val as LengthValue).unit).toBe('m');

        // widthAtt: Attribute;
        expect((item3[widthAtt.id].attributeId)).toBe(widthAtt.id);
        expect((item3[widthAtt.id].val as WidthValue).type).toBe('width');
        expect((item3[widthAtt.id].val as WidthValue).value).toBe(33.33);
        expect((item3[widthAtt.id].val as WidthValue).unit).toBe('m');

        // heightAtt: Attribute;
        expect((item3[heightAtt.id].attributeId)).toBe(heightAtt.id);
        expect((item3[heightAtt.id].val as HeightValue).type).toBe('height');
        expect((item3[heightAtt.id].val as HeightValue).value).toBe(33.33);
        expect((item3[heightAtt.id].val as HeightValue).unit).toBe('m');

        // weightAtt: Attribute;
        expect((item3[weightAtt.id].attributeId)).toBe(weightAtt.id);
        expect((item3[weightAtt.id].val as WeightValue).type).toBe('weight');
        expect((item3[weightAtt.id].val as WeightValue).value).toBe(33.33);
        expect((item3[weightAtt.id].val as WeightValue).unit).toBe('g');

        // selectAtt: Attribute;
        expect((item3[selectAtt.id].attributeId)).toBe(selectAtt.id);
        expect((item3[selectAtt.id].val as SelectValue).type).toBe('select');
        expect((item3[selectAtt.id].val as SelectValue).key).toBe('key5');

        // doubleSelectAtt: Attribute;
        expect((item3[doubleSelectAtt.id].attributeId)).toBe(doubleSelectAtt.id);
        expect((item3[doubleSelectAtt.id].val as DoubleSelectValue).type).toBe('doubleselect');
        expect((item3[doubleSelectAtt.id].val as DoubleSelectValue).key1).toBe('key5');
        expect((item3[doubleSelectAtt.id].val as DoubleSelectValue).key2).toBe('xkey55');



        // add or update item
        const iName: string = `xxxx-item-${new Date()}`;
        const iName2: string = `yyyy-item-${new Date()}`;
        await addOrUpdateItem(viewId, {
            id: -1,
            name: iName,
            description: iName,
        } as Item);

        const i1: Item =  await getItemByName(viewId, iName);
        expect(i1.id).not.toBe(-1);
        expect(i1.name).toBe(iName);
        expect(i1.description).toBe(iName);
        
        i1.name = iName2;
        i1.description = iName2;
        await addOrUpdateItem(viewId, i1);
        const i2: Item = await getItemByName(viewId, iName2);
        expect(i2.name).toBe(iName2);
        expect(i2.description).toBe(iName2);
        
        
        // set status
        const errs: string[] = await updateItemsStatus([i2.id], "DISABLED");
        const i3: Item = await getItemById(viewId, i2.id);
        expect(errs.length).toBe(0);
        expect(i3).toBeFalsy();
    });



});
