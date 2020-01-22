import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableItemAndAttributeSet} from '../../model/item-attribute.model';
import {Item, TableItem} from '../../model/item.model';
import {ValidationResult} from '../../model/validation.model';
import {Rule} from '../../model/rule.model';
import {View} from '../../model/view.model';
import {Attribute} from '../../model/attribute.model';
import {toTableItem} from '../../utils/item-to-table-items.util';
import {ValidationResultTableComponentEvent} from './validation-result-table.component';
import {forkJoin} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ApiResponse} from '../../model/response.model';
import {toNotifications} from '../../service/common.service';

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

    tableItems: TableItem[];

    currentRule: Rule;
    currentItem: Item;

    constructor() {
        this.events = new EventEmitter<ValidationResultTableComponentEvent>();
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
    }
}
