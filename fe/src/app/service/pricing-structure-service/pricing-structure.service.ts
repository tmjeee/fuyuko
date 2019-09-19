import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {PricingStructure, PricingStructureItemWithPrice, PricingStructureWithItems} from '../../model/pricing-structure.model';

const allPricingStructures: PricingStructureWithItems[] = [
    { id: 1, name: 'Pricing Structure #1', description: 'Pricing Structure #1 description', items: [
       { id: 1, itemId: 1, itemName: 'item #1', itemDescription: 'item #1 description', price: 1.00, country: 'AUD'} as PricingStructureItemWithPrice
    ]} as PricingStructureWithItems,
];


@Injectable()
export class PricingStructureService {

    allPricingStructures(): Observable<PricingStructure[]> {
        return of(allPricingStructures.map((ps: PricingStructureWithItems) => {
            return {
                id: ps.id,
                name: ps.name,
                description: ps.description,
            } as PricingStructure
        }));
    }

    pricingStructureWithItems(pricingStructureId: number): Observable<PricingStructureWithItems> {
        return of(allPricingStructures.find((p: PricingStructureWithItems) => p.id === pricingStructureId));
    }


}
