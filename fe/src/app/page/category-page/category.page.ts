import {Component, OnInit} from "@angular/core";
import {CategoryService} from "../../service/category-service/category.service";
import {ViewService} from "../../service/view-service/view.service";
import {map, tap} from "rxjs/operators";
import {View} from "../../model/view.model";
import {CategoryWithItems} from "../../model/category.model";
import {GetAttributesFn, GetItemsFn} from "../../component/category-component/category.component";
import {Attribute} from "../../model/attribute.model";
import {Observable} from "rxjs";
import {AttributeService} from "../../service/attribute-service/attribute.service";
import {PaginableApiResponse} from "../../model/api-response.model";
import {Item} from "../../model/item.model";
import {ItemService} from "../../service/item-service/item.service";


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

    constructor(private viewService: ViewService,
                private categoryService: CategoryService,
                private itemService: ItemService,
                private attributeService: AttributeService) {
        this.categoriesWithItems = [];
    }

    ngOnInit(): void {
        this.getAttributesFn = (viewId: number): Observable<Attribute[]> => {
            return this.attributeService.getAllAttributesByView(viewId).pipe(map((r: PaginableApiResponse<Attribute[]>) => r.payload));
        };
        this.getItemsFn = (viewId: number, itemIds: number[]): Observable<PaginableApiResponse<Item[]>> => {
            return this.itemService.getItemsByIds(viewId, itemIds);
        };

        this.viewService.asObserver().pipe(
            tap((v: View) => {
                this.view = v;
                if (v) {
                    this.treeLoading = true;
                    this.categoryService.getCategoriesWithItems(v.id).pipe(
                        tap((r: CategoryWithItems[]) => {
                            this.categoriesWithItems = r;
                            this.treeLoading = false;
                            console.log('****** page got tree', this.categoriesWithItems);
                        })
                    ).subscribe();
                }
            })
        ).subscribe();
    }

}