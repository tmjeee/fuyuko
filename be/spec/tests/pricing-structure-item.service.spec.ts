import {
    addItemToPricingStructure,
    getAllPricingStructureItemsWithPrice,
    getItemByName,
    getPricingStructureByName, getPricingStructureItem,
    getViewByName,
    setPrices
} from '../../src/service';
import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from '../helpers/test-helper';
import {PricingStructure, PricingStructureItemWithPrice} from '@fuyuko-common/model/pricing-structure.model';
import {Item} from '@fuyuko-common/model/item.model';
import {View} from '@fuyuko-common/model/view.model';


describe('pricing-structure-item', () => {

    let view: View;
    let pricingStructure: PricingStructure;
    let pricingStructure2: PricingStructure;
    let item: Item;

    beforeAll(async () => {
        await setupTestDatabase();
        await setupBeforeAll2();
        view = await getViewByName('Test View 1');
        pricingStructure = await getPricingStructureByName(view.id, 'Pricing Structure #1');
        pricingStructure2 = await getPricingStructureByName(view.id, 'Pricing Structure #2');
        item = await getItemByName(view.id, 'Item-1') as Item;
    }, JASMINE_TIMEOUT);

    it('test setPrices', async () => {
        const errs: string[] = await setPrices([
            {
                pricingStructureId: pricingStructure.id,
                item: {
                    itemId: item.id,
                    price: 10.10,
                    country: 'AED'
                }
            }
        ]);
        expect(errs.length).toBe(0);

        const p: PricingStructureItemWithPrice[] = await getAllPricingStructureItemsWithPrice(1);
        const i = p.find((_p: PricingStructureItemWithPrice) => _p.itemId == item.id);

        expect(i).toBeTruthy();
        expect(i!.itemId).toBe(item.id);
        expect(i!.price).toBe(10.10);
        expect(i!.country).toBe('AED');
    });

    it('test addItemToPricingStructure and getPricingStructureItem', async () => {
        const r: boolean = await addItemToPricingStructure(view.id, pricingStructure2.id, item.id);
        expect(r).toBeTruthy();

        const p: PricingStructureItemWithPrice = await getPricingStructureItem(view.id, pricingStructure2.id, item.id)
        expect(p).toBeTruthy();
    });
});
