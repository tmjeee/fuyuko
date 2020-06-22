import {Component, EventEmitter, Input, Output} from "@angular/core";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, Observable} from "rxjs";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatRadioChange} from "@angular/material/radio";
import {CustomBulkEdit} from "../../model/custom-bulk-edit.model";
import {animate, state, style, transition, trigger} from "@angular/animations";


export class InternalDataSource implements DataSource<CustomBulkEdit> {

   subject: BehaviorSubject<CustomBulkEdit[]> = new BehaviorSubject<CustomBulkEdit[]>([]);


   connect(collectionViewer: CollectionViewer): Observable<CustomBulkEdit[] | ReadonlyArray<CustomBulkEdit>> {
      return this.subject.asObservable();
   }

   disconnect(collectionViewer: CollectionViewer): void {
      this.subject.complete();
   }

   update(customBulkEdits: CustomBulkEdit[]) {
      const r: CustomBulkEdit[] = [];
      customBulkEdits.forEach((c: CustomBulkEdit) => {
         r.push(c, { ...c, detail: true } as CustomBulkEdit);
      });
      this.subject.next(r);
   }
}

export interface CustomBulkEditListComponentEvent {
   type: 'selected';
   customBulkEdit: CustomBulkEdit;
}

@Component({
   selector: 'app-custom-bulk-edit-list',
   templateUrl: './custom-bulk-edit-list.component.html',
   styleUrls: ['./custom-bulk-edit-list.component.scss'],
   animations: [
      trigger('detailExpand', [
         state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden', display: 'none'})),
         state('expanded', style({height: '*', visibility: 'visible', display: 'table-row'})),
         transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
   ],
})
export class CustomBulkEditListComponent {

   @Input() customBulkEdits: CustomBulkEdit[];
   @Output() events: EventEmitter<CustomBulkEditListComponentEvent>;

   dataSource: InternalDataSource;
   columnsToDisplay: string[];
   expandedColumnsToDisplay: string[];

   formGroup: FormGroup;
   formControl: FormControl;

   expandedCustomBulkEdit: CustomBulkEdit // customBulkEdit that is row expanded

   constructor(private formBuilder: FormBuilder) {
      this.formControl = this.formBuilder.control('');
      this.formGroup = this.formBuilder.group({
         "radio": this.formControl
      });
      this.columnsToDisplay = ['select', 'action', 'name', 'description'];
      this.expandedColumnsToDisplay = ['expanded'];
      this.dataSource = new InternalDataSource();
      this.events = new EventEmitter<CustomBulkEditListComponentEvent>();
   }

   isRowExpanded(customBulkEdit: CustomBulkEdit): boolean {
      const b =  this.expandedCustomBulkEdit && this.expandedCustomBulkEdit.id === customBulkEdit.id;
      return b;
   }

   masterRowClicked(customBulkEdit: CustomBulkEdit) {
      if (this.expandedCustomBulkEdit && this.expandedCustomBulkEdit.id === customBulkEdit.id) { // already expanded, click on same item toggle expansion
         this.expandedCustomBulkEdit = null;
      } else {
         this.expandedCustomBulkEdit = customBulkEdit;
      }
   }

   isChildRow(index: number, customBulkEdit: CustomBulkEdit): boolean {
      return  customBulkEdit.hasOwnProperty('detail');
   }

   ngOnInit(): void {
      this.dataSource.update(this.customBulkEdits);
   }

   onRadioChange($event: MatRadioChange) {
      const m: CustomBulkEdit = $event.value;
      this.events.emit({
         type: 'selected',
         customBulkEdit: m
      });
   }

}