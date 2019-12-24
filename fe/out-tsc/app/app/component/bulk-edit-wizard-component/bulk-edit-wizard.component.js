import * as tslib_1 from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { createNewItemValue } from '../../shared-utils/ui-item-value-creator.utils';
import { hasItemValue } from '../../utils/ui-item-value-getter.util';
import { BulkEditService } from '../../service/bulk-edit-service/bulk-edit.service';
import { operatorNeedsItemValue, operatorsForAttribute } from '../../utils/attribute-operators.util';
import { tap } from 'rxjs/operators';
import { toBulkEditTableItem } from '../../utils/item-to-table-items.util';
import { MatStepper } from '@angular/material';
import { JobsService } from '../../service/jobs-service/jobs.service';
let BulkEditWizardComponent = class BulkEditWizardComponent {
    constructor(formBuilder, notificationsService, bulkEditService, jobsService) {
        this.formBuilder = formBuilder;
        this.notificationsService = notificationsService;
        this.bulkEditService = bulkEditService;
        this.jobsService = jobsService;
        this.secondStepReady = false;
        this.editable = true;
    }
    ngOnInit() {
        this.reset();
        this.fetchFn = this.f.bind(this);
    }
    f(jobId, lastLogId) {
        return this.jobsService.jobLogs(jobId, lastLogId);
    }
    ngOnChanges(changes) {
        if (changes.attributes && changes.attributes.currentValue) {
            this.reset();
        }
    }
    onChangeClauseEvent(index, $event) {
        this.changeClauses[index] = Object.assign({}, $event);
        this.formGroupFirstStep.updateValueAndValidity();
    }
    deleteChangeClause(index) {
        this.changeClauses.splice(index, 1);
        this.formGroupFirstStep.updateValueAndValidity();
    }
    addChangeClause() {
        if (this.attributes.length <= 0) {
            this.notificationsService.error('Error', 'No attribute(s)');
            return;
        }
        const attribute = this.attributes[0];
        const val = createNewItemValue(attribute);
        this.changeClauses.push({
            attribute: this.attributes[0],
            itemValue: val
        });
        this.formGroupFirstStep.updateValueAndValidity();
    }
    onWhereClauseEvent(index, $event) {
        this.whereClauses[index] = Object.assign({}, $event);
        this.formGroupFirstStep.updateValueAndValidity();
    }
    deleteWhereClause(index) {
        this.whereClauses.splice(index, 1);
        this.formGroupFirstStep.updateValueAndValidity();
    }
    addWhereClause() {
        if (this.attributes.length <= 0) {
            this.notificationsService.error('Error', 'No attribute(s)');
            return;
        }
        const attribute = this.attributes[0];
        const operators = operatorsForAttribute(attribute);
        const val = createNewItemValue(attribute);
        this.whereClauses.push({
            attribute,
            operator: ((operators && operators.length > 0) ? operators[0] : undefined),
            itemValue: val
        });
        this.formGroupFirstStep.updateValueAndValidity();
    }
    reset() {
        this.job = undefined;
        this.changeClauses = [];
        this.whereClauses = [];
        this.formGroupFirstStep = this.formBuilder.group({});
        this.formGroupFirstStep.setValidators((control) => {
            const errors = {};
            this.fillErrors1(this.changeClauses, errors);
            this.fillErrors2(this.whereClauses, errors);
            return errors;
        });
        this.formGroupSecondStep = this.formBuilder.group({});
        this.formGroupThirdStep = this.formBuilder.group({});
        this.addChangeClause();
        this.addWhereClause();
    }
    fillErrors2(item, validationErrors) {
        const error = item.reduce((ac, prev) => {
            if (!prev.operator) {
                ac.missingOperator = true;
            }
            else {
                const needsItemValue = operatorNeedsItemValue(prev.operator);
                const r = hasItemValue(prev.attribute, prev.itemValue);
                if (needsItemValue && !r) {
                    ac.missingItemValue = true;
                }
            }
            if (!prev.attribute) {
                ac.missingAttribute = true;
            }
            return ac;
        }, validationErrors);
        return error;
    }
    fillErrors1(itemValueAndAttributes, validationErrors) {
        const error = itemValueAndAttributes.reduce((ac, prev) => {
            const r = hasItemValue(prev.attribute, prev.itemValue);
            if (!r) {
                ac.missingItemValue = true;
            }
            if (!prev.attribute) {
                ac.missingAttribute = true;
            }
            return ac;
        }, validationErrors);
        return error;
    }
    onFirstStepSubmit() {
        this.secondStepReady = false;
        this.bulkEditService
            .previewBuilEdit(this.view.id, this.changeClauses, this.whereClauses)
            .pipe(tap((b) => {
            this.bulkEditPackage = b;
            console.log('*********************** bulk edit packate', this.bulkEditPackage);
            if (this.bulkEditPackage) {
                const bulkEditItems = this.bulkEditPackage.bulkEditItems;
                this.bulkEditTableItems = toBulkEditTableItem(bulkEditItems);
                this.secondStepReady = true;
            }
        })).subscribe();
    }
    onStepperSelectionChange($event) {
    }
    onSecondStepSubmit() {
        this.editable = false;
        // todo:
        this.jobsService
            .scheduleBulkEditJob(this.view.id, this.bulkEditPackage)
            .pipe(tap((j) => {
            this.job = j;
        })).subscribe();
    }
    onThirdStepSubmit() {
        this.stepper.reset();
    }
};
tslib_1.__decorate([
    ViewChild('stepper', { static: false }),
    tslib_1.__metadata("design:type", MatStepper)
], BulkEditWizardComponent.prototype, "stepper", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], BulkEditWizardComponent.prototype, "view", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], BulkEditWizardComponent.prototype, "attributes", void 0);
BulkEditWizardComponent = tslib_1.__decorate([
    Component({
        selector: 'app-bulk-edit-wizard',
        templateUrl: './bulk-edit-wizard.component.html',
        styleUrls: ['./bulk-edit-wizard.component.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [FormBuilder,
        NotificationsService,
        BulkEditService,
        JobsService])
], BulkEditWizardComponent);
export { BulkEditWizardComponent };
//# sourceMappingURL=bulk-edit-wizard.component.js.map