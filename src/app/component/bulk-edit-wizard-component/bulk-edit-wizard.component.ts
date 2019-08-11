import {Component, Input, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Attribute} from '../../model/attribute.model';
import {ItemValueAndAttribute} from '../../model/item-attribute.model';
import {NotificationsService} from 'angular2-notifications';
import {Value} from '../../model/item.model';
import {createNewItemValue} from '../../utils/ui-item-value-creator.utils';

@Component({
   selector: 'app-bulk-edit-wizard',
   templateUrl: './bulk-edit-wizard.component.html',
   styleUrls: ['./bulk-edit-wizard.component.scss']
})
export class BulkEditWizardComponent implements OnChanges {

    // first step
    formGroupFirstStep: FormGroup;
    changeClauses: ItemValueAndAttribute[];
    whereClauses: ItemValueAndAttribute[];

    // second step
    formGroupSecondStep: FormGroup;

    // third step
    formGroupThirdStep: FormGroup;

    @Input() attributes: Attribute[];

    constructor(private formBuilder: FormBuilder, private notificationsService: NotificationsService) {
        this.reset();
    }

    onChangeClauseEvent(index: number, $event: ItemValueAndAttribute) {
        this.changeClauses[index] = { ...$event };
    }

    deleteChangeClause(index: number) {
        this.changeClauses.splice(index, 1);
    }

    addChangeClause() {
        console.log('**** addChangeClause');
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
    }

    onWhereClauseEvent(index: number, $event: ItemValueAndAttribute) {
        this.whereClauses[index] = { ...$event };
    }

    deleteWhereClause(index: number) {
        this.whereClauses.splice(index, 1);
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
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.attributes && (changes.attributes as SimpleChange).currentValue) {
            this.reset();
        }
    }

    private reset(): void {
        this.changeClauses = [];
        this.whereClauses = [];
        this.formGroupFirstStep = this.formBuilder.group({});
        this.formGroupSecondStep = this.formBuilder.group({});
        this.formGroupThirdStep = this.formBuilder.group({});
    }
}
