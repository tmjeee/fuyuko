import {
  AREA_FORMAT,
  AreaValue, CURRENCY_FORMAT,
  CurrencyValue, DATE_FORMAT,
  DateValue, DIMENSION_FORMAT,
  DimensionValue, DoubleSelectValue, HEIGHT_FORMAT, HeightValue,
  ItemValTypes, LENGTH_FORMAT, LengthValue, NumberValue, SelectValue,
  StringValue,
  TextValue, Value, VOLUME_FORMAT,
  VolumeValue, WIDTH_FORMAT, WidthValue
} from '../model/item.model';
import {Attribute, ATTRIBUTE_TYPES, Pair1, Pair2} from '../model/attribute.model';
import moment from 'moment';
import numeral from 'numeral';


interface ItemValueConverters {
  convertToString(a: Attribute, i: ItemValTypes): string;
}

export function isItemValue(v: (Value | ItemValTypes)): v is Value {
  const r =  (v && v.hasOwnProperty('attributeId') && v.hasOwnProperty('val'));
  return r;
}

export function isItemValueType(v: (Value | ItemValTypes)): v is ItemValTypes {
  const r =  (v && v.hasOwnProperty('type') && ATTRIBUTE_TYPES.indexOf((v as ItemValTypes).type) >= 0);
  return r;
}

abstract class AbstractItemValueConverter implements ItemValueConverters {
  abstract convertToDebugString(i: ItemValTypes): string;
  convertToString(a: Attribute, i: ItemValTypes): string {
      return this._check(a, i, (y, z) => this._convertToString(y, z));
  }
  convertToCsv(a: Attribute, i: ItemValTypes): string {
      return this._check(a, i, (y, z) => this._convertToCsv(y, z));
  }
  private _check(a: Attribute, i: ItemValTypes, callback: (a: Attribute, i: ItemValTypes) => string) {
    if (i) {
      if (a.type !== i.type) {
        throw new Error('incompatible types');
      }
      return callback(a, i);
    }
    return undefined;
  }
  protected abstract _convertToString(a: Attribute, i: ItemValTypes): string;
  protected abstract _convertToCsv(a: Attribute, i: ItemValTypes): string;
  protected abstract convertFromCsv(csv: string): ItemValTypes;
}

class StringItemValueConverter extends AbstractItemValueConverter {
  convertToDebugString(i: StringValue): string {
      return `{type: ${i.type} value: ${i.value}`;
  }
  protected _convertToString(a: Attribute, i: StringValue): string {
    return i.value;
  }
  protected _convertToCsv(a: Attribute, i: StringValue): string {
      return this._convertToString(a, i);
  }
  protected convertFromCsv(csv: string): ItemValTypes {
      return {
        type: 'string',
        value: csv,
      } as StringValue;
  }
}

class TextItemValueConverter extends AbstractItemValueConverter {
  convertToDebugString(i: TextValue): string {
    return `{type: ${i.type} value: ${i.value}}`;
  }
  protected _convertToString(a: Attribute, i: TextValue): string {
    return i.value;
  }
  protected _convertToCsv(a: Attribute, i: TextValue): string {
     return this._convertToString(a, i);
  }
  protected convertFromCsv(csv: string): ItemValTypes {
      return {
          type: 'text',
          value: csv
      } as TextValue;
  }
}

class NumberItemValueConverter extends AbstractItemValueConverter {
  convertToDebugString(i: NumberValue): string {
    return `{type: ${i.type} value: ${i.value}}`;
  }
  protected _convertToString(a: Attribute, i: NumberValue): string {
    return '' + i.value;
  }
  protected _convertToCsv(a: Attribute, i: NumberValue): string {
      return this._convertToString(a, i);
  }
  protected convertFromCsv(csv: string): NumberValue {
      return {
        type: 'number',
        value: Number(csv)
      } as NumberValue;
  }
}

class DateItemValueConverter extends AbstractItemValueConverter {
  convertToDebugString(i: DateValue): string {
    return `{type: ${i.type} value ${i.value}}`;
  }
  protected _convertToString(a: Attribute, i: DateValue): string {
    const m: moment.Moment = moment(i.value, DATE_FORMAT);
    if (a.format) {
      return m.format(a.format);
    }
    return m.format(DATE_FORMAT);
  }
  protected _convertToCsv(a: Attribute, i: DateValue): string {
      return this._convertToString(a, i);
  }
  protected convertFromCsv(csv: string): DateValue {
    const m: moment.Moment = moment(csv, DATE_FORMAT);
    const f = m.format(DATE_FORMAT);
    return {
      type: 'date',
      value: f
    } as DateValue;
  }
}

