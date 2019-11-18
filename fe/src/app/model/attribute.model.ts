
export const ATTRIBUTE_TYPES = [
  'string', 'text', 'number', 'date', 'currency', 'volume',
  'dimension', 'area', 'width', 'length', 'height', 'select', 'doubleselect'];

export type AttributeType = 'string' | 'text' | 'number' | 'date' |
                            'currency' | 'volume' |
                            'dimension' | 'area' | 'width' | 'length' | 'height' |
                            'select' | 'doubleselect';

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
  format?: string; // applicable to: number, date, time, datetime, currency, volume, dimension, area,width, length, height
  showCurrencyCountry?: boolean; // applicable to: currency
  pair1?: Pair1[]; // for single select & double select
  pair2?: Pair2[]; // for double select
}


export interface Attribute2 {
  id: number;
  type: string;
  name: string;
  description: string;
  metadatas: Metadata2[];
}

export interface Metadata2 {
  id: number;
  name: string;
  entries: MetadataEntry2[];
}

export interface MetadataEntry2 {
  id: number;
  key: string;
  value: string;
}

