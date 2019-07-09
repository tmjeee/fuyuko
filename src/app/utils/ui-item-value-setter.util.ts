import {Attribute} from '../model/attribute.model';
import {
  AreaValue,
  CurrencyValue,
  DateValue, DimensionValue, DoubleSelectValue, HeightValue,
  TableItem,
  ItemValTypes, LengthValue,
  NumberValue, SelectValue,
  StringValue,
  TextValue,
  Value, VolumeValue, WidthValue, Item
} from '../model/item.model';
import {AreaUnits, CountryCurrencyUnits, DimensionUnits, HeightUnits, LengthUnits, VolumeUnits, WidthUnits} from '../model/unit.model';

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

export function addAttributesToItem(i: Item | TableItem, attributes: Attribute[]) {
  attributes.forEach((a: Attribute) => {
    const val: Value = { attributeId: a.id, val: undefined } as Value;
    i[a.id] = val;
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
  });
}

function setItemValue(attribute: Attribute, value: Value, val: ItemValTypes) {
  value.val = val;
}


export function setItemStringValue(attribute: Attribute, value: Value, val: string) {
  setItemValue(attribute, value, {
    type: 'string',
    value: val
  } as StringValue);
}

export function setItemTextValue(attribute: Attribute, value: Value, val: string) {
  setItemValue(attribute, value, {
    type: 'text',
    value: val
  } as TextValue);
}

export function setItemNumberValue(attribute: Attribute, value: Value, val: number) {
  setItemValue(attribute, value , {
    type: 'number',
    value: val
  } as NumberValue);
}

export function setItemDateValue(attribute: Attribute, value: Value, val: string) {
  setItemValue(attribute, value, {
    type: 'date',
    value: val,
    format: 'DD-MM-YYYY'
  } as DateValue);
}

export function setItemCurrencyValue(attribute: Attribute, value: Value, val: number, country?: CountryCurrencyUnits) {
  setItemValue(attribute, value, {
    type: 'currency',
    value: val,
    country
  } as CurrencyValue);
}

export function setItemAreaValue(attribute: Attribute, value: Value, val: number, unit: AreaUnits) {
  setItemValue(attribute, value, {
    type: 'area',
    value: val,
    unit
  } as AreaValue);
}

export function setItemVolumeValue(attribute: Attribute, value: Value, val: number, unit: VolumeUnits) {
  setItemValue(attribute, value, {
    type: 'volume',
    value: val,
    unit
  } as VolumeValue);
}

export function setItemDimensionValue(attribute: Attribute, value: Value, width: number, length: number, height: number,
                                      unit: DimensionUnits) {
  setItemValue(attribute, value, {
    type: 'dimension',
    width,
    length,
    height,
    unit
  } as DimensionValue);
}

export function setItemWidthValue(attribute: Attribute, value: Value, val: number, unit: WidthUnits) {
  setItemValue(attribute, value, {
    type: 'width',
    value: val,
    unit
  } as WidthValue);
}

export function setItemHeightValue(attribute: Attribute, value: Value, val: number, unit: HeightUnits) {
  setItemValue(attribute, value, {
    type: 'height',
    value: val,
    unit
  } as HeightValue);
}

export function setItemLengthValue(attribute: Attribute, value: Value, val: number, unit: LengthUnits) {
  setItemValue(attribute, value, {
    type: 'length',
    value: val,
    unit
  } as LengthValue);
}

export function setItemSelectValue(attribute: Attribute, value: Value, key1: string) {
  setItemValue(attribute, value, {
    type: 'select',
    key: key1
  } as SelectValue);
}

export function setItemDoubleSelectValue(attribute: Attribute, value: Value, key1: string, key2: string) {
  setItemValue(attribute, value, {
    type: 'doubleselect',
    key1,
    key2
  } as DoubleSelectValue);
}
