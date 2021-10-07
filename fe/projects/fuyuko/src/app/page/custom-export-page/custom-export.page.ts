import {Component, OnDestroy, OnInit} from '@angular/core';
import {View} from '@fuyuko-common/model/view.model';
import {finalize, tap} from 'rxjs/operators';
import {
    CustomExportPreviewFn,
    CustomExportSubmitFn, CustomExportValidateFn
} from '../../component/export-data-component/custom-export-wizard.component';
import {
    CustomDataExport,
    ExportScriptInputValue,
    ExportScriptJobSubmissionResult,
    ExportScriptPreview, ExportScriptValidateResult
} from '@fuyuko-common/model/custom-export.model';
import {CustomExportService} from '../../service/custom-export-service/custom-export.service';
import {LoadingService} from '../../service/loading-service/loading.service';

@Component({
    templateUrl: './custom-export.page.html',
    styleUrls: ['./custom-export.page.scss']
})
export class CustomExportPageComponent implements OnInit, OnDestroy {

    customDataExports: CustomDataExport[] = [];
    ready = false ;
    customExportValidateFn: CustomExportValidateFn;
    customExportPreviewFn: CustomExportPreviewFn;
    customExportSubmitFn: CustomExportSubmitFn;

    constructor(private customExportService: CustomExportService,
                private loadingService: LoadingService) {
        this.customExportValidateFn = (v: View, c: CustomDataExport, i: ExportScriptInputValue[]) => {
            this.loadingService.startLoading();
            return this.customExportService.validate(v, c, i).pipe(
                tap((r: ExportScriptValidateResult) => {
                    this.loadingService.stopLoading();
                })
            );
        };
        this.customExportPreviewFn = (v: View, c: CustomDataExport, i: ExportScriptInputValue[]) => {
            this.loadingService.startLoading();
            return this.customExportService.preview(v, c, i).pipe(
               tap((r: ExportScriptPreview) => {
                   this.loadingService.stopLoading();
               })
            );
        };
        this.customExportSubmitFn = (v: View, c: CustomDataExport, p: ExportScriptPreview,  i: ExportScriptInputValue[]) => {
            this.loadingService.startLoading();
            return this.customExportService.submit(v, c, p, i).pipe(
                tap((r: ExportScriptJobSubmissionResult) => {
                    this.loadingService.stopLoading();
                })
            );
        };
    }


    ngOnInit(): void {
        this.ready = false;
        this.loadingService.startLoading();
        this.customExportService.getAllCustomExports().pipe(
            tap((c: CustomDataExport[]) => {
                this.customDataExports = c;
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
