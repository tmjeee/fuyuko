import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
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
    styleUrls: ['./category.component.scss']
})
export class CategoryTreeComponent implements OnInit {

    @Input() categoriesWithItem: CategoryWithItems[]
    @Output() events: EventEmitter<CategoryTreeComponentEvent>;

    currentlySelectedTreeNode: TreeNode;

    treeControl: FlatTreeControl<TreeNode>;
    treeFlatter: MatTreeFlattener<CategoryWithItems | CategorySimpleItem, TreeNode>;
    dataSource: MatTreeFlatDataSource<CategoryWithItems | CategorySimpleItem, TreeNode>;

    constructor() {
        this.events = new EventEmitter<CategoryTreeComponentEvent>();
        this.treeControl = new FlatTreeControl<TreeNode>(
            (n: TreeNode) => n.level,
            (n: TreeNode) => n.expandable
        );

        this.treeFlatter = new MatTreeFlattener<CategoryWithItems | CategorySimpleItem, TreeNode>(
            (categoryWithItems: CategoryWithItems | CategorySimpleItem, level: number): TreeNode => {
                return {
                   name: categoryWithItems.name,
                   level,
                   type: (categoryWithItems as CategoryWithItems).children ? 'category' : 'item',
                   expandable: (((categoryWithItems as CategoryWithItems).children && !!(categoryWithItems as CategoryWithItems).children.length) ||
                                ((categoryWithItems as CategoryWithItems).items && !!(categoryWithItems as CategoryWithItems).items.length)),
                   isCurrentlyInExpandedState: false,
                   currentCategoryWithItems: (categoryWithItems as CategoryWithItems).children ? (categoryWithItems as CategoryWithItems) : null,
                   categoriesWithItems: this.categoriesWithItem,
                   currentItem: (categoryWithItems as CategoryWithItems).children ?  null : categoryWithItems as CategorySimpleItem
                };
            },
            (n: TreeNode) => n.level,
            (n: TreeNode) => n.expandable,
            (n: CategoryWithItems) => (n as CategoryWithItems).children ? [...n.children, ...n.items] : null
        );

        this.dataSource = new MatTreeFlatDataSource<CategoryWithItems | CategorySimpleItem , TreeNode>(this.treeControl, this.treeFlatter);
    }

    ngOnInit(): void {
        this.dataSource.data = this.categoriesWithItem;
    }

    hasChild(_: number, node: TreeNode): boolean {
        return node.expandable;
    }

    onTreeExpandIconClicked(node: TreeNode) {
        node.isCurrentlyInExpandedState = !node.isCurrentlyInExpandedState;
    }

    onTreeNodeClicked($event: MouseEvent, node: TreeNode) {
        this.currentlySelectedTreeNode = node;
        this.events.emit({
           type: "node-selected",
           node
        } as CategoryTreeComponentEvent);
    }
}