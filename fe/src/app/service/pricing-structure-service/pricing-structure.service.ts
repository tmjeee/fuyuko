import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {
    PricingStructure,
    PricingStructureWithItems,
    TablePricingStructureItemWithPrice
} from '../../model/pricing-structure.model';
import config from '../../../assets/config.json';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '../../model/response.model';

const URL_ALL_PRICING_STRUCTURES = `${config.api_host_url}/view/:viewId/pricingStructures`;
const URL_ALL_ITEMS_WITH_PRICE = `${config.api_host_url}/view/:viewId/pricingStructuresWithItems/:pricingStructureId`;
const URL_UPDATE_PRICING_STRUCTURE_STATUS = `${config.api_host_url}/view/:viewId/pricingStructure/:pricingStructureId/status/:status`;
const URL_UPDATE_PRICING_STRUCTURE = `${config.api_host_url}/view/:viewId/pricingStructures`;
const URL_UPDATE_PRICING_STRUCTURE_ITEM = `${config.api_host_url}/view/:viewId/pricingStructure/:pricingStructureId/item`;


@Injectable()
export class PricingStructureService {

    constructor(private httpClient: HttpClient) { }

    allPricingStructures(viewId: number): Observable<PricingStructure[]> {
        return this.httpClient.get<PricingStructure[]>(URL_ALL_PRICING_STRUCTURES.replace(':viewId', `${viewId}`));
    }

    pricingStructureWithItems(viewId: number, pricingStructureId: number): Observable<PricingStructureWithItems> {
        return this.httpClient.get<PricingStructureWithItems>(
            URL_ALL_ITEMS_WITH_PRICE.replace(':viewId', `${viewId}`).replace(':pricingStructureId', `${pricingStructureId}`));
    }
    ////////

    deletePricingStructure(viewId: number, pricingStructure: PricingStructure): Observable<ApiResponse> {
        return this.httpClient.post<ApiResponse>(
            URL_UPDATE_PRICING_STRUCTURE_STATUS
                .replace(':viewId', `${viewId}`)
                .replace(':pricingStructureId', `${pricingStructure.id}`)
                .replace(':status', `DELETED`), {});
    }

    newPricingStructure(viewId: number, pricingStructure: PricingStructure): Observable<ApiResponse> {
        return this.httpClient.post<ApiResponse>(
            URL_UPDATE_PRICING_STRUCTURE.replace(':viewId', `${viewId}`), {
                pricingStructures: [pricingStructure]
            });
    }

    updatePricingStructure(viewId: number, pricingStructure: PricingStructure): Observable<ApiResponse> {
        return this.httpClient.post<ApiResponse>(
            URL_UPDATE_PRICING_STRUCTURE.replace(':viewId', `${viewId}`), {
                pricingStructures: [pricingStructure]
            });
    }

    editPricingStructureItem(viewId: number, pricingStructureId: number, pricingStructureItem: TablePricingStructureItemWithPrice):
        Observable<ApiResponse> {
        return this.httpClient.post<ApiResponse>(
            URL_UPDATE_PRICING_STRUCTURE_ITEM
                .replace(':viewId', `${viewId}`)
                .replace(':pricingStructureId', `${pricingStructureId}`),
            {pricingStructureItems: [pricingStructureItem]});
    }
}
