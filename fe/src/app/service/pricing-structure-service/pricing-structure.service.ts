import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {
    PricingStructure,
    PricingStructureWithItems,
    TablePricingStructureItemWithPrice
} from '../../model/pricing-structure.model';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from '../../model/api-response.model';
import {map} from "rxjs/operators";

const URL_ALL_PRICING_STRUCTURES = () => `${config().api_host_url}/pricingStructures`;
const URL_ALL_ITEMS_WITH_PRICE = () => `${config().api_host_url}/pricingStructuresWithItems/:pricingStructureId`;
const URL_UPDATE_PRICING_STRUCTURE_STATUS = () => `${config().api_host_url}/pricingStructure/:pricingStructureId/status/:status`;
const URL_UPDATE_PRICING_STRUCTURE = () => `${config().api_host_url}/pricingStructures`;
const URL_UPDATE_PRICING_STRUCTURE_ITEM = () => `${config().api_host_url}/pricingStructure/:pricingStructureId/item`;

const URL_PRICING_STRUCTURE_BY_ID = () => `${config().api_host_url}/pricingStructure/:pricingStructureId`;


@Injectable()
export class PricingStructureService {

    constructor(private httpClient: HttpClient) { }


    allPricingStructures(): Observable<PricingStructure[]> {
        return this.httpClient
            .get<ApiResponse<PricingStructure[]>>(URL_ALL_PRICING_STRUCTURES())
            .pipe(
                map((r: ApiResponse<PricingStructure[]>) => r.payload)
            );
    }

    pricingStructureWithItems(pricingStructureId: number): Observable<PricingStructureWithItems> {
        return this.httpClient
            .get<ApiResponse<PricingStructureWithItems>>(URL_ALL_ITEMS_WITH_PRICE().replace(':pricingStructureId', `${pricingStructureId}`))
            .pipe(
                map((r: ApiResponse<PricingStructureWithItems>) => r.payload)
            );
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

    getPricingStructureById(pricingStructureId: number): Observable<PricingStructure> {
        return this.httpClient.get<ApiResponse<PricingStructure>>(
            URL_PRICING_STRUCTURE_BY_ID().replace(':pricingStructureId', String(pricingStructureId)))
            .pipe(
                map((r: ApiResponse<PricingStructure>) => r.payload)
            );
    }

    getAllPricingStructuresByView(viewId: number): Observable<PricingStructure[]> {
        return this.httpClient.get<ApiResponse<PricingStructure[]>>(
            URL_ALL_PRICING_STRUCTURES().replace(':viewId', String(viewId)))
            .pipe(map((r: ApiResponse<PricingStructure[]>) => r.payload));
    }
}
