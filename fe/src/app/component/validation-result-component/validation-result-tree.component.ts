import {Component, Input, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {Item} from '../../model/item.model';
import {FlatTreeControl} from '@angular/cdk/tree';
import {ValidationError, ValidationResult} from '../../model/validation.model';

interface Node {
    i: Item;
    e: ValidationError[];
    name: string;
    children: Node[];
}

const createNode = (i: Item, vr: ValidationResult): Node => {
    const n: Node = {
        i,
        name: i ? i.name : '',
        e: [],
        children: []
    };
    if (vr && i) { // add validation erorrs as children
        const err: ValidationError[] = vr.errors.filter((er: ValidationError) => er.itemId === i.id);
        for (const errr of err) {
            const nn: Node = {
                i: null,
                name: `Validation Error #${errr.id}`,
                e: [],
                children: []
            };
            n.e.push(errr);
            n.children.push(nn);
        }
    }
    return n;
};

const merge = (items: Item[], vr: ValidationResult): Node[] => {
    const a = [];
    for (const item of items) {
        const n: Node = mergeRecursively(item, vr);
        a.push(n);
    }
    return a;
};

const mergeRecursively = (item: Item, vr: ValidationResult): Node => {
    const p =  createNode(item, vr);
    for (const c of item.children) {
        p.children.push(mergeRecursively(c, vr));
    }
    return p;
};

export interface Flattened {
    node: Node;
    expandable: boolean;
    level: number;
}

const getLevelFn = (n: Flattened) => n.level;
const isExpandableFn = (n: Flattened) => n.expandable;
const getChildrenFn = (n: Node) => n.children;

export class DataSource extends MatTreeFlatDataSource<Node, Flattened> {
    constructor(treeControl: FlatTreeControl<Flattened>, treeFlattener: MatTreeFlattener<Node, Flattened>, initialData?: Node[]) {
        super(treeControl, treeFlattener, initialData);
    }

    update(items: Node[]) {
        this.data = items;
    }
}

@Component({
   selector: 'app-validation-result-tree',
   templateUrl: './validation-result-tree.component.html',
   styleUrls: ['./validation-result-tree.component.scss']
})
export class ValidationResultTreeComponent implements OnInit {

    @Input() items: Item[];
    @Input() validationResult: ValidationResult;

    treeControl: FlatTreeControl<Flattened>;
    treeFlattener: MatTreeFlattener<Node, Flattened>;
    datasource: DataSource;

    constructor() {
        this.treeControl = new FlatTreeControl<Flattened>(getLevelFn, isExpandableFn);
        this.treeFlattener = new MatTreeFlattener<Node, Flattened>(
            (n: Node, level: number) => ({
                node: n,
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

    ngOnInit(): void {
        const n: Node[] = merge(this.items, this.validationResult);
        this.datasource.update(n);
    }
}
