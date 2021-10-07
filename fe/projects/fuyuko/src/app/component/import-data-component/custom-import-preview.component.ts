import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomDataImport, ImportScriptInputValue, ImportScriptPreview} from '@fuyuko-common/model/custom-import.model';
import {CustomImportPreviewFn} from './custom-import-wizard.component';
import {finalize, tap} from 'rxjs/operators';
import {View} from '@fuyuko-common/model/view.model';


export interface CustomImportPreviewComponentEvent {
    preview: ImportScriptPreview;
}



@Component({
   selector: 'app-custom-import-preview',
   templateUrl: './custom-import-preview.component.html',
   styleUrls: ['./custom-import-preview.component.scss']
})
export class CustomImportPreviewComponent implements OnInit {

   @Input() view!: View;
   @Input() customDataImport!: CustomDataImport;
   @Input() inputValues: ImportScriptInputValue[] = [];
   @Input() previewFn!: CustomImportPreviewFn;

   @Output() events: EventEmitter<CustomImportPreviewComponentEvent>;

   preview?: ImportScriptPreview;
   datasource: {[key: string]: string}[] = [];
   ready = false ;


    constructor() {
        this.events = new EventEmitter<CustomImportPreviewComponentEvent>();
    }

   ngOnInit(): void {
        this.reload();
   }

   reload() {
       this.ready = false;
       this.datasource = [];
       this.previewFn(this.view, this.customDataImport, this.inputValues).pipe(
           tap((r: ImportScriptPreview) => {
              this.preview = r;
              if (this.preview && this.preview.rows && this.preview.columns) {
                  for (const row of this.preview.rows) {
                      const o2 = this.preview.columns.reduce((o: { [k: string]: string }, col: string) => {
                          o[col] = row[col];
                          return o;
                      }, {});
                      this.datasource.push(o2);
                  }
                  this.events.emit({
                      preview: this.preview
                  });
              }
              this.ready = true;
           }),
           finalize(() => this.ready = true)
       ).subscribe();
   }
}
