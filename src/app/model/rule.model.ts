import {AttributeType} from './attribute.model';
import {ItemValTypes} from './item.model';

export type OperatorType = 'eq' | 'not eq' | 'lt' | 'not lt' | 'gt' | 'not gt' | 'gte' | 'not gte' | 'lte' |
  'not lte' | 'empty' | 'not empty' ;

export const ALL_OPERATOR_TYPES: OperatorType[] = ['eq' , 'not eq' , 'lt' , 'not lt' , 'gt' , 'not gt' , 'gte' , 'not gte' ,
  'lte' , 'not lte' , 'empty' , 'not empty'] ;

export const STRING_OPERATOR_TYPES: OperatorType[] = [ 'eq', 'not eq', 'empty', 'not empty'];
export const TEXT_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty'];
export const SELECT_OPERATOR_TYPES: OperatorType[] = [ 'eq', 'not eq', 'empty', 'not empty'];
export const DOUBLE_SELECT_OPERATOR_TYPES: OperatorType[] = [ 'eq', 'not eq', 'empty', 'not empty'];
export const NUMBER_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
  'not lte', 'gte', 'not gte'];
export const DATE_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
  'not lte', 'gte', 'not gte'];
export const CURRENCY_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
  'not lte', 'gte', 'not gte'];
export const VOLUME_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
  'not lte', 'gte', 'not gte'];
export const AREA_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
  'not lte', 'gte', 'not gte'];
export const DIMENSION_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
  'not lte', 'gte', 'not gte'];
export const WIDTH_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
  'not lte', 'gte', 'not gte'];
export const HEIGHT_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
  'not lte', 'gte', 'not gte'];
export const LENGTH_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
  'not lte', 'gte', 'not gte'];

export interface Rule {
  id: number;
  name: string;
  description: string;
  validateClauses: ValidateClause[];
  whenClauses: WhenClause[];
}

export interface ValidateClause {
  id: number;
  attributeId: number;
  attributeName: string;
  attributeType: AttributeType;
  operator: OperatorType;
  condition: ItemValTypes;
}

export interface WhenClause {
  id: number;
  attributeId: number;
  attributeName: string;
  attributeType: AttributeType;
  operator: OperatorType;
  condition: ItemValTypes;
}
