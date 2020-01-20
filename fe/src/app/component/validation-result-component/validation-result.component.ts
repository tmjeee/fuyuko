import {Component, Input, OnInit} from '@angular/core';
import {ItemAndAttributeSet} from '../../model/item-attribute.model';
import {Item} from '../../model/item.model';
import {ValidationResult} from '../../model/validation.model';
import {Rule} from '../../model/rule.model';
import {View} from '../../model/view.model';
import {Attribute} from '../../model/attribute.model';
import {ItemSearchComponentEvent} from '../item-search-component/item-search.component';
import {DataTableComponentEvent} from '../data-table-component/data-table.component';

@Component({
    selector: 'app-validation-result',
    templateUrl: './validation-result.component.html',
    styleUrls: ['./validation-result.component.scss']
})
export  class ValidationResultComponent implements OnInit {

    itemAndAttributeSet: ItemAndAttributeSet;

    @Input() items: Item[];
    @Input() attributes: Attribute[];
    @Input() validationResult: ValidationResult;
    @Input() rules: Rule[];
    @Input() view: View;

    currentRule: Rule;
    currentItem: Item;

    ngOnInit(): void {
        this.itemAndAttributeSet = {
           attributes: this.attributes,
           items: this.items
        };
    }

    onDataTableSearchEvent($event: ItemSearchComponentEvent) {
    }

    onDataTableEvent($event: DataTableComponentEvent) {
    }
}
