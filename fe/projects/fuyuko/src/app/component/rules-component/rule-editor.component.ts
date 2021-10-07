import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {Rule, RULE_LEVELS, RuleLevel, ValidateClause, WhenClause} from '@fuyuko-common/model/rule.model';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {isItemValueOperatorAndAttributeWithIdValid} from '../../utils/item-value-operator-attribute.util';
import {OperatorType} from '@fuyuko-common/model/operator.model';
import {ItemValTypes, Value} from '@fuyuko-common/model/item.model';
import {PartialBy} from '@fuyuko-common/model/types';
import {assertDefinedReturn} from '../../utils/common.util';

export interface ItemValueOperatorAndAttributeWithId {
    id: number;
    itemValue: Value[];
    operator: OperatorType;
    attribute: Attribute;
}

export interface RuleEditorComponentEvent {
    type: 'cancel' | 'update';
    rule?: Rule; // only available at 'update'
}

@Component({
    selector: 'app-rule-editor',
    templateUrl: './rule-editor.component.html',
    styleUrls: ['./rule-editor.component.scss']
})
export class RuleEditorComponent implements OnChanges {

    formGroup: FormGroup;
    validateClauses: PartialBy<ItemValueOperatorAndAttributeWithId, 'attribute' | 'operator'>[];
    whenClauses: PartialBy<ItemValueOperatorAndAttributeWithId, 'attribute' | 'operator'>[];

    formControlName: FormControl;
    formControlDescription: FormControl;
    formControlRuleLevel: FormControl;

    counter: number;

    @Input() attributes: Attribute[] = [];
    @Input() rule!: Rule;

    @Output() events: EventEmitter<RuleEditorComponentEvent>;

    // subscription: Subscription;
    ruleLevels: RuleLevel[];

    constructor(private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private router: Router) {
        this.ruleLevels = RULE_LEVELS;
        this.counter = -1;
        this.events = new EventEmitter<RuleEditorComponentEvent>();
        this.validateClauses = [];
        this.whenClauses = [];
        this.formControlName = formBuilder.control('', [Validators.required]);
        this.formControlDescription = formBuilder.control('', [Validators.required]);
        this.formControlRuleLevel = formBuilder.control('', [Validators.required]);
        this.formGroup = formBuilder.group({
            name: this.formControlName,
            description: this.formControlDescription,
            ruleLevel: this.formControlRuleLevel,
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
                        if (!isItemValueOperatorAndAttributeWithIdValid(validationClause)) {
                            validationErrors.badValidateClause = true;
                            hasError = true;
                        }
                    }
                }
                if (this.whenClauses.length <= 0) {
                    // #113 "whenClause" is optional, if not presents it means "validateClause" is to be applied to all items
                    // validationErrors.missingWhenClause = true;
                    // hasError = true;
                } else {
                    for (const whenClause of this.whenClauses) {
                        if (!isItemValueOperatorAndAttributeWithIdValid(whenClause)) {
                            validationErrors.badValidateClause = true;
                            hasError = true;
                        }
                    }
                }
                return hasError ? validationErrors : null;
            }
        ]);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.attributes || changes.rule) {
            const a: Attribute[] = changes.attributes.currentValue;
            const r: Rule[] = changes.rule.currentValue;
            if (a && r) {
                this.reload();
            }
        }
    }

    reload() {
        if (this.rule) {
            this.formControlName.setValue(this.rule.name);
            this.formControlDescription.setValue(this.rule.description);
            this.formControlRuleLevel.setValue(this.rule.level);
            if (this.rule.validateClauses) {
                this.validateClauses = [];
                this.rule.validateClauses.forEach((ruleValidateClause: ValidateClause) => {
                    const rId: number = ruleValidateClause.id;
                    const attribute: Attribute | undefined = this.attributes.find(
                        (a: Attribute) => a.id === ruleValidateClause.attributeId);
                    const operator: OperatorType = ruleValidateClause.operator;
                    if (attribute) {
                        const itemValue: Value[] = ruleValidateClause.condition
                            .map((c: ItemValTypes) => ({attributeId: attribute.id, val: c}));
                        //    { attributeId: attribute.id, val: ruleValidateClause.condition} as Value;

                        this.validateClauses.push({
                            id: rId,
                            attribute,
                            operator,
                            itemValue
                        } as ItemValueOperatorAndAttributeWithId);
                    }
                });
            }
            if (this.rule.whenClauses) {
                this.whenClauses = [];
                this.rule.whenClauses.forEach((whenClause: WhenClause) => {
                    const rId: number = whenClause.id;
                    const attribute: Attribute | undefined = this.attributes.find(
                        (a: Attribute) => a.id === whenClause.attributeId);
                    const operator: OperatorType = whenClause.operator;
                    if (attribute) {
                        const itemValue: Value[] = whenClause.condition.map((v: ItemValTypes) => ({
                            attributeId: attribute.id,
                            val: v
                        }));
                        //    { attributeId: attribute.id, val: whenClause.condition } as Value;

                        this.whenClauses.push({
                            id: rId,
                            attribute,
                            operator,
                            itemValue
                        } as ItemValueOperatorAndAttributeWithId);
                    }
                });
            }
        }
    }

    onAddRuleValidation($event: MouseEvent) {
        this.validateClauses.push({
            id: this.counter--,
            attribute: undefined,
            operator: undefined,
            itemValue: []
        });
        this.formGroup.updateValueAndValidity();
    }

    onDeleteRuleValidation($event: MouseEvent, index: number,
                           validateClause: PartialBy<ItemValueOperatorAndAttributeWithId, 'attribute' | 'operator'>) {
        this.validateClauses.splice(index, 1);
        this.formGroup.updateValueAndValidity();
    }

    onAddRuleWhen($event: MouseEvent) {

        this.whenClauses.push({
            id: this.counter--,
            attribute: undefined,
            operator: undefined,
            itemValue: [],
        });
        this.formGroup.updateValueAndValidity();
    }

    onDeleteRuleWhen($event: MouseEvent, index: number,
                     whenClause: PartialBy<ItemValueOperatorAndAttributeWithId, 'attribute' | 'operator'>) {
        this.whenClauses.splice(index, 1);
        this.formGroup.updateValueAndValidity();
    }

    onSubmit() {
        const r: Rule = {
            id: this.rule.id,
            name: this.formControlName.value,
            description: this.formControlDescription.value,
            level: this.formControlRuleLevel.value,
            status: 'ENABLED',
            validateClauses: this.validateClauses.reduce((acc: ValidateClause[], g: PartialBy<ItemValueOperatorAndAttributeWithId, 'attribute' | 'operator'>) => {
                acc.push({
                    id: g.id,
                    attributeId: assertDefinedReturn(g.attribute).id,
                    attributeName: assertDefinedReturn(g.attribute).name,
                    attributeType: assertDefinedReturn(g.attribute).type,
                    operator: g.operator,
                    condition: g.itemValue.map((v: Value) => v.val)
                } as ValidateClause);
                return acc;
            }, []),
            whenClauses: this.whenClauses.reduce((acc: WhenClause[], g: PartialBy<ItemValueOperatorAndAttributeWithId, 'attribute' | 'operator'>) => {
                acc.push({
                    id: g.id,
                    attributeId: assertDefinedReturn(g.attribute).id,
                    attributeName: assertDefinedReturn(g.attribute).name,
                    attributeType: assertDefinedReturn(g.attribute).type,
                    operator: g.operator,
                    condition: g.itemValue.map((v: Value) => v.val)
                } as ValidateClause);
                return acc;
            }, [])
        } as Rule;
        this.events.emit({
           type: 'update',
           rule: r
        } as RuleEditorComponentEvent);
    }


    onWhenClauseChange($event: ItemValueOperatorAndAttributeWithId, index: number) {
        const i: ItemValueOperatorAndAttributeWithId = {
            id: this.whenClauses[index].id,
            attribute: $event.attribute,
            operator: $event.operator,
            itemValue: $event.itemValue,
        };
        this.whenClauses[index] = i;
        this.formGroup.updateValueAndValidity();
    }

    onValidateClauseChange($event: ItemValueOperatorAndAttributeWithId, index: number) {
        const i: ItemValueOperatorAndAttributeWithId = {
            id: this.validateClauses[index].id,
            attribute: $event.attribute,
            operator: $event.operator,
            itemValue: $event.itemValue,
        };
        this.validateClauses[index] = i;
        this.formGroup.updateValueAndValidity();
    }

    async onCancel($event: MouseEvent) {
        this.events.emit({
            type: 'cancel',
        } as RuleEditorComponentEvent);
    }

    cast(a: Omit<ItemValueOperatorAndAttributeWithId, 'attribute' | 'operator'> & Partial<Pick<ItemValueOperatorAndAttributeWithId, 'attribute' | 'operator'>>) {
        return a as ItemValueOperatorAndAttributeWithId;
    }
}
