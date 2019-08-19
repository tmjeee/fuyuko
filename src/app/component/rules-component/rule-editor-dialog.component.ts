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
import {ItemValueAndAttribute, TableItemAndAttribute} from '../../model/item-attribute.model';
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
import {getItemStringValue} from '../../utils/ui-item-value-getter.util';
import {HEIGHT_UNITS} from '../../model/unit.model';

export interface RuleEditorDialogComponentData {
  attributes: Attribute[];
  rule: Rule;
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
  formArrayValidateClauses: FormArray;
  formArrayWhenClauses: FormArray;

  formControlName: FormControl;
  formControlDescription: FormControl;


  constructor(private matDialogRef: MatDialogRef<RuleEditorDialogComponent, Rule>,
              @Inject(MAT_DIALOG_DATA) data: RuleEditorDialogComponentData,
              private counterService: CounterService,
              private formBuilder: FormBuilder) {
    this.attributes = data.attributes;
    this.rule = data.rule;
    this.formControlName = formBuilder.control('', [Validators.required]);
    this.formControlDescription = formBuilder.control('', [Validators.required]);
    this.formArrayValidateClauses = formBuilder.array([]);
    this.formArrayWhenClauses = formBuilder.array([]);
    this.formGroup = formBuilder.group({
      name: this.formControlName,
      description: this.formControlDescription,
      validateClauses: this.formArrayValidateClauses,
      whenClauses: this.formArrayWhenClauses
    });
    this.formGroup.setValidators([
      (c: AbstractControl): ValidationErrors | null => {
        const fg: FormGroup = (c as FormGroup);
        if ((fg.controls.validateClauses && (fg.controls.validateClauses as FormArray)).length <= 0 ||
            (fg.controls.whenClauses && (fg.controls.whenClauses as FormArray)).length <= 0) {
          return { missing: true };
        }
        return null;
      }
    ]);
  }

  ngOnInit(): void {
    if (this.rule) {
      this.formControlName.setValue(this.rule.name);
      this.formControlDescription.setValue(this.rule.description);
      if (this.rule.validateClauses) {
        this.rule.validateClauses.forEach((validateClause: ValidateClause) => {
          const attribute: Attribute = this.attributes.find((a: Attribute) => a.id === validateClause.attributeId);
          const validateClauseFormGroup: FormGroup = (this.formBuilder.group({
            id: this.formBuilder.control(validateClause.id),
            attribute: this.formBuilder.control(attribute, [Validators.required]),
            operator: this.formBuilder.control(validateClause.operator, [Validators.required]),
            condition: this.formBuilder.control(validateClause.condition, [Validators.required])
          }));
          this.updateOperatorsAndConditions(
            attribute,
            validateClause.operator,
            validateClause.condition,
            validateClauseFormGroup as FormGroup);
          this.formArrayValidateClauses.push(validateClauseFormGroup);
        });
      }
      if (this.rule.whenClauses) {
        this.rule.whenClauses.forEach((whenClause: WhenClause) => {
          const attribute: Attribute = this.attributes.find((a: Attribute) => a.id === whenClause.attributeId);
          const whenClauseFormGroup: FormGroup = (this.formBuilder.group({
            id: this.formBuilder.control(whenClause.id),
            attribute: this.formBuilder.control(attribute, [Validators.required]),
            operator: this.formBuilder.control(whenClause.operator, [Validators.required]),
            condition: this.formBuilder.control(whenClause.condition, [Validators.required])
          }));
          this.updateOperatorsAndConditions(
            attribute,
            whenClause.operator,
            whenClause.condition,
            whenClauseFormGroup as FormGroup);
          this.formArrayWhenClauses.push(whenClauseFormGroup);
        });
      }
    }
  }

  onAddRuleValidation($event: MouseEvent) {
    this.formArrayValidateClauses.push(this.formBuilder.group({
      id: this.counterService.nextNegativeNumber(),
      attribute: this.formBuilder.control('', [Validators.required]),
      operator: this.formBuilder.control('', [Validators.required]),
      condition: this.formBuilder.control('', [Validators.required])
    }));
  }

  onDeleteRuleValidation($event: MouseEvent, formGroupValidateClause: AbstractControl) {
    const index = this.formArrayValidateClauses.controls.findIndex((g: FormGroup) => {
      return g.controls.id.value === (formGroupValidateClause as FormGroup).controls.id.value;
    });
    if (index !== -1) {
      this.formArrayValidateClauses.removeAt(index);
    }
  }

  onAddRuleWhen($event: MouseEvent) {
    this.formArrayWhenClauses.push(this.formBuilder.group({
      id: this.counterService.nextNegativeNumber(),
      attribute: this.formBuilder.control('', [Validators.required]),
      operator: this.formBuilder.control('', [Validators.required]),
      condition: this.formBuilder.control('', [Validators.required])
    }));
  }

  onDeleteRuleWhen($event: MouseEvent, formGroupWhenClause: AbstractControl) {
    const index = this.formArrayWhenClauses.controls.findIndex((g: FormGroup) => {
      return g.controls.id.value === (formGroupWhenClause as FormGroup).controls.id.value;
    });
    if (index !== -1) {
      this.formArrayWhenClauses.removeAt(index);
    }
  }

  onSubmit() {
    const r: Rule = {
      id: this.rule.id,
      name: this.formControlName.value,
      description: this.formControlDescription.value,
      validateClauses: this.formArrayValidateClauses.controls.reduce((acc: ValidateClause[], g: FormGroup) => {
        acc.push({
          id: g.controls.id.value,
          attributeId: g.controls.attribute.value.id,
          attributeName: g.controls.attribute.value.name,
          attributeType: g.controls.attribute.value.type,
          operator: g.controls.operator.value,
          condition: (g as any).itemValueAndAttribute.itemValue.val
        } as ValidateClause);
        return acc;
      }, []),
      whenClauses: this.formArrayWhenClauses.controls.reduce((acc: WhenClause[], g: FormGroup) => {
        acc.push({
          id: g.controls.id.value,
          attributeId: g.controls.attribute.value.id,
          attributeName: g.controls.attribute.value.name,
          attributeType: g.controls.attribute.value.type,
          operator: g.controls.operator.value,
          condition: (g as any).itemValueAndAttribute.itemValue.val
        } as ValidateClause);
        return acc;
      }, [])
    } as Rule;
    this.matDialogRef.close(r);
  }

  onWhenAttributeChanged($event: MatSelectChange, formGroupWhenClause: AbstractControl) {
    const attribute: Attribute = $event.value;
    this._onWhenAttributeChanged(attribute, formGroupWhenClause);
  }
  _onWhenAttributeChanged(attribute: Attribute, formGroupWhenClause: AbstractControl) {
    this.updateOperatorsAndConditions(attribute, null, null, formGroupWhenClause as FormGroup);
  }

  onValidateAttributeChanged($event: MatSelectChange, formGroupValidateClause: AbstractControl) {
    const attribute: Attribute = $event.value;
    this._onValidateAttributeChanged(attribute, formGroupValidateClause);
  }
  _onValidateAttributeChanged(attribute: Attribute, formGroupValidateClause: AbstractControl) {
    this.updateOperatorsAndConditions(attribute, null, null, formGroupValidateClause as FormGroup);
  }

  private updateOperatorsAndConditions(attribute: Attribute, operator: OperatorType, condition: ItemValTypes, formGroup: FormGroup) {
    (formGroup.get('operator')).setValue(operator ? operator : '');
    (formGroup.get('condition')).setValue(condition ? condition : '');
    switch (attribute.type) {
      case 'string':
        (formGroup as any).operators = STRING_OPERATOR_TYPES;
        (formGroup as any).itemValueAndAttribute = {
          attribute,
          itemValue: {
            attributeId: attribute.id,
            val: condition ? condition : {
              type: 'string',
              value: ''
            } as StringValue
          } as Value,
        } as ItemValueAndAttribute;
        break;
      case 'text':
        (formGroup as any).operators = TEXT_OPERATOR_TYPES;
        (formGroup as any).itemValueAndAttribute = {
          attribute,
          itemValue: {
            attributeId: attribute.id,
            val: condition ? condition : {
              type: 'text',
              value: ''
            } as TextValue
          } as Value
        } as ItemValueAndAttribute;
        break;
      case 'number':
        (formGroup as any).operators = NUMBER_OPERATOR_TYPES;
        (formGroup as any).itemValueAndAttribute = {
          attribute,
          itemValue: {
            attributeId: attribute.id,
            val: condition ? condition : {
              type: 'number',
              value: undefined,
            } as NumberValue
          } as Value
        } as ItemValueAndAttribute;
        break;
      case 'date':
        (formGroup as any).operators = DATE_OPERATOR_TYPES;
        (formGroup as any).itemValueAndAttribute = {
          attribute,
          itemValue: {
            attributeId: attribute.id,
            val: condition ? condition : {
              type: 'date',
              value: ''
            } as DateValue
          } as Value
        } as ItemValueAndAttribute;
        break;
      case 'currency':
        (formGroup as any).operators = CURRENCY_OPERATOR_TYPES;
        (formGroup as any).itemValueAndAttribute = {
          attribute,
          itemValue: {
            attributeId: attribute.id,
            val: condition ? condition : {
              type: 'currency',
              value: undefined,
              country: undefined
            } as CurrencyValue
          } as Value
        } as ItemValueAndAttribute;
        break;
      case 'area':
        (formGroup as any).operators = AREA_OPERATOR_TYPES;
        (formGroup as any).itemValueAndAttribute = {
          attribute,
          itemValue: {
            attributeId: attribute.id,
            val: condition ? condition : {
              type: 'area',
              value: undefined,
              unit: 'cm2'
            } as AreaValue
          } as Value,
        } as ItemValueAndAttribute;
        break;
      case 'dimension':
        (formGroup as any).operators = DIMENSION_OPERATOR_TYPES;
        (formGroup as any).itemValueAndAttribute = {
          attribute,
          itemValue: {
            attributeId: attribute.id,
            val: condition ? condition : {
              type: 'dimension',
              unit: undefined,
              width: undefined,
              height: undefined,
              length: undefined
            } as DimensionValue
          } as Value
        } as ItemValueAndAttribute;
        break;
      case 'volume':
        (formGroup as any).operators = VOLUME_OPERATOR_TYPES;
        (formGroup as any).itemValueAndAttribute = {
          attribute,
          itemValue: {
            attributeId: attribute.id,
            val: condition ? condition : {
              type: 'volume',
              value: undefined,
              unit: undefined
            } as VolumeValue
          } as Value
        } as ItemValueAndAttribute;
        break;
      case 'width':
        (formGroup as any).operators = WIDTH_OPERATOR_TYPES;
        (formGroup as any).itemValueAndAttribute = {
          attribute,
          itemValue: {
            attributeId: attribute.id,
            val: condition ? condition : {
              type: 'width',
              value: undefined,
              unit: undefined
            } as WidthValue
          } as Value
        } as ItemValueAndAttribute;
        break;
      case 'height':
        (formGroup as any).operators = HEIGHT_OPERATOR_TYPES;
        (formGroup as any).itemValueAndAttribute = {
          attribute,
          itemValue: {
            attributeId: attribute.id,
            val: condition ? condition : {
              type: 'height',
              value: undefined,
              unit: undefined,
            } as HeightValue
          } as Value
        } as ItemValueAndAttribute;
        break;
      case 'length':
        (formGroup as any).operators = LENGTH_OPERATOR_TYPES;
        (formGroup as any).itemValueAndAttribute = {
          attribute,
          itemValue: {
            attributeId: attribute.id,
            val: condition ? condition : {
              type: 'length',
              value: undefined,
              unit: undefined
            } as LengthValue
          } as Value
        } as ItemValueAndAttribute;
        break;
      case 'select':
        (formGroup as any).operators = SELECT_OPERATOR_TYPES;
        (formGroup as any).itemValueAndAttribute = {
          attribute,
          itemValue: {
            attributeId: attribute.id,
            val: condition ? condition : {
              type: 'select',
              key: undefined,
            } as SelectValue
          } as Value
        } as ItemValueAndAttribute;
        break;
      case 'doubleselect':
        (formGroup as any).operators = DOUBLE_SELECT_OPERATOR_TYPES;
        (formGroup as any).itemValueAndAttribute = {
          attribute,
          itemValue: {
            attributeId: attribute.id,
            val: condition ? condition : {
              type: 'doubleselect',
              key1: undefined,
              key2: undefined
            } as DoubleSelectValue
          } as Value
        } as ItemValueAndAttribute;
        break;
      default:
        throw new Error('unsupported attribute type');
    }
  }

  onWhenConditionChanged($event: ItemValueAndAttribute, formGroupWhenClause: AbstractControl) {
    const fg: FormGroup = formGroupWhenClause as FormGroup;
    const itemValue: ItemValTypes = $event.itemValue.val;
    (fg as any).itemValueAndAttribute = $event;
    fg.controls.condition.setValue(itemValue);
  }

  onValidateConditionChanged($event: ItemValueAndAttribute, formGroupValidateClause: AbstractControl) {
    const fg: FormGroup = formGroupValidateClause as FormGroup;
    const itemValue: ItemValTypes = $event.itemValue.val;
    (fg as any).itemValueAndAttribute = $event;
    fg.controls.condition.setValue(itemValue);
  }
}
