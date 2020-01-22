import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {Item} from '../../model/item.model';
import {FlatTreeControl} from '@angular/cdk/tree';
import {ValidationError, ValidationResult} from '../../model/validation.model';
import {Observable, Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';

interface Node {
    i: Item;
    e: ValidationError;
    es: ValidationError[];
    isItem: boolean;
    isError: boolean;
    name: string;
    children: Node[];
}

const findValidationErrors = (i: Item, vr: ValidationResult): ValidationError[] => {
    const err: ValidationError[] = vr.errors.filter((er: ValidationError) => er.itemId === i.id);
    return err;
};

const createNode = (i: Item, vr: ValidationResult): Node => {
    const n: Node = {
        i,
        name: i ? i.name : 'unknown item',
        isItem: true,
        isError: false,
        es: [],
        e: null,
        children: []
    };
    if (vr && i) { // add validation erorrs as children
        const err: ValidationError[] = findValidationErrors(i, vr);
        for (const errr of err) {
            const nn: Node = {
                i,
                name: `Validation Error #${errr.id}`,
                isError: true,
                isItem: false,
                e: errr,
                es: err,
                children: []
            };
            n.es.push(errr);
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

export interface ValidationResultTreeComponentEvent {
    type: 'selection-item-changed' | 'selection-error-changed';
    item: Item;                    // available when 'selection-item-changed'
    errors: ValidationError[];      // available when 'selection-item-changed'
    error: ValidationError;         // available when 'selection-error-changed' represents selected error node
}

@Component({
   selector: 'app-validation-result-tree',
   templateUrl: './validation-result-tree.component.html',
   styleUrls: ['./validation-result-tree.component.scss']
})
export class ValidationResultTreeComponent implements OnInit, OnDestroy {

    @Input() items: Item[];
    @Input() validationResult: ValidationResult;
    @Input() observable: Observable<Item>;
    @Output() event: EventEmitter<ValidationResultTreeComponentEvent>;

    selected: Flattened;

    subscription: Subscription;

    treeControl: FlatTreeControl<Flattened>;
    treeFlattener: MatTreeFlattener<Node, Flattened>;
    datasource: DataSource;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        this.event = new EventEmitter<ValidationResultTreeComponentEvent>();
        this.treeControl = new FlatTreeControl<Flattened>(getLevelFn, isExpandableFn);
        this.treeFlattener = new MatTreeFlattener<Node, Flattened>(
            (n: Node, level: number) => ({
                node: n,
                expandable: (!!n.children && !!n.children.length),
                level
            } as Flattened),
            getLevelFn, isExpandableFn, getChildrenFn
        );
        this.datasource = new DataSource( this.treeControl, this.treeFlattener);
        if (this.observable) {
            this.subscription = this.observable.pipe(
                tap((i: Item) => {
                    this.handleExternalItemChange(i);
                })
            ).subscribe();
        }
    }

    isNodeSelected(n: Flattened): boolean {
        console.log('**** isNodeSelected', (n === this.selected), n, this.selected);
        return (n === this.selected);
    }

    handleExternalItemChange(i: Item) {
        const f: Flattened = this.treeControl.dataNodes.find((n: Flattened) => n.node.i && n.node.i.id === i.id);
        if (f) {
            this.selected = f;
            this.treeControl.expand(f);
        }
    }

    onNodeClicked($event: MouseEvent, n: Flattened) {
        this.selected = n;
        if (n.node.isItem) {
            this.event.emit({
                type: 'selection-item-changed',
                item: n.node.i,
                errors: n.node.es,
                error: null
            });
        } else if (n.node.isError) {
            this.event.emit({
                type: 'selection-error-changed',
                item: n.node.i,
                errors: n.node.es,
                error: n.node.e
            });
        }
    }

    hasChild(index: number, n: Flattened)  {
        return n.expandable;
    }

    ngOnInit(): void {
        const n: Node[] = merge(this.items, this.validationResult);
        this.datasource.update(n);
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}

