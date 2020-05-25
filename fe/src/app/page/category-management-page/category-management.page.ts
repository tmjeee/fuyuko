import {Component, OnInit} from "@angular/core";
import {ViewService} from "../../service/view-service/view.service";
import {CategoryService} from "../../service/category-service/category.service";
import {ItemService} from "../../service/item-service/item.service";
import {NotificationsService} from "angular2-notifications";
import {AttributeService} from "../../service/attribute-service/attribute.service";
import {CategorySimpleItem, CategoryWithItems} from "../../model/category.model";
import {View} from "../../model/view.model";
import {tap} from "rxjs/operators";
import {
    AddCategoryFn, AddItemsToCategoryFn, DeleteCategoryFn, EditCategoryFn,
    GetCategoriesWithItemsFn,
    GetCategorySimpleItemsInCategoryFn, GetCategorySimpleItemsNotInCategoryFn, RemoveItemsFromCategoryFn
} from "../../component/category-component/category-management.component";
import {Observable} from "rxjs";
import {ApiResponse, PaginableApiResponse} from "../../model/api-response.model";
import {LimitOffset} from "../../model/limit-offset.model";
import {toNotifications} from "../../service/common.service";

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
               private attributeService: AttributeService) {
      this.categoriesWithItems = [];
   }

   ngOnInit(): void {
      this.loading = true;

      this.getCategoriesWithItemsFn = (viewId: number): Observable<CategoryWithItems[]> => {
          return this.categoryService.getCategoriesWithItems(viewId).pipe(
              tap((r: CategoryWithItems[]) => {
                  this.categoriesWithItems = r;
              })
          );
      };

      this.addItemsToCategoryFn = (categoryId: number, items: CategorySimpleItem[]): Observable<ApiResponse> => {
          return this.categoryService.addItemsToCategory(this.view.id, categoryId, items)
              .pipe(
                  tap((r: ApiResponse) => toNotifications(this.notificationsService, r))
              );
      };
      
      this.removeItemsFromCategoryFn = (categoryId: number, items: CategorySimpleItem[]): Observable<ApiResponse> => {
          return this.categoryService.removeItemsFromCategory(this.view.id, categoryId, items)
              .pipe(
                  tap((r: ApiResponse) => toNotifications(this.notificationsService, r))
              );
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

      this.viewService.asObserver().pipe(
         tap((v: View) => {
            this.view = v;
            this.loading = false;
         })
      ).subscribe();
   }
}