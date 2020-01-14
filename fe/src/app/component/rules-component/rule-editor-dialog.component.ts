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

export interface RuleEditorDialogComponentData {
  attributes: Attribute[];
  rule: Rule;
}

export interface ItemValueOperatorAndAttributeWithId extends ItemValueOperatorAndAttribute {
  id: number;
}


@Component({
  selector: 'app-rule-editor',
  templateUrl: './rule-editor-dialog.component.html',
  styleUrls: ['./rule-editor-dialog.component.scss']
})
export class RuleEditorDialogComponent implements OnInit {

  attributes: Attribute[];
  rule: Rule;

  formGroup: FormGroup;
  validateClauses: ItemValueOperatorAndAttributeWithId[];
  whenClauses: ItemValueOperatorAndAttributeWithId[];

  formControlName: FormControl;
  formControlDescription: FormControl;

  counter: number;

  constructor(private matDialogRef: MatDialogRef<RuleEditorDialogComponent, Rule>,
              @Inject(MAT_DIALOG_DATA) data: RuleEditorDialogComponentData,
              private counterService: CounterService,
              private formBuilder: FormBuilder) {
    this.counter = -1;
    this.validateClauses = [];
    this.whenClauses = [];
    this.attributes = data.attributes;
    this.rule = data.rule;
    this.formControlName = formBuilder.control('', [Validators.required]);
    this.formControlDescription = formBuilder.control('', [Validators.required]);
    this.formGroup = formBuilder.group({
      name: this.formControlName,
      description: this.formControlDescription,
    });
    this.formGroup.setValidators([
      (c: AbstractControl): ValidationErrors | null => {
        let hasError = false;
        const validationErrors: ValidationErrors = {};
        const fg: FormGroup = (c as FormGroup);
        if (this.validateClauses.length <= 0) {
          validationErrors.missingValidateClause = true;
          hasError = true;
        } else {
          for (const validationClause of this.validateClauses) {
            if (!isItemValueOperatorAndAttributeValid(validationClause)) {
             validationErrors.badValidateClause = true;
             hasError = true;
            }
          }
        }
        if (this.whenClauses.length <= 0) {
          validationErrors.missingWhenClause = true;
          hasError = true;
        } else {
          for (const whenClause of this.whenClauses) {
            if (!isItemValueOperatorAndAttributeValid(whenClause)) {
              validationErrors.badValidateClause = true;
              hasError = true;
            }
          }
        }
        return hasError ? validationErrors : null;
      }
    ]);
  }

  ngOnInit(): void {
    if (this.rule) {
      this.formControlName.setValue(this.rule.name);
      this.formControlDescription.setValue(this.rule.description);
      if (this.rule.validateClauses) {
        this.rule.validateClauses.forEach((ruleValidateClause: ValidateClause) => {
          const ruleId: number = ruleValidateClause.id;
          const attribute: Attribute = this.attributes.find((a: Attribute) => a.id === ruleValidateClause.attributeId);
          const operator: OperatorType = ruleValidateClause.operator;
          const itemValue: Value = { attributeId: attribute.id, val: ruleValidateClause.condition} as Value;

          this.validateClauses.push({
            id: ruleId,
            attribute,
            operator,
            itemValue
          } as ItemValueOperatorAndAttributeWithId);
        });
      }
      if (this.rule.whenClauses) {
        this.rule.whenClauses.forEach((whenClause: WhenClause) => {
          const ruleId: number = whenClause.id;
          const attribute: Attribute = this.attributes.find((a: Attribute) => a.id === whenClause.attributeId);
          const operator: OperatorType = whenClause.operator;
          const itemValue: Value = { attributeId: attribute.id, val: whenClause.condition } as Value;

          this.whenClauses.push({
            id: ruleId,
            attribute,
            operator,
            itemValue
          } as ItemValueOperatorAndAttributeWithId);
        });
      }
    }
  }

  onAddRuleValidation($event: MouseEvent) {
    const attribute: Attribute = null;
    const operator: OperatorType = null;
    const itemValue: Value = null;

    this.validateClauses.push({
      id: this.counter--,
      attribute,
      operator,
      itemValue
    } as ItemValueOperatorAndAttributeWithId);
    this.formGroup.updateValueAndValidity();
  }

  onDeleteRuleValidation($event: MouseEvent, index: number, validateClause: ItemValueOperatorAndAttribute) {
    this.validateClauses.splice(index, 1);
    this.formGroup.updateValueAndValidity();
  }

  onAddRuleWhen($event: MouseEvent) {
    const attribute: Attribute = null;
    const operator: OperatorType = null;
    const itemValue: Value = null;

    this.whenClauses.push({
      id: this.counter--,
      attribute,
      operator,
      itemValue
    } as ItemValueOperatorAndAttributeWithId);
    this.formGroup.updateValueAndValidity();
  }

  onDeleteRuleWhen($event: MouseEvent, index: number, whenClause: ItemValueOperatorAndAttribute) {
    this.whenClauses.splice(index, 1);
    this.formGroup.updateValueAndValidity();
  }

  onSubmit() {
    const r: Rule = {
      id: this.rule.id,
      name: this.formControlName.value,
      description: this.formControlDescription.value,
      validateClauses: this.validateClauses.reduce((acc: ValidateClause[], g: ItemValueOperatorAndAttributeWithId) => {
        acc.push({
          id: g.id,
          attributeId: g.attribute.id,
          attributeName: g.attribute.name,
          attributeType: g.attribute.type,
          operator: g.operator,
          condition: g.itemValue.val
        } as ValidateClause);
        return acc;
      }, []),
      whenClauses: this.whenClauses.reduce((acc: WhenClause[], g: ItemValueOperatorAndAttributeWithId) => {
        acc.push({
          id: g.id,
          attributeId: g.attribute.id,
          attributeName: g.attribute.name,
          attributeType: g.attribute.type,
          operator: g.operator,
          condition: g.itemValue.val
        } as ValidateClause);
        return acc;
      }, [])
    } as Rule;
    this.matDialogRef.close(r);
  }


  onWhenClauseChange($event: ItemValueOperatorAndAttribute, index: number) {
    const i: ItemValueOperatorAndAttributeWithId = {
      id: this.whenClauses[index].id,
      ...$event as ItemValueOperatorAndAttribute } as ItemValueOperatorAndAttributeWithId;
    this.whenClauses[index] = i;
    this.formGroup.updateValueAndValidity();
  }

  onValidateClauseChange($event: ItemValueOperatorAndAttribute, index: number) {
    const i: ItemValueOperatorAndAttributeWithId = {
      id: this.validateClauses[index].id,
      ...$event as ItemValueOperatorAndAttribute } as ItemValueOperatorAndAttributeWithId;
    this.validateClauses[index] = i;
    this.formGroup.updateValueAndValidity();
  }

  onCancel($event: MouseEvent) {
      this.matDialogRef.close(null);
  }
}
