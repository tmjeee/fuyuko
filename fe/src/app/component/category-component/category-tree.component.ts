import {Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from "@angular/core";
import {CategorySimpleItem, CategoryWithItems} from "../../model/category.model";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {FlatTreeControl} from "@angular/cdk/tree";

export interface TreeNode {
    name: string;
    level: number;
    expandable: boolean;
    type: 'category' | 'item',
    isCurrentlyInExpandedState: boolean;

    currentCategoryWithItems: CategoryWithItems;
    categoriesWithItems: CategoryWithItems[];
    currentItem: {id: number, name: string, description: string};
};

export interface CategoryTreeComponentEvent {
    type: 'node-selected',
    node: TreeNode
};


const isCategoryWithItem = (i: CategoryWithItems | CategorySimpleItem): i is CategoryWithItems => {
    return (i as CategoryWithItems).children !== undefined;
}

@Component({
    selector: 'app-category-tree',
    templateUrl: './category-tree.component.html',
    styleUrls: ['./category-tree.component.scss']
})
export class CategoryTreeComponent implements OnInit, OnChanges {

    @Input() categoriesWithItems: CategoryWithItems[]
    @Input() includeItems: boolean;
    @Input() selectedCategoryId: number;
    @Output() events: EventEmitter<CategoryTreeComponentEvent>;

    currentlySelectedTreeNode: TreeNode;

    tmp: Set<number>;  // store the id of category that is expanded
    treeNodeNeesExpanding: TreeNode[] = []; // keeps the TreeNode that needs expanding

    treeControl: FlatTreeControl<TreeNode>;
    treeFlatter: MatTreeFlattener<CategoryWithItems | CategorySimpleItem, TreeNode>;
    dataSource: MatTreeFlatDataSource<CategoryWithItems | CategorySimpleItem, TreeNode>;

    constructor() {
        this.tmp = new Set();
        this.includeItems = true;
        this.events = new EventEmitter<CategoryTreeComponentEvent>();
        this.treeControl = new FlatTreeControl<TreeNode>(
            (n: TreeNode) => n.level,
            (n: TreeNode) => n.expandable
        );

        this.treeFlatter = new MatTreeFlattener<CategoryWithItems | CategorySimpleItem, TreeNode>(
            (categoryWithItems: CategoryWithItems | CategorySimpleItem, level: number): TreeNode => {
                const isCategory: boolean = !!(categoryWithItems as CategoryWithItems).children;
                const treeNode: TreeNode = {
                   name: categoryWithItems.name,
                   level,
                   type: isCategory ? 'category' : 'item',
                   expandable: (()=>{
                       return this.includeItems ?
                           ((((categoryWithItems as CategoryWithItems).children && !!(categoryWithItems as CategoryWithItems).children.length) ||
                               ((categoryWithItems as CategoryWithItems).items && !!(categoryWithItems as CategoryWithItems).items.length))) :
                           ((((categoryWithItems as CategoryWithItems).children && !!(categoryWithItems as CategoryWithItems).children.length)));
                   })(),
                   isCurrentlyInExpandedState: (()=>{
                       if (isCategory) {
                           // return this.tmp.has(categoryWithItems.id);
                           return false;
                       } else {
                           return false;
                       }
                   })(),
                   currentCategoryWithItems: (categoryWithItems as CategoryWithItems).children ? (categoryWithItems as CategoryWithItems) : null,
                   categoriesWithItems: this.categoriesWithItems,
                   currentItem: (categoryWithItems as CategoryWithItems).children ?  null : categoryWithItems as CategorySimpleItem
                };
                if (this.tmp.has(categoryWithItems.id)) {
                   this.treeNodeNeesExpanding.push(treeNode); 
                }
                return treeNode;
            },
            (n: TreeNode) => n.level,
            (n: TreeNode) => n.expandable,
            (n: CategoryWithItems) => (n as CategoryWithItems).children ? (this.includeItems ? [...n.children, ...n.items] : [...n.children]) : null
        );
        this.dataSource = new MatTreeFlatDataSource<CategoryWithItems | CategorySimpleItem , TreeNode>(this.treeControl, this.treeFlatter);
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.categoriesWithItems && changes.categoriesWithItems.currentValue) {
            this.treeNodeNeesExpanding.length=0;
            this.dataSource.data = this.categoriesWithItems;
            for (const treeNode of this.treeNodeNeesExpanding) {
                this.treeControl.expand(treeNode);
            }
        }
    }

    hasChild(_: number, node: TreeNode): boolean {
        return node.expandable;
    }

    onTreeExpandIconClicked(node: TreeNode) {
        node.isCurrentlyInExpandedState = !node.isCurrentlyInExpandedState;
        if (node.currentCategoryWithItems) {
            // if it is a category, store it's id if it is expanded  so we can reconstruct it back later
            // in  constructor's treeFlatter.
            if (node.isCurrentlyInExpandedState) {
                this.tmp.add(node.currentCategoryWithItems.id);
            } else {
                this.tmp.delete(node.currentCategoryWithItems.id);
            }
        }
    }

    onTreeNodeClicked($event: MouseEvent, node: TreeNode) {
        this.currentlySelectedTreeNode = node;
        this.selectedCategoryId = node.currentCategoryWithItems ? node.currentCategoryWithItems.id : null;
        this.events.emit({
           type: "node-selected",
           node
        } as CategoryTreeComponentEvent);
    }
    
    isTreeNodeSelected(node: TreeNode): boolean {
        if (node.type === 'category') {
            return (this.selectedCategoryId && 
                this.selectedCategoryId && 
                node && 
                node.currentCategoryWithItems && 
                this.selectedCategoryId == node?.currentCategoryWithItems?.id);
        } else if (node.type === 'item') {
            return (this.currentlySelectedTreeNode === node);
        }
    }
}