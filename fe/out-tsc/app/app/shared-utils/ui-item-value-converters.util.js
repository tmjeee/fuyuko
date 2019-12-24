import { AREA_FORMAT, CURRENCY_FORMAT, DATE_FORMAT, DIMENSION_FORMAT, HEIGHT_FORMAT, LENGTH_FORMAT, VOLUME_FORMAT, WIDTH_FORMAT } from '../model/item.model';
import { ATTRIBUTE_TYPES } from '../model/attribute.model';
import moment from 'moment';
import numeral from 'numeral';
export function isItemValue(v) {
    const r = (v && v.hasOwnProperty('attributeId') && v.hasOwnProperty('val'));
    return r;
}
export function isItemValueType(v) {
    const r = (v && v.hasOwnProperty('type') && ATTRIBUTE_TYPES.indexOf(v.type) >= 0);
    return r;
}
class AbstractItemValueConverter {
    convertToString(a, i) {
        return this._check(a, i, (y, z) => this._convertToString(y, z));
    }
    convertToCsv(a, i) {
        return this._check(a, i, (y, z) => this._convertToCsv(y, z));
    }
    _check(a, i, callback) {
        if (i) {
            if (a.type !== i.type) {
                throw new Error('incompatible types');
            }
            return callback(a, i);
        }
        return undefined;
    }
}
class StringItemValueConverter extends AbstractItemValueConverter {
    _convertToString(a, i) {
        return i.value;
    }
    _convertToCsv(a, i) {
        return this._convertToString(a, i);
    }
    convertFromCsv(csv) {
        return {
            type: 'string',
            value: csv,
        };
    }
}
class TextItemValueConverter extends AbstractItemValueConverter {
    _convertToString(a, i) {
        return i.value;
    }
    _convertToCsv(a, i) {
        return this._convertToString(a, i);
    }
    convertFromCsv(csv) {
        return {
            type: 'text',
            value: csv
        };
    }
}
class NumberItemValueConverter extends AbstractItemValueConverter {
    _convertToString(a, i) {
        return '' + i.value;
    }
    _convertToCsv(a, i) {
        return this._convertToString(a, i);
    }
    convertFromCsv(csv) {
        return {
            type: 'number',
            value: Number(csv)
        };
    }
}
class DateItemValueConverter extends AbstractItemValueConverter {
    _convertToString(a, i) {
        const m = moment(i.value, DATE_FORMAT);
        if (a.format) {
            return m.format(a.format);
        }
        return m.format(DATE_FORMAT);
    }
    _convertToCsv(a, i) {
        return this._convertToString(a, i);
    }
    convertFromCsv(csv) {
        const m = moment(csv, DATE_FORMAT);
        const f = m.format(DATE_FORMAT);
        return {
            type: 'date',
            value: f
        };
    }
}
class CurrencyItemValueConverter extends AbstractItemValueConverter {
    _convertToString(a, i) {
        if (a.showCurrencyCountry) {
            return `${numeral(i.value).format(CURRENCY_FORMAT)} ${i.country ? i.country : ''}`;
        }
        return `${numeral(i.value).format(CURRENCY_FORMAT)}`;
    }
    _convertToCsv(a, i) {
        return `${numeral(i.value).format(CURRENCY_FORMAT)}|${i.country ? i.country : ''}`;
    }
    convertFromCsv(csv) {
        const p = csv.split('|');
        return {
            type: 'currency',
            value: Number(numeral(p[0]).format(CURRENCY_FORMAT)),
            country: p.length > 1 && p[1] ? p[1] : '',
        };
    }
}
class DimensionItemValueConverter extends AbstractItemValueConverter {
    _convertToString(a, i) {
        const f = a.format ? a.format : DIMENSION_FORMAT;
        return `w:${numeral(i.width).format(f)} ${i.unit},
            h:${numeral(i.height).format(f)} ${i.unit}
            l:${numeral(i.length).format(f)} ${i.unit}`;
    }
    _convertToCsv(a, i) {
        const f = a.format ? a.format : DIMENSION_FORMAT;
        return `${numeral(i.width).format(f)}|${numeral(i.height).format(f)}|${numeral(i.length).format(f)}|${i.unit}`;
    }
    convertFromCsv(csv) {
        const p = csv.split('|');
        return {
            type: 'dimension',
            width: p && p.length >= 1 ? p[0] : 0,
            height: p && p.length >= 2 ? p[1] : 0,
            length: p && p.length >= 3 ? p[2] : 0,
            unit: p && p.length >= 4 ? p[3] : undefined
        };
    }
}
class AreaItemValueConverter extends AbstractItemValueConverter {
    _convertToString(a, i) {
        const f = a.format ? a.format : AREA_FORMAT;
        return `${numeral(i.value).format(f)} ${i.unit}`;
    }
    _convertToCsv(a, i) {
        const f = a.format ? a.format : AREA_FORMAT;
        return `${numeral(i.value).format(f)}|${i.unit}`;
    }
    convertFromCsv(csv) {
        const p = csv.split('|');
        return {
            type: 'area',
            value: Number(p[0]),
            unit: p[1]
        };
    }
}
class VolumeItemValueConverter extends AbstractItemValueConverter {
    _convertToString(a, i) {
        const f = a.format ? a.format : VOLUME_FORMAT;
        return `${numeral(i.value).format(f)} ${i.unit}`;
    }
    _convertToCsv(a, i) {
        const f = a.format ? a.format : VOLUME_FORMAT;
        return `${numeral(i.value).format(f)}|${i.unit}`;
    }
    convertFromCsv(csv) {
        const p = csv.split('|');
        return {
            type: 'volume',
            value: Number(p[0]),
            unit: p[1]
        };
    }
}
class WidthItemValueConverter extends AbstractItemValueConverter {
    _convertToString(a, i) {
        const f = a.format ? a.format : WIDTH_FORMAT;
        return `${numeral(i.value).format(f)} ${i.unit}`;
    }
    _convertToCsv(a, i) {
        const f = a.format ? a.format : WIDTH_FORMAT;
        return `${numeral(i.value).format(f)}|${i.unit}`;
    }
    convertFromCsv(csv) {
        const p = csv.split('|');
        return {
            type: 'width',
            value: Number(p[0]),
            unit: p[1]
        };
    }
}
class LengthItemValueConverter extends AbstractItemValueConverter {
    _convertToString(a, i) {
        const f = a.format ? a.format : LENGTH_FORMAT;
        return `${numeral(i.value).format(f)} ${i.unit}`;
    }
    _convertToCsv(a, i) {
        const f = a.format ? a.format : LENGTH_FORMAT;
        return `${numeral(i.value).format(f)}|${i.unit}`;
    }
    convertFromCsv(csv) {
        const p = csv.split('|');
        return {
            type: 'length',
            value: Number(p[0]),
            unit: p[1]
        };
    }
}
class HeightItemValueConverter extends AbstractItemValueConverter {
    _convertToString(a, i) {
        const f = a.format ? a.format : HEIGHT_FORMAT;
        return `${numeral(i.value).format(f)} ${i.unit}`;
    }
    _convertToCsv(a, i) {
        const f = a.format ? a.format : HEIGHT_FORMAT;
        return `${numeral(i.value).format(f)}|${i.unit}`;
    }
    convertFromCsv(csv) {
        const p = csv.split('|');
        return {
            type: 'height',
            value: Number(p[0]),
            unit: p[1]
        };
    }
}
class SelectItemValueConverter extends AbstractItemValueConverter {
    _convertToString(a, i) {
        const p = a.pair1.find((pp) => pp.key === i.key);
        return `${p ? p.value : ''}`;
    }
    _convertToCsv(a, i) {
        return this._convertToString(a, i);
    }
    convertFromCsv(csv) {
        return {
            type: 'select',
            key: csv
        };
    }
}
class DoubleSelectItemValueConverter extends AbstractItemValueConverter {
    _convertToString(a, i) {
        const p1 = a.pair1.find((p) => p.key === i.key1);
        const p2 = a.pair2.find((p) => p.key2 === i.key2);
        return `${p1 ? p1.value : ''} - ${p2 ? p2.value : ''}`;
    }
    _convertToCsv(a, i) {
        return this._convertToString(a, i);
    }
    convertFromCsv(csv) {
        const p = csv.split('|');
        return {
            type: 'doubleselect',
            key1: p[0],
            key2: p[1]
        };
    }
}
const STRING_ITEM_CONVERTER = new StringItemValueConverter();
const TEXT_ITEM_CONVERTER = new TextItemValueConverter();
const NUMBER_ITEM_CONVERTER = new NumberItemValueConverter();
const DATE_ITEM_CONVERTER = new DateItemValueConverter();
const CURRENCY_ITEM_CONVERTER = new CurrencyItemValueConverter();
const VOLUME_ITEM_CONVERTER = new VolumeItemValueConverter();
const DIMENSION_ITEM_CONVERTER = new DimensionItemValueConverter();
const AREA_ITEM_CONVERTER = new AreaItemValueConverter();
const WIDTH_ITEM_CONVERTER = new WidthItemValueConverter();
const HEIGHT_ITEM_CONVERTER = new HeightItemValueConverter();
const LENGTH_ITEM_CONVERTER = new LengthItemValueConverter();
const SELECT_ITEM_CONVERTER = new SelectItemValueConverter();
const DOUBLESELECT_ITEM_CONVERTER = new DoubleSelectItemValueConverter();
export const itemConverter = (a) => {
    let typeConverter;
    switch (a.type) {
        case 'string':
            typeConverter = STRING_ITEM_CONVERTER;
            break;
        case 'text':
            typeConverter = TEXT_ITEM_CONVERTER;
            break;
        case 'number':
            typeConverter = NUMBER_ITEM_CONVERTER;
            break;
        case 'date':
            typeConverter = DATE_ITEM_CONVERTER;
            break;
        case 'currency':
            typeConverter = CURRENCY_ITEM_CONVERTER;
            break;
        case 'volume':
            typeConverter = VOLUME_ITEM_CONVERTER;
            break;
        case 'dimension':
            typeConverter = DIMENSION_ITEM_CONVERTER;
            break;
        case 'area':
            typeConverter = AREA_ITEM_CONVERTER;
            break;
        case 'width':
            typeConverter = WIDTH_ITEM_CONVERTER;
            break;
        case 'length':
            typeConverter = LENGTH_ITEM_CONVERTER;
            break;
        case 'height':
            typeConverter = HEIGHT_ITEM_CONVERTER;
            break;
        case 'select':
            typeConverter = SELECT_ITEM_CONVERTER;
            break;
        case 'doubleselect':
            typeConverter = DOUBLESELECT_ITEM_CONVERTER;
            break;
    }
    if (!typeConverter) {
        throw new Error(`Bad attribute type ${a.type}`);
    }
    return typeConverter;
};
export const convertToCsv = (a, i) => {
    const v = isItemValueType(i) ? i : (isItemValue(i) ? i.val : undefined);
    const typeConverter = itemConverter(a);
    return typeConverter.convertToCsv(a, v);
};
export const convertToString = (a, i) => {
    const v = isItemValueType(i) ? i : (isItemValue(i) ? i.val : undefined);
    const typeConverter = itemConverter(a);
    return typeConverter.convertToString(a, v);
};
//# sourceMappingURL=ui-item-value-converters.util.js.map