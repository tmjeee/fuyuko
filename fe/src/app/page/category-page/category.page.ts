import {Component, OnInit} from "@angular/core";
import {CategoryService} from "../../service/category-service/category.service";
import {ViewService} from "../../service/view-service/view.service";
import {tap} from "rxjs/operators";
import {View} from "../../model/view.model";
import {CategoryWithItems} from "../../model/category.model";


@Component({
    templateUrl: './category.page.html',
    styleUrls: ['./category.page.scss']
})
export class CategoryPageComponent implements OnInit {

    treeLoading: boolean;
    categoriesWithItems: CategoryWithItems[];

    constructor(private viewService: ViewService, private categoryService: CategoryService) {
        this.categoriesWithItems = [];
    }

    ngOnInit(): void {
        this.viewService.asObserver().pipe(
            tap((v: View) => {
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