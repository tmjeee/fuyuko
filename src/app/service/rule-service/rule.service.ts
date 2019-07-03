import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Rule, ValidateClause, WhenClause} from 'src/app/model/rule.model';
import {StringValue} from '../../model/item.model';

const ALL_RULES: Rule[] = [
  { id: 1, name: 'Rule #1', description: 'Rule #1 Description',
    validateClauses: [
      { id: 2, attributeId: 1, attributeName: 'string attribute', attributeType: 'string', operator: 'eq',
        condition: { type: 'string', value: 'aaaa'} as StringValue} as ValidateClause
    ],
    whenClauses: [
      { id: 3, attributeId: 1, attributeName: 'string attribute', attributeType: 'string', operator: 'eq',
        condition: { type: 'string', value: 'aaaa'} as StringValue} as WhenClause
    ]
  } as Rule,
];

@Injectable()
export class RuleService {

  count: number = ALL_RULES.length;


  getAllRulesByView(viewId: number): Observable<Rule[]> {
    return of(ALL_RULES);
  }

  addRule(rule: Rule): Observable<Rule> {
    console.log('******* add rule', rule);
    rule.id = this.count++;
    ALL_RULES.push(rule);
    return of(rule);
  }

  updateRule(rule: Rule): Observable<Rule> {
    console.log('******* update rule', rule);
    const index = ALL_RULES.findIndex((r: Rule) => r.id === rule.id);
    if (index !== -1) {
      ALL_RULES.splice(index, 1, rule);
    }
    return of(rule);
  }

  deleteRule(rule: Rule): Observable<Rule> {
    console.log('******* delete rule', rule);
    const index = ALL_RULES.findIndex((r: Rule) => r.id === rule.id);
    if (index !== -1) {
      ALL_RULES.splice(index, 1);
    }
    return of(rule);
  }
}
