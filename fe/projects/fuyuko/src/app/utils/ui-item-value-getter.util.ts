import {Attribute} from '@fuyuko-common/model/attribute.model';
import {
  AreaValue, CurrencyValue,
  DateValue, DimensionValue, DoubleSelectValue, HeightValue,
  Item,
  TableItem,
  ItemValTypes, LengthValue,
  NumberValue, SelectValue,
  StringValue,
  TextValue,
  VolumeValue, WidthValue, Value
} from '@fuyuko-common/model/item.model';
import {getItemValue} from '@fuyuko-common/shared-utils/item.util';

export const hasItemValues = (attribute: Attribute, values: Value[]): boolean => {
  let b = true;
  for (const value of values) {
    b = b && hasItemValue(attribute, value);
  }
  return b;
};


export const hasItemValue = (attribute: Attribute, value: Value): boolean => {
    if (!value || !value.val) {
      return false;
    }
    switch (attribute.type) {
      case 'string':
        return (!!(value.val as StringValue).value);
      case 'text':
        return  (!!(value.val as TextValue).value);
      case 'date':
        return (!!(value.val as DateValue).value);
      case 'number':
        return (!Number.isNaN(Number((value.val as NumberValue).value)));
      case 'currency':
        return (!Number.isNaN(Number((value.val as CurrencyValue).value)) && (!!(value.val as CurrencyValue).country));
      case 'area':
        return (!Number.isNaN(Number((value.val as AreaValue).value)) && (!!(value.val as AreaValue).unit));
      case 'volume':
        return (!Number.isNaN(Number((value.val as VolumeValue).value)) && (!!(value.val as VolumeValue).unit));
      case 'dimension':
        return (
            (!Number.isNaN(Number((value.val as DimensionValue).height))) &&
            (!Number.isNaN(Number((value.val as DimensionValue).width))) &&
            (!Number.isNaN(Number((value.val as DimensionValue).length))) &&
            (!!(value.val as DimensionValue).unit)
        );
      case 'width':
        return (!Number.isNaN(Number((value.val as WidthValue).value)) && (!!(value.val as WidthValue).unit));
      case 'height':
        return (!Number.isNaN(Number((value.val as HeightValue).value)) && (!!(value.val as HeightValue).unit));
      case 'length':
        return (!Number.isNaN(Number((value.val as LengthValue).value)) && (!!(value.val as LengthValue).unit));
      case 'select':
        return  (!!(value.val as SelectValue).key);
      case 'doubleselect':
        return  (
            (!!(value.val as DoubleSelectValue).key1) &&
            (!!(value.val as DoubleSelectValue).key2)
        );
    }
    return false;
};

const internalGetItemValue = (attribute: Attribute, item: TableItem | Item): ItemValTypes | undefined => {
  const i: Value | undefined = getItemValue(item, attribute.id);
  const v: ItemValTypes | undefined = i ? i.val : undefined;
  return v;
};
export const getItemStringValue = (attribute: Attribute, item: TableItem | Item): StringValue => {
  return internalGetItemValue(attribute, item) as StringValue;
};
export const getItemTextValue = (attribute: Attribute, item: TableItem | Item): TextValue => {
  return internalGetItemValue(attribute, item) as TextValue;
};
export const getItemNumberValue = (attribute: Attribute, item: TableItem | Item): NumberValue => {
  return internalGetItemValue(attribute, item) as NumberValue;
};
export const getItemDateValue = (attribute: Attribute, item: TableItem | Item): DateValue => {
  return internalGetItemValue(attribute, item) as DateValue;
};
export const getItemCurrencyValue = (attribute: Attribute, item: TableItem | Item): CurrencyValue => {
  return internalGetItemValue(attribute, item) as CurrencyValue;
};
export const getItemAreaValue = (attribute: Attribute, item: TableItem | Item): AreaValue => {
  return internalGetItemValue(attribute, item) as AreaValue;
};
export const getItemVolumeValue = (attribute: Attribute, item: TableItem | Item): VolumeValue => {
  return internalGetItemValue(attribute, item) as VolumeValue;
};
export const getItemDimensionValue = (attribute: Attribute, item: TableItem | Item): DimensionValue => {
  return internalGetItemValue(attribute, item) as DimensionValue;
};
export const getItemWidthValue = (attribute: Attribute, item: TableItem | Item): WidthValue => {
  return internalGetItemValue(attribute, item) as WidthValue;
};
export const getItemHeightValue = (attribute: Attribute, item: TableItem | Item): HeightValue => {
  return internalGetItemValue(attribute, item) as HeightValue;
};
export const getItemLengthValue = (attribute: Attribute, item: TableItem | Item): LengthValue => {
  return internalGetItemValue(attribute, item) as LengthValue;
};
export const getItemSelectValue = (attribute: Attribute, item: TableItem | Item): SelectValue => {
  return internalGetItemValue(attribute, item) as SelectValue;
};
export const getItemDoubleSelectValue = (attribute: Attribute, item: TableItem | Item): DoubleSelectValue => {
  return internalGetItemValue(attribute, item) as DoubleSelectValue;
};
