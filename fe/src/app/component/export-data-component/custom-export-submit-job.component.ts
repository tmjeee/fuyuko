import {Component, Input} from "@angular/core";
import {View} from "../../model/view.model";
import {tap} from "rxjs/operators";
import {
    CustomDataExport,
    ExportScriptInputValue,
    ExportScriptJobSubmissionResult,
    ExportScriptPreview
} from "../../model/custom-export.model";
import {CustomExportSubmitFn} from "./custom-export-wizard.component";


@Component({
    selector: 'app-custom-export-job-submit',
    templateUrl: './custom-export-submit-job.component.html',
    styleUrls: ['./custom-export-submit-job.component.scss']
})
export class CustomExportSubmitJobComponent {

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
            })
        ).subscribe();
    }
}