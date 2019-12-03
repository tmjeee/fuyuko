import { Item, ItemValTypes, Value } from "../model/item.model";
import {Item2, ItemValue2} from "../route/model/server-side.model";

import {revert as itemValueRevert } from './conversion-item-value.service';
import {convert as itemValueTypesConvert} from './conversion-item-value-types.service';

export const convert = (item2s: Item2[]): Item[] => {
   return (item2s ? item2s.map(_convert): []);
}

export const _convert = (item2: Item2): Item => {
    const item: Item = {
        id: item2.id,
        parentId: item2.parentId,
        images: item2.images,
        description: item2.description,
        name: item2.name,
        children: convert(item2.children)
    } as Item;

    for (const value2 of item2.values) {
        const value: Value = {
            attributeId: value2.attributeId,
            val: itemValueTypesConvert(value2.metadatas)
        } as Value;
        item[value2.attributeId] = value;
    }

    return item;
}

export const revert = (items: Item[]): Item2[] => {
    return (items ? items.map(_revert) : []);
}

export const _revert = (item: Item): Item2 => {
    const item2: Item2 = {
        id: item.id,
        name: item.name,
        description: item.description,
        images: item.images,
        parentId: item.parentId,
        values: [],
        children: revert(item.children)
    } as Item2;

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

