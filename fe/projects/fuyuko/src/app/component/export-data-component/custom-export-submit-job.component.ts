import {Component, Input, OnInit} from '@angular/core';
import {View} from '@fuyuko-common/model/view.model';
import {finalize, tap} from 'rxjs/operators';
import {
    CustomDataExport,
    ExportScriptInputValue,
    ExportScriptJobSubmissionResult,
    ExportScriptPreview
} from '@fuyuko-common/model/custom-export.model';
import {CustomExportSubmitFn} from './custom-export-wizard.component';


@Component({
    selector: 'app-custom-export-submit-job',
    templateUrl: './custom-export-submit-job.component.html',
    styleUrls: ['./custom-export-submit-job.component.scss']
})
export class CustomExportSubmitJobComponent implements OnInit {

    @Input() view: View;
    @Input() customDataExport: CustomDataExport;
    @Input() inputValues: ExportScriptInputValue[];
    @Input() preview: ExportScriptPreview;
    @Input() submitFn: CustomExportSubmitFn;

    ready: boolean;
    result: ExportScriptJobSubmissionResult;


    constructor() {}

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.ready = false;
        this.submitFn(this.view, this.customDataExport, this.preview, this.inputValues).pipe(
            tap((r: ExportScriptJobSubmissionResult) => {
                this.result = r;
                this.ready = true;
            }),
            finalize(() => this.ready = true)
        ).subscribe();
    }
}
