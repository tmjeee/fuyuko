import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ViewService} from '../../service/view-service/view.service';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {NotificationsService} from 'angular2-notifications';
import {RuleService} from '../../service/rule-service/rule.service';
import {map, tap} from 'rxjs/operators';
import {View} from '../../model/view.model';
import {combineLatest, Subscription} from 'rxjs';
import {Attribute} from '../../model/attribute.model';
import {Rule, ValidateClause, WhenClause} from '../../model/rule.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CounterService} from '../../service/counter-service/counter.service';
import {isItemValueOperatorAndAttributeValid} from '../../utils/item-value-operator-attribute.util';
import {OperatorType} from '../../model/operator.model';
import {Value} from '../../model/item.model';
import {ItemValueOperatorAndAttribute} from '../../model/item-attribute.model';
import {
    ItemValueOperatorAndAttributeWithId,
    RuleEditorDialogComponentData
} from '../../component/rules-component/rule-editor-dialog.component';

@Component({
    templateUrl: './edit-rule.page.html',
    styleUrls: ['./edit-rule.page.scss']
})
export class EditRulePageComponent implements OnInit, OnDestroy {

    formGroup: FormGroup;
    validateClauses: ItemValueOperatorAndAttributeWithId[];
    whenClauses: ItemValueOperatorAndAttributeWithId[];

    formControlName: FormControl;
    formControlDescription: FormControl;

    counter: number;

    currentView: View;
    attributes: Attribute[];
    rule: Rule;

    subscription: Subscription;

    ready: boolean;

    constructor(private viewService: ViewService,
                private route: ActivatedRoute,
                private attributeService: AttributeService,
                private notificationService: NotificationsService,
                private formBuilder: FormBuilder,
                private router: Router,
                private ruleService: RuleService) {
        this.counter = -1;
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

    ngOnInit(): void {
        this.ready = false;
        this.subscription = this.viewService
            .asObserver()
            .pipe(
                map((currentView: View) => {
                    if (currentView) {
                        this.currentView = currentView;
                        this.reload();
                        this.ready = true;
                    } else {
                        this.ready = true;
                    }
                }),
            ).subscribe();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    reload() {
        this.ready = false;
        const ruleId: string = this.route.snapshot.paramMap.get('ruleId');
        combineLatest([
            this.attributeService.getAllAttributesByView(this.currentView.id),
            this.ruleService.getRuleByView(this.currentView.id, Number(ruleId))
        ]).pipe(
            tap((r: [Attribute[], Rule]) => {
                this.attributes = r[0];
                this.rule = r[1];
                if (this.rule) {
                    this.formControlName.setValue(this.rule.name);
                    this.formControlDescription.setValue(this.rule.description);
                    if (this.rule.validateClauses) {
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
                this.ready = true;
            })
        ).subscribe();
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
        this.ruleService.updateRule(this.currentView.id, r)
            .pipe(
               tap((_) => {
                   this.notificationService.success(`Updated`, `Rule updated`);
                   this.reload();
               })
            ).subscribe();
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
        await this.router.navigate(['/view-gen-layout', {outlets:{primary:['rules'], help: ['view-help'] }}]);
    }
}
