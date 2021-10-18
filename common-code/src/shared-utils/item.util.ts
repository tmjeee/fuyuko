import {Item, PricedItem, TableItem, Value} from '../model/item.model';

export const getItemValue = <P extends Item | PricedItem | TableItem>(item: P, attributeId: number): Value | undefined => {
    const value = item.values.find(v => v.attributeId === attributeId);
    return value;
};

export const setItemValue = <P extends Item | PricedItem | TableItem>(item: P, attributeId: number, newValue: Value | undefined) => {
    const index = item.values.findIndex(v => v.attributeId === attributeId);
    if (index >= 0) {
        if (newValue) {
            item.values[index] = newValue;
        } else {
            item.values.splice(index, 1);
        }
    } else {
        if (newValue) {
            item.values.push(newValue);
        }
    }
};

export const deleteItemValue = <P extends Item | PricedItem | TableItem>(item: P, attributeId: number) => {
    const index = item.values.findIndex(v => v.attributeId === attributeId);
    if (index >= 0) {
        item.values.splice(index, 1);
    }
}
