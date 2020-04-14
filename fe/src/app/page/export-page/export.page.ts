import {Component, OnInit} from '@angular/core';
import {View} from '../../model/view.model';
import {ViewService} from '../../service/view-service/view.service';
import {ExportDataService} from '../../service/export-data-service/export-data.service';
import {map, tap} from 'rxjs/operators';
import {
    PreviewExportFn, SubmitExportJobFn,
    ViewAttributeFn, ViewPricingStructureFn,
} from '../../component/export-data-component/export-data.component';
import {Attribute} from '../../model/attribute.model';
import {ItemValueOperatorAndAttribute} from '../../model/item-attribute.model';
import {AttributeDataExport, DataExportType, ItemDataExport, PriceDataExport} from '../../model/data-export.model';
import {AttributeService} from '../../service/attribute-service/attribute.service';
import {PricingStructure} from '../../model/pricing-structure.model';
import {Observable} from "rxjs";
import {PricingStructureService} from "../../service/pricing-structure-service/pricing-structure.service";
import {PaginableApiResponse} from "../../model/api-response.model";

@Component({
    templateUrl: './export.page.html',
    styleUrls: ['./export.page.scss']
})
export class ExportPageComponent implements OnInit {

    allViews: View[];
    viewAttributeFn: ViewAttributeFn;
    previewExportFn: PreviewExportFn;
    submitExportJobFn: SubmitExportJobFn;
    viewPricingStructuresFn: ViewPricingStructureFn;

    constructor(private viewService: ViewService,
                private pricingStrutureService: PricingStructureService,
                private attributeService: AttributeService,
                private exportDataService: ExportDataService) { }

    ngOnInit(): void {
        this.viewService.getAllViews().pipe(
            tap((v: View[]) => {
                this.allViews = v;
            })
        ).subscribe();

        this.viewAttributeFn = (viewId: number) => {
           return this.attributeService.getAllAttributesByView(viewId)
               .pipe( map((r: PaginableApiResponse<Attribute[]>) => r.payload));
        };

        this.viewPricingStructuresFn = (viewId: number) => {
            return this.pricingStrutureService.getAllPricingStructuresByView(viewId);
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

