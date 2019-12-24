import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { toItem } from '../../utils/item-to-table-items.util';
import config from '../../../assets/config.json';
import { HttpClient } from '@angular/common/http';
const URL_GET_ALL_ITEMS = `${config.api_host_url}/view/:viewId/items`;
const URL_UPDATE_ITEMS = `${config.api_host_url}/view/:viewId/items/update`;
const URL_UPDATE_ITEM_STATUS = `${config.api_host_url}/view/:viewId/items/status/:status`;
let ItemService = class ItemService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    getAllItems(viewId, search = '', searchType = 'basic') {
        if (search) {
            // todo: need one REST api for search
            return this.httpClient.get(URL_GET_ALL_ITEMS.replace(':viewId', String(viewId)));
        }
        else {
            return this.httpClient.get(URL_GET_ALL_ITEMS.replace(':viewId', String(viewId)));
        }
    }
    saveItems(viewId, items) {
        return this.httpClient.post(URL_UPDATE_ITEMS.replace('viewId', String(viewId)), {
            items
        });
    }
    deleteItems(viewId, items) {
        return this.httpClient.post(URL_UPDATE_ITEM_STATUS.replace(':viewId', String(viewId)).replace(':status', 'DELETED'), {
            itemIds: items.map((i) => i.id)
        });
    }
    saveTableItems(viewId, tableItems) {
        const items = toItem(tableItems);
        return this.httpClient.post(URL_UPDATE_ITEMS.replace(':viewId', String(viewId)), {
            items
        });
    }
    deleteTableItems(viewId, tableItems) {
        const items = toItem(tableItems);
        return this.httpClient.post(URL_UPDATE_ITEM_STATUS.replace(':viewId', String(viewId)).replace(':status', 'DELETED'), {
            itemIds: items.map((i) => i.id)
        });
        const deletedItems = [];
    }
};
ItemService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], ItemService);
export { ItemService };
//# sourceMappingURL=item.service.js.map