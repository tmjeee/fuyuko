import {Component, Input} from '@angular/core';
import {View} from '@fuyuko-common/model/view.model';
import {finalize, tap} from 'rxjs/operators';
import {
    CustomBulkEdit,
    CustomBulkEditScriptInputValue, CustomBulkEditScriptJobSubmissionResult,
    CustomBulkEditScriptPreview
} from '@fuyuko-common/model/custom-bulk-edit.model';
import {CustomBulkEditSubmitFn} from './custom-bulk-edit-wizard.component';


@Component({
    selector: 'app-custom-bulk-edit-submit-job',
    templateUrl: './custom-bulk-edit-submit.component.html',
    styleUrls: ['./custom-bulk-edit-submit.component.scss']
})
export class CustomBulkEditSubmitJobComponent {

    @Input() view: View;
    @Input() customBulkEdit: CustomBulkEdit;
    @Input() inputValues: CustomBulkEditScriptInputValue[];
    @Input() preview: CustomBulkEditScriptPreview;
    @Input() submitFn: CustomBulkEditSubmitFn;

    ready: boolean;
    result: CustomBulkEditScriptJobSubmissionResult;


    constructor() {}

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.ready = false;
        this.submitFn(this.view, this.customBulkEdit, this.preview, this.inputValues).pipe(
            tap((r: CustomBulkEditScriptJobSubmissionResult) => {
                this.result = r;
                this.ready = true;
            }),
            finalize(() => this.ready = true)
        ).subscribe();
    }
}
