import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableItemAndAttributeSet} from '@fuyuko-common/model/item-attribute.model';
import {Item, TableItem} from '@fuyuko-common/model/item.model';
import {ValidationError, ValidationResult} from '@fuyuko-common/model/validation.model';
import {Rule} from '@fuyuko-common/model/rule.model';
import {View} from '@fuyuko-common/model/view.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {toTableItem} from '../../utils/item-to-table-items.util';
import {ValidationResultTableComponentEvent} from './validation-result-table.component';
import {ValidationResultTreeComponentEvent} from './validation-result-tree.component';
import {BehaviorSubject} from 'rxjs';
import {ValidationResultLogReloadFn} from './validation-result-log.component';

@Component({
    selector: 'app-validation-result',
    templateUrl: './validation-result.component.html',
    styleUrls: ['./validation-result.component.scss']
})
export  class ValidationResultComponent implements OnInit {

    itemAndAttributeSet!: TableItemAndAttributeSet;

    @Input() items: Item[] = [];
    @Input() attributes: Attribute[] = [];
    @Input() validationResult!: ValidationResult;
    @Input() rules: Rule[] = [];
    @Input() view!: View;
    @Input() validationResultLogReloadFn!: ValidationResultLogReloadFn;

    @Output() events: EventEmitter<ValidationResultTableComponentEvent>;

    treeItemChangeEvents: BehaviorSubject<Item | undefined>; // for tree  @input
    tableItemChangeEvents: BehaviorSubject<Item | undefined>; // for table and console @Input
    validationErrorChangeEvents: BehaviorSubject<ValidationError[]>; // for console @Input

    tableItems!: TableItem[];

    constructor() {
        this.events = new EventEmitter<ValidationResultTableComponentEvent>();
        this.tableItemChangeEvents = new BehaviorSubject<Item | undefined>(undefined);
        this.treeItemChangeEvents = new BehaviorSubject<Item | undefined>(undefined);
        this.validationErrorChangeEvents = new BehaviorSubject<ValidationError[]>([]);
    }

    ngOnInit(): void {
        this.tableItems = toTableItem(this.items);
        this.itemAndAttributeSet = {
           attributes: this.attributes,
           tableItems: this.tableItems
        };
    }

    private b(items: Item[], itemId: number): Item | undefined {
        for (const i of items) {
            if (i.id === itemId) {
                return i;
            }
            if (i.children) {
                const ii: Item | undefined = this.b(i.children, itemId);
                if (ii) {
                    return ii;
                }
            }
        }
        return undefined;
    }

    onValidationResultTableEvent($event: ValidationResultTableComponentEvent) {
        this.events.emit($event);
        switch ($event.type) {
            case 'selection-changed':
                const tableItems: TableItem[] | undefined = $event.modifiedItems;
                if (tableItems && tableItems.length) {
                    const it: Item | undefined = this.b(this.items, tableItems[0].id);
                    if (it) {
                        this.fireTreeItemChangeEvent(it);
                        this.fireTableItemChangeEvent(it);
                        if ($event.errors) {
                            this.fireValidationErrorEvent($event.errors);
                        }
                    }
                }
                break;
        }
    }

    onValidationResultTreeEvent($event: ValidationResultTreeComponentEvent) {
        switch ( $event.type) {
            case 'selection-error-changed':
                // if $event.error is truthy that means a 'validation' node is clicked, else an 'item' node is clicked
                this.fireTableItemChangeEvent($event.item);
                this.fireValidationErrorEvent($event.error ? [$event.error] : $event.errors);
                break;
            case 'selection-item-changed':
                this.fireTableItemChangeEvent($event.item);
                this.fireValidationErrorEvent($event.errors);
                break;
            case 'selection-rule-changed':
                this.fireTableItemChangeEvent($event.item);
                this.fireValidationErrorEvent($event.errors);
                break;
        }
    }

    fireTableItemChangeEvent(i: Item | undefined) {
        this.tableItemChangeEvents.next(i);
    }

    fireTreeItemChangeEvent(i: Item | undefined) {
        this.treeItemChangeEvents.next(i);
    }

    fireValidationErrorEvent(e: ValidationError[]) {
        this.validationErrorChangeEvents.next(e);
    }
}
