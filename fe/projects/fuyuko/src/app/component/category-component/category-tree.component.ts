import {Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {CategorySimpleItem, CategoryWithItems} from '@fuyuko-common/model/category.model';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import {CdkDragDrop, CdkDragEnd, CdkDragEnter, CdkDragExit, CdkDragSortEvent} from '@angular/cdk/drag-drop';

export interface TreeNode {
    name: string;                                   // node name
    level: number;                                  // level
    expandable: boolean;                            // can this node be expanded (not a leaf node)
    type: 'category' | 'item';                      // is this node an item or category
    isCurrentlyInExpandedState: boolean;            // is this node expanded?

    currentCategoryWithItems?: CategoryWithItems;   // current selected node  as category (if it is a category)
    categoriesWithItems: CategoryWithItems[];       // all categories
    currentItem?: {                                 // current selected node as item (if it is an item)
        id: number,
        name: string,
        description: string,
        creationDate: Date,
        lastUpdate: Date
    };
}

export interface CategoryTreeComponentEvent {
    type: 'node-selected';
    node: TreeNode;
}

export interface CategoryTreeComponentDragDropEvent {
    type: 'drop';
    sourceItem: TreeNode;
    destinationItem: TreeNode;
}


const isCategoryWithItem = (i: CategoryWithItems | CategorySimpleItem): i is CategoryWithItems => {
    return (i as CategoryWithItems).children !== undefined;
};

@Component({
    selector: 'app-category-tree',
    templateUrl: './category-tree.component.html',
    styleUrls: ['./category-tree.component.scss']
})
export class CategoryTreeComponent implements OnInit, OnChanges {

    @Input() categoriesWithItems: CategoryWithItems[];
    @Input() includeItems: boolean;
    @Input() selectedCategoryId?: number;
    @Output() events: EventEmitter<CategoryTreeComponentEvent>;
    @Output() dragDropEvents: EventEmitter<CategoryTreeComponentDragDropEvent>;

    currentlySelectedTreeNode?: TreeNode;
    currentlyDragEnterTreeNode?: TreeNode;

    tmp: Set<number>;  // store the id of category that is expanded
    treeNodeNeesExpanding: TreeNode[] = []; // keeps the TreeNode that needs expanding

    treeControl: FlatTreeControl<TreeNode>;
    treeFlatter: MatTreeFlattener<CategoryWithItems | CategorySimpleItem, TreeNode>;
    dataSource: MatTreeFlatDataSource<CategoryWithItems | CategorySimpleItem, TreeNode>;

    constructor() {
        this.categoriesWithItems = [];
        this.tmp = new Set();
        this.includeItems = true;
        this.events = new EventEmitter<CategoryTreeComponentEvent>();
        this.dragDropEvents = new EventEmitter<CategoryTreeComponentDragDropEvent>();
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
                   expandable: (() => {
                       return this.includeItems ?
                           ((((categoryWithItems as CategoryWithItems).children &&
                                   !!(categoryWithItems as CategoryWithItems).children.length) ||
                               ((categoryWithItems as CategoryWithItems).items &&
                                   !!(categoryWithItems as CategoryWithItems).items.length))) :
                           ((((categoryWithItems as CategoryWithItems).children &&
                               !!(categoryWithItems as CategoryWithItems).children.length)));
                   })(),
                   isCurrentlyInExpandedState: (() => {
                       if (isCategory) {
                           // return this.tmp.has(categoryWithItems.id);
                           return false;
                       } else {
                           return false;
                       }
                   })(),
                   currentCategoryWithItems:
                       (categoryWithItems as CategoryWithItems).children ?
                           (categoryWithItems as CategoryWithItems) : undefined,
                   categoriesWithItems: this.categoriesWithItems,
                   currentItem:
                       (categoryWithItems as CategoryWithItems).children ?
                           undefined : categoryWithItems as CategorySimpleItem
                };
                if (this.tmp.has(categoryWithItems.id)) {
                   this.treeNodeNeesExpanding.push(treeNode);
                }
                return treeNode;
            },
            (n: TreeNode) => n.level,
            (n: TreeNode) => n.expandable,
            (n: CategoryWithItems | CategorySimpleItem) =>
                (n as CategoryWithItems).children ?
                    (this.includeItems ?
                        [...(n as CategoryWithItems).children, ...(n as CategoryWithItems).items] :
                        [...(n as CategoryWithItems).children]) :
                    null
        );
        this.dataSource = new MatTreeFlatDataSource<CategoryWithItems | CategorySimpleItem , TreeNode>(this.treeControl, this.treeFlatter);
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.categoriesWithItems && changes.categoriesWithItems.currentValue) {
            this.treeNodeNeesExpanding.length = 0;
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
        this.selectedCategoryId = node.currentCategoryWithItems ? node.currentCategoryWithItems.id : undefined;
        this.events.emit({
           type: 'node-selected',
           node
        } as CategoryTreeComponentEvent);
    }

    isTreeNodeSelected(node: TreeNode): boolean {
        if (node.type === 'category') {
            return !!(this.selectedCategoryId &&
                this.selectedCategoryId &&
                node &&
                node.currentCategoryWithItems &&
                this.selectedCategoryId === node?.currentCategoryWithItems?.id);
        } else if (node.type === 'item') {
            return (this.currentlySelectedTreeNode === node);
        }
        return false;
    }

    onDrop($event: CdkDragDrop<any, any>) {
        this.currentlyDragEnterTreeNode = undefined;
        const sourceItem: TreeNode = $event.item.data;
        const dropItem: TreeNode = $event.container.data;
        if (sourceItem.currentCategoryWithItems?.id === dropItem.currentCategoryWithItems?.id) {
            // try to move a category into itself, not possible
            return;
        }
        this.dragDropEvents.emit({
           type: 'drop',
           sourceItem,
           destinationItem: dropItem
        } as CategoryTreeComponentDragDropEvent);
        console.log(`**** on drop, drop ${sourceItem.currentCategoryWithItems?.name}  into ${dropItem.currentCategoryWithItems?.name}`);
    }

    onEnter($event: CdkDragEnter<any>) {
        console.log(`**** drag drop on enter ${$event.container.data.name}`);
        this.currentlyDragEnterTreeNode = $event.container.data;
    }

    onExit($event: CdkDragExit<any>) {
        console.log(`***** drag drop on exit ${$event.container.data.name}`);
        this.currentlyDragEnterTreeNode = undefined;
    }

    isCurrentDragEnterTreeNode(n: TreeNode): boolean {
        return (this.currentlyDragEnterTreeNode === n);
    }

    onSorted($event: CdkDragSortEvent<any>) {
        console.log('****** drag drop on sorted', $event.container.data.name);
    }

    onDragEnd($event: CdkDragEnd) {
        console.log('*====== drag end');
        $event.source.element.nativeElement.style.transform = 'none'; // visually reset element to its origin
        const source: any = $event.source;
        source._passiveTransform = { x: 0, y: 0 }; // make it so new drag starts from same origin
    }
}
