import {Attribute} from '../model/attribute.model';
import {
  AreaValue, CurrencyValue,
  DateValue, DimensionValue, DoubleSelectValue, HeightValue,
  Item,
  TableItem,
  ItemValTypes, LengthValue,
  NumberValue, SelectValue,
  StringValue,
  TextValue,
  VolumeValue, WidthValue
} from '../model/item.model';

const getItemValue = (attribute: Attribute, item: TableItem | Item): ItemValTypes => {
  const v: ItemValTypes = item[attribute.id].val;
  return v;
};
export const getItemStringValue = (attribute: Attribute, item: TableItem | Item): StringValue => {
  return getItemValue(attribute, item) as StringValue;
};
export const getItemTextValue = (attribute: Attribute, item: TableItem | Item): TextValue => {
  return getItemValue(attribute, item) as TextValue;
};
export const getItemNumberValue = (attribute: Attribute, item: TableItem | Item): NumberValue => {
  return getItemValue(attribute, item) as NumberValue;
};
export const getItemDateValue = (attribute: Attribute, item: TableItem | Item): DateValue => {
  return getItemValue(attribute, item) as DateValue;
};
export const getItemCurrencyValue = (attribute: Attribute, item: TableItem | Item): CurrencyValue => {
  return getItemValue(attribute, item) as CurrencyValue;
};
export const getItemAreaValue = (attribute: Attribute, item: TableItem | Item): AreaValue => {
  return getItemValue(attribute, item) as AreaValue;
};
export const getItemVolumeValue = (attribute: Attribute, item: TableItem | Item): VolumeValue => {
  return getItemValue(attribute, item) as VolumeValue;
};
export const getItemDimensionValue = (attribute: Attribute, item: TableItem | Item): DimensionValue => {
  return getItemValue(attribute, item) as DimensionValue;
};
export const getItemWidthValue = (attribute: Attribute, item: TableItem | Item): WidthValue => {
  return getItemValue(attribute, item) as WidthValue;
};
export const getItemHeightValue = (attribute: Attribute, item: TableItem | Item): HeightValue => {
  return getItemValue(attribute, item) as HeightValue;
};
export const getItemLengthValue = (attribute: Attribute, item: TableItem | Item): LengthValue => {
  return getItemValue(attribute, item) as LengthValue;
};
export const getItemSelectValue = (attribute: Attribute, item: TableItem | Item): SelectValue => {
  return getItemValue(attribute, item) as SelectValue;
};
export const getItemDoubleSelectValue = (attribute: Attribute, item: TableItem | Item): DoubleSelectValue => {
  return getItemValue(attribute, item) as DoubleSelectValue;
};
