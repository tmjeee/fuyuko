import {
  AreaUnits,
  CountryCurrencyUnits,
  DimensionUnits,
  HeightUnits,
  LengthUnits,
  VolumeUnits, WeightUnits,
  WidthUnits
} from './unit.model';

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
  parentId: number;
  creationDate: Date;
  lastUpdate: Date;
  [attributeId: number]: Value;

  children: Item[];
}


export interface TableItem {
  id: number;
  name: string;
  description: string;
  images: ItemImage[];
  parentId: number;
  depth: number;
  creationDate: Date;
  lastUpdate: Date;
  [attributeId: number]: Value;

  rootParentId: number;
}

export interface PricedItem {
  id: number;
  name: string;
  description: string;
  images: ItemImage[];
  parentId: number;
  creationDate: Date;
  lastUpdate: Date;
  [attributeId: number]: Value;
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
  val: ItemValTypes;
}

export type ItemValTypes = StringValue | TextValue | NumberValue | DateValue |
  CurrencyValue | VolumeValue | DimensionValue | AreaValue | WidthValue | LengthValue | HeightValue |
  SelectValue | DoubleSelectValue | WeightValue;

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
  country: CountryCurrencyUnits;
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

export interface WeightValue {
  type: 'weight';
  value: number;
  unit: WeightUnits;
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



