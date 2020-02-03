import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {Item} from '../../model/item.model';
import {FlatTreeControl} from '@angular/cdk/tree';
import {ValidationError, ValidationResult} from '../../model/validation.model';
import {Observable, Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Rule} from '../../model/rule.model';

interface Node {
    i: Item;
    r: Rule;
    rs: Rule[];
    e: ValidationError;
    es: ValidationError[];
    isItem: boolean;
    isError: boolean;
    isRule: boolean;
    name: string;
    children: Node[];
}

const findValidationErrors = (i: Item, vr: ValidationResult): ValidationError[] => {
    const err: ValidationError[] = vr.errors.filter((er: ValidationError) => er.itemId === i.id);
    return err;
};

const findRule = (rId: number, rules: Rule[]): Rule => {
   return rules.find((r: Rule) => r.id === rId);
};

const createNode = (i: Item, vr: ValidationResult, rules: Rule[]): Node => {
    const n: Node = {
        i,
        r: null,
        rs: [],
        name: i ? i.name : 'unknown item',
        isItem: true,
        isError: false,
        isRule: false,
        es: [],
        e: null,
        children: []
    };
    if (vr && i) { // add rule and errors as children
        const m: Map<number /* ruleId */, Node> = new Map();
        const err: ValidationError[] = findValidationErrors(i, vr);
        for (const errr of err) {
            // add rule as children
            if (!m.has(errr.ruleId)) {
               const r: Rule = findRule(errr.ruleId, rules);
               const rn: Node = {
                   i,
                   r,
                   rs: r ? [r] : [],
                   name: `Rule #${errr.ruleId}`,
                   isError: false,
                   isRule: true,
                   isItem: false,
                   e: null,
                   es: [],
                   children: []
               };
               m.set(errr.ruleId, rn);
               if (r) {
                   n.rs.push(r);
               }
               n.children.push(rn);
            }
            // add error as children of rule
            const rr: Rule = findRule(errr.ruleId, rules);
            const nn: Node = {
                i,
                name: `Validation Error #${errr.id}`,
                r: rr,
                rs: rr ? [rr] : [],
                isError: true,
                isItem: false,
                isRule: false,
                e: errr,
                es: err,
                children: []
            };
            n.es.push(errr);
            m.get(errr.ruleId).es.push(errr);
            m.get(errr.ruleId).children.push(nn);
        }
    }
    return n;
};

const merge = (items: Item[], vr: ValidationResult, rules: Rule[]): Node[] => {
    const a = [];
    for (const item of items) {
        const n: Node = mergeRecursively(item, vr, rules);
        a.push(n);
    }
    return a;
};

const mergeRecursively = (item: Item, vr: ValidationResult, rules: Rule[]): Node => {
    const p =  createNode(item, vr, rules);
    for (const c of item.children) {
        p.children.push(mergeRecursively(c, vr, rules));
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
    type: 'selection-item-changed' | 'selection-error-changed' | 'selection-rule-changed';
    rule: Rule;                     // available when 'selection-error-changed' | 'selection-rule-changed'
    item: Item;                     // available when 'selection-item-changed' | 'selection-rule-changed' | 'selection-error-changed
    errors: ValidationError[];      // available when 'selection-item-changed' | 'selection-rule-changed' | 'selection-error-changed
    error: ValidationError;         // available when 'selection-error-changed'
}

@Component({
   selector: 'app-validation-result-tree',
   templateUrl: './validation-result-tree.component.html',
   styleUrls: ['./validation-result-tree.component.scss']
})
export class ValidationResultTreeComponent implements OnInit, OnDestroy {

    @Input() items: Item[];
    @Input() rules: Rule[];
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
    }

    isNodeSelected(n: Flattened): boolean {
        return (n === this.selected);
    }

    private b(ns: Flattened[], itemId: number) {
        for (const n of ns) {
            if (n.node.i && n.node.i.id === itemId) {
                return n;
            }
            const children: Flattened[] = this.treeControl.getDescendants(n);
            if (children) {
                const d: Flattened = this.b(children, itemId);
                if (d) {
                    return d;
                }
            }
        }
        return null;
    }

    handleExternalItemChange(i: Item) {
        console.log('******* handleExternalItemChange (tree)');
        const f: Flattened = this.b(this.treeControl.dataNodes, i.id);
        console.log('*** f', f);
        if (f && this.selected !== f) {
            this.selected = f;
            this.treeControl.expand(f);
            // this.fireEvent(f);
        }
    }

    fireEvent(n: Flattened) {
        if (n.node.isItem) {
            this.event.emit({
                type: 'selection-item-changed',
                rule: null,
                item: n.node.i,
                errors: n.node.es,
                error: null
            });
        } else if (n.node.isRule) {
            this.event.emit({
                type: 'selection-rule-changed',
                rule: n.node.r,
                item: n.node.i,
                errors: n.node.es,
                error: null
            });
        } else if (n.node.isError) {
            this.event.emit({
                type: 'selection-error-changed',
                rule: n.node.r,
                item: n.node.i,
                errors: n.node.es,
                error: n.node.e
            });
        }
    }

    onNodeClicked($event: MouseEvent, n: Flattened) {
        this.selected = n;
        this.fireEvent(n);
    }

    hasChild(index: number, n: Flattened)  {
        return n.expandable;
    }

    ngOnInit(): void {
        if (this.observable) {
            this.subscription = this.observable.pipe(
                tap((i: Item) => {
                    if (i) {
                        this.handleExternalItemChange(i);
                    }
                })
            ).subscribe();
        }
        const n: Node[] = merge(this.items, this.validationResult, this.rules);
        this.datasource.update(n);
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}

