import {AttributeType} from './attribute.model';
import {ItemValTypes} from './item.model';
import {OperatorType} from './operator.model';
import {Status} from './status.model';

export interface CustomRule {
  id: number;
  name: string;
  description: string;
}

export interface CustomRuleForView {
  id: number;
  name: string;
  description: string;
  status: Status;
}


export interface Rule {
  id: number;
  name: string;
  status: string;
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
  condition: ItemValTypes[];
}

export interface WhenClause {
  id: number;
  attributeId: number;
  attributeName: string;
  attributeType: AttributeType;
  operator: OperatorType;
  condition: ItemValTypes[];
}
