import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PricingStructure} from '../../model/pricing-structure.model';
import config from '../../utils/config.util';
import {HttpClient} from '@angular/common/http';
import {PricedItem} from '../../model/item.model';

const URL_PARTNER_PRICING_STRUCTURES = () => `${config().api_host_url}/user/:userId/partner-pricing-structures`;
const URL_PARTNER_PRICE_ITEMS = () => `${config().api_host_url}/pricingStructure/:pricingStructureId/pricedItems`;

@Injectable()
export class PartnerService {

    constructor(private httpClient: HttpClient) {
    }


    getPartnerPricingStructures(userId: number): Observable<PricingStructure[]> {
        return this.httpClient.get<PricingStructure[]>(URL_PARTNER_PRICING_STRUCTURES().replace(':userId', String(userId)));
    }

    getPartnerPriceItems(pricingStructureId: number): Observable<PricedItem[]> {
        return this.httpClient.get<PricedItem[]>(URL_PARTNER_PRICE_ITEMS().replace(':pricingStructureId', String(pricingStructureId)));
    }

}
