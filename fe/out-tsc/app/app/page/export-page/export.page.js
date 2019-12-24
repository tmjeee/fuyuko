import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ViewService } from '../../service/view-service/view.service';
import { ExportDataService } from '../../service/export-data-service/export-data.service';
import { tap } from 'rxjs/operators';
let ExportPageComponent = class ExportPageComponent {
    constructor(viewService, exportDataService) {
        this.viewService = viewService;
        this.exportDataService = exportDataService;
    }
    ngOnInit() {
        this.viewService.getAllViews().pipe(tap((v) => {
            this.allViews = v;
        })).subscribe();
        this.viewAttributeFn = (viewId) => {
            return this.exportDataService.viewAttributeFn(viewId);
        };
        this.previewExportFn = (exportType, viewId, attributes, filter) => {
            return this.exportDataService.previewExportFn(exportType, viewId, attributes, filter);
        };
        this.submitExportJobFn = (exportType, viewId, attributes, dataExport, filter) => {
            return this.exportDataService.submitExportJobFn(exportType, viewId, attributes, dataExport, filter);
        };
    }
};
ExportPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './export.page.html',
        styleUrls: ['./export.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ViewService,
        ExportDataService])
], ExportPageComponent);
export { ExportPageComponent };
//# sourceMappingURL=export.page.js.map