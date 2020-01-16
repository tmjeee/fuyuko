import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Attribute} from '../../model/attribute.model';
import {ItemValueOperatorAndAttribute} from '../../model/item-attribute.model';
import {
    AttributeDataExport,
    DataExportType,
    ItemDataExport,
    PriceDataExport
} from '../../model/data-export.model';
import {Job} from '../../model/job.model';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {PricingStructure} from '../../model/pricing-structure.model';

const URL_PREVIEW_ATTRIBUTES = () => `${config().api_host_url}/view/:viewId/export/attributes/preview`;
const URL_PREVIEW_ITEMS = () => `${config().api_host_url}/view/:viewId/export/items/preview`;
const URL_PREVIEW_PRICES = () => `${config().api_host_url}/view/:viewId/export/pricingStructure/:pricingStructureId/prices/preview`;

@Injectable()
export class ExportDataService {

    constructor(private httpClient: HttpClient) {
    }


    previewExportFn(exportType: DataExportType, viewId: number, attributes: Attribute[],
                    filter: ItemValueOperatorAndAttribute[], ps?: PricingStructure):
        Observable<AttributeDataExport | ItemDataExport | PriceDataExport> {

        switch (exportType) {
            case 'ATTRIBUTE':
                // return {} as AttributeDataExport;
                return this.httpClient.get<AttributeDataExport>(URL_PREVIEW_ATTRIBUTES().replace(':viewId', String(viewId)));
                break;
            case 'ITEM':
                return this.httpClient.get<ItemDataExport>(URL_PREVIEW_ITEMS().replace(':viewId', String(viewId)));
                break;
            case 'PRICE':
                return this.httpClient.get<PriceDataExport>(URL_PREVIEW_PRICES()
                    .replace(':viewId', String(viewId)).replace(':pricingStructureId', String(ps.id)));
                break;
        }

        return null;
    }

    submitExportJobFn(exportType: DataExportType, viewId: number, attributes: Attribute[],
                      dataExport: AttributeDataExport | ItemDataExport | PriceDataExport,
                      filter: ItemValueOperatorAndAttribute[]): Observable<Job> {
        return of({
            id: 900,
            name: `Export data job`,
            creationDate: new Date(),
            lastUpdate: new Date(),
            progress: 'SCHEDULED',
            status: 'ENABLED'
        } as Job);
    }
}
