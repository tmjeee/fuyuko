import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors} from '@angular/forms';
import {Attribute} from '../../model/attribute.model';
import {ItemValueAndAttribute, ItemValueOperatorAndAttribute} from '../../model/item-attribute.model';
import {NotificationsService} from 'angular2-notifications';
import {Value} from '../../model/item.model';
import {createNewItemValue} from '../../shared-utils/ui-item-value-creator.utils';
import {getItemAreaValue, hasItemValue} from '../../utils/ui-item-value-getter.util';
import {BulkEditService} from '../../service/bulk-edit-service/bulk-edit.service';
import {View} from '../../model/view.model';
import {operatorNeedsItemValue, operatorsForAttribute} from '../../utils/attribute-operators.util';
import {OperatorType} from '../../model/operator.model';
import {BulkEditItem, BulkEditPackage, BulkEditTableItem} from '../../model/bulk-edit.model';
import {tap} from 'rxjs/operators';
import {toBulkEditTableItem} from '../../utils/item-to-table-items.util';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import {JobsService} from '../../service/jobs-service/jobs.service';
import {Job, JobAndLogs} from '../../model/job.model';
import {Observable} from 'rxjs';

@Component({
   selector: 'app-bulk-edit-wizard',
   templateUrl: './bulk-edit-wizard.component.html',
   styleUrls: ['./bulk-edit-wizard.component.scss']
})
export class BulkEditWizardComponent implements OnInit, OnChanges {

    editable: boolean;  // when in third steps, all other steps are not editable

    @ViewChild('stepper') stepper: MatStepper;

    // first step
    formGroupFirstStep: FormGroup;
    changeClauses: ItemValueAndAttribute[];
    whereClauses: ItemValueOperatorAndAttribute[];

    // second step
    formGroupSecondStep: FormGroup;
    secondStepReady: boolean;
    bulkEditPackage: BulkEditPackage;
    bulkEditTableItems: BulkEditTableItem[];

    // third step
    formGroupThirdStep: FormGroup;
    job: Job;  // bulk edit job
    fetchFn: (jobId: number, lastLogId: number) => Observable<JobAndLogs>;

    @Input() view: View;
    @Input() attributes: Attribute[];

    constructor(private formBuilder: FormBuilder,
                private notificationsService: NotificationsService,
                private bulkEditService: BulkEditService,
                private jobsService: JobsService) {
        this.secondStepReady = false;
        this.editable = true;
    }

    ngOnInit(): void {
        this.reset();
        this.fetchFn = this.f.bind(this);
    }

    f(jobId: number, lastLogId: number): Observable<JobAndLogs> {
        return this.jobsService.jobLogs(jobId, lastLogId);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.attributes && (changes.attributes as SimpleChange).currentValue) {
            const attrs: Attribute[] =  (changes.attributes as SimpleChange).currentValue;
            if (attrs && attrs.length > 0) {
                this.reset();
            }
        }
    }

    onChangeClauseEvent(index: number, $event: ItemValueAndAttribute) {
        this.changeClauses[index] = { ...$event };
        this.formGroupFirstStep.updateValueAndValidity();
    }

    deleteChangeClause(index: number) {
        this.changeClauses.splice(index, 1);
        this.formGroupFirstStep.updateValueAndValidity();
    }

    addChangeClause() {
        if (this.attributes.length <= 0) {
            this.notificationsService.error('Error', 'No attribute(s)');
            return;
        }
        const attribute: Attribute = this.attributes[0];
        const val: Value = createNewItemValue(attribute);
        this.changeClauses.push({
            attribute: this.attributes[0],
            itemValue: val
        } as ItemValueAndAttribute);
        this.formGroupFirstStep.updateValueAndValidity();
    }

    onWhereClauseEvent(index: number, $event: ItemValueOperatorAndAttribute) {
        this.whereClauses[index] = { ...$event };
        this.formGroupFirstStep.updateValueAndValidity();
    }

    deleteWhereClause(index: number) {
        this.whereClauses.splice(index, 1);
        this.formGroupFirstStep.updateValueAndValidity();
    }

    addWhereClause() {
        if (this.attributes.length <= 0) {
            this.notificationsService.error('Error', 'No attribute(s)');
            return;
        }
        const attribute: Attribute = this.attributes[0];
        const operators: OperatorType[] = operatorsForAttribute(attribute);
        const val: Value = createNewItemValue(attribute);
        this.whereClauses.push({
            attribute,
            operator: ((operators && operators.length > 0) ? operators[0] : undefined),
            itemValue: val
        } as ItemValueOperatorAndAttribute);
        this.formGroupFirstStep.updateValueAndValidity();
    }


    private reset(): void {
        this.job = undefined;
        this.changeClauses = [];
        this.whereClauses = [];
        this.formGroupFirstStep = this.formBuilder.group({});
        this.formGroupFirstStep.setValidators((control: AbstractControl): ValidationErrors | null  => {
            const errors: ValidationErrors = {};
            this.fillErrors1(this.changeClauses, errors);
            this.fillErrors2(this.whereClauses, errors);
            return errors;
        });
        this.formGroupSecondStep = this.formBuilder.group({});
        this.formGroupThirdStep = this.formBuilder.group({});
        this.addChangeClause();
        this.addWhereClause();
    }

    private fillErrors2(item: ItemValueOperatorAndAttribute[], validationErrors: ValidationErrors): ValidationErrors {
        const error = item.reduce((ac: ValidationErrors, prev: ItemValueOperatorAndAttribute) => {
            if (!prev.operator) {
                ac.missingOperator = true;
            } else {
                const needsItemValue: boolean = operatorNeedsItemValue(prev.operator);
                const r: boolean = hasItemValue(prev.attribute, prev.itemValue);
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


    private fillErrors1(itemValueAndAttributes: ItemValueAndAttribute[], validationErrors: ValidationErrors): ValidationErrors {
        const error = itemValueAndAttributes.reduce((ac: ValidationErrors, prev: ItemValueAndAttribute) => {
            const r: boolean = hasItemValue(prev.attribute, prev.itemValue);
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
            .pipe(
                tap((b: BulkEditPackage) => {
                   this.bulkEditPackage = b;
                   console.log('*********************** bulk edit packate', this.bulkEditPackage);
                   if (this.bulkEditPackage) {
                       const bulkEditItems: BulkEditItem[] = this.bulkEditPackage.bulkEditItems;
                       this.bulkEditTableItems  = toBulkEditTableItem(bulkEditItems);
                       this.secondStepReady = true;
                   }
                })
            ).subscribe();
    }

    onStepperSelectionChange($event: StepperSelectionEvent) {
    }

    onSecondStepSubmit() {
        this.editable = false;
        // todo:
        this.jobsService
            .scheduleBulkEditJob(this.view.id, this.bulkEditPackage)
            .pipe(
                tap((j: Job) => {
                    this.job = j;
                })
            ).subscribe();
    }

    onThirdStepSubmit() {
        this.stepper.reset();
    }
}
