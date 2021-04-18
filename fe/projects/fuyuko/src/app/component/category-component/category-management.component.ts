import {
    ChangeDetectorRef,
    Component, EventEmitter,
    Input,
    OnChanges,
    OnInit, Output,
    SimpleChange,
    SimpleChanges
} from '@angular/core';
import {Category, CategorySimpleItem, CategoryWithItems} from '@fuyuko-common/model/category.model';
import {Observable} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';
import {CategoryTreeComponentDragDropEvent, CategoryTreeComponentEvent, TreeNode} from './category-tree.component';
import {ApiResponse, PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {Pagination} from '../../utils/pagination.utils';
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {PaginationComponentEvent} from '../pagination-component/pagination.component';
import {MatDialog} from '@angular/material/dialog';
import {EditCategoryPopupComponent} from './edit-category-popup.component';
import {Action, CategoryItemTableComponentEvent} from './category-item-table.component';
import {isApiResponseSuccess} from '../../service/common.service';

export type GetCategoriesWithItemsFn = (viewId: number) => Observable<CategoryWithItems[]>;
export type GetCategorySimpleItemsInCategoryFn =
    (viewId: number, categoryId: number, limitOffset?: LimitOffset) => Observable<PaginableApiResponse<CategorySimpleItem[]>>;
export type GetCategorySimpleItemsNotInCategoryFn =
    (viewId: number, categoryId: number, limitOffset?: LimitOffset) => Observable<PaginableApiResponse<CategorySimpleItem[]>>;
export type AddCategoryFn = (parentCategoryId: number, name: string, description: string) => Observable<ApiResponse>;
export type EditCategoryFn = (categoryId: number, name: string, description: string) => Observable<ApiResponse>;
export type DeleteCategoryFn = (categoryId: number) => Observable<ApiResponse>;
export type AddItemsToCategoryFn = (categoryId: number, items: CategorySimpleItem[]) => Observable<ApiResponse>;
export type RemoveItemsFromCategoryFn = (categoryId: number, items: CategorySimpleItem[]) => Observable<ApiResponse>;

export interface CategoryManagementComponentTreeDragDropEvent {
    type: 'drop' | 'move-to-root';
    sourceItem: TreeNode;
    destinationItem?: TreeNode;        // only when type is 'drop'
    reloadTreeFn: () => void;
}

@Component({
    selector: 'app-category-management',
    templateUrl: './category-management.component.html',
    styleUrls: ['./category-management.component.scss'],
})
export class CategoryManagementComponent  implements  OnInit, OnChanges {

    treeLoading: boolean;

    @Input() viewId: number;
    @Input() getCategoriesWithItemsFn: GetCategoriesWithItemsFn;
    @Input() getCategorySimpleItemsInCategoryFn: GetCategorySimpleItemsInCategoryFn;
    @Input() getCategorySimpleItemsNotInCategoryFn: GetCategorySimpleItemsNotInCategoryFn;
    @Input() addCategoryFn: AddCategoryFn;
    @Input() editCategoryFn: EditCategoryFn;
    @Input() deleteCategoryFn: DeleteCategoryFn;
    @Input() addItemsToCategoryFn: AddItemsToCategoryFn;
    @Input() removeItemsFromCategoryFn: RemoveItemsFromCategoryFn;
    @Output() categoryTreeDragDropEvents: EventEmitter<CategoryManagementComponentTreeDragDropEvent>;

    selectedTreeNode: TreeNode;
    categoriesWithItems: CategoryWithItems[];
    addableCategoryTableActions: Action[];
    addableCategoryTableItems: CategorySimpleItem[];
    addableCategoryTableItemsPagination: Pagination;
    removableCategoryTableItems: CategorySimpleItem[];
    removableCategoryTableItemsPagination: Pagination;
    removeableCategoryTableActions: Action[];

    constructor(private matDialog: MatDialog,
                private changeDetectorRef: ChangeDetectorRef) {
        this.categoriesWithItems = [];
        this.categoryTreeDragDropEvents = new EventEmitter<CategoryManagementComponentTreeDragDropEvent>();
        this.addableCategoryTableItemsPagination = new Pagination();
        this.removableCategoryTableItemsPagination = new Pagination();
        this.removeableCategoryTableActions = [
            {id: 'removeItemFromCategory', name: 'Remove', description: 'Remove items from selected category'}
        ];
        this.addableCategoryTableActions = [
            {id: 'addItemToCategory', name: 'Add', description: 'Add items to selected category'}
        ];
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.viewId) {
            const simpleChange: SimpleChange = changes.viewId;
            const viewId: number = simpleChange.currentValue;
            const prevViewId: number = simpleChange.previousValue;
            if (prevViewId !== viewId) {
                this.reloadTree(viewId);
            }
        }
    }

    reloadTree(viewId: number) {
        if (viewId) {
            this.treeLoading = true;
            this.getCategoriesWithItemsFn(viewId).pipe(
                tap((r: CategoryWithItems[]) => {
                    this.categoriesWithItems = r;
                }),
                finalize(() => this.treeLoading = false)
            ).subscribe();
        }
    }

    hasCategory(): boolean {
        return (this.categoriesWithItems && !!this.categoriesWithItems.length);
    }

    hasTreeNodeSelected(): boolean {
        return (!!this.selectedTreeNode);
    }

    ngOnInit(): void {
    }


    onCategoryTreeEvents($event: CategoryTreeComponentEvent) {
        switch ($event.type) {
            case 'node-selected':
                this.selectedTreeNode = $event.node;
                const categoryWithItems: CategoryWithItems = $event.node.currentCategoryWithItems;
                if (categoryWithItems) {
                    this.reloadAddableItemsTable(this.viewId, categoryWithItems.id);
                    this.reloadRemoveableItemsTable(this.viewId, categoryWithItems.id);
                }
                break;
        }
    }

    reloadAddableItemsTable(viewId: number, categoryId: number) {
        if (categoryId && viewId) {
            this.getCategorySimpleItemsNotInCategoryFn(viewId, categoryId, this.addableCategoryTableItemsPagination.limitOffset())
                .pipe(
                    tap((r: PaginableApiResponse<CategorySimpleItem[]>) => {
                        this.addableCategoryTableItemsPagination.update(r);
                        this.addableCategoryTableItems = r.payload;
                    })
                ).subscribe();
        }
    }

    reloadRemoveableItemsTable(viewId: number, categoryId: number) {
        if (categoryId && viewId) {
            this.getCategorySimpleItemsInCategoryFn(viewId, categoryId, this.removableCategoryTableItemsPagination.limitOffset())
                .pipe(
                    tap((r: PaginableApiResponse<CategorySimpleItem[]>) => {
                        this.removableCategoryTableItemsPagination.update(r);
                        this.removableCategoryTableItems = r.payload;
                    })
                ).subscribe();
        }
    }

    onAddableCategoryTableItemsPaginationEvent($event: PaginationComponentEvent) {
        this.addableCategoryTableItemsPagination.updateFromPageEvent($event.pageEvent);
    }

    onRemovableCategoryTableItemsPaginationEvent($event: PaginationComponentEvent) {
        this.removableCategoryTableItemsPagination.updateFromPageEvent($event.pageEvent);
    }

    addRootCategory($event: MouseEvent) {
        this.matDialog
            .open(EditCategoryPopupComponent, {width: '90vw', height: '90vh', data: null})
            .afterClosed().pipe(
                tap((r: {id: number, name: string, description: string}) => {
                    if (r) {
                        this.addCategoryFn(-1, r.name, r.description)
                            .pipe(
                                tap((res: ApiResponse) => {
                                    if (isApiResponseSuccess(res)) {
                                        this.reloadTree(this.viewId);
                                    }
                                })
                            ).subscribe();
                    }
                })
        ).subscribe();

    }

    addChildCategory($event: MouseEvent) {
        this.matDialog
            .open(EditCategoryPopupComponent, {width: '90vw', height: '90vh', data: null})
            .afterClosed().pipe(
            tap((r: {id: number, name: string, description: string}) => {
                if (r) {
                    this.addCategoryFn(this.selectedTreeNode.currentCategoryWithItems.id, r.name, r.description)
                        .pipe(
                            tap((res: ApiResponse) => {
                                if (isApiResponseSuccess(res)) {
                                    this.reloadTree(this.viewId);
                                }
                            })
                        ).subscribe();
                }
            })
        ).subscribe();
    }

    deleteCategory($event: MouseEvent) {
        this.deleteCategoryFn(this.selectedTreeNode.currentCategoryWithItems.id).pipe(
            tap((res: ApiResponse) => {
                if (isApiResponseSuccess(res)) {
                    this.selectedTreeNode = null;
                    this.addableCategoryTableItems = [];
                    this.removableCategoryTableItems = [];
                    this.addableCategoryTableItemsPagination.reset();
                    this.removableCategoryTableItemsPagination.reset();
                    this.reloadTree(this.viewId);
                }
            })
        ).subscribe();
    }

    editCategory($event: MouseEvent) {
        const category: Category = this.selectedTreeNode.currentCategoryWithItems;
        this.matDialog
            .open(EditCategoryPopupComponent, {width: '90vw', height: '90vh', data: category})
            .afterClosed().pipe(
                tap((r: {id: number, name: string, description: string}) => {
                    if (r) {
                        this.editCategoryFn(r.id, r.name, r.description).pipe(
                            tap((res: ApiResponse) => {
                                if (isApiResponseSuccess(res)) {
                                    this.reloadTree(this.viewId);
                                }
                            })
                        ).subscribe();
                    }
                })
        ).subscribe();
    }

    moveCategoryToRoot($event: MouseEvent) {
        const category: Category = this.selectedTreeNode.currentCategoryWithItems;
        this.categoryTreeDragDropEvents.emit({
           sourceItem: this.selectedTreeNode,
           destinationItem: null,
           type: 'move-to-root',
           reloadTreeFn: () => {
               this.reloadTree(this.viewId);
           }
        } as CategoryManagementComponentTreeDragDropEvent);
    }

    onAddableCategoryTableEvent($event: CategoryItemTableComponentEvent) {
       const items: CategorySimpleItem[] = $event.items;
       const categoryId: number = this.selectedTreeNode.currentCategoryWithItems.id;
       // add these items to category
       this.reloadAddableItemsTable(this.viewId, categoryId);
       this.addItemsToCategoryFn(categoryId, items).pipe(
           tap((r: ApiResponse) => {
              // this.reloadTree(this.viewId);
              this.reloadAddableItemsTable(this.viewId, categoryId);
              this.reloadRemoveableItemsTable(this.viewId, categoryId);
           })
       ).subscribe();
    }

    onRemoveableCategoryTableEvent($event: CategoryItemTableComponentEvent) {
        const items: CategorySimpleItem[] = $event.items;
        const categoryId: number = this.selectedTreeNode.currentCategoryWithItems.id;
        // remove these items from category
        this.removeItemsFromCategoryFn(categoryId, items).pipe(
            tap((r: ApiResponse) => {
                // this.reloadTree(this.viewId);
                this.reloadAddableItemsTable(this.viewId, categoryId);
                this.reloadRemoveableItemsTable(this.viewId, categoryId);
            })
        ).subscribe();
    }

    onCategoryTreeDragDropEvents($event: CategoryTreeComponentDragDropEvent) {
        this.categoryTreeDragDropEvents.emit({
           type: 'drop',
           sourceItem: $event.sourceItem,
           destinationItem: $event.destinationItem,
           reloadTreeFn: () => {
               this.reloadTree(this.viewId);
           }
        } as CategoryManagementComponentTreeDragDropEvent);
    }

}
