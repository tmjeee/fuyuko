import {Component, OnInit} from "@angular/core";
import {CategoryService} from "../../service/category-service/category.service";
import {ViewService} from "../../service/view-service/view.service";
import {combineAll, delay, finalize, map, tap} from "rxjs/operators";
import {View} from "../../model/view.model";
import {CategoryWithItems} from "../../model/category.model";
import {
    DeleteItemImageFn,
    GetAttributesFn,
    GetItemsFn,
    MarkItemImageAsPrimaryFn, SaveItemAttributeValueFn, SaveItemInfoFn, SaveOrUpdateTableItemsFn, UploadItemImageFn
} from "../../component/category-component/category.component";
import {Attribute} from "../../model/attribute.model";
import {forkJoin, Observable, of} from "rxjs";
import {AttributeService} from "../../service/attribute-service/attribute.service";
import {ApiResponse, PaginableApiResponse} from "../../model/api-response.model";
import {Item, TableItem} from "../../model/item.model";
import {ItemService} from "../../service/item-service/item.service";
import {CarouselItemImage} from "../../component/carousel-component/carousel.component";
import {Type} from "../../component/data-editor-component/item-editor.component";
import {ItemValueAndAttribute} from "../../model/item-attribute.model";
import {toNotifications} from "../../service/common.service";
import {NotificationsService} from "angular2-notifications";
import {Pagination} from "../../utils/pagination.utils";
import {LimitOffset} from "../../model/limit-offset.model";
import {LoadingService} from "../../service/loading-service/loading.service";

@Component({
    templateUrl: './category.page.html',
    styleUrls: ['./category.page.scss']
})
export class CategoryPageComponent implements OnInit {

    treeLoading: boolean;
    categoriesWithItems: CategoryWithItems[];
    view: View;
    getAttributesFn: GetAttributesFn;
    getItemsFn: GetItemsFn;
    deleteItemImageFn: DeleteItemImageFn;
    markItemImageAsPrimaryFn: MarkItemImageAsPrimaryFn;
    saveItemAttributeValueFn: SaveItemAttributeValueFn;
    saveItemInfoFn: SaveItemInfoFn;
    saveOrUpdateTableItemsFn: SaveOrUpdateTableItemsFn;
    uploadItemImageFn: UploadItemImageFn;

    constructor(private viewService: ViewService,
                private categoryService: CategoryService,
                private itemService: ItemService,
                private notificationsService: NotificationsService,
                private attributeService: AttributeService,
                private loadingService: LoadingService) {
        this.categoriesWithItems = [];
    }

    ngOnInit(): void {
        this.getAttributesFn = (viewId: number): Observable<Attribute[]> => {
            this.loadingService.startLoading();
            return this.attributeService.getAllAttributesByView(viewId).pipe(
                map((r: PaginableApiResponse<Attribute[]>) => r.payload),
                finalize(() => {
                    this.loadingService.stopLoading();
                })
            );
        };
        this.getItemsFn = (viewId: number, itemIds: number[], limitOffset: LimitOffset): Observable<PaginableApiResponse<Item[]>> => {
            this.loadingService.startLoading();
            return this.itemService.getItemsByIds(viewId, itemIds, limitOffset).pipe(
                finalize(() => {
                    this.loadingService.stopLoading();
                })
            );
        };
        this.deleteItemImageFn = (itemId: number, image: CarouselItemImage) => {
            return this.itemService.deleteItemImage(itemId, image.id).pipe(
                tap((r: ApiResponse) => {
                    toNotifications(this.notificationsService, r);
                })
            );
        };
        this.markItemImageAsPrimaryFn = (itemId: number, image: CarouselItemImage) => {
            return this.itemService.markItemImageAsPrimary(itemId, image.id).pipe(
                tap((r: ApiResponse) => {
                    toNotifications(this.notificationsService, r);
                })
            );
        };
        this.saveItemAttributeValueFn = (item: Item, itemValueAndAttribute: ItemValueAndAttribute) => {
            item[itemValueAndAttribute.attribute.id] = itemValueAndAttribute.itemValue;
            return this.itemService.saveItems(this.view.id, [item]).pipe(
                tap((r: ApiResponse) => {
                   toNotifications(this.notificationsService, r);
                })
            );
        };
        this.saveItemInfoFn = (type: Type, item: Item) => {
            return this.itemService.saveItems(this.view.id, [item]).pipe(
                tap((r: ApiResponse) => {
                    toNotifications(this.notificationsService, r);
                })
            );
        };
        this.saveOrUpdateTableItemsFn = (modifiedTableItems: TableItem[], deletedTableItems: TableItem[]) => {
            const streams:Observable<ApiResponse>[] = [];
            if (modifiedTableItems && modifiedTableItems.length) {
                streams.push(this.itemService.saveTableItems(this.view.id, modifiedTableItems));
            }
            if (deletedTableItems && deletedTableItems.length) {
                streams.push(this.itemService.deleteTableItems(this.view.id, deletedTableItems));
            }
            return forkJoin(streams).pipe(
                tap((r: ApiResponse[]) => {
                    r.forEach((_r: ApiResponse) => toNotifications(this.notificationsService, _r));
                })
            );
        };
        this.uploadItemImageFn = (itemId: number, file: File) => {
            return this.itemService.uploadItemImage(itemId, file).pipe(
                tap((r: ApiResponse) => {
                    toNotifications(this.notificationsService, r);
                })
            )
        };

        this.viewService.asObserver().pipe(
            tap((v: View) => {
                this.view = v;
                if (v) {
                    this.treeLoading = true;
                    this.loadingService.startLoading();
                    this.categoryService.getCategoriesWithItems(v.id).pipe(
                        tap((r: CategoryWithItems[]) => {
                            this.categoriesWithItems = r;
                            this.treeLoading = false;
                        }),
                        finalize(() => {
                            this.treeLoading = false;
                            this.loadingService.stopLoading();
                        })
                    ).subscribe();
                }
            })
        ).subscribe();
    }
}