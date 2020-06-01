import {Component, Input, OnInit} from "@angular/core";
import {
    CustomDataImport,
    ImportScriptInputValue,
    ImportScriptJobSubmissionResult,
    ImportScriptPreview
} from "../../model/custom-import.model";
import {Observable} from "rxjs";
import {CustomImportSubmitFn} from "./custom-import-wizard.component";
import {finalize, tap} from "rxjs/operators";
import {View} from "../../model/view.model";


@Component({
    selector: 'app-custom-import-submit-job',
    templateUrl: './custom-import-submit-job.component.html',
    styleUrls: ['./custom-import-submit-job.component.scss']
})
export class CustomImportSubmitJobComponent implements OnInit {


    @Input() view: View;
    @Input() customDataImport: CustomDataImport;
    @Input() inputValues: ImportScriptInputValue[];
    @Input() preview: ImportScriptPreview;
    @Input() submitFn: CustomImportSubmitFn;

    ready: boolean;
    result: ImportScriptJobSubmissionResult;


    constructor() {}

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.ready = false;
        this.submitFn(this.view, this.customDataImport, this.preview, this.inputValues).pipe(
            tap((r: ImportScriptJobSubmissionResult) => {
                this.result = r;
                this.ready = true;
            }),
            finalize(() => this.ready = true)
        ).subscribe();
    }

}