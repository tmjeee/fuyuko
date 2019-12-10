import {Component, OnInit} from '@angular/core';
import {View} from '../../model/view.model';
import {ViewService} from '../../service/view-service/view.service';
import {ExportDataService} from '../../service/export-data-service/export-data.service';
import {tap} from 'rxjs/operators';
import {
    PreviewExportFn, SubmitExportJobFn,
    ViewAttributeFn,
} from '../../component/export-data-component/export-data.component';
import {Attribute} from '../../model/attribute.model';
import {ItemValueOperatorAndAttribute} from '../../model/item-attribute.model';
import {DataExportType} from '../../model/data-export.model';

@Component({
    templateUrl: './export.page.html',
    styleUrls: ['./export.page.scss']
})
export class ExportPageComponent implements OnInit {

    allViews: View[];
    viewAttributeFn: ViewAttributeFn;
    previewExportFn: PreviewExportFn;
    submitExportJobFn: SubmitExportJobFn;

    constructor(private viewService: ViewService,
                private exportDataService: ExportDataService) { }

    ngOnInit(): void {
        this.viewService.getAllViews().pipe(
            tap((v: View[]) => {
                this.allViews = v;
            })
        ).subscribe();

        this.viewAttributeFn = (viewId: number) => {
           return this.exportDataService.viewAttributeFn(viewId);
        };

        this.previewExportFn = (exportType: DataExportType, viewId: number, attributes: Attribute[],
                                filter: ItemValueOperatorAndAttribute[]) => {
            return this.exportDataService.previewExportFn(exportType, viewId, attributes, filter);
        };

        this.submitExportJobFn = (exportType: DataExportType, viewId: number, attributes: Attribute[],
                                  filter: ItemValueOperatorAndAttribute[]) => {
            return this.exportDataService.submitExportJobFn(exportType, viewId, attributes, filter);
        };
    }

}

