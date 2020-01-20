import {Component, Input, OnInit} from '@angular/core';
import {ItemAndAttributeSet, TableItemAndAttributeSet} from '../../model/item-attribute.model';
import {Item, TableItem} from '../../model/item.model';
import {ValidationResult} from '../../model/validation.model';
import {Rule} from '../../model/rule.model';
import {View} from '../../model/view.model';
import {Attribute} from '../../model/attribute.model';
import {ItemSearchComponentEvent} from '../item-search-component/item-search.component';
import {DataTableComponentEvent} from '../data-table-component/data-table.component';
import {toTableItem} from "../../utils/item-to-table-items.util";

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

    tableItems: TableItem[];

    currentRule: Rule;
    currentItem: Item;

    ngOnInit(): void {
        this.tableItems = toTableItem(this.items);
        this.itemAndAttributeSet = {
           attributes: this.attributes,
           tableItems: this.tableItems
        };
    }

    onDataTableSearchEvent($event: ItemSearchComponentEvent) {
    }

    onDataTableEvent($event: DataTableComponentEvent) {
    }
}
