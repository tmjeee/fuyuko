import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {
    PricingStructure, PricingStructureItem,
    PricingStructureWithItems,
    TablePricingStructureItemWithPrice
} from '../../model/pricing-structure.model';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '../../model/response.model';

const URL_ALL_PRICING_STRUCTURES = () => `${config().api_host_url}/pricingStructures`;
const URL_ALL_ITEMS_WITH_PRICE = () => `${config().api_host_url}/pricingStructuresWithItems/:pricingStructureId`;
const URL_UPDATE_PRICING_STRUCTURE_STATUS = () => `${config().api_host_url}/pricingStructure/:pricingStructureId/status/:status`;
const URL_UPDATE_PRICING_STRUCTURE = () => `${config().api_host_url}/pricingStructures`;
const URL_UPDATE_PRICING_STRUCTURE_ITEM = () => `${config().api_host_url}/pricingStructure/:pricingStructureId/item`;

const URL_ALL_ADDABLE_PRICING_STRUCTURE_ITEMS = () => `${config().api_host_url}/pricingStructure/:pricingStructureId/addable-items`;
const URL_PRICING_STRUCTURE_BY_ID = () => `${config().api_host_url}/pricingStructure/:pricingStructureId`;
const URL_ADD_PRICING_STRUCURE_ITEMS = () => `${config().api_host_url}/pricingStructure/:pricingStructureId/add-items`;


@Injectable()
export class PricingStructureService {

    constructor(private httpClient: HttpClient) { }


    allPricingStructures(): Observable<PricingStructure[]> {
        return this.httpClient.get<PricingStructure[]>(URL_ALL_PRICING_STRUCTURES());
    }

    pricingStructureWithItems(pricingStructureId: number): Observable<PricingStructureWithItems> {
        return this.httpClient.get<PricingStructureWithItems>(
            URL_ALL_ITEMS_WITH_PRICE().replace(':pricingStructureId', `${pricingStructureId}`));
    }
    ////////

    deletePricingStructure(pricingStructure: PricingStructure): Observable<ApiResponse> {
        return this.httpClient.post<ApiResponse>(
            URL_UPDATE_PRICING_STRUCTURE_STATUS()
                .replace(':pricingStructureId', `${pricingStructure.id}`)
                .replace(':status', `DELETED`), {});
    }

    newPricingStructure(pricingStructure: PricingStructure): Observable<ApiResponse> {
        return this.httpClient.post<ApiResponse>(
            URL_UPDATE_PRICING_STRUCTURE(), {
                pricingStructures: [pricingStructure]
            });
    }

    updatePricingStructure(pricingStructure: PricingStructure): Observable<ApiResponse> {
        return this.httpClient.post<ApiResponse>(
            URL_UPDATE_PRICING_STRUCTURE(), {
                pricingStructures: [pricingStructure]
            });
    }

    editPricingStructureItem(pricingStructureId: number, pricingStructureItem: TablePricingStructureItemWithPrice):
        Observable<ApiResponse> {
        return this.httpClient.post<ApiResponse>(
            URL_UPDATE_PRICING_STRUCTURE_ITEM()
                .replace(':pricingStructureId', `${pricingStructureId}`),
            {pricingStructureItems: [pricingStructureItem]});
    }

    ///////////////////

    allAddablePricingStructureItems(pricingStructureId: number): Observable<PricingStructureItem[]> {
        return this.httpClient.get<PricingStructureItem[]>(
            URL_ALL_ADDABLE_PRICING_STRUCTURE_ITEMS().replace(':pricingStructureId', String(pricingStructureId)));
    }

    getPricingStructureById(pricingStructureId: number): Observable<PricingStructure> {
        return this.httpClient.get<PricingStructure>(
            URL_PRICING_STRUCTURE_BY_ID().replace(':pricingStructureId', String(pricingStructureId)));
    }

    addPricingStructureItems(pricingStructureId: number, pricingStructureItems: PricingStructureItem[]) {
        return this.httpClient.post(
            URL_ADD_PRICING_STRUCURE_ITEMS().replace(':pricingStructureId', String(pricingStructureId)),
            pricingStructureItems);
    }
}
