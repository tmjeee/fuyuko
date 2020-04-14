import {Item, ItemValTypes, PricedItem, Value} from "../model/item.model";
import {Item2, ItemValue2, PricedItem2} from "../server-side-model/server-side.model";

import {itemValueRevert as itemValueRevert } from './conversion-item-value.service';
import {itemValTypesConvert as itemValueTypesConvert} from './conversion-item-value-types.service';

export const itemsConvert = (item2s: Item2[] | PricedItem2[] ): Item[] | PricedItem[] => {
   return (item2s ? (item2s as []).map(itemConvert): []);
}

export const itemConvert = (item2: Item2 | PricedItem2): Item | PricedItem => {
    const item: Item | PricedItem = {
        id: item2.id,
        parentId: item2.parentId,
        images: item2.images,
        description: item2.description,
        name: item2.name,
        creationDate: item2.creationDate,
        lastUpdate: item2.lastUpdate,
        children: itemsConvert(item2.children),
        price: (item2 as PricedItem2).price ? (item2 as PricedItem2).price : undefined,
        country: (item2 as PricedItem2).country ? (item2 as PricedItem2).country : undefined,

    } as Item | PricedItem;

    for (const value2 of item2.values) {
        const value: Value = {
            attributeId: value2.attributeId,
            val: itemValueTypesConvert(value2.metadatas)
        } as Value;
        item[value2.attributeId] = value;
    }

    return item;
}

export const itemsRevert = (items: Item[] | PricedItem[]): Item2[] | PricedItem2[] => {
    return (items ? (items as []).map(itemRevert) : []);
}

export const itemRevert = (item: Item | PricedItem): Item2 | PricedItem2 => {
    const item2: Item2 | PricedItem2 = {
        id: item.id,
        name: item.name,
        description: item.description,
        images: item.images,
        parentId: item.parentId,
        creationDate: item.creationDate,
        lastUpdate: item.lastUpdate,
        values: [],
        children: itemsRevert(item.children),
        price: (item as PricedItem).price ? (item as PricedItem).price : undefined,
        country: (item as PricedItem).country ? (item as PricedItem).country : undefined
    } as Item2 | PricedItem2;

    for (const i in item) {
        if (item.hasOwnProperty(i) && !isNaN(Number(i))) {
            const value: Value = item[i];
            const val: ItemValTypes = value.val;

            const val2: ItemValue2 = itemValueRevert(value);
            if (val2) {
                item2.values.push(val2);
            }
        }
    }
    return item2;
}

