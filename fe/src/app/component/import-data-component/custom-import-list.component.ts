import {Component, Input} from "@angular/core";
import {CustomDataImport} from "../../model/custom-import.model";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, Observable} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";

export class InternalDataSource implements DataSource<CustomDataImport> {

    subject: BehaviorSubject<CustomDataImport[]> = new BehaviorSubject<CustomDataImport[]>([]);


    connect(collectionViewer: CollectionViewer): Observable<CustomDataImport[] | ReadonlyArray<CustomDataImport>> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
    }

    update(customDataImport: CustomDataImport[]) {
        this.subject.next(customDataImport);
    }
}

@Component({
    selector: 'app-custom-import-list',
    templateUrl: './custom-import-list.component.html',
    styleUrls: ['./custom-import-list.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class CustomImportListComponent {

    @Input() customDataImports: CustomDataImport[];

    dataSource: InternalDataSource;
    columnsToDisplay: string[];
    expandedColumnsToDisplay: string[];

    expandedCustomDataImport: CustomDataImport;

    constructor() {
        this.columnsToDisplay = ['name', 'description'];
        this.expandedColumnsToDisplay = [''];
        this.dataSource = new InternalDataSource();
    }

    isRowExpanded(customDataImport: CustomDataImport): boolean {
        return this.expandedCustomDataImport === customDataImport;
    }

    masterRowClicked(customDataImport: CustomDataImport) {
        this.expandedCustomDataImport = customDataImport;
    }
}