import {Component, OnInit} from '@angular/core';
import {View} from '../../model/view.model';
import {ViewService} from '../../service/view-service/view.service';
import {ExportDataService} from '../../service/export-data-service/export-data.service';
import {tap} from 'rxjs/operators';
import {
    PreviewExportFn, SubmitExportJobFn,
    ViewAttributeFn,
    ViewItemsFn
} from '../../component/export-data-component/export-data.component';
import {Attribute} from '../../model/attribute.model';
import {ItemValueOperatorAndAttribute} from '../../model/item-attribute.model';
import {Observable} from 'rxjs';
import {DataExport} from '../../model/data-export.model';

@Component({
    templateUrl: './export.page.html',
    styleUrls: ['./export.page.scss']
})
export class ExportPageComponent implements OnInit {

    allViews: View[];
    viewAttributeFn: ViewAttributeFn;
    viewItemsFn: ViewItemsFn;
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

        this.viewItemsFn = (viewId: number) => {
            return this.exportDataService.viewItemsFn(viewId);
        };

        this.previewExportFn = (viewId: number, attributes: Attribute[], filter: ItemValueOperatorAndAttribute[]) => {
            return this.exportDataService.previewExportFn(viewId, attributes, filter);
        };

        this.submitExportJobFn = (viewId: number, attributes: Attribute[], filter: ItemValueOperatorAndAttribute[]) => {
            return this.exportDataService.submitExportJobFn(viewId, attributes, filter);
        };
    }

}

