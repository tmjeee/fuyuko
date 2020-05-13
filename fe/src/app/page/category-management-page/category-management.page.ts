import {Component, OnInit} from "@angular/core";
import {ViewService} from "../../service/view-service/view.service";
import {CategoryService} from "../../service/category-service/category.service";
import {ItemService} from "../../service/item-service/item.service";
import {NotificationsService} from "angular2-notifications";
import {AttributeService} from "../../service/attribute-service/attribute.service";
import {CategoryWithItems} from "../../model/category.model";
import {View} from "../../model/view.model";
import {tap} from "rxjs/operators";
import {GetCategoriesWithItemsFn} from "../../component/category-component/category-management.component";
import {Observable} from "rxjs";



@Component({
   templateUrl: './category-management.page.html',
   styleUrls: ['./category-management.page.scss']
})
export class CategoryManagementPageComponent implements OnInit {

   loading: boolean;
   categoriesWithItems: CategoryWithItems[];
   view: View;

   getCategoriesWithItemsFn: GetCategoriesWithItemsFn;

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

      this.viewService.asObserver().pipe(
         tap((v: View) => {
            this.view = v;
            console.log('******* view', this.view);
            this.loading = false;
         })
      ).subscribe();
   }
}