import {Item, TableItem, Value} from './item.model';
import {Attribute} from './attribute.model';
import {OperatorType} from './operator.model';

export interface TableItemAndAttribute {
  attribute: Attribute;
  tableItem: TableItem;
}

export interface ItemAndAttributes {
  attributes: Attribute[];
  item: Item;
}

export interface ItemValueAndAttribute {
  itemValue: Value;
  attribute: Attribute;
}

export interface ItemValueOperatorAndAttribute {
  itemValue: Value;
  operator: OperatorType;
  attribute: Attribute;
}


export interface TableItemAndAttributeSet {
  attributes: Attribute[];
  tableItems: TableItem[];
}

export interface ItemAndAttributeSet {
  attributes: Attribute[];
  items: Item[];
}

