import {Component, OnInit} from "@angular/core";
import {ViewService} from "../../service/view-service/view.service";
import {CategoryService} from "../../service/category-service/category.service";
import {ItemService} from "../../service/item-service/item.service";
import {NotificationsService} from "angular2-notifications";
import {AttributeService} from "../../service/attribute-service/attribute.service";
import {CategorySimpleItem, CategoryWithItems} from "../../model/category.model";
import {View} from "../../model/view.model";
import {finalize, tap} from "rxjs/operators";
import {
    AddCategoryFn, AddItemsToCategoryFn, CategoryManagementComponentTreeDragDropEvent, DeleteCategoryFn, EditCategoryFn,
    GetCategoriesWithItemsFn,
    GetCategorySimpleItemsInCategoryFn, GetCategorySimpleItemsNotInCategoryFn, RemoveItemsFromCategoryFn
} from "../../component/category-component/category-management.component";
import {Observable} from "rxjs";
import {ApiResponse, PaginableApiResponse} from "../../model/api-response.model";
import {LimitOffset} from "../../model/limit-offset.model";
import {toNotifications} from "../../service/common.service";
import {LoadingService} from "../../service/loading-service/loading.service";
import {CategoryTreeComponentDragDropEvent} from "../../component/category-component/category-tree.component";

@Component({
   templateUrl: './category-management.page.html',
   styleUrls: ['./category-management.page.scss']
})
export class CategoryManagementPageComponent implements OnInit {

   loading: boolean;
   categoriesWithItems: CategoryWithItems[];
   view: View;

   getCategoriesWithItemsFn: GetCategoriesWithItemsFn;
   getCategorySimpleItemsInCatgoryFn: GetCategorySimpleItemsInCategoryFn;
   getCategorySimpleItemsNotInCategoryFn: GetCategorySimpleItemsNotInCategoryFn;
   addCategoryFn: AddCategoryFn; 
   editCategoryFn: EditCategoryFn;
   deleteCategoryFn: DeleteCategoryFn;
   addItemsToCategoryFn: AddItemsToCategoryFn;
   removeItemsFromCategoryFn: RemoveItemsFromCategoryFn;
    

   constructor(private viewService: ViewService,
               private categoryService: CategoryService,
               private itemService: ItemService,
               private notificationsService: NotificationsService,
               private loadingService: LoadingService,
               private attributeService: AttributeService) {
      this.categoriesWithItems = [];
   }

   ngOnInit(): void {

      this.getCategoriesWithItemsFn = (viewId: number): Observable<CategoryWithItems[]> => {
          this.loadingService.startLoading();
          return this.categoryService.getCategoriesWithItems(viewId).pipe(
              tap((r: CategoryWithItems[]) => {
                  this.categoriesWithItems = r;
                  this.loadingService.stopLoading();
              })
          );
      };

      this.addItemsToCategoryFn = (categoryId: number, items: CategorySimpleItem[]): Observable<ApiResponse> => {
          return this.categoryService.addItemsToCategory(this.view.id, categoryId, items);
      };
      
      this.removeItemsFromCategoryFn = (categoryId: number, items: CategorySimpleItem[]): Observable<ApiResponse> => {
          return this.categoryService.removeItemsFromCategory(this.view.id, categoryId, items);
      };

      this.addCategoryFn = (parentCategoryId: number, name: string, description: string): Observable<ApiResponse> => {
        return this.categoryService.addCategory(this.view.id, parentCategoryId, name, description)
            .pipe(
                tap((r: ApiResponse) => toNotifications(this.notificationsService, r))
            );
      };
      
      this.editCategoryFn = (categoryId: number, name: string, description: string): Observable<ApiResponse> => {
          return this.categoryService.updateCategory(this.view.id, -1, categoryId, name, description)
              .pipe(
                  tap((r: ApiResponse) => toNotifications(this.notificationsService, r))
              );
      };
      
      this.deleteCategoryFn = (categoryId: number): Observable<ApiResponse> => {
          return this.categoryService.deleteCategory(this.view.id, categoryId)
              .pipe(
                  tap((r: ApiResponse) => toNotifications(this.notificationsService, r))
              );
      };

      this.getCategorySimpleItemsInCatgoryFn = (viewId: number, categoryId: number, limitOffset?: LimitOffset): Observable<PaginableApiResponse<CategorySimpleItem[]>> => {
          return this.categoryService.getCategorySimpleItemsInCategory(viewId, categoryId, limitOffset);
      };
      
      this.getCategorySimpleItemsNotInCategoryFn = (viewId: number, categoryId: number, limitOffset?: LimitOffset): Observable<PaginableApiResponse<CategorySimpleItem[]>> => {
          return this.categoryService.getCategorySimpleItemsNotInCategory(viewId, categoryId, limitOffset);
      };

      this.loading = true;
      this.loadingService.startLoading();
      this.viewService.asObserver().pipe(
         tap((v: View) => {
            this.view = v;
            this.loading = false;
         }),
         finalize(() => {
             this.loading = false;
             this.loadingService.stopLoading();
         })
      ).subscribe();
   }

    onCategoryTreeDragDropEvents($event: CategoryManagementComponentTreeDragDropEvent) {
       switch($event.type) {
          case "drop": {
              this.categoryService.updateCategoryHierarchy(
                  this.view.id,
                  $event.sourceItem.currentCategoryWithItems.id,
                  $event.destinationItem.currentCategoryWithItems.id)
                  .pipe(
                      tap((r: ApiResponse) => {
                          toNotifications(this.notificationsService, r);
                          $event.reloadTreeFn();
                      })
                  ).subscribe();
              break;
          }
           case "move-to-root": {
               this.categoryService.updateCategoryHierarchy(
                   this.view.id,
                   $event.sourceItem.currentCategoryWithItems.id)
                   .pipe(
                       tap((r: ApiResponse) => {
                           toNotifications(this.notificationsService, r);
                           $event.reloadTreeFn();
                       })
                   ).subscribe();
               break;
           }
       }
    }
}