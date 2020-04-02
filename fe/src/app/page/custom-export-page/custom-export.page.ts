import {Component, OnDestroy, OnInit} from "@angular/core";
import {View} from "../../model/view.model";
import {tap} from "rxjs/operators";
import {
    CustomExportPreviewFn,
    CustomExportSubmitFn, CustomExportValidateFn
} from "../../component/export-data-component/custom-export-wizard.component";
import {CustomDataExport, ExportScriptInputValue, ExportScriptPreview} from "../../model/custom-export.model";
import {CustomExportService} from "../../service/custom-export-service/custom-export.service";
import {CustomDataImport} from "../../model/custom-import.model";

@Component({
    templateUrl: './custom-export.page.html',
    styleUrls: ['./custom-export.page.scss']
})
export class CustomExportPageComponent implements OnInit, OnDestroy {

    customDataExports: CustomDataExport[];
    ready: boolean;
    customExportValidateFn: CustomExportValidateFn;
    customExportPreviewFn: CustomExportPreviewFn;
    customExportSubmitFn: CustomExportSubmitFn;

    constructor(private customExportService: CustomExportService) {
        this.customExportValidateFn = (c: CustomDataExport, i: ExportScriptInputValue[]) => {
            return this.customExportService.validate(c, i);
        };
        this.customExportPreviewFn = (v: View, c: CustomDataExport, i: ExportScriptInputValue[]) => {
            return this.customExportService.preview(v, c, i);
        };
        this.customExportSubmitFn = (v: View, c: CustomDataExport, p: ExportScriptPreview,  i: ExportScriptInputValue[]) => {
            return this.customExportService.submit(v, c, p, i);
        }
    }


    ngOnInit(): void {
        this.ready = false;
        this.customExportService.getAllCustomExports().pipe(
            tap((c: CustomDataImport[]) => {
                this.customDataExports = c;
                this.ready = true;
            })
        ).subscribe();
    }

    ngOnDestroy(): void {
    }


}