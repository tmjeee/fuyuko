import { setItemValue } from './ui-item-value-setter.util';
export function createNewItem(id, attributes, parentId) {
    const i = { id, parentId, name: '', description: '' };
    addAttributesToItem(i, attributes);
    return i;
}
export function createNewTableItem(id, attributes, parentId, rootParentId) {
    const i = { id, parentId, rootParentId, name: '', description: '' };
    addAttributesToItem(i, attributes);
    return i;
}
export function createNewItemValue(a, defaultValues = true) {
    const val = { attributeId: a.id, val: undefined };
    if (defaultValues) {
        setItemValue(a, val);
    }
    return val;
}
export function addAttributesToItem(i, attributes) {
    attributes.forEach((a) => {
        const val = { attributeId: a.id, val: undefined };
        i[a.id] = val;
        setItemValue(a, val);
    });
}
//# sourceMappingURL=ui-item-value-creator.utils.js.map