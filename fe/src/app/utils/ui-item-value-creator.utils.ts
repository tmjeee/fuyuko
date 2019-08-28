import {Item, TableItem, Value} from '../model/item.model';
import {Attribute} from '../model/attribute.model';
import {setItemValue} from './ui-item-value-setter.util';
import {ItemValueOperatorAndAttributeWithId} from "../component/rules-component/rule-editor-dialog.component";

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

export function createNewItemValue(a: Attribute): Value {
    const val: Value = { attributeId: a.id, val: undefined } as Value;
    setItemValue(a, val);
    return val;
}

export function addAttributesToItem(i: Item | TableItem, attributes: Attribute[]) {
    attributes.forEach((a: Attribute) => {
        const val: Value = { attributeId: a.id, val: undefined } as Value;
        i[a.id] = val;
        setItemValue(a, val);
    });
}

