import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from '../../utils/config.util';
const URL_ALL_ATTRIBUTES_BY_VIEW = `${config.api_host_url}/attributes/view/:viewId`;
const URL_SEARCH_ALL_ATTRIBUTES_BY_VIEW = `${config.api_host_url}/attributes/view/:viewId/search/:attribute`;
const URL_ADD_ATTRIBUTE_TO_VIEW = `${config.api_host_url}/view/:viewId/attributes/add`;
const URL_UPDATE_ATTRIBUTE = `${config.api_host_url}/attributes/update`;
const URL_UPDATE_ATTRIBUTE_STATUS = `${config.api_host_url}/attributes/:attributeId/state/:state`;
let AttributeService = class AttributeService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    getAllAttributesByView(viewId) {
        return this.httpClient.get(URL_ALL_ATTRIBUTES_BY_VIEW.replace(':viewId', String(viewId)));
    }
    deleteAttribute(view, attribute) {
        return this.httpClient.post(URL_UPDATE_ATTRIBUTE_STATUS.replace(':attributeId', String(attribute.id)).replace(':state', 'DELETED'), {});
    }
    searchAttribute(viewId, search) {
        return this.httpClient.get(URL_SEARCH_ALL_ATTRIBUTES_BY_VIEW.replace(':viewId', String(viewId)).replace(':attribute', search));
    }
    addAttribute(view, attribute) {
        return this.httpClient.post(URL_ADD_ATTRIBUTE_TO_VIEW.replace(':viewId', String(view.id)), {
            attributes: [attribute]
        });
    }
    updateAttribute(view, attribute) {
        return this.httpClient.post(URL_UPDATE_ATTRIBUTE, {
            attributes: [attribute]
        });
    }
};
AttributeService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], AttributeService);
export { AttributeService };
//# sourceMappingURL=attribute.service.js.map