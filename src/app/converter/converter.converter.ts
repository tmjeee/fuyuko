import {Value} from '../model/item.model';

export interface Converter {
  serialize(v: Value): string;
  deserialize(s: string): Value;
}
