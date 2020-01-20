import {Component, Input} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {Item} from '../../model/item.model';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Validation, ValidationResult} from "../../model/validation.model";

export interface Flattened {
    item: Item;
    expandable: boolean;
    level: number;
}

const getLevelFn = (n: Flattened) => n.level;
const isExpandableFn = (n: Flattened) => n.expandable;
const getChildrenFn = (n: Item) => n.children;

export class DataSource extends MatTreeFlatDataSource<Item, Flattened> {
    constructor(treeControl: FlatTreeControl<Flattened>, treeFlattener: MatTreeFlattener<Item, Flattened>, initialData?: Item[]) {
        super(treeControl, treeFlattener, initialData);
    }

    update(items: Item[]) {
        this.data = items;
    }
}

@Component({
   selector: 'app-validation-result-tree',
   templateUrl: './validation-result-tree.component.html',
   styleUrls: ['./validation-result-tree.component.scss']
})
export class ValidationResultTreeComponent {

    @Input() items: Item[];
    @Input() validationResult: ValidationResult;

    treeControl: FlatTreeControl<Flattened>;
    treeFlattener: MatTreeFlattener<Item, Flattened>;
    datasource: MatTreeFlatDataSource<Item, Flattened>;

    constructor() {
        this.treeControl = new FlatTreeControl<Flattened>(getLevelFn, isExpandableFn);
        this.treeFlattener = new MatTreeFlattener<Item, Flattened>(
            (n: Item, level: number) => ({
                item: n,
                expandable: !!n.children,
                level
            } as Flattened),
            getLevelFn, isExpandableFn, getChildrenFn
        );
        this.datasource = new DataSource( this.treeControl, this.treeFlattener);
    }

    hasChild(index: number, n: Flattened)  {
        return n.expandable;
    }


}
