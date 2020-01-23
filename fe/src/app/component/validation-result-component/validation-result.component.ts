import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableItemAndAttributeSet} from '../../model/item-attribute.model';
import {Item, TableItem} from '../../model/item.model';
import {ValidationError, ValidationResult} from '../../model/validation.model';
import {Rule} from '../../model/rule.model';
import {View} from '../../model/view.model';
import {Attribute} from '../../model/attribute.model';
import {toTableItem} from '../../utils/item-to-table-items.util';
import {ValidationResultTableComponentEvent} from './validation-result-table.component';
import {ValidationResultTreeComponentEvent} from './validation-result-tree.component';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-validation-result',
    templateUrl: './validation-result.component.html',
    styleUrls: ['./validation-result.component.scss']
})
export  class ValidationResultComponent implements OnInit {

    itemAndAttributeSet: TableItemAndAttributeSet;

    @Input() items: Item[];
    @Input() attributes: Attribute[];
    @Input() validationResult: ValidationResult;
    @Input() rules: Rule[];
    @Input() view: View;

    @Output() events: EventEmitter<ValidationResultTableComponentEvent>;

    itemChangeEvents: BehaviorSubject<Item>;
    validationErrorChangeEvents: BehaviorSubject<ValidationError[]>;

    tableItems: TableItem[];

    constructor() {
        this.events = new EventEmitter<ValidationResultTableComponentEvent>();
        this.itemChangeEvents = new BehaviorSubject<Item>(null);
        this.validationErrorChangeEvents = new BehaviorSubject<ValidationError[]>(null);
    }

    ngOnInit(): void {
        this.tableItems = toTableItem(this.items);
        this.itemAndAttributeSet = {
           attributes: this.attributes,
           tableItems: this.tableItems
        };
    }

    onValidationResultTableEvent($event: ValidationResultTableComponentEvent) {
        this.events.emit($event);
        switch ($event.type) {
            case 'selection-changed':
                const tableItems: TableItem[] = $event.modifiedItems;
                if (tableItems && tableItems.length) {
                    const it: Item = this.items.find((i: Item) => i.id === tableItems[0].id);
                    if (it) {
                        this.fireItemChangeEvent(it);
                    }
                }
                break;
        }
    }

    onValidationResultTreeEvent($event: ValidationResultTreeComponentEvent) {
        switch ( $event.type) {
            case 'selection-error-changed':
                this.fireItemChangeEvent($event.item);
                // if $event.error is truthy that means a 'validation' node is clicked, else an 'item' node is clicked
                this.fireValidationErrorEvent($event.error ? [$event.error] : $event.errors);
                break;
            case 'selection-item-changed':
                this.fireItemChangeEvent($event.item);
                this.fireValidationErrorEvent($event.errors);
                break;
            case 'selection-rule-changed':
                this.fireItemChangeEvent($event.item);
                this.fireValidationErrorEvent($event.errors);
                break;
        }
    }

    fireItemChangeEvent(i: Item) {
        console.log('****** validation-result-comp item change', i);
        this.itemChangeEvents.next(i);
    }

    fireValidationErrorEvent(e: ValidationError[]) {
        console.log('****** validation-result-comp error change', e);
        this.validationErrorChangeEvents.next(e);
    }
}
