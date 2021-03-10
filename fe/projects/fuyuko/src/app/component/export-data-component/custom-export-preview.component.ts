import {Component, EventEmitter, Input, Output} from '@angular/core';
import {View} from '@fuyuko-common/model/view.model';
import {finalize, tap} from 'rxjs/operators';
import {CustomDataExport, ExportScriptInputValue, ExportScriptPreview} from '@fuyuko-common/model/custom-export.model';
import {CustomExportPreviewFn} from './custom-export-wizard.component';

export interface CustomExportPreviewComponentEvent {
    preview: ExportScriptPreview;
}

@Component({
    selector: 'app-custom-export-preview',
    templateUrl: './custom-export-preview.component.html',
    styleUrls: ['./custom-export-preview.component.scss']
})
export class CustomExportPreviewComponent {

    @Input() view: View;
    @Input() customDataExport: CustomDataExport;
    @Input() inputValues: ExportScriptInputValue[];
    @Input() previewFn: CustomExportPreviewFn;

    @Output() events: EventEmitter<CustomExportPreviewComponentEvent>;

    preview: ExportScriptPreview;
    datasource: {[key: string]: string}[];
    ready: boolean;


    constructor() {
        this.events = new EventEmitter<CustomExportPreviewComponentEvent>();
    }

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.ready = false;
        this.datasource = [];
        this.previewFn(this.view, this.customDataExport, this.inputValues).pipe(
            tap((r: ExportScriptPreview) => {
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
