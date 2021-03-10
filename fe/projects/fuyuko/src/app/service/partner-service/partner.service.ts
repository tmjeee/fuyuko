import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PricingStructure} from '@fuyuko-common/model/pricing-structure.model';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {PricedItem} from '@fuyuko-common/model/item.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';
import {map} from 'rxjs/operators';

const URL_PARTNER_PRICING_STRUCTURES = () => `${config().api_host_url}/user/:userId/partner-pricing-structures`;
const URL_PARTNER_PRICE_ITEMS = () => `${config().api_host_url}/pricingStructure/:pricingStructureId/pricedItems`;

@Injectable()
export class PartnerService {

    constructor(private httpClient: HttpClient) {
    }


    getPartnerPricingStructures(userId: number): Observable<PricingStructure[]> {
        return this.httpClient
            .get<ApiResponse<PricingStructure[]>>(URL_PARTNER_PRICING_STRUCTURES().replace(':userId', String(userId)))
            .pipe(
                map((r: ApiResponse<PricingStructure[]>) => r.payload)
            );
    }

    getPartnerPriceItems(pricingStructureId: number): Observable<PricedItem[]> {
        return this.httpClient
            .get<ApiResponse<PricedItem[]>>(URL_PARTNER_PRICE_ITEMS().replace(':pricingStructureId', String(pricingStructureId)))
            .pipe(
                map((r: ApiResponse<PricedItem[]>) => r.payload)
            );
    }

}
