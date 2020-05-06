import {Component, Input} from "@angular/core";
import {CategorySimpleItem, CategoryWithItems} from "../../model/category.model";
import {CategoryTreeComponentEvent} from "./category-tree.component";
import {Observable, of} from "rxjs";
import {PaginableApiResponse} from "../../model/api-response.model";
import {Item} from "../../model/item.model";
import {combineAll, finalize, tap} from "rxjs/operators";
import {ItemAndAttributeSet, TableItemAndAttributeSet} from "../../model/item-attribute.model";
import {Attribute} from "../../model/attribute.model";
import {toTableItem} from "../../utils/item-to-table-items.util";

export type GetItemsFn = (viewId: number, itemIds: number[])=> Observable<PaginableApiResponse<Item[]>>
export type GetAttributesFn = (viewId: number) => Observable<Attribute[]>

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent {

    loading: boolean;

    @Input() getItemsFn: GetItemsFn;
    @Input() getAttributesFn: GetAttributesFn;
    @Input() viewId: number;
    @Input() categoriesWithItems: CategoryWithItems[]

    displayType: 'category' | 'item'
    paginableApiResponse: PaginableApiResponse<Item[]>;
    attributes: Attribute[];
    itemAndAttributeSet: TableItemAndAttributeSet;

    onCategoryTreeEvent($event: CategoryTreeComponentEvent) {
        switch($event.node.type) {
            case "category": {
                this.loading = true;
                this.displayType = $event.node.type;
                const itemIds: number[] = $event.node.currentCategoryWithItems.items.reduce((acc: number[], i: CategorySimpleItem) => {
                    acc.push(i.id);
                    return acc;
                }, []);
                of(
                    this.getItemsFn(this.viewId, itemIds),
                    this.getAttributesFn(this.viewId)
                ).pipe(
                    combineAll((r:[PaginableApiResponse<Item[]>, Attribute[]]) => {
                        this.paginableApiResponse = r[0];
                        this.attributes = r[1];
                        this.itemAndAttributeSet = {
                            attributes: this.attributes,
                            tableItems: toTableItem(this.paginableApiResponse.payload)
                        }
                    }),
                    finalize(() => this.loading = false)
                ).subscribe();
                break;
            }
            case "item": {
                this.loading = true;
                this.displayType = $event.node.type;
                of(
                    this.getItemsFn(this.viewId, [$event.node.currentItem.id]),
                    this.getAttributesFn(this.viewId)
                ).pipe(
                    combineAll((r:[PaginableApiResponse<Item[]>, Attribute[]]) => {
                        this.paginableApiResponse = r[0];
                        this.attributes = r[1];
                    }),
                    finalize(() => this.loading = false)
                ).subscribe();
                break;
            }
        }
    }
}