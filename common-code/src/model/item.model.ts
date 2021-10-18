import {
  AreaUnits,
  CountryCurrencyUnits,
  DimensionUnits,
  HeightUnits,
  LengthUnits,
  VolumeUnits, WeightUnits,
  WidthUnits
} from './unit.model';
import {PartialBy} from "./types";

export type ItemSearchType = 'basic' | 'advance';

export const NUMBER_FORMAT = '0.00';
export const DATE_FORMAT = 'DD-MM-YYYY';
export const CURRENCY_FORMAT = '$0.00';
export const AREA_FORMAT = '0.00';
export const VOLUME_FORMAT = '0.00';
export const DIMENSION_FORMAT = '0.00';
export const WIDTH_FORMAT = '0.00';
export const HEIGHT_FORMAT = '0.00';
export const WEIGHT_FORMAT = '0.00';
export const LENGTH_FORMAT = '0.00';
export const SHOW_COUNTRY_CURRENCY = true;

export const MAT_DATE_FORMAT = {
  parse: {
    dateInput: DATE_FORMAT
  },
  display: {
    dateInput: DATE_FORMAT,
    monthYearLabel: 'MM-YYYY',
    dateA11yLabel: DATE_FORMAT,
    monthYearA11yLabel: 'MM-YYYY',
  }
};


export interface Item {
  id: number;
  name: string;
  description: string;
  images: ItemImage[];
  parentId?: number;
  creationDate: Date;
  lastUpdate: Date;
  values: Value[];
  // [attributeId: number]: Value;

  children: Item[];
};

export type PartialItem = PartialBy<Item, 'creationDate' | 'lastUpdate'>;


export interface TableItem {
  id: number;
  name: string;
  description: string;
  images: ItemImage[];
  parentId: number;
  depth: number;
  creationDate: Date;
  lastUpdate: Date;
  values: Value[];
  // [attributeId: number]: Value;

  rootParentId: number;
}

export interface PricedItem {
  id: number;
  name: string;
  description: string;
  images: ItemImage[];
  parentId?: number;
  creationDate: Date;
  lastUpdate: Date;
  values: Value[];
  // [attributeId: number]: Value;
  price: number;
  country: string;

  children: PricedItem[];
}

export interface TablePricedItem {
  id: number;
  name: string;
  description: string;
  images: ItemImage[];
  parentId: number;
  depth: number;
  creationDate: Date;
  lastUpdate: Date;
  [attributeId: number]: Value;
  price: number;
  country: string;

  rootParentId: number;
}

export interface ItemImage {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  primary: boolean;
}


export interface Value {
  attributeId: number;
  val?: ItemValTypes;
}

export type ItemValTypes = StringValue | TextValue | NumberValue | DateValue |
  CurrencyValue | VolumeValue | DimensionValue | AreaValue | WidthValue | LengthValue | HeightValue |
  SelectValue | DoubleSelectValue | WeightValue;

export type StringValueType = 'string';
export interface StringValue {
  type: StringValueType;
  value: string;
}

export type TextValueType = 'text';
export interface TextValue {
  type: TextValueType;
  value: string;
}

export type NumberValueType = 'number';
export interface NumberValue {
  type: NumberValueType;
  value: number;
}

export type DateValueType = 'date';
export interface DateValue {
  type: DateValueType;
  value: string;
}

export type CurrencyValueType = 'currency';
export interface CurrencyValue {
  type: CurrencyValueType;
  value: number;
  country: CountryCurrencyUnits;
}

export type VolumeValueType = 'volume';
export interface VolumeValue {
  type: VolumeValueType;
  value: number;
  unit: VolumeUnits;
}

export type DimensionValueType = 'dimension';
export interface DimensionValue {
  type: DimensionValueType;
  length: number;
  width: number;
  height: number;
  unit: DimensionUnits;
}

export type AreaValueType = 'area';
export interface AreaValue {
  type: AreaValueType;
  value: number;
  unit: AreaUnits;
}

export type WidthValueType = 'width';
export interface WidthValue {
  type: WidthValueType;
  value: number;
  unit: WidthUnits;
}

export type LengthValueType = 'length';
export interface LengthValue {
  type: LengthValueType;
  value: number;
  unit: LengthUnits;
}

export type HeightValueType = 'height';
export interface HeightValue {
  type: HeightValueType;
  value: number;
  unit: HeightUnits;
}

export type WeightValueType = 'weight';
export interface WeightValue {
  type: WeightValueType;
  value: number;
  unit: WeightUnits;
}

export type SelectValueType = 'select';
export interface SelectValue {
  type: SelectValueType;
  key?: string;
}


export type DoubleSelectValueType = 'doubleselect';
export interface DoubleSelectValue {
  type: DoubleSelectValueType;
  key1?: string;
  key2?: string;
}



