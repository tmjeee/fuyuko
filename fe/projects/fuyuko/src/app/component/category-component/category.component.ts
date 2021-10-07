import {Component, Input} from '@angular/core';
import {CategorySimpleItem, CategoryWithItems} from '@fuyuko-common/model/category.model';
import {CategoryTreeComponentEvent} from './category-tree.component';
import {Observable, of} from 'rxjs';
import {ApiResponse, PaginableApiResponse} from '@fuyuko-common/model/api-response.model';
import {Item, TableItem} from '@fuyuko-common/model/item.model';
import {combineAll, finalize, tap} from 'rxjs/operators';
import {ItemAndAttributeSet, ItemValueAndAttribute, TableItemAndAttributeSet} from '@fuyuko-common/model/item-attribute.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {toTableItem} from '../../utils/item-to-table-items.util';
import {DataTableComponentEvent} from '../data-table-component/data-table.component';
import {CarouselComponentEvent, CarouselItemImage} from '../carousel-component/carousel.component';
import {ItemSearchComponentEvent} from '../item-search-component/item-search.component';
import {ItemEditorComponentEvent, Type} from '../data-editor-component/item-editor.component';
import {DataEditorEvent} from '../data-editor-component/item-info.component';
import {
    DataThumbnailComponentEvent,
    DataThumbnailSearchComponentEvent
} from '../data-thumbnail-component/data-thumbnail.component';
import {DataListComponentEvent, DataListSearchComponentEvent} from '../data-list-component/data-list.component';
import {Pagination} from '../../utils/pagination.utils';
import {PaginationComponentEvent} from '../pagination-component/pagination.component';
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';

export type GetItemsFn = (viewId: number, itemIds: number[], limitOffset: LimitOffset) => Observable<PaginableApiResponse<Item[]>>;
export type GetAttributesFn = (viewId: number) => Observable<Attribute[]>;
export type SaveOrUpdateTableItemsFn = (modifiedTableItems: TableItem[], deletedTableItems: TableItem[]) => Observable<ApiResponse[]>;
export type MarkItemImageAsPrimaryFn = (itemId: number, image: CarouselItemImage) => Observable<ApiResponse>;
export type DeleteItemImageFn = (itemId: number, image: CarouselItemImage) => Observable<ApiResponse>;
export type UploadItemImageFn = (itemId: number, file: File) => Observable<ApiResponse>;
export type SaveItemInfoFn = (type: Type, item: Item) => Observable<ApiResponse>;
export type SaveItemAttributeValueFn = (item: Item, itemValueAndAttribute: ItemValueAndAttribute) => Observable<ApiResponse>;
export type SaveOrUpdateItemsFn = (modifiedItems: Item[], deletedItems: Item[]) => Observable<ApiResponse[]>;
export type GetFavouriteItemIdsFn = (viewId: number) => Observable<number[]>;
export type AddFavouriteItemsFn = (viewId: number, itemIds: number[]) => Observable<ApiResponse>;
export type RemoveFavouriteItemsFn = (viewId: number, itemIds: number[]) => Observable<ApiResponse>;


