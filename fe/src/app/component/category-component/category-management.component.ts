import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from "@angular/core";
import {CategoryWithItems} from "../../model/category.model";
import {Observable} from "rxjs";
import {finalize, tap} from "rxjs/operators";

export type GetCategoriesWithItemsFn = (viewId: number) => Observable<CategoryWithItems[]>;

@Component({
    selector: 'app-category-management',
    templateUrl: './category-management.component.html',
    styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent  implements  OnInit, OnChanges {

    treeLoading: boolean;

    @Input() viewId: number;
    @Input() getCategoriesWithItemsFn: GetCategoriesWithItemsFn;

    categoriesWithItems: CategoryWithItems[];

    constructor() {
        this.categoriesWithItems = [];
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.viewId) {
            const simpleChange: SimpleChange = changes.viewId;
            const viewId: number = simpleChange.currentValue;
            console.log('**** on change', this.viewId);
            if (viewId) {
                this.treeLoading = true;
                this.getCategoriesWithItemsFn(viewId).pipe(
                    tap((r: CategoryWithItems[]) => {
                        this.categoriesWithItems = r;
                    }),
                    finalize(() => this.treeLoading = false)
                ).subscribe()
            }
        }
    }

    ngOnInit(): void {
    }


}