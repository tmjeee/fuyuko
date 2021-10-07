import {Component, OnInit} from '@angular/core';
import {View} from '@fuyuko-common/model/view.model';
import {finalize, tap} from 'rxjs/operators';
import {LoadingService} from '../../service/loading-service/loading.service';
import {
    CustomBulkEdit,
    CustomBulkEditScriptInputValue, CustomBulkEditScriptJobSubmissionResult,
    CustomBulkEditScriptPreview, CustomBulkEditScriptValidateResult
} from '@fuyuko-common/model/custom-bulk-edit.model';
import {
    CustomBulkEditFormValidateFn,
    CustomBulkEditPreviewFn,
    CustomBulkEditSubmitFn
} from '../../component/bulk-edit-wizard-component/custom-bulk-edit-wizard.component';
import {CustomBulkEditService} from '../../service/custom-bulk-edit-service/custom-bulk-edit.service';

@Component({
    templateUrl: './custom-bulk-edit.page.html',
    styleUrls: ['./custom-bulk-edit.page.scss']
})
export class CustomBulkEditPageComponent implements OnInit {

    customBulkEdits: CustomBulkEdit[] = [];
    ready = false ;
    customBulkEditValidateFn!: CustomBulkEditFormValidateFn;
    customBulkEditPreviewFn!: CustomBulkEditPreviewFn;
    customBulkEditSubmitFn!: CustomBulkEditSubmitFn;

    constructor(private customBulkEditService: CustomBulkEditService,
                private loadingService: LoadingService) {
        this.customBulkEditValidateFn = (v: View, c: CustomBulkEdit, i: CustomBulkEditScriptInputValue[]) => {
            this.loadingService.startLoading();
            return this.customBulkEditService.validate(v, c, i).pipe(
                tap((r: CustomBulkEditScriptValidateResult) => {
                    this.loadingService.stopLoading();
                })
            );
        };
        this.customBulkEditPreviewFn = (v: View, c: CustomBulkEdit, i: CustomBulkEditScriptInputValue[]) => {
            this.loadingService.startLoading();
            return this.customBulkEditService.preview(v, c, i).pipe(
                tap((r: CustomBulkEditScriptPreview) => {
                    this.loadingService.stopLoading();
                })
            );
        };
        this.customBulkEditSubmitFn = (v: View, c: CustomBulkEdit, p: CustomBulkEditScriptPreview, i: CustomBulkEditScriptInputValue[]) => {
            this.loadingService.startLoading();
            return this.customBulkEditService.submit(v, c, p, i).pipe(
                tap((r: CustomBulkEditScriptJobSubmissionResult) => {
                    this.loadingService.stopLoading();
                })
            );
        };
    }


    ngOnInit(): void {
        this.ready = false;
        this.loadingService.startLoading();
        this.customBulkEditService.getAllCustomBulkEdits().pipe(
            tap((c: CustomBulkEdit[]) => {
                this.customBulkEdits = c;
                this.ready = true;
            }),
            finalize(() => {
                this.ready = true;
                this.loadingService.stopLoading();
            })
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.loadingService.stopLoading();
    }
}
