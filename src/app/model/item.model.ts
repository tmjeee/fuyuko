import {AttributeType} from './attribute.model';
import {AreaUnits, DimensionUnits, HeightUnits, LengthUnits, VolumeUnits, WidthUnits} from './unit.model';

export const DATE_FORMAT = 'DD-MM-YYYY';
export const CURRENCY_FORMAT = '$0.00';
export const AREA_FORMAT = '0.00';
export const VOLUME_FORMAT = '0.00';
export const DIMENSION_FORMAT = '0.00';
export const WIDTH_FORMAT = '0.00';
export const HEIGHT_FORMAT = '0.00';
export const LENGTH_FORMAT = '0.00';


export interface Item {
  id: number;
  name: string;
  description: string;
  images: string[];
  parentId: number;
  [attributeId: number]: Value;
  children: Item[];
}

export interface TableItem {
  id: number;
  name: string;
  description: string;
  images: string[];
  rootParentId: number;
  parentId: number;
  depth: number;
  [attributeId: number]: Value;
}

export interface Value {
  attributeId: number;
  val: ItemValTypes;
}

export type ItemValTypes = StringValue | TextValue | NumberValue | DateValue |
  CurrencyValue | VolumeValue | DimensionValue | AreaValue | WidthValue | LengthValue | HeightValue |
  SelectValue | DoubleSelectValue;

export interface StringValue {
  type: 'string';
  value: string;
}

export interface TextValue {
  type: 'text';
  value: string;
}

export interface NumberValue {
  type: 'number';
  value: number;
}

export interface DateValue {
  type: 'date';
  value: string;
}

export interface CurrencyValue {
  type: 'currency';
  value: number;
  country: string;
}

export interface VolumeValue {
  type: 'volume';
  value: number;
  unit: VolumeUnits;
}

export interface DimensionValue {
  type: 'dimension';
  length: number;
  width: number;
  height: number;
  unit: DimensionUnits;
}

export interface AreaValue {
  type: 'area';
  value: number;
  unit: AreaUnits;
}

export interface WidthValue {
  type: 'width';
  value: number;
  unit: WidthUnits;
}

export interface LengthValue {
  type: 'length';
  value: number;
  unit: LengthUnits;
}

export interface HeightValue {
  type: 'height';
  value: number;
  unit: HeightUnits;
}

export interface SelectValue {
  type: 'select';
  key: string;
}

export interface DoubleSelectValue {
  type: 'doubleselect';
  key1: string;
  key2: string;
}



