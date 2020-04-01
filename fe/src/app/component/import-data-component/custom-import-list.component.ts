import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {CustomDataImport} from "../../model/custom-import.model";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, Observable} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {TableItem} from "../../model/item.model";
import {MatRadioChange} from "@angular/material/radio";
import {FormBuilder, FormControl} from "@angular/forms";

export class InternalDataSource implements DataSource<CustomDataImport> {

    subject: BehaviorSubject<CustomDataImport[]> = new BehaviorSubject<CustomDataImport[]>([]);


    connect(collectionViewer: CollectionViewer): Observable<CustomDataImport[] | ReadonlyArray<CustomDataImport>> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
    }

    update(customDataImports: CustomDataImport[]) {
        const r: CustomDataImport[] = [];
        customDataImports.forEach((c: CustomDataImport) => {
           r.push(c, { ...c, detail: true } as CustomDataImport);
        });
        this.subject.next(r);
    }
}

export interface CustomImportListComponentEvent {
    type: 'selected';
    customDataImport: CustomDataImport;
}

@Component({
    selector: 'app-custom-import-list',
    templateUrl: './custom-import-list.component.html',
    styleUrls: ['./custom-import-list.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden', display: 'none'})),
            state('expanded', style({height: '*', visibility: 'visible', display: 'table-row'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class CustomImportListComponent implements OnInit {

    @Input() customDataImports: CustomDataImport[];
    @Output() events: EventEmitter<CustomImportListComponentEvent>;

    dataSource: InternalDataSource;
    columnsToDisplay: string[];
    expandedColumnsToDisplay: string[];

    expandedCustomDataImport: CustomDataImport;

    formControl: FormControl;

    constructor(private formBuilder: FormBuilder) {
        this.columnsToDisplay = ['select', 'action', 'name', 'description'];
        this.expandedColumnsToDisplay = ['expanded'];
        this.dataSource = new InternalDataSource();
        this.events = new EventEmitter<CustomImportListComponentEvent>();
        this.formControl = this.formBuilder.control('');
    }

    isRowExpanded(customDataImport: CustomDataImport): boolean {
        const b =  this.expandedCustomDataImport && this.expandedCustomDataImport.id === customDataImport.id;
        return b;
    }

    masterRowClicked(customDataImport: CustomDataImport) {
        console.log('**** master row clicked');
        if (this.expandedCustomDataImport && this.expandedCustomDataImport.id === customDataImport.id) { // already expanded, click on same item toggle expansion
            this.expandedCustomDataImport = null;
        } else {
            this.expandedCustomDataImport = customDataImport;
        }
    }

    isChildRow(index: number, customDataImport: CustomDataImport): boolean {
        return  customDataImport.hasOwnProperty('detail');
    }

    ngOnInit(): void {
        this.dataSource.update(this.customDataImports);
    }

    onRadioChange($event: MatRadioChange) {
       const m: CustomDataImport = $event.value;
       this.events.emit({
           type: 'selected',
           customDataImport: m
       });
    }
}