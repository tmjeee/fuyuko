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
                id: (++pricingStructureItemIdCounter), itemId: pricingStructureItemIdCounter, itemName: 'item #1a',
                itemDescription: 'item #1a description', price: 1.00, country: 'AUD'
            } as PricingStructureItemWithPrice,
            {
                id: (++pricingStructureItemIdCounter), itemId: pricingStructureItemIdCounter, itemName: 'item #1b',
                itemDescription: 'item #1b description', price: 2.00, country: 'AUD'
            } as PricingStructureItemWithPrice,
            {
                id: (++pricingStructureItemIdCounter), itemId: pricingStructureItemIdCounter, itemName: 'item #1c',
                itemDescription: 'item #1c description', price: 3.00, country: 'AUD'
            } as PricingStructureItemWithPrice,
        ]
    } as PricingStructureWithItems,
    { id: (++pricingStructureIdCounter), name: 'Pricing Structure #2', description: 'Pricing Structure #2 description',
        items: [
            {
                id: (++pricingStructureItemIdCounter), itemId: pricingStructureItemIdCounter, itemName: 'item #2a',
                itemDescription: 'item #2a description', price: 2.00, country: 'AUD'
            } as PricingStructureItemWithPrice,
            {
                id: (++pricingStructureItemIdCounter), itemId: pricingStructureItemIdCounter, itemName: 'item #2b',
                itemDescription: 'item #2b description', price: 4.00, country: 'AUD'
            } as PricingStructureItemWithPrice,
            {
                id: (++pricingStructureItemIdCounter), itemId: pricingStructureItemIdCounter, itemName: 'item #2c',
                itemDescription: 'item #2c description', price: 6.00, country: 'AUD'
            } as PricingStructureItemWithPrice,
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

    newPricingStructure(pricingStructure: PricingStructure): Observable<PricingStructure> {
        const newPricingStructure: PricingStructureWithItems =
            { id: (++pricingStructureIdCounter), name: `Pricing Structure #${(Math.random()*100)/100}`, description: `Pricing Structure #${(Math.random()*100)/100} description`,
                items: [
                    {
                        id: (++pricingStructureItemIdCounter), itemId: pricingStructureItemIdCounter, itemName: `item #${(Math.random()*100)/100}`,
                        itemDescription: `item #${(Math.random()*100)/100} description`, price: (Math.random()*10)/10, country: 'AUD'
                    } as PricingStructureItemWithPrice,
                    {
                        id: (++pricingStructureItemIdCounter), itemId: pricingStructureItemIdCounter, itemName: `item #${(Math.random()*100)/100}`,
                        itemDescription: `item #${(Math.random()*100)/100} description`, price: (Math.random()*10)/10, country: 'AUD'
                    } as PricingStructureItemWithPrice,
                    {
                        id: (++pricingStructureItemIdCounter), itemId: pricingStructureItemIdCounter, itemName: `item #${(Math.random()*100)/100}`,
                        itemDescription: `item #${(Math.random()*100)/100} description`, price: (Math.random()*10)/10, country: 'AUD'
                    } as PricingStructureItemWithPrice,
                ]
            } as PricingStructureWithItems;
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
