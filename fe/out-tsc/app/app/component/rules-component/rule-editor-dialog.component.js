import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CounterService } from '../../service/counter-service/counter.service';
import { isItemValueOperatorAndAttributeValid } from "../../utils/item-value-operator-attribute.util";
let RuleEditorDialogComponent = class RuleEditorDialogComponent {
    constructor(matDialogRef, data, counterService, formBuilder) {
        this.matDialogRef = matDialogRef;
        this.counterService = counterService;
        this.formBuilder = formBuilder;
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
            (c) => {
                let hasError = false;
                const validationErrors = {};
                const fg = c;
                if (this.validateClauses.length <= 0) {
                    validationErrors.missingValidateClause = true;
                    hasError = true;
                }
                else {
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
                }
                else {
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
    ngOnInit() {
        if (this.rule) {
            this.formControlName.setValue(this.rule.name);
            this.formControlDescription.setValue(this.rule.description);
            if (this.rule.validateClauses) {
                this.rule.validateClauses.forEach((ruleValidateClause) => {
                    const ruleId = ruleValidateClause.id;
                    const attribute = this.attributes.find((a) => a.id === ruleValidateClause.attributeId);
                    const operator = ruleValidateClause.operator;
                    const itemValue = { attributeId: attribute.id, val: ruleValidateClause.condition };
                    this.validateClauses.push({
                        id: ruleId,
                        attribute,
                        operator,
                        itemValue
                    });
                });
            }
            if (this.rule.whenClauses) {
                this.rule.whenClauses.forEach((whenClause) => {
                    const ruleId = whenClause.id;
                    const attribute = this.attributes.find((a) => a.id === whenClause.attributeId);
                    const operator = whenClause.operator;
                    const itemValue = { attributeId: attribute.id, val: whenClause.condition };
                    this.whenClauses.push({
                        id: ruleId,
                        attribute,
                        operator,
                        itemValue
                    });
                });
            }
        }
    }
    onAddRuleValidation($event) {
        const attribute = null;
        const operator = null;
        const itemValue = null;
        this.validateClauses.push({
            id: this.counter--,
            attribute,
            operator,
            itemValue
        });
        this.formGroup.updateValueAndValidity();
    }
    onDeleteRuleValidation($event, index, validateClause) {
        this.validateClauses.splice(index, 1);
        this.formGroup.updateValueAndValidity();
    }
    onAddRuleWhen($event) {
        const attribute = null;
        const operator = null;
        const itemValue = null;
        this.whenClauses.push({
            id: this.counter--,
            attribute,
            operator,
            itemValue
        });
        this.formGroup.updateValueAndValidity();
    }
    onDeleteRuleWhen($event, index, whenClause) {
        this.whenClauses.splice(index, 1);
        this.formGroup.updateValueAndValidity();
    }
    onSubmit() {
        const r = {
            id: this.rule.id,
            name: this.formControlName.value,
            description: this.formControlDescription.value,
            validateClauses: this.validateClauses.reduce((acc, g) => {
                acc.push({
                    id: g.id,
                    attributeId: g.attribute.id,
                    attributeName: g.attribute.name,
                    attributeType: g.attribute.type,
                    operator: g.operator,
                    condition: g.itemValue.val
                });
                return acc;
            }, []),
            whenClauses: this.whenClauses.reduce((acc, g) => {
                acc.push({
                    id: g.id,
                    attributeId: g.attribute.id,
                    attributeName: g.attribute.name,
                    attributeType: g.attribute.type,
                    operator: g.operator,
                    condition: g.itemValue.val
                });
                return acc;
            }, [])
        };
        this.matDialogRef.close(r);
    }
    onWhenClauseChange($event, index) {
        const i = Object.assign({ id: this.whenClauses[index].id }, $event);
        this.whenClauses[index] = i;
        this.formGroup.updateValueAndValidity();
    }
    onValidateClauseChange($event, index) {
        const i = Object.assign({ id: this.validateClauses[index].id }, $event);
        this.validateClauses[index] = i;
        this.formGroup.updateValueAndValidity();
    }
    onCancel($event) {
        this.matDialogRef.close(null);
    }
};
RuleEditorDialogComponent = tslib_1.__decorate([
    Component({
        selector: 'app-rule-editor',
        templateUrl: './rule-editor-dialog.component.html',
        styleUrls: ['./rule-editor-dialog.component.scss']
    }),
    tslib_1.__param(1, Inject(MAT_DIALOG_DATA)),
    tslib_1.__metadata("design:paramtypes", [MatDialogRef, Object, CounterService,
        FormBuilder])
], RuleEditorDialogComponent);
export { RuleEditorDialogComponent };
//# sourceMappingURL=rule-editor-dialog.component.js.map