import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {ItemValueOperatorAndAttribute} from '@fuyuko-common/model/item-attribute.model';
import {
    AttributeDataExport,
    DataExportType,
    ItemDataExport,
    PriceDataExport
} from '@fuyuko-common/model/data-export.model';
import {Job} from '@fuyuko-common/model/job.model';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {PricingStructure} from '@fuyuko-common/model/pricing-structure.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {map} from 'rxjs/operators';

const URL_PREVIEW_ATTRIBUTES = () => `${config().api_host_url}/view/:viewId/export/attributes/preview`;
const URL_PREVIEW_ITEMS = () => `${config().api_host_url}/view/:viewId/export/items/preview`;
const URL_PREVIEW_PRICES = () => `${config().api_host_url}/view/:viewId/export/pricingStructure/:pricingStructureId/prices/preview`;

const URL_SCHEDULE_ATTRIBUTES_EXPORT = () => `${config().api_host_url}/view/:viewId/export/attributes`;
const URL_SCHEDULE_ITEMS_EXPORT = () => `${config().api_host_url}/view/:viewId/export/items`;
const URL_SCHEDULE_PRICES_EXPORT = () => `${config().api_host_url}/view/:viewId/export/pricingStructure/:pricingStructureId/prices`;


@Injectable()
export class ExportDataService {

    constructor(private httpClient: HttpClient) {
    }



    previewExportFn(exportType: DataExportType, viewId: number, attributes: Attribute[],
                    filter: ItemValueOperatorAndAttribute[], ps?: PricingStructure):
        Observable<AttributeDataExport | ItemDataExport | PriceDataExport> {

        switch (exportType) {
            case 'ATTRIBUTE': {
                // return {} as AttributeDataExport;
                return this.httpClient.post<ApiResponse<AttributeDataExport>>(URL_PREVIEW_ATTRIBUTES().replace(':viewId', String(viewId)),
                    {
                        attributes,
                        filter
                    }).pipe(map((r: ApiResponse<AttributeDataExport>) => r.payload));
                break;
            }
            case 'ITEM': {
                return this.httpClient.post<ApiResponse<ItemDataExport>>(URL_PREVIEW_ITEMS().replace(':viewId', String(viewId)),
                    {
                        attributes,
                        filter
                    }).pipe(map((r: ApiResponse<ItemDataExport>) => r.payload));
                break;
            }
            case 'PRICE': {
                return this.httpClient.post<ApiResponse<PriceDataExport>>(URL_PREVIEW_PRICES()
                        .replace(':viewId', String(viewId)).replace(':pricingStructureId', String(ps.id)),
                    {
                        attributes,
                        filter,
                        pricingStructureId: ps.id
                    }).pipe(map((r: ApiResponse<PriceDataExport>) => r.payload));
                break;
            }
        }

        return null;
    }

    submitExportJobFn(exportType: DataExportType, viewId: number, attributes: Attribute[],
                      dataExport: AttributeDataExport | ItemDataExport | PriceDataExport,
                      filter: ItemValueOperatorAndAttribute[]): Observable<Job> {
        switch (exportType) {
            case 'ATTRIBUTE': {
                const attributeDataExport: AttributeDataExport = dataExport as AttributeDataExport;
                return this.httpClient.post<ApiResponse<Job>>(URL_SCHEDULE_ATTRIBUTES_EXPORT().replace(':viewId', String(viewId)),
                    {
                        attributes: attributeDataExport.attributes
                    }).pipe(map((r: ApiResponse<Job>) => r.payload));
                break;
            }
            case 'ITEM': {
                const itemDataExport: ItemDataExport = dataExport as ItemDataExport;
                return this.httpClient.post<ApiResponse<Job>>(URL_SCHEDULE_ITEMS_EXPORT().replace(':viewId', String(viewId)),
                    {
                        attributes: itemDataExport.attributes,
                        items: itemDataExport.items
                    }).pipe(map((r: ApiResponse<Job>) => r.payload));
                break;
            }
            case 'PRICE': {
                const priceDataExport: PriceDataExport = dataExport as PriceDataExport;
                const pricingStructureId: number = priceDataExport.pricingStructure.id;
                return this.httpClient.post<ApiResponse<Job>>(URL_SCHEDULE_PRICES_EXPORT()
                    .replace(':viewId', String(viewId))
                    .replace(':pricingStructureId', String(pricingStructureId)), {
                    attributes: priceDataExport.attributes,
                    pricedItems: priceDataExport.pricedItems
                }).pipe(map((r: ApiResponse<Job>) => r.payload));
                break;
            }
        }
        return null;
    }

}
