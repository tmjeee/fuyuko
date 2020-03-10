// all
export type OperatorType = 'eq' | 'not eq' | 'lt' | 'not lt' | 'gt' | 'not gt' | 'gte' | 'not gte' | 'lte' |
    'not lte' | 'empty' | 'not empty' | 'contain' | 'not contain' | 'regexp' ;
export const ALL_OPERATOR_TYPES: OperatorType[] = ['eq' , 'not eq' , 'lt' , 'not lt' , 'gt' , 'not gt' , 'gte' , 'not gte' ,
    'lte' , 'not lte' , 'empty' , 'not empty', 'contain', 'not contain', 'regexp'] ;


// string
export type StringOperatorType =  'eq' | 'not eq'| 'empty'| 'not empty'| 'contain'| 'not contain'| 'regexp';
export const STRING_OPERATOR_TYPES: OperatorType[] = [ 'eq', 'not eq', 'empty', 'not empty', 'contain', 'not contain', 'regexp'];

// text
export type TextOperatorType = 'eq'| 'not eq'| 'empty'| 'not empty'| 'contain'| 'not contain'| 'regexp';
export const TEXT_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'contain', 'not contain', 'regexp'];

// select
export type SelectOperatorType =  'eq'| 'not eq'| 'empty'| 'not empty';
export const SELECT_OPERATOR_TYPES: OperatorType[] = [ 'eq', 'not eq', 'empty', 'not empty'];

// doubleselect
export type DoubleselectOperatorType =  'eq'| 'not eq'| 'empty'| 'not empty';
export const DOUBLE_SELECT_OPERATOR_TYPES: OperatorType[] = [ 'eq', 'not eq', 'empty', 'not empty'];

// number
export type NumberOperatorType = 'eq'| 'not eq'| 'empty'| 'not empty'| 'lt'| 'not lt'| 'gt'| 'not gt'| 'lte'| 'not lte'| 'gte'| 'not gte';
export const NUMBER_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
    'not lte', 'gte', 'not gte'];

// date
export type DateOperatorType = 'eq'| 'not eq'| 'empty'| 'not empty'| 'lt'| 'not lt'| 'gt'| 'not gt'| 'lte'| 'not lte'| 'gte'| 'not gte';
export const DATE_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
    'not lte', 'gte', 'not gte'];

// currency
export type CurrencyOperatorType = 'eq'| 'not eq'| 'empty'| 'not empty'| 'lt'| 'not lt'| 'gt'| 'not gt'| 'lte'| 'not lte'| 'gte'| 'not gte';
export const CURRENCY_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
    'not lte', 'gte', 'not gte'];

// volume
export type VolumeOperatorType = 'eq'| 'not eq'| 'empty'| 'not empty'| 'lt'| 'not lt'| 'gt'| 'not gt'| 'lte'| 'not lte'| 'gte'| 'not gte';
export const VOLUME_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
    'not lte', 'gte', 'not gte'];

// area
export type AreaOperatorType = 'eq'| 'not eq'| 'empty'| 'not empty'| 'lt'| 'not lt'| 'gt'| 'not gt'| 'lte'| 'not lte'| 'gte'| 'not gte';
export const AREA_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
    'not lte', 'gte', 'not gte'];

// dimension
export type DimensionOperatorType = 'eq'| 'not eq'| 'empty'| 'not empty'| 'lt'| 'not lt'| 'gt'| 'not gt'| 'lte'| 'not lte'| 'gte'| 'not gte';
export const DIMENSION_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
    'not lte', 'gte', 'not gte'];

// width
export type WidthOperatorType = 'eq'| 'not eq'| 'empty'| 'not empty'| 'lt'| 'not lt'| 'gt'| 'not gt'| 'lte'| 'not lte'| 'gte'| 'not gte';
export const WIDTH_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
    'not lte', 'gte', 'not gte'];

// height
export type HeightOperatorType = 'eq'| 'not eq'| 'empty'| 'not empty'| 'lt'| 'not lt'| 'gt'| 'not gt'| 'lte'| 'not lte'| 'gte'| 'not gte';
export const HEIGHT_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
    'not lte', 'gte', 'not gte'];

// length
export type LengthOperatorType = 'eq'| 'not eq'| 'empty'| 'not empty'| 'lt'| 'not lt'| 'gt'| 'not gt'| 'lte'| 'not lte'| 'gte'| 'not gte';
export const LENGTH_OPERATOR_TYPES: OperatorType[] = ['eq', 'not eq', 'empty', 'not empty', 'lt', 'not lt', 'gt', 'not gt', 'lte',
    'not lte', 'gte', 'not gte'];


// ==== misc
export const OPERATORS_WITHOUT_CONFIGURATBLE_VALUES: OperatorType[] = ['empty', 'not empty'];
