import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors} from '@angular/forms';
import {Attribute} from '../../model/attribute.model';
import {ItemValueAndAttribute} from '../../model/item-attribute.model';
import {NotificationsService} from 'angular2-notifications';
import {Value} from '../../model/item.model';
import {createNewItemValue} from '../../utils/ui-item-value-creator.utils';
import {getItemAreaValue, hasItemValue} from '../../utils/ui-item-value-getter.util';

@Component({
   selector: 'app-bulk-edit-wizard',
   templateUrl: './bulk-edit-wizard.component.html',
   styleUrls: ['./bulk-edit-wizard.component.scss']
})
export class BulkEditWizardComponent implements OnInit, OnChanges {

    // first step
    formGroupFirstStep: FormGroup;
    changeClauses: ItemValueAndAttribute[];
    whereClauses: ItemValueAndAttribute[];

    // second step
    formGroupSecondStep: FormGroup;

    // third step
    formGroupThirdStep: FormGroup;

    @Input() attributes: Attribute[];

    constructor(private formBuilder: FormBuilder, private notificationsService: NotificationsService) { }

    ngOnInit(): void {
        this.reset();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.attributes && (changes.attributes as SimpleChange).currentValue) {
            this.reset();
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

    onWhereClauseEvent(index: number, $event: ItemValueAndAttribute) {
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
        const val: Value = createNewItemValue(attribute);
        this.whereClauses.push({
            attribute: this.attributes[0],
            itemValue: val
        } as ItemValueAndAttribute);
        this.formGroupFirstStep.updateValueAndValidity();
    }


    private reset(): void {
        this.changeClauses = [];
        this.whereClauses = [];
        this.formGroupFirstStep = this.formBuilder.group({});
        this.formGroupFirstStep.setValidators((control: AbstractControl): ValidationErrors | null  => {
            const errors: ValidationErrors = {};
            this.fillErrors(this.changeClauses, errors);
            this.fillErrors(this.whereClauses, errors);
            return errors;
        });
        this.formGroupSecondStep = this.formBuilder.group({});
        this.formGroupThirdStep = this.formBuilder.group({});
        this.addChangeClause();
        this.addWhereClause();
    }


    private fillErrors(itemValueAndAttributes: ItemValueAndAttribute[], validationErrors: ValidationErrors): ValidationErrors {
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
}
