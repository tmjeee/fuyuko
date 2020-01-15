import {Component, Inject, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Attribute} from '../../model/attribute.model';
import {
  OperatorType,
  AREA_OPERATOR_TYPES,
  CURRENCY_OPERATOR_TYPES,
  DATE_OPERATOR_TYPES,
  DIMENSION_OPERATOR_TYPES,
  DOUBLE_SELECT_OPERATOR_TYPES,
  HEIGHT_OPERATOR_TYPES,
  LENGTH_OPERATOR_TYPES,
  NUMBER_OPERATOR_TYPES,
  SELECT_OPERATOR_TYPES,
  STRING_OPERATOR_TYPES,
  TEXT_OPERATOR_TYPES,
  VOLUME_OPERATOR_TYPES,
  WIDTH_OPERATOR_TYPES
} from '../../model/operator.model';
import {Rule, ValidateClause, WhenClause} from '../../model/rule.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import {CounterService} from '../../service/counter-service/counter.service';
import {
  ItemValueAndAttribute,
  ItemValueOperatorAndAttribute,
  TableItemAndAttribute
} from '../../model/item-attribute.model';
import {
  AreaValue,
  CurrencyValue,
  DateValue, DimensionValue,
  DoubleSelectValue, HeightValue,
  ItemValTypes, LengthValue, NumberValue,
  SelectValue,
  StringValue,
  TableItem,
  TextValue,
  Value, VolumeValue, WidthValue
} from '../../model/item.model';
import {getItemStringValue, hasItemValue} from '../../utils/ui-item-value-getter.util';
import {HEIGHT_UNITS} from '../../model/unit.model';
import {isItemValueOperatorAndAttributeValid} from '../../utils/item-value-operator-attribute.util';
import {View} from '../../model/view.model';
import {RuleEditorComponentEvent} from './rule-editor.component';

export interface RuleEditorDialogComponentData {
  attributes: Attribute[];
  rule: Rule;
  view: View;
}

export interface ItemValueOperatorAndAttributeWithId extends ItemValueOperatorAndAttribute {
  id: number;
}


@Component({
  templateUrl: './rule-editor-dialog.component.html',
  styleUrls: ['./rule-editor-dialog.component.scss']
})
export class RuleEditorDialogComponent {

  attributes: Attribute[];
  rule: Rule;
  view: View;

  constructor(private matDialogRef: MatDialogRef<RuleEditorDialogComponent, Rule>,
              @Inject(MAT_DIALOG_DATA) data: RuleEditorDialogComponentData) {
      this.attributes = data.attributes;
      this.rule = data.rule;
      this.view = data.view;
  }


  onRuleEditorEvent($event: RuleEditorComponentEvent) {
      switch ($event.type) {
        case 'cancel':
          this.matDialogRef.close(null);
          break;
        case 'update':
          this.matDialogRef.close($event.rule);
          break;
      }
  }
}
