import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {
    PricingStructure, PricingStructureItem,
    PricingStructureItemWithPrice,
    PricingStructureWithItems,
    TablePricingStructureItemWithPrice
} from '../../model/pricing-structure.model';

let pricingStructureIdCounter = 0;
let pricingStructureItemIdCounter = 0;

const allPricingStructures: PricingStructureWithItems[] = [
    { id: (++pricingStructureIdCounter), name: 'Pricing Structure #1', description: 'Pricing Structure #1 description',
        items: [
            {
                id: (++pricingStructureItemIdCounter), itemId: pricingStructureItemIdCounter, itemName: 'item #1',
                itemDescription: 'item #1 description', price: 1.00, country: 'AUD'
            } as PricingStructureItemWithPrice
        ]
    } as PricingStructureWithItems,
    { id: (++pricingStructureIdCounter), name: 'Pricing Structure #2', description: 'Pricing Structure #2 description',
        items: [
            {
                id: (++pricingStructureItemIdCounter), itemId: pricingStructureItemIdCounter, itemName: 'item #2',
                itemDescription: 'item #2 description', price: 2.00, country: 'AUD'
            } as PricingStructureItemWithPrice
        ]
    } as PricingStructureWithItems,
];


@Injectable()
export class PricingStructureService {

    allPricingStructures(): Observable<PricingStructure[]> {
        return of(allPricingStructures.map((ps: PricingStructureWithItems) => {
            return {
                id: ps.id,
                name: ps.name,
                description: ps.description,
            } as PricingStructure;
        }));
    }

    pricingStructureWithItems(pricingStructureId: number): Observable<PricingStructureWithItems> {
        return of(allPricingStructures.find((p: PricingStructureWithItems) => p.id === pricingStructureId));
    }
    ////////

    deletePricingStructure(pricingStructure: PricingStructure): Observable<PricingStructure> {
        const temp: PricingStructureWithItems[] = allPricingStructures.filter((p: PricingStructureWithItems) => {
            return p.id !== pricingStructure.id;
        });
        allPricingStructures.length = 0 ;
        allPricingStructures.push(...temp);
        return of(pricingStructure);
    }

    newPricingStrucutreChildItem(pricingStructure: PricingStructure, parent: TablePricingStructureItemWithPrice, pricingStructureItem: TablePricingStructureItemWithPrice):
        Observable<PricingStructureItemWithPrice> {
        const ps: PricingStructureWithItems = allPricingStructures.find((p: PricingStructure) => p.id === pricingStructure.id);
        if (ps) {
            const pi: PricingStructureItemWithPrice = ps.items.find((i: PricingStructureItemWithPrice) => i.id === parent.id);
            const newPricingStructureItem: PricingStructureItemWithPrice = { ...pricingStructureItem, children: [] };
            newPricingStructureItem.id = (++pricingStructureItemIdCounter);
            pi.children.push(newPricingStructureItem);
            return of(newPricingStructureItem);
        }
        return of(null);
    }

    newPricingStructure(pricingStructure: PricingStructure): Observable<PricingStructure> {
        const newPricingStructure: PricingStructureWithItems = {...pricingStructure, items: []};
        newPricingStructure.id = (++pricingStructureIdCounter);
        allPricingStructures.push(newPricingStructure);
        return of(newPricingStructure);
    }

    updatePricingStructure(pricingStructure: PricingStructure): Observable<PricingStructure> {
        const ps: PricingStructureWithItems = allPricingStructures.find((p: PricingStructure) => p.id === pricingStructure.id);
        ps.name = pricingStructure.name;
        ps.description = pricingStructure.description;
        return of(pricingStructure);
    }

    editPricingStructureItem(pricingStructureItem: TablePricingStructureItemWithPrice): Observable<PricingStructureItemWithPrice> {
        for (const ps of allPricingStructures) {
            for (const pi  of ps.items) {
                if (pi.id === pricingStructureItem.id) {
                    pi.price = pricingStructureItem.price;
                    return of(pi);
                }
            }
        }
    }
}
