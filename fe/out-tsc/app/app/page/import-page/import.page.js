import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ImportDataService } from '../../service/import-data-service/import-data.service';
import { ViewService } from '../../service/view-service/view.service';
import { tap } from 'rxjs/operators';
let ImportPageComponent = class ImportPageComponent {
    constructor(importDataService, viewService) {
        this.importDataService = importDataService;
        this.viewService = viewService;
        this.allViews = [];
    }
    ngOnInit() {
        this.showPreviewFn = (viewId, uploadType, file) => {
            return this.importDataService.showPreview(viewId, uploadType, file);
        };
        this.submitDataImportFn = ((viewId, uploadType, dataImport) => {
            return this.importDataService.submitDataImport(viewId, uploadType, dataImport);
        });
        this.viewService.getAllViews()
            .pipe(tap((v) => {
            this.allViews = v;
        })).subscribe();
    }
};
ImportPageComponent = tslib_1.__decorate([
    Component({
        templateUrl: './import.page.html',
        styleUrls: ['./import.page.scss']
    }),
    tslib_1.__metadata("design:paramtypes", [ImportDataService, ViewService])
], ImportPageComponent);
export { ImportPageComponent };
//# sourceMappingURL=import.page.js.map