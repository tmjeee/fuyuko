import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CustomDataImport} from '@fuyuko-common/model/custom-import.model';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatRadioChange} from '@angular/material/radio';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CustomDataExport} from '@fuyuko-common/model/custom-export.model';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';


export class InternalDataSource implements DataSource<CustomDataExport> {

   subject: BehaviorSubject<CustomDataExport[]> = new BehaviorSubject<CustomDataExport[]>([]);


   connect(collectionViewer: CollectionViewer): Observable<CustomDataExport[] | ReadonlyArray<CustomDataExport>> {
      return this.subject.asObservable();
   }

   disconnect(collectionViewer: CollectionViewer): void {
      this.subject.complete();
   }

   update(customDataExports: CustomDataExport[]) {
      const r: CustomDataImport[] = [];
      customDataExports.forEach((c: CustomDataExport) => {
         r.push(c, { ...c, detail: true } as CustomDataImport);
      });
      this.subject.next(r);
   }
}

export interface CustomExportListComponentEvent {
   type: 'selected';
   customDataExport: CustomDataExport;
}

@Component({
   selector: 'app-custom-export-list' ,
   templateUrl: './custom-export-list.component.html',
   styleUrls: ['./custom-export-list.component.scss'],
   animations: [
      trigger('detailExpand', [
         state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden', display: 'none'})),
         state('expanded', style({height: '*', visibility: 'visible', display: 'table-row'})),
         transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
   ],
})
export class CustomExportListComponent {

   @Input() customDataExports: CustomDataExport[];
   @Output() events: EventEmitter<CustomExportListComponentEvent>;

   dataSource: InternalDataSource;
   columnsToDisplay: string[];
   expandedColumnsToDisplay: string[];

   formGroup: FormGroup;
   formControl: FormControl;

   expandedCustomDataImport: CustomDataExport; // customDataExport that is row expanded

   constructor(private formBuilder: FormBuilder) {
      this.formControl = this.formBuilder.control('');
      this.formGroup = this.formBuilder.group({
         radio: this.formControl
      });
      this.columnsToDisplay = ['select', 'action', 'name', 'description'];
      this.expandedColumnsToDisplay = ['expanded'];
      this.dataSource = new InternalDataSource();
      this.events = new EventEmitter<CustomExportListComponentEvent>();
   }

   isRowExpanded(customDataImport: CustomDataImport): boolean {
      const b =  this.expandedCustomDataImport && this.expandedCustomDataImport.id === customDataImport.id;
      return b;
   }

   masterRowClicked(customDataImport: CustomDataImport) {
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
      this.dataSource.update(this.customDataExports);
   }

   onRadioChange($event: MatRadioChange) {
      const m: CustomDataImport = $event.value;
      this.events.emit({
         type: 'selected',
         customDataExport: m
      });
   }
}