class CurrencyItemValueConverter extends AbstractItemValueConverter {
  convertToDebugString(i: CurrencyValue): string {
    return `{type: ${i.type} value: ${i.value} country: ${i.country}`;
  }
  protected _convertToString(a: Attribute, i: CurrencyValue): string {
    if (a.showCurrencyCountry) {
      return `${numeral(i.value).format(CURRENCY_FORMAT)} ${i.country ? i.country : ''}`;
    }
    return `${numeral(i.value).format(CURRENCY_FORMAT)}`;
  }
  protected _convertToCsv(a: Attribute, i: CurrencyValue): string {
    return `${numeral(i.value).format(CURRENCY_FORMAT)}|${i.country ? i.country : ''}`;
  }
  protected convertFromCsv(csv: string): CurrencyValue {
    const p: string[] = csv.split('|');
    return {
      type: 'currency',
      value: Number(numeral(p[0]).format(CURRENCY_FORMAT)),
      country: p.length > 1 && p[1] ? p[1] : '',
    } as CurrencyValue;
  }
}

class DimensionItemValueConverter extends AbstractItemValueConverter {
  convertToDebugString(i: DimensionValue): string {
    return `{type: ${i.type} width: ${i.width} length: ${i.length} height: ${i.height} unit: ${i.unit}}`;
  }
  protected _convertToString(a: Attribute, i: DimensionValue): string {
    const f: string = a.format ? a.format : DIMENSION_FORMAT;
    return `w:${numeral(i.width).format(f)} ${i.unit},
            h:${numeral(i.height).format(f)} ${i.unit}
            l:${numeral(i.length).format(f)} ${i.unit}`;
  }
  protected _convertToCsv(a: Attribute, i: DimensionValue): string {
    const f: string = a.format ? a.format : DIMENSION_FORMAT;
    return `${numeral(i.width).format(f)}|${numeral(i.height).format(f)}|${numeral(i.length).format(f)}|${i.unit}`;
  }
  protected convertFromCsv(csv: string): DimensionValue {
    const p: string[] = csv.split('|');
    return {
      type: 'dimension',
      width: p && p.length >= 1 ? p[0] : 0,
      height: p && p.length >= 2 ? p[1] : 0,
      length: p && p.length >= 3 ? p[2] : 0,
      unit:  p && p.length >= 4 ? p[3] : undefined
    } as DimensionValue;
  }
}

class AreaItemValueConverter extends AbstractItemValueConverter {
  convertToDebugString(i: AreaValue): string {
    return `{type: ${i.type} value: ${i.value} unit: ${i.unit}}`;
  }
  protected _convertToString(a: Attribute, i: AreaValue): string {
    const f: string = a.format ? a.format : AREA_FORMAT;
    return `${numeral(i.value).format(f)} ${i.unit}`;
  }
  protected _convertToCsv(a: Attribute, i: AreaValue): string {
    const f: string = a.format ? a.format : AREA_FORMAT;
    return `${numeral(i.value).format(f)}|${i.unit}`;
  }
  protected convertFromCsv(csv: string): AreaValue {
    const p: string[] = csv.split('|');
    return {
      type: 'area',
      value: Number(p[0]),
      unit: p[1]
    } as AreaValue;
  }
}

class VolumeItemValueConverter extends AbstractItemValueConverter {
  convertToDebugString(i: VolumeValue): string {
    return `{type: ${i.type} value: ${i.value} unit: ${i.unit}}`;
  }
  protected _convertToString(a: Attribute, i: VolumeValue): string {
    const f: string = a.format ? a.format : VOLUME_FORMAT;
    return `${numeral(i.value).format(f)} ${i.unit}`;
  }
  protected _convertToCsv(a: Attribute, i: VolumeValue): string {
    const f: string = a.format ? a.format : VOLUME_FORMAT;
    return `${numeral(i.value).format(f)}|${i.unit}`;
  }
  protected convertFromCsv(csv: string): VolumeValue {
    const p: string[] = csv.split('|');
    return {
      type: 'volume',
      value: Number(p[0]),
      unit: p[1]
    } as VolumeValue;
  }
}

class WidthItemValueConverter extends AbstractItemValueConverter {
  convertToDebugString(i: WidthValue): string {
    return `{type: ${i.type} value: ${i.value} unit: ${i.unit}`;
  }
  protected _convertToString(a: Attribute, i: WidthValue): string {
    const f: string = a.format ? a.format : WIDTH_FORMAT;
    return `${numeral(i.value).format(f)} ${i.unit}`;
  }
  protected _convertToCsv(a: Attribute, i: WidthValue): string {
    const f: string = a.format ? a.format : WIDTH_FORMAT;
    return `${numeral(i.value).format(f)}|${i.unit}`;
  }
  protected convertFromCsv(csv: string): WidthValue {
    const p: string[] = csv.split('|');
    return {
      type: 'width',
      value: Number(p[0]),
      unit: p[1]
    } as WidthValue;
  }
}

class LengthItemValueConverter extends AbstractItemValueConverter {
  convertToDebugString(i: LengthValue): string {
    return `{type: ${i.type} value: ${i.value} unit: ${i.unit}`;
  }
  protected _convertToString(a: Attribute, i: LengthValue): string {
    const f: string = a.format ? a.format : LENGTH_FORMAT;
    return `${numeral(i.value).format(f)} ${i.unit}`;
  }
  protected _convertToCsv(a: Attribute, i: LengthValue): string {
    const f: string = a.format ? a.format : LENGTH_FORMAT;
    return `${numeral(i.value).format(f)}|${i.unit}`;
  }
  protected convertFromCsv(csv: string): LengthValue {
    const p: string[] = csv.split('|');
    return {
      type: 'length',
      value: Number(p[0]),
      unit: p[1]
    } as LengthValue;
  }
}

class HeightItemValueConverter extends AbstractItemValueConverter {
  convertToDebugString(i: HeightValue): string {
    return `{type: ${i.type} value: ${i.value} unit: ${i.unit}}`;
  }
  protected _convertToString(a: Attribute, i: HeightValue): string {
    const f: string = a.format ? a.format : HEIGHT_FORMAT;
    return `${numeral(i.value).format(f)} ${i.unit}`;
  }
  protected _convertToCsv(a: Attribute, i: HeightValue): string {
    const f: string = a.format ? a.format : HEIGHT_FORMAT;
    return `${numeral(i.value).format(f)}|${i.unit}`;
  }
  protected convertFromCsv(csv: string): HeightValue {
    const p: string[] = csv.split('|');
    return {
      type: 'height',
      value: Number(p[0]),
      unit: p[1]
    } as HeightValue;
  }
}

class SelectItemValueConverter extends AbstractItemValueConverter {
  convertToDebugString(i: SelectValue): string {
    return `{type: ${i.type} key: ${i.key}}`;
  }
  protected _convertToString(a: Attribute, i: SelectValue): string {
    const p: Pair1 = a.pair1.find((pp: Pair1) => pp.key === i.key);
    return `${p ? p.value : ''}`;
  }
  protected _convertToCsv(a: Attribute, i: SelectValue): string {
    return this._convertToString(a, i);
  }
  protected convertFromCsv(csv: string): SelectValue {
    return {
      type: 'select',
      key: csv
    } as SelectValue;
  }
}

class DoubleSelectItemValueConverter extends AbstractItemValueConverter {
  convertToDebugString(i: DoubleSelectValue): string {
    return `{type: ${i.type} key1: ${i.key1} key2: ${i.key2}}`;
  }
  protected _convertToString(a: Attribute, i: DoubleSelectValue): string {
    const p1: Pair1 = a.pair1.find((p: Pair1) => p.key === i.key1);
    const p2: Pair2 = a.pair2.find((p: Pair2) => p.key2 === i.key2);
    return `${p1 ? p1.value : ''} - ${p2 ? p2.value : ''}`;
  }
  protected _convertToCsv(a: Attribute, i: DoubleSelectValue): string {
    return this._convertToString(a, i);
  }
  protected convertFromCsv(csv: string): DoubleSelectValue {
    const p: string[] = csv.split('|');
    return {
      type: 'doubleselect',
      key1: p[0],
      key2: p[1]
    } as DoubleSelectValue;
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

export const itemConverter = (a: Attribute): AbstractItemValueConverter => {
  return itemConverterByType(a.type);
};

export const itemConverterByType = (t: string): AbstractItemValueConverter => {
  let typeConverter: AbstractItemValueConverter;
  switch (t) {
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
    throw new Error(`Bad attribute type ${t}`);
  }
  return typeConverter;
};

export const convertToCsv = (a: Attribute, i: Value | ItemValTypes): string => {
  const v: ItemValTypes = isItemValueType(i) ? i : (isItemValue(i) ? i.val : undefined);
  const typeConverter: AbstractItemValueConverter = itemConverter(a);
  return typeConverter.convertToCsv(a, v);
};

export const convertToString = (a: Attribute, i: Value | ItemValTypes): string => {
  const v: ItemValTypes = isItemValueType(i) ? i : (isItemValue(i) ? i.val : undefined);
  const typeConverter: AbstractItemValueConverter = itemConverter(a);
  return typeConverter.convertToString(a, v);
};

export const convertToDebugStrings = (i: Value[] | ItemValTypes[]): string => {
  let s = ``;
  for (const x of i) {
    s = s + convertToDebugString(x);
  }
  return s;
}

export const convertToDebugString = (i: Value | ItemValTypes): string => {
  const v: ItemValTypes = isItemValueType(i) ? i : (isItemValue(i) ? i.val : undefined);
  const typeConverter: AbstractItemValueConverter = itemConverterByType(v.type);
  return typeConverter.convertToDebugString(v);
};


