import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import config from '../../utils/config.util';
import { HttpClient } from '@angular/common/http';
const URL_PREVIEW_ATTRIBUTES = `${config.api_host_url}/view/:viewId/import/attributes/preview`;
const URL_PREVIEW_PRICES = `${config.api_host_url}/view/:viewId/import/prices/preview`;
const URL_PREVIEW_ITEMS = `${config.api_host_url}/view/:viewId/import/items/preview`;
const URL_SCHEDULE_ATTRIBUTES = `${config.api_host_url}/view/:viewId/import/attributes`;
const URL_SCHEDULE_PRICES = `${config.api_host_url}/view/:viewId/import/prices`;
const URL_SCHEDULE_ITEMS = `${config.api_host_url}/view/:viewId/import/items`;
let ImportDataService = class ImportDataService {
    constructor(httpClient) {
        this.httpClient = httpClient;
        this.jobNumber = 1000;
    }
    showPreview(viewId, uploadType, file) {
        switch (uploadType) {
            case 'ATTRIBUTE': {
                const formData = new FormData();
                formData.set('attributeDataCsvFile', file);
                return this.httpClient.post(URL_PREVIEW_ATTRIBUTES.replace(':viewId', String(viewId)), formData);
            }
            case 'ITEM': {
                const formData = new FormData();
                formData.set('itemDataCsvFile', file);
                return this.httpClient.post(URL_PREVIEW_ITEMS.replace(':viewId', String(viewId)), formData);
            }
            case 'PRICE': {
                const formData = new FormData();
                formData.set('priceDataCsvFile', file);
                return this.httpClient.post(URL_PREVIEW_PRICES.replace(':viewId', String(viewId)), formData);
            }
        }
    }
    submitDataImport(viewId, uploadType, dataImport) {
        switch (uploadType) {
            case 'ATTRIBUTE': {
                const formData = new FormData();
                return this.httpClient.post(URL_SCHEDULE_ATTRIBUTES.replace(':viewId', String(viewId)), formData);
            }
            case 'ITEM': {
                const formData = new FormData();
                return this.httpClient.post(URL_SCHEDULE_ITEMS.replace(':viewId', String(viewId)), formData);
            }
            case 'PRICE': {
                const formData = new FormData();
                return this.httpClient.post(URL_SCHEDULE_PRICES.replace(':viewId', String(viewId)), formData);
            }
        }
    }
};
ImportDataService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], ImportDataService);
export { ImportDataService };
//# sourceMappingURL=import-data.service.js.map