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
import {AttributeDataExport, DataExportType, ItemDataExport, PriceDataExport} from '../../model/data-export.model';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {PricingStructure} from '../../model/pricing-structure.model';

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
                private attributeService: AttributeService,
                private exportDataService: ExportDataService) { }

    ngOnInit(): void {
        this.viewService.getAllViews().pipe(
            tap((v: View[]) => {
                this.allViews = v;
            })
        ).subscribe();

        this.viewAttributeFn = (viewId: number) => {
           return this.attributeService.getAllAttributesByView(viewId);
        };

        this.previewExportFn = (exportType: DataExportType, viewId: number, attributes: Attribute[],
                                filter: ItemValueOperatorAndAttribute[], ps?: PricingStructure) => {
            return this.exportDataService.previewExportFn(exportType, viewId, attributes, filter, ps);
        };

        this.submitExportJobFn = (exportType: DataExportType, viewId: number, attributes: Attribute[],
                                  dataExport: AttributeDataExport | ItemDataExport | PriceDataExport,
                                  filter: ItemValueOperatorAndAttribute[]) => {
            return this.exportDataService.submitExportJobFn(exportType, viewId, attributes, dataExport, filter);
        };
    }

}

