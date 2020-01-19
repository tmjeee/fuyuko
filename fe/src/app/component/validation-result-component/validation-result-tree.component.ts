import {Component} from '@angular/core';
import {MatTreeFlatDataSource} from '@angular/material/tree';
import {Item} from '../../model/item.model';

export interface Flattened {
    item: Item;
    expandable: boolean;
    level: number;
}

@Component({
   selector: 'app-validation-tree',
   templateUrl: './validation-result-tree.component.html',
   styleUrls: ['./validation-result-tree.component.scss']
})
export class ValidationResultTreeComponent {

    datasource: MatTreeFlatDataSource<Item, Flattened>;


}
