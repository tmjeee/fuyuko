import {Component, EventEmitter, Input, Output} from '@angular/core';
import {View} from '@fuyuko-common/model/view.model';
import {finalize, tap} from 'rxjs/operators';
import {
   CustomBulkEdit,
   CustomBulkEditScriptInputValue,
   CustomBulkEditScriptPreview
} from '@fuyuko-common/model/custom-bulk-edit.model';
import {CustomBulkEditPreviewFn} from './custom-bulk-edit-wizard.component';


export interface CustomBulkEditPreviewComponentEvent {
   preview: CustomBulkEditScriptPreview;
}


@Component({
   selector: 'app-custom-bulk-edit-preview',
   templateUrl: './custom-bulk-edit-preview.component.html',
   styleUrls: ['./custom-bulk-edit-preview.component.scss']
})
export class CustomBulkEditPreviewComponent {

   @Input() view: View;
   @Input() customBulkEdit: CustomBulkEdit;
   @Input() inputValues: CustomBulkEditScriptInputValue[];
   @Input() previewFn: CustomBulkEditPreviewFn;

   @Output() events: EventEmitter<CustomBulkEditPreviewComponentEvent>;

   preview: CustomBulkEditScriptPreview;
   datasource: {[key: string]: string}[];
   ready: boolean;


   constructor() {
      this.events = new EventEmitter<CustomBulkEditPreviewComponentEvent>();
   }

   ngOnInit(): void {
      this.reload();
   }

   reload() {
      this.ready = false;
      this.datasource = [];
      this.previewFn(this.view, this.customBulkEdit, this.inputValues).pipe(
          tap((r: CustomBulkEditScriptPreview) => {
             this.preview = r;
             for (const row of this.preview.rows) {
                const o = this.preview.columns.reduce((o: {[k: string]: string}, col: string) => {
                   o[col] = row[col];
                   return o;
                }, {});
                this.datasource.push(o);
             }
             this.events.emit({
                preview: this.preview
             });
             this.ready = true;
          }),
          finalize(() => this.ready = true)
      ).subscribe();
   }
}
