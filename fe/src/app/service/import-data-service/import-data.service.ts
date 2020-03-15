import {Injectable} from '@angular/core';
import {
    AttributeDataImport,
    ItemDataImport,
    PriceDataImport,
    DataImportType,
} from '../../model/data-import.model';
import {Observable, of} from 'rxjs';
import {Job} from '../../model/job.model';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';

const URL_PREVIEW_ATTRIBUTES = () => `${config().api_host_url}/view/:viewId/import/attributes/preview`;
const URL_PREVIEW_PRICES = () => `${config().api_host_url}/view/:viewId/import/prices/preview`;
const URL_PREVIEW_ITEMS = () => `${config().api_host_url}/view/:viewId/import/items/preview`;

const URL_SCHEDULE_ATTRIBUTES = () => `${config().api_host_url}/view/:viewId/import/attributes`;
const URL_SCHEDULE_PRICES = ()  => `${config().api_host_url}/view/:viewId/import/prices`;
const URL_SCHEDULE_ITEMS = () => `${config().api_host_url}/view/:viewId/import/items`;


@Injectable()
export class ImportDataService {

    jobNumber = 1000;

    constructor(private httpClient: HttpClient) {}

    showPreview(viewId: number, uploadType: DataImportType, file: File):
        Observable<AttributeDataImport | ItemDataImport | PriceDataImport> {
        switch (uploadType) {
            case 'ATTRIBUTE': {
                const formData: FormData = new FormData();
                formData.set('attributeDataCsvFile', file);
                return this.httpClient.post<AttributeDataImport>(
                    URL_PREVIEW_ATTRIBUTES().replace(':viewId', String(viewId)), formData);
            }
            case 'ITEM': {
                const formData: FormData = new FormData();
                formData.set('itemDataCsvFile', file);
                return this.httpClient.post<ItemDataImport>(
                    URL_PREVIEW_ITEMS().replace(':viewId', String(viewId)), formData);

            }
            case 'PRICE': {
                const formData: FormData = new FormData();
                formData.set('priceDataCsvFile', file);
                return this.httpClient.post<PriceDataImport>(
                    URL_PREVIEW_PRICES().replace(':viewId', String(viewId)), formData);
            }
        }
    }


    submitDataImport(viewId: number, uploadType: DataImportType,
                     dataImport: AttributeDataImport | ItemDataImport | PriceDataImport): Observable<Job> {
        switch (uploadType) {
            case 'ATTRIBUTE': {
                const attributeDataImport: AttributeDataImport = dataImport as AttributeDataImport;
                return this.httpClient.post<Job>(URL_SCHEDULE_ATTRIBUTES().replace(':viewId', String(viewId)), {
                    dataImportId: attributeDataImport.dataImportId,
                    attributes: attributeDataImport.attributes
                });
            }
            case 'ITEM': {
                const itemDataImport: ItemDataImport = dataImport as ItemDataImport;
                return this.httpClient.post<Job>(URL_SCHEDULE_ITEMS().replace(':viewId', String(viewId)), {
                    dataImportId: itemDataImport.dataImportId,
                    items: itemDataImport.items
                });
            }
            case 'PRICE': {
                const priceDataImport: PriceDataImport = dataImport as PriceDataImport;
                console.log('************* priceDataImport', priceDataImport);
                return this.httpClient.post<Job>(URL_SCHEDULE_PRICES().replace(':viewId', String(viewId)), {
                    dataImportId: priceDataImport.dataImportId,
                    priceDataItems: priceDataImport.items
                });
            }
        }
    }
}
