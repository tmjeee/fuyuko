import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import config from '../../utils/config.util';
import { HttpClient } from '@angular/common/http';
const URL_ALL_PRICING_STRUCTURES = `${config.api_host_url}/pricingStructures`;
const URL_ALL_ITEMS_WITH_PRICE = `${config.api_host_url}/pricingStructuresWithItems/:pricingStructureId`;
const URL_UPDATE_PRICING_STRUCTURE_STATUS = `${config.api_host_url}/pricingStructure/:pricingStructureId/status/:status`;
const URL_UPDATE_PRICING_STRUCTURE = `${config.api_host_url}/pricingStructures`;
const URL_UPDATE_PRICING_STRUCTURE_ITEM = `${config.api_host_url}/pricingStructure/:pricingStructureId/item`;
let PricingStructureService = class PricingStructureService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    allPricingStructures() {
        return this.httpClient.get(URL_ALL_PRICING_STRUCTURES);
    }
    pricingStructureWithItems(pricingStructureId) {
        return this.httpClient.get(URL_ALL_ITEMS_WITH_PRICE.replace(':pricingStructureId', `${pricingStructureId}`));
    }
    ////////
    deletePricingStructure(pricingStructure) {
        return this.httpClient.post(URL_UPDATE_PRICING_STRUCTURE_STATUS
            .replace(':pricingStructureId', `${pricingStructure.id}`)
            .replace(':status', `DELETED`), {});
    }
    newPricingStructure(pricingStructure) {
        return this.httpClient.post(URL_UPDATE_PRICING_STRUCTURE, {
            pricingStructures: [pricingStructure]
        });
    }
    updatePricingStructure(pricingStructure) {
        return this.httpClient.post(URL_UPDATE_PRICING_STRUCTURE, {
            pricingStructures: [pricingStructure]
        });
    }
    editPricingStructureItem(pricingStructureId, pricingStructureItem) {
        return this.httpClient.post(URL_UPDATE_PRICING_STRUCTURE_ITEM
            .replace(':pricingStructureId', `${pricingStructureId}`), { pricingStructureItems: [pricingStructureItem] });
    }
};
PricingStructureService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [HttpClient])
], PricingStructureService);
export { PricingStructureService };
//# sourceMappingURL=pricing-structure.service.js.map