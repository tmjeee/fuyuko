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
                return this.httpClient.post<AttributeDataExport>(URL_PREVIEW_ATTRIBUTES().replace(':viewId', String(viewId)),
                    {
                        attributes,
                        filter
                    });
                break;
            }
            case 'ITEM': {
                return this.httpClient.post<ItemDataExport>(URL_PREVIEW_ITEMS().replace(':viewId', String(viewId)),
                    {
                        attributes,
                        filter
                    });
                break;
            }
            case 'PRICE': {
                return this.httpClient.post<PriceDataExport>(URL_PREVIEW_PRICES()
                        .replace(':viewId', String(viewId)).replace(':pricingStructureId', String(ps.id)),
                    {
                        attributes,
                        filter,
                        pricingStructureId: ps.id
                    });
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
                return this.httpClient.post<Job>(URL_SCHEDULE_ATTRIBUTES_EXPORT().replace(':viewId', String(viewId)),
                    {
                        attributes: attributeDataExport.attributes
                    });
                break;
            }
            case 'ITEM': {
                const itemDataExport: ItemDataExport = dataExport as ItemDataExport;
                return this.httpClient.post<Job>(URL_SCHEDULE_ITEMS_EXPORT().replace(':viewId', String(viewId)),
                    {
                        attributes: itemDataExport.attributes,
                        items: itemDataExport.items
                    });
                break;
            }
            case 'PRICE': {
                const priceDataExport: PriceDataExport = dataExport as PriceDataExport;
                const pricingStructureId: number = priceDataExport.pricingStructure.id;
                return this.httpClient.post<Job>(URL_SCHEDULE_PRICES_EXPORT()
                    .replace(':viewId', String(viewId))
                    .replace(':pricingStructureId', String(pricingStructureId)), {
                    attributes: priceDataExport.attributes,
                    pricedItems: priceDataExport.pricedItems
                })
                break;
            }
        }
        return null;
    }

}
