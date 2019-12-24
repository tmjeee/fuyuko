export const hasItemValue = (attribute, value) => {
    if (!value || !value.val) {
        return false;
    }
    switch (attribute.type) {
        case 'string':
            return (!!value.val.value);
        case 'text':
            return (!!value.val.value);
        case 'date':
            return (!!value.val.value);
        case 'number':
            return Number.isNaN(Number(value.val.value));
        case 'currency':
            return (!Number.isNaN(Number(value.val.value)) && (!!value.val.country));
        case 'area':
            return (!Number.isNaN(Number(value.val.value)) && (!!value.val.unit));
        case 'volume':
            return (!Number.isNaN(Number(value.val.value)) && (!!value.val.unit));
        case 'dimension':
            return ((!Number.isNaN(Number(value.val.height))) &&
                (!Number.isNaN(Number(value.val.width))) &&
                (!Number.isNaN(Number(value.val.length))) &&
                (!!value.val.unit));
        case 'width':
            return (!Number.isNaN(Number(value.val.value)) && (!!value.val.unit));
        case 'height':
            return (!Number.isNaN(Number(value.val.value)) && (!!value.val.unit));
        case 'length':
            return (!Number.isNaN(Number(value.val.value)) && (!!value.val.unit));
        case 'select':
            return (!!value.val.key);
        case 'doubleselect':
            return ((!!value.val.key1) &&
                (!!value.val.key2));
    }
};
const internalGetItemValue = (attribute, item) => {
    const v = item[attribute.id].val;
    return v;
};
export const getItemStringValue = (attribute, item) => {
    return internalGetItemValue(attribute, item);
};
export const getItemTextValue = (attribute, item) => {
    return internalGetItemValue(attribute, item);
};
export const getItemNumberValue = (attribute, item) => {
    return internalGetItemValue(attribute, item);
};
export const getItemDateValue = (attribute, item) => {
    return internalGetItemValue(attribute, item);
};
export const getItemCurrencyValue = (attribute, item) => {
    return internalGetItemValue(attribute, item);
};
export const getItemAreaValue = (attribute, item) => {
    return internalGetItemValue(attribute, item);
};
export const getItemVolumeValue = (attribute, item) => {
    return internalGetItemValue(attribute, item);
};
export const getItemDimensionValue = (attribute, item) => {
    return internalGetItemValue(attribute, item);
};
export const getItemWidthValue = (attribute, item) => {
    return internalGetItemValue(attribute, item);
};
export const getItemHeightValue = (attribute, item) => {
    return internalGetItemValue(attribute, item);
};
export const getItemLengthValue = (attribute, item) => {
    return internalGetItemValue(attribute, item);
};
export const getItemSelectValue = (attribute, item) => {
    return internalGetItemValue(attribute, item);
};
export const getItemDoubleSelectValue = (attribute, item) => {
    return internalGetItemValue(attribute, item);
};
//# sourceMappingURL=ui-item-value-getter.util.js.map