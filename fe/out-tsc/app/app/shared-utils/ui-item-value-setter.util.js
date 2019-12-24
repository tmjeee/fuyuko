export function setItemValue(a, val) {
    switch (a.type) {
        case 'string':
            setItemStringValue(a, val, '');
            break;
        case 'text':
            setItemTextValue(a, val, '');
            break;
        case 'number':
            setItemNumberValue(a, val, 0);
            break;
        case 'date':
            setItemDateValue(a, val, '');
            break;
        case 'currency':
            setItemCurrencyValue(a, val, 0);
            break;
        case 'area':
            setItemAreaValue(a, val, 0, 'm2');
            break;
        case 'volume':
            setItemVolumeValue(a, val, 0, 'l');
            break;
        case 'dimension':
            setItemDimensionValue(a, val, 0, 0, 0, 'm');
            break;
        case 'width':
            setItemWidthValue(a, val, 0, 'm');
            break;
        case 'height':
            setItemHeightValue(a, val, 0, 'm');
            break;
        case 'length':
            setItemLengthValue(a, val, 0, 'm');
            break;
        case 'select':
            setItemSelectValue(a, val, '');
            break;
        case 'doubleselect':
            setItemDoubleSelectValue(a, val, '', '');
            break;
    }
}
function _setItemValue(attribute, value, val) {
    value.val = val;
}
export function setItemStringValue(attribute, value, val) {
    _setItemValue(attribute, value, {
        type: 'string',
        value: val
    });
}
export function setItemTextValue(attribute, value, val) {
    _setItemValue(attribute, value, {
        type: 'text',
        value: val
    });
}
export function setItemNumberValue(attribute, value, val) {
    _setItemValue(attribute, value, {
        type: 'number',
        value: val
    });
}
export function setItemDateValue(attribute, value, val) {
    _setItemValue(attribute, value, {
        type: 'date',
        value: val,
        format: 'DD-MM-YYYY'
    });
}
export function setItemCurrencyValue(attribute, value, val, country) {
    _setItemValue(attribute, value, {
        type: 'currency',
        value: val,
        country
    });
}
export function setItemAreaValue(attribute, value, val, unit) {
    _setItemValue(attribute, value, {
        type: 'area',
        value: val,
        unit
    });
}
export function setItemVolumeValue(attribute, value, val, unit) {
    _setItemValue(attribute, value, {
        type: 'volume',
        value: val,
        unit
    });
}
export function setItemDimensionValue(attribute, value, width, length, height, unit) {
    _setItemValue(attribute, value, {
        type: 'dimension',
        width,
        length,
        height,
        unit
    });
}
export function setItemWidthValue(attribute, value, val, unit) {
    _setItemValue(attribute, value, {
        type: 'width',
        value: val,
        unit
    });
}
export function setItemHeightValue(attribute, value, val, unit) {
    _setItemValue(attribute, value, {
        type: 'height',
        value: val,
        unit
    });
}
export function setItemLengthValue(attribute, value, val, unit) {
    _setItemValue(attribute, value, {
        type: 'length',
        value: val,
        unit
    });
}
export function setItemSelectValue(attribute, value, key1) {
    _setItemValue(attribute, value, {
        type: 'select',
        key: key1
    });
}
export function setItemDoubleSelectValue(attribute, value, key1, key2) {
    _setItemValue(attribute, value, {
        type: 'doubleselect',
        key1,
        key2
    });
}
//# sourceMappingURL=ui-item-value-setter.util.js.map