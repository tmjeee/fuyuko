import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {ItemValueOperatorAndAttributeWithId} from './rule-editor-dialog.component';
import {Attribute} from '../../model/attribute.model';
import {Rule, ValidateClause, WhenClause} from '../../model/rule.model';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {isItemValueOperatorAndAttributeValid} from '../../utils/item-value-operator-attribute.util';
import {OperatorType} from '../../model/operator.model';
import {Value} from '../../model/item.model';
import {ItemValueOperatorAndAttribute} from '../../model/item-attribute.model';


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
    validateClauses: ItemValueOperatorAndAttributeWithId[];
    whenClauses: ItemValueOperatorAndAttributeWithId[];

    formControlName: FormControl;
    formControlDescription: FormControl;

    counter: number;

    @Input() attributes: Attribute[];
    @Input() rule: Rule;

    @Output() events: EventEmitter<RuleEditorComponentEvent>;

    subscription: Subscription;

    constructor(private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private router: Router) {
        this.counter = -1;
        this.events = new EventEmitter<RuleEditorComponentEvent>();
        this.validateClauses = [];
        this.whenClauses = [];
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
            if (this.rule.validateClauses) {
                this.validateClauses = [];
                this.rule.validateClauses.forEach((ruleValidateClause: ValidateClause) => {
                    const rId: number = ruleValidateClause.id;
                    const attribute: Attribute = this.attributes.find(
                        (a: Attribute) => a.id === ruleValidateClause.attributeId);
                    const operator: OperatorType = ruleValidateClause.operator;
                    const itemValue: Value =
                        { attributeId: attribute.id, val: ruleValidateClause.condition} as Value;

                    this.validateClauses.push({
                        id: rId,
                        attribute,
                        operator,
                        itemValue
                    } as ItemValueOperatorAndAttributeWithId);
                });
            }
            if (this.rule.whenClauses) {
                this.whenClauses = [];
                this.rule.whenClauses.forEach((whenClause: WhenClause) => {
                    const rId: number = whenClause.id;
                    const attribute: Attribute = this.attributes.find(
                        (a: Attribute) => a.id === whenClause.attributeId);
                    const operator: OperatorType = whenClause.operator;
                    const itemValue: Value = { attributeId: attribute.id, val: whenClause.condition } as Value;

                    this.whenClauses.push({
                        id: rId,
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
        this.events.emit({
           type: 'update',
           rule: r
        } as RuleEditorComponentEvent);
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

    async onCancel($event: MouseEvent) {
        this.events.emit({
            type: 'cancel',
        } as RuleEditorComponentEvent);
    }
}
