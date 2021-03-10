
export const ATTRIBUTE_TYPES = [
  'string', 'text', 'number', 'date', 'currency', 'volume',
  'dimension', 'area', 'width', 'length', 'height', 'select', 'doubleselect', 'weight'];

export type AttributeType = 'string' | 'text' | 'number' | 'date' |
                            'currency' | 'volume' |
                            'dimension' | 'area' | 'width' | 'length' | 'height' |
                            'select' | 'doubleselect' | 'weight';

export interface Pair1 {
  id: number;
  key: string;
  value: string;
}

export interface Pair2 {
  id: number;
  key1: string;
  key2: string;
  value: string;
}


export interface Attribute {
  id: number;
  type: AttributeType;
  name: string;
  description: string;
  creationDate: Date;
  lastUpdate: Date;
  format?: string; // applicable to: number, date, time, datetime, currency, volume, dimension, area,width, length, height, weight
  showCurrencyCountry?: boolean; // applicable to: currency
  pair1?: Pair1[]; // for single select & double select
  pair2?: Pair2[]; // for double select
}

export interface StringAttribute extends Attribute {
  id: number,
  name: string,
  description: string,
  type: 'string'
}


