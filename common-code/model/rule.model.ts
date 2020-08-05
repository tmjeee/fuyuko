import {AttributeType} from './attribute.model';
import {ItemValTypes} from './item.model';
import {OperatorType} from './operator.model';
import {Status} from "./status.model";

export type RuleLevel = 'WARN' | 'ERROR';
export const RULE_LEVELS: RuleLevel[] = ['WARN', 'ERROR'];

export interface Rule {
  id: number;
  name: string;
  status: Status;
  description: string;
  level: RuleLevel;
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
