import {Item, TableItem, Value} from '../model/item.model';
import {Attribute} from '../model/attribute.model';
import {setItemValue} from './ui-item-value-setter.util';

export function createNewItem(id: number, attributes: Attribute[], parentId?: number): Item {
    const i: Item = {id, parentId, name: '', description: ''} as Item;
    addAttributesToItem(i, attributes);
    return i;
}

export function createNewTableItem(id: number, attributes: Attribute[], parentId?: number, rootParentId?: number): TableItem {
    const i: TableItem = {id, parentId, rootParentId, name: '', description: ''} as TableItem;
    addAttributesToItem(i, attributes);
    return i;
}

export function createNewItemValue(a: Attribute, defaultValues: boolean = true): Value {
    const val: Value = { attributeId: a.id, val: undefined } as Value;
    if (defaultValues) {
        setItemValue(a, val);
    }
    return val;
}

export function addAttributesToItem(i: Item | TableItem, attributes: Attribute[]) {
    attributes.forEach((a: Attribute) => {
        const val: Value = { attributeId: a.id, val: undefined } as Value;
        i[a.id] = val;
        setItemValue(a, val);
    });
}

