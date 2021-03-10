import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Rule} from '@fuyuko-common/model/rule.model';
import { MatDialog} from '@angular/material/dialog';
import {Attribute} from '@fuyuko-common/model/attribute.model';

export interface RulesTableComponentEvent {
  type: 'add' | 'edit' | 'delete' | 'enable' | 'disable' ;
  rule: Rule; // available for all types except for 'add'
}

@Component({
  selector: 'app-rules-table' ,
  templateUrl: './rules-table.component.html',
  styleUrls: ['./rules-table.component.scss']
})
export class RulesTableComponent {
  counter: number;

  @Input() attributes: Attribute[];
  @Input() rules: Rule[];
  @Output() events: EventEmitter<RulesTableComponentEvent>;

  constructor(private matDialog: MatDialog) {
    this.rules = [];
    this.attributes = [];
    this.counter = -1;
    this.events = new EventEmitter();
  }

  onDeleteRule($event: MouseEvent, rule: Rule) {
    $event.stopImmediatePropagation();
    $event.preventDefault();
    this.events.emit({
      type: 'delete',
      rule: {...rule},
    } as RulesTableComponentEvent);
  }

  onExternalEdit($event: MouseEvent, rule: Rule) {
    this.events.emit({
      type: 'edit',
      rule: {...rule}
    } as RulesTableComponentEvent);
  }


  onAddRule($event: MouseEvent) {
    this.events.emit({
      type: 'add',
      rule: null,
    } as RulesTableComponentEvent);
  }

  findAttribute(attributeId: number): Attribute {
    return this.attributes.find((a: Attribute) => a.id === attributeId);
  }

  onEnableRule($event: MouseEvent, rule: Rule) {
    $event.stopImmediatePropagation();
    $event.preventDefault();
    this.events.emit({
        type: 'enable',
        rule
      } as RulesTableComponentEvent);
  }

  onDisableRule($event: MouseEvent, rule: Rule) {
    $event.stopImmediatePropagation();
    $event.preventDefault();
    this.events.emit({
      type: 'disable',
      rule
    } as RulesTableComponentEvent);
  }

  isEnabled(rule: Rule) {
    return rule.status === 'ENABLED';
  }

  isDisabled(rule: Rule) {
    return rule.status === 'DISABLED';
  }
}
