import {Component, EventEmitter, Input, Output} from "@angular/core";
import {PricingStructure, PricingStructureItem} from "../../model/pricing-structure.model";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {TableItem} from "../../model/item.model";
import {CollectionViewer, DataSource, SelectionModel} from "@angular/cdk/collections";
import {BehaviorSubject, Observable} from "rxjs";


export class DataTableDataSource extends DataSource<PricingStructureItem> {

    subject: BehaviorSubject<PricingStructureItem[]> = new BehaviorSubject([]);

    connect(collectionViewer: CollectionViewer): Observable<PricingStructureItem[]> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
    }

    update(items: PricingStructureItem[]) {
        this.subject.next(items);
    }
}

export interface PricingStructureAddItemsComponentEvent {
    type: 'add';
    pricingStructure: PricingStructure;
    pricingStructureItems: PricingStructureItem[];
}

@Component({
    selector: 'app-pricing-structure-add-items',
    templateUrl: './pricing-structure-add-items.component.html',
    styleUrls: ['./pricing-structure-add-items.component.scss']
})
export class PricingStructureAddItemsComponent {

    @Input() pricingStructure: PricingStructure;
    @Input() pricingStructureItems: PricingStructureItem[];
    @Output() events: EventEmitter<PricingStructureAddItemsComponentEvent>;

    selectionModel: SelectionModel<PricingStructureItem>;

    dataSource: DataTableDataSource;

    constructor() {
        this.events = new EventEmitter<PricingStructureAddItemsComponentEvent>();
        this.selectionModel = new SelectionModel(true, []);
        this.dataSource = new DataTableDataSource();
    }


    masterToggle($event: MatCheckboxChange) {
        if (this.pricingStructureItems.length > 0 &&
            this.selectionModel.selected.length === this.pricingStructureItems.length) {
            this.selectionModel.clear();
        } else {
            this.pricingStructureItems.forEach((i: PricingStructureItem) => {
                this.selectionModel.select(i);
            });
        }
    }


    isMasterToggleChecked(): boolean {
        return (this.pricingStructureItems.length > 0 &&
            this.selectionModel.selected.length === this.pricingStructureItems.length);
    }


    isMasterToggleIndetermine(): boolean {
        return (this.pricingStructureItems.length > 0 &&
            this.selectionModel.selected.length > 0 &&
            this.selectionModel.selected.length < this.pricingStructureItems.length);
    }


    nonMasterToggle($event: MatCheckboxChange, pricingStructureItem: PricingStructureItem) {
        if (this.selectionModel.isSelected(pricingStructureItem)) {
            this.selectionModel.deselect(pricingStructureItem);
        } else {
            this.selectionModel.select(pricingStructureItem);
        }
    }

    isNonMasterToggleChecked(pricingStructureItem: PricingStructureItem): boolean {
        return this.selectionModel.isSelected(pricingStructureItem);
    }

    addToPricingStructure($event: MouseEvent) {
        this.events.emit({
            type: 'add',
            pricingStructure: this.pricingStructure,
            pricingStructureItems: this.selectionModel.selected
        });
    }
}
