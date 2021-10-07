import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {CollectionViewer, DataSource, SelectionModel} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CategorySimpleItem} from '@fuyuko-common/model/category.model';
import {assertDefinedReturn} from "../../utils/common.util";

export interface RowInfo {
    item: CategorySimpleItem;
    expanded: boolean;
}

export class CategoryItemTableDatasource extends DataSource<CategorySimpleItem> {

    subject: BehaviorSubject<CategorySimpleItem[]> = new BehaviorSubject([] as CategorySimpleItem[]);

    connect(collectionViewer: CollectionViewer): Observable<CategorySimpleItem[] | ReadonlyArray<CategorySimpleItem>> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
    }

    update(items: CategorySimpleItem[]) {
        this.subject.next(items);
    }
}


export interface Action {
    id: string; name: string; description: string;
}

export interface CategoryItemTableComponentEvent {
    actionId: string;
    items: CategorySimpleItem[];
}

@Component({
    selector: 'app-category-item-table',
    templateUrl: './category-item-table.component.html',
    styleUrls: ['./category-item-table.component.scss']
})
export class CategoryItemTableComponent implements OnInit, OnChanges {

    displayedColumns: string[]; // the attribute ids

    datasource: CategoryItemTableDatasource;

    @Input() categorySimpleItems: CategorySimpleItem[] = [];
    @Input() actions: Action[] = [];
    @Output() events: EventEmitter<CategoryItemTableComponentEvent>;


    selectionModel: SelectionModel<CategorySimpleItem>;
    rowInfoMap: Map<number, RowInfo>;

    // item id as key

    constructor() {
        this.actions = [];
        this.events = new EventEmitter<CategoryItemTableComponentEvent>();
        this.selectionModel = new SelectionModel<CategorySimpleItem>(true);
        this.rowInfoMap = new Map<number, RowInfo>();
        this.displayedColumns = ['selection', 'name', 'description', 'creationDate', 'lastUpdate'];
        this.datasource = new CategoryItemTableDatasource();
    }

    ngOnInit(): void {
        // this.datasource.update(this.categorySimpleItems);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.categorySimpleItems) {
            const change: SimpleChange = changes.categorySimpleItems;
            const i: CategorySimpleItem[] = change.currentValue ? change.currentValue : [];
            this.datasource.update(i);
        }
    }

    masterToggle($event: MatCheckboxChange) {
        if (this.categorySimpleItems.length > 0 &&
            this.selectionModel.selected.length === this.categorySimpleItems.length) {
            this.selectionModel.clear();
        } else {
            this.categorySimpleItems.forEach((i: CategorySimpleItem) => {
                this.selectionModel.select(i);
            });
        }
    }


    isMasterToggleChecked(): boolean {
        return (this.categorySimpleItems.length > 0 &&
            this.selectionModel.selected.length === this.categorySimpleItems.length);
    }


    isMasterToggleIndetermine(): boolean {
        return (this.categorySimpleItems.length > 0 &&
            this.selectionModel.selected.length > 0 &&
            this.selectionModel.selected.length < this.categorySimpleItems.length);
    }

    nonMasterToggle($event: MatCheckboxChange, item: CategorySimpleItem) {
        if (this.selectionModel.isSelected(item)) {
            this.selectionModel.deselect(item);
        } else {
            this.selectionModel.select(item);
        }
    }

    isNonMasterToggleChecked(item: CategorySimpleItem): boolean {
        return this.selectionModel.isSelected(item);
    }


    isRowExpanded(item: CategorySimpleItem): boolean {
        if (!this.rowInfoMap.has(item.id)) {
            this.rowInfoMap.set(item.id, { item, expanded: false } as RowInfo);
        }
        return assertDefinedReturn(this.rowInfoMap.get(item.id)).expanded;
    }


    rowClicked(item: CategorySimpleItem) {
        if (!this.rowInfoMap.has(item.id)) {
            this.rowInfoMap.set(item.id, { item, expanded: false } as RowInfo);
        }
        assertDefinedReturn(this.rowInfoMap.get(item.id)).expanded =
            !assertDefinedReturn(this.rowInfoMap.get(item.id)).expanded;
    }

    onActionClicked($event: MouseEvent, action: Action) {
        this.events.emit({
            actionId: action.id,
            items: [...this.selectionModel.selected]
        } as CategoryItemTableComponentEvent);
        this.selectionModel.clear();
    }
}