@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent {

    loading: boolean;

    @Input() getItemsFn!: GetItemsFn;
    @Input() getAttributesFn!: GetAttributesFn;
    @Input() saveOrUpdateTableItemsFn!: SaveOrUpdateTableItemsFn;
    @Input() markItemImageAsPrimaryFn!: MarkItemImageAsPrimaryFn;
    @Input() deleteItemImageFn!: DeleteItemImageFn;
    @Input() uploadItemImageFn!: UploadItemImageFn;
    @Input() saveItemInfoFn!: SaveItemInfoFn;
    @Input() saveItemAttributeValueFn!: SaveItemAttributeValueFn;
    @Input() saveOrUpdateItemsFn!: SaveOrUpdateItemsFn;
    @Input() getFavouriteItemIdsFn!: GetFavouriteItemIdsFn;
    @Input() addFavouriteItemsFn!: AddFavouriteItemsFn;
    @Input() removeFavouriteItemsFn!: RemoveFavouriteItemsFn;

    @Input() viewId!: number;
    @Input() categoriesWithItems: CategoryWithItems[] = [];

    showCategorySidebar: boolean;

    viewType: 'table' | 'thumbnail' | 'list'; // when displayType is 'category'

    displayType: 'category' | 'item';
    currentCategoryWithItems?: CategoryWithItems;        // when displayType is 'category'
    currentItem?: CategorySimpleItem;                    // when displayType is 'item'
    paginableApiResponse?: PaginableApiResponse<Item[]>;
    attributes: Attribute[] = [];

    tableItemAndAttributeSet?: TableItemAndAttributeSet; // available when displayType is 'category'
    favouritedItemIds: number[] = [];                    // available when displayType is 'category'
    itemAndAttributeSet?: ItemAndAttributeSet;            // available when displayType is 'category'
    item?: Item;
    pagination: Pagination;

    // available when displayType is 'item'

    constructor() {
        this.viewType = 'table';
        this.showCategorySidebar = true;
        this.pagination = new Pagination();
        this.loading = false;
        this.displayType = 'category';
    }


    onDataTableEvent($event: DataTableComponentEvent) {
        switch ($event.type) {
            case 'reload': {
                this.reload();
                break;
            }
            case 'modification': {
                this.saveOrUpdateTableItemsFn($event.modifiedItems ?? [], $event.deletedItems ?? [])
                    .pipe(
                        tap((r: ApiResponse[]) => {
                            this.reload();
                        })
                    ).subscribe();
                break;
            }
            case 'favourite': {
                this.addFavouriteItemsFn(
                    this.viewId,
                    ($event.favouritedItems ?? []).map((i: TableItem) => i.id)
                ).pipe(
                    tap((r: ApiResponse) => {
                        const itemIds: number[] = (($event.favouritedItems ?? []).map((i: TableItem) => i.id));
                        itemIds.reduce((favouritedItemIds: number[], itemId: number) => {
                            if (favouritedItemIds.indexOf(itemId) < 0) {
                                favouritedItemIds.push(itemId);
                            }
                            return favouritedItemIds;
                        }, this.favouritedItemIds);
                        // this.reload();
                    })
                ).subscribe();
                break;
            }
            case 'unfavourite': {
                this.removeFavouriteItemsFn(
                    this.viewId,
                    ($event.favouritedItems ?? []).map((i: TableItem) => i.id)
                ).pipe(
                    tap((r: ApiResponse) => {
                        const itemIds: number[] = (($event.favouritedItems ?? []).map((i: TableItem) => i.id));
                        itemIds.reduce((favouritedItemIds: number[], itemId: number) => {
                            const i = favouritedItemIds.indexOf(itemId);
                            if (i >= 0) {
                                favouritedItemIds.splice(i, 1);
                            }
                            return favouritedItemIds;
                        }, this.favouritedItemIds);
                        // this.reload();
                    })
                ).subscribe();
                break;
            }
        }
    }

    onDataTableCarouselEvent($event: CarouselComponentEvent) {
        switch ($event.type) {
            case 'markAsPrimary': {
                if ($event.image) {
                    this.markItemImageAsPrimaryFn($event.itemId, $event.image).pipe(
                        tap((r: ApiResponse) => {
                            this.reload();
                        })
                    ).subscribe();
                }
                break;
            }
            case 'upload': {
                if ($event.file) {
                    this.uploadItemImageFn($event.itemId, $event.file).pipe(
                        tap((r: ApiResponse) => {
                            this.reload();
                        })
                    ).subscribe();
                }
                break;
            }
            case 'delete': {
                if ($event.image) {
                    this.deleteItemImageFn($event.itemId, $event.image).pipe(
                        tap((r: ApiResponse) => {
                            this.reload();
                        })
                    ).subscribe();
                }
                break;
            }
        }
    }

    onDataTableSearchEvent($event: ItemSearchComponentEvent) {
        // no search enabled
    }

    onItemInfoCarouselEvent($event: CarouselComponentEvent) {
        switch ($event.type) {
            case 'markAsPrimary': {
                if ($event.image) {
                    this.markItemImageAsPrimaryFn($event.itemId, $event.image).pipe(
                        tap((r: ApiResponse) => {
                            this.reload();
                        })
                    ).subscribe();
                }
                break;
            }
            case 'upload': {
                if ($event.file) {
                    this.uploadItemImageFn($event.itemId, $event.file).pipe(
                        tap((r: ApiResponse) => {
                            this.reload();
                        })
                    ).subscribe();
                }
                break;
            }
            case 'delete': {
                if ($event.image) {
                    this.deleteItemImageFn($event.itemId, $event.image).pipe(
                        tap((r: ApiResponse) => {
                            this.reload();
                        })
                    ).subscribe();
                }
                break;
            }
        }
    }

    onItemInfoItemEditorEvent($event: ItemEditorComponentEvent) {
        this.saveItemInfoFn($event.type, $event.item as Item).pipe(
            tap((r: ApiResponse) => {
               this.reload();
            })
        ).subscribe();
    }

    onItemInfoDataEditorEvent($event: DataEditorEvent) {
        this.saveItemAttributeValueFn($event.item, $event.itemValueAndAttribute).pipe(
            tap((r: ApiResponse) => {
                this.reload();
            })
        ).subscribe();
    }


    onThumbnailEvent($event: DataThumbnailComponentEvent) {
        switch ($event.type) {
            case 'reload':
                this.reload();
                break;
            case 'modification':
               this.saveOrUpdateItemsFn($event.modifiedItems, $event.deletedItems).pipe(
                   tap((r: ApiResponse[]) => {
                       this.reload();
                   })
               ).subscribe();
               break;
        }
    }

    onThumbnailCarouselEvent($event: CarouselComponentEvent) {
        switch ($event.type) {
            case 'markAsPrimary': {
                if ($event.image) {
                    this.markItemImageAsPrimaryFn($event.itemId, $event.image).pipe(
                        tap((r: ApiResponse) => {
                            this.reload();
                        })
                    ).subscribe();
                }
                break;
            }
            case 'upload': {
                if ($event.file) {
                    this.uploadItemImageFn($event.itemId, $event.file).pipe(
                        tap((r: ApiResponse) => {
                            this.reload();
                        })
                    ).subscribe();
                }
                break;
            }
            case 'delete': {
                if ($event.image) {
                    this.deleteItemImageFn($event.itemId, $event.image).pipe(
                        tap((r: ApiResponse) => {
                            this.reload();
                        })
                    ).subscribe();
                }
                break;
            }
        }
    }

    onThumbnailSearchEvent($event: DataThumbnailSearchComponentEvent) {
        // no search enabled
    }


    onListEvent($event: DataListComponentEvent) {
        switch ($event.type) {
            case 'reload':
                this.reload();
                break;
            case 'modification':
                this.saveOrUpdateItemsFn($event.modifiedItems, $event.deletedItems).pipe(
                    tap((r: ApiResponse[]) => {
                        this.reload();
                    })
                ).subscribe();
                break;
        }
    }

    onListSearchEvent($event: DataListSearchComponentEvent) {
        // no search enabled
    }

    onListCarouselEvent($event: CarouselComponentEvent) {
        switch ($event.type) {
            case 'markAsPrimary': {
                if ($event.image) {
                    this.markItemImageAsPrimaryFn($event.itemId, $event.image).pipe(
                        tap((r: ApiResponse) => {
                            this.reload();
                        })
                    ).subscribe();
                }
                break;
            }
            case 'upload': {
                if ($event.file) {
                    this.uploadItemImageFn($event.itemId, $event.file).pipe(
                        tap((r: ApiResponse) => {
                            this.reload();
                        })
                    ).subscribe();
                }
                break;
            }
            case 'delete': {
                if ($event.image) {
                    this.deleteItemImageFn($event.itemId, $event.image).pipe(
                        tap((r: ApiResponse) => {
                            this.reload();
                        })
                    ).subscribe();
                }
                break;
            }
        }
    }

    onCategoryTreeEvent($event: CategoryTreeComponentEvent) {
        this.displayType = $event.node.type;
        this.currentCategoryWithItems = $event.node.currentCategoryWithItems;
        this.currentItem = $event.node.currentItem;
        this.reload();
    }

    reload() {
        switch (this.displayType) {
            case 'category': {
                if (this.currentCategoryWithItems) {
                    this.loading = true;
                    const itemIds: number[] = this.currentCategoryWithItems.items.reduce((acc: number[], i: CategorySimpleItem) => {
                        acc.push(i.id);
                        return acc;
                    }, []);
                    of(
                        this.getItemsFn(this.viewId, itemIds, this.pagination.limitOffset()),
                        this.getAttributesFn(this.viewId),
                        this.getFavouriteItemIdsFn(this.viewId),
                    ).pipe(
                        combineAll() as any,
                        tap((r: [PaginableApiResponse<Item[]>, Attribute[], number[]]) => {
                            this.paginableApiResponse = r[0];
                            this.attributes = r[1];
                            this.pagination.update(r[0]);
                            this.tableItemAndAttributeSet = {
                                attributes: this.attributes,
                                tableItems: this.paginableApiResponse.payload ? toTableItem(this.paginableApiResponse.payload) : []
                            };
                            this.itemAndAttributeSet = {
                                attributes: this.attributes,
                                items: this.paginableApiResponse.payload ? this.paginableApiResponse.payload : []
                            };
                            this.favouritedItemIds = r[2];
                            this.loading = false;
                        }),
                        finalize(() => this.loading = false)
                    ).subscribe();
                }
                break;
            }
            case 'item': {
                if (this.currentItem) {
                    this.loading = true;
                    of(
                        this.getItemsFn(this.viewId, [this.currentItem.id], this.pagination.limitOffset()),
                        this.getAttributesFn(this.viewId)
                    ).pipe(
                        combineAll() as any,
                        tap((r: [PaginableApiResponse<Item[]>, Attribute[]]) => {
                            this.paginableApiResponse = r[0];
                            this.item = r[0].payload ? r[0].payload[0] : undefined;
                            this.attributes = r[1];
                        }),
                        finalize(() => this.loading = false)
                    ).subscribe();
                }
                break;
            }
        }

    }

    switchToTabularView($event: MouseEvent) {
       this.viewType = 'table';
    }

    switchToThumbnailView($event: MouseEvent) {
        this.viewType = 'thumbnail';
    }

    switchToListView($event: MouseEvent) {
        this.viewType = 'list';
    }

    toggleCategorySideBar($event: MouseEvent) {
        this.showCategorySidebar = !this.showCategorySidebar;

    }

    onPaginationEvent($event: PaginationComponentEvent) {
        this.pagination.updateFromPageEvent($event.pageEvent);
        this.reload();
    }
}
