import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from '../helpers/test-helper';
import {
    addOrUpdatePricingStructures,
    getAllPricingStructureItemsWithPrice,
    getAllPricingStructureItemsWithPriceCount,
    getAllPricingStructures,
    getGroupByName,
    getPartnerPricingStructures,
    getPricingStructureById,
    getPricingStructureByName,
    getPricingStructureGroupAssociations,
    getPricingStructuresByView,
    getUserByUsername,
    getViewByName,
    linkPricingStructureWithGroupId,
    searchGroupsAssociatedWithPricingStructure,
    searchGroupsNotAssociatedWithPricingStructure,
    unlinkPricingStructureWithGroupId,
    updatePricingStructureStatus
} from "../../src/service";
import {Group} from '@fuyuko-common/model/group.model';
import {
    PricingStructure,
    PricingStructureGroupAssociation,
    PricingStructureItemWithPrice
} from '@fuyuko-common/model/pricing-structure.model';
import {View} from '@fuyuko-common/model/view.model';
import {User} from '@fuyuko-common/model/user.model';



describe('pricing-structure-service', () => {

    let view: View;
    let viewer1: User;
    let admin1: User;


    beforeAll(async () => {
        await setupTestDatabase();
        await setupBeforeAll2();
        view = await getViewByName('Test View 1');
        viewer1 = await getUserByUsername('viewer1');
        admin1 = await getUserByUsername('admin1');
    }, JASMINE_TIMEOUT);




    it('test searchGroupsAssociatedWithPricingStructure', async () => {
        {
            const groups: Group[] = await searchGroupsAssociatedWithPricingStructure(1);

            //console.log(util.inspect(groups));
            expect(groups).toBeDefined();
            expect(groups.length).toBe(2);
            expect(groups[0].name).toBe('ADMIN Group');
            expect(groups[1].name).toBe('PARTNER Group');
        }

        {
            const groups: Group[] = await searchGroupsAssociatedWithPricingStructure(1, 'admin');

            //console.log(util.inspect(groups));
            expect(groups).toBeDefined();
            expect(groups.length).toBe(1);
            expect(groups[0].name).toBe('ADMIN Group');
        }
    });

    it(`test searchGroupsNotAssociatedWithPricingStructure`, async () => {
        {
            const groups: Group[] = await searchGroupsNotAssociatedWithPricingStructure(1);

            //console.log(util.inspect(groups));
            expect(groups).toBeDefined();
            expect(groups.length).toBe(2);
            expect(groups[0].name).toBe('VIEW Group');
            expect(groups[1].name).toBe('EDIT Group');
        }
        {
            const groups: Group[] = await searchGroupsNotAssociatedWithPricingStructure(1, 'VIEW');

            // console.log(util.inspect(groups));
            expect(groups).toBeDefined();
            expect(groups.length).toBe(1);
            expect(groups[0].name).toBe('VIEW Group');
        }
    });

    it('test getPricingStructureGroupAssociation', async () => {
        const pricingStructureGroupAssociations: PricingStructureGroupAssociation[] = await getPricingStructureGroupAssociations();

        // console.log(util.inspect(pricingStructureGroupAssociations, {depth: 5}));
        expect(pricingStructureGroupAssociations).toBeDefined();
        expect(pricingStructureGroupAssociations.length).toBe(4);
        expect(pricingStructureGroupAssociations[0].pricingStructure.name).toBe('Pricing Structure #1');
        expect(pricingStructureGroupAssociations[0].pricingStructure.viewName).toBe('Test View 1');
        expect(pricingStructureGroupAssociations[0].groups.length).toBe(2);
        expect(pricingStructureGroupAssociations[0].groups[0].name).toBe('ADMIN Group');
        expect(pricingStructureGroupAssociations[0].groups[1].name).toBe('PARTNER Group');
        expect(pricingStructureGroupAssociations[1].pricingStructure.name).toBe('Pricing Structure #2');
        expect(pricingStructureGroupAssociations[1].pricingStructure.viewName).toBe('Test View 1');
        expect(pricingStructureGroupAssociations[1].groups.length).toBe(2);
        expect(pricingStructureGroupAssociations[1].groups[0].name).toBe('ADMIN Group');
        expect(pricingStructureGroupAssociations[1].groups[1].name).toBe('PARTNER Group');
        expect(pricingStructureGroupAssociations[2].pricingStructure.name).toBe('Pricing Structure #1');
        expect(pricingStructureGroupAssociations[2].pricingStructure.viewName).toBe('Test View 2');
        expect(pricingStructureGroupAssociations[2].groups.length).toBe(2);
        expect(pricingStructureGroupAssociations[2].groups[0].name).toBe('ADMIN Group');
        expect(pricingStructureGroupAssociations[2].groups[1].name).toBe('PARTNER Group');
        expect(pricingStructureGroupAssociations[3].pricingStructure.name).toBe('Pricing Structure #2');
        expect(pricingStructureGroupAssociations[3].pricingStructure.viewName).toBe('Test View 2');
        expect(pricingStructureGroupAssociations[3].groups.length).toBe(2);
        expect(pricingStructureGroupAssociations[3].groups[0].name).toBe('ADMIN Group');
        expect(pricingStructureGroupAssociations[3].groups[1].name).toBe('PARTNER Group');
    });

    it('test linking group with no partner role', async () => {
        const g: Group = await getGroupByName('VIEW Group');
        expect(g).toBeTruthy();

        const errors: string[] = await linkPricingStructureWithGroupId(1, g.id);
        expect(errors).toBeDefined();
        expect(errors.length).toBe(1);
    });

    it('test link/unlinkPricingStructureWithGroupId', async () => {

        const g: Group = await getGroupByName('PARTNER Group');
        expect(g).toBeTruthy();

        const errors2: string[] = await unlinkPricingStructureWithGroupId(1, g.id);
        expect(errors2).toBeDefined();
        expect(errors2.length).toBe(0);

        const g3: Group[] = await searchGroupsAssociatedWithPricingStructure(1, 'PARTNER');
        expect(g3.length).toBe(0);

        const errors: string[] = await linkPricingStructureWithGroupId(1, g.id);
        expect(errors).toBeDefined();
        expect(errors.length).toBe(0);

        const gs: Group[] = await searchGroupsAssociatedWithPricingStructure(1, 'PARTNER');
        expect(gs.length).toBe(1);
        expect(gs[0].name).toBe('PARTNER Group');
    });


    it(`test updatePricingStructureStatus`, async () => {
        const r1: boolean = await updatePricingStructureStatus(1, 'DISABLED');
        expect(r1).toBeTrue();

        const p1: PricingStructure =  await getPricingStructureById(1);
        expect(p1.status).toBe('DISABLED');

        const r2: boolean = await updatePricingStructureStatus(1, 'ENABLED');
        expect(r2).toBeTrue();

        const p2: PricingStructure =  await getPricingStructureById(1);
        expect(p2.status).toBe('ENABLED');
    });

    it(`test addOrUpdatePricingStructure`, async () => {
        const ps1name = `PS1-${Math.random()}`;
        const err1: string[]  = await addOrUpdatePricingStructures([{
            name: ps1name,
            viewId: view.id,
            description: 'PS1 Description',
        }]);
        expect(err1.length).toBe(0);

        const ps1: PricingStructure = await getPricingStructureByName(view.id, ps1name);
        expect(ps1.name).toBe(ps1name);
        expect(ps1.description).toBe('PS1 Description');

        const ps2name = `PS1xxx-${Math.random()}`;
        const err2: string[] = await addOrUpdatePricingStructures([{
            viewId: view.id,
            id: ps1.id,
            name: ps2name,
            description: 'PS1xxx Description'
        }]);

        const ps2: PricingStructure = await getPricingStructureById(ps1.id);
        expect(ps2.name).toBe(ps2name);
        expect(ps2.description).toBe('PS1xxx Description');
    });

    it(`test getPricingStructureByView`, async () => {
        const ps: PricingStructure[] = await getPricingStructuresByView(view.id);

        //console.log(util.inspect(ps));
        expect(ps.length).toBeGreaterThanOrEqual(2);
        expect(ps[0].name).toBe('Pricing Structure #1');
        expect(ps[0].viewId).toBe(view.id);
        expect(ps[0].viewName).toBe('Test View 1');
        expect(ps[1].name).toBe('Pricing Structure #2');
        expect(ps[1].viewId).toBe(view.id);
        expect(ps[1].viewName).toBe('Test View 1');
    });

    it(`test getPartnerPricingStructures`, async () => {
        const ps1: PricingStructure[] = await getPartnerPricingStructures(viewer1.id);
        const ps2: PricingStructure[] = await getPartnerPricingStructures(admin1.id);

        // console.log(util.inspect(ps1));
        // console.log(util.inspect(ps2));
        expect(ps1.length).toBe(0);
        expect(ps2.length).toBe(4);
        expect(ps2[0].name).toBe('Pricing Structure #1');
        expect(ps2[0].viewName).toBe('Test View 1');
        expect(ps2[1].name).toBe('Pricing Structure #2');
        expect(ps2[1].viewName).toBe('Test View 1');
        expect(ps2[2].name).toBe('Pricing Structure #1');
        expect(ps2[2].viewName).toBe('Test View 2');
        expect(ps2[3].name).toBe('Pricing Structure #2');
        expect(ps2[3].viewName).toBe('Test View 2');
    });

    it('test getAllPricingStructureWithPrice', async () => {

        const count: number = await getAllPricingStructureItemsWithPriceCount(1);
        const pricingStructureItemsWithPrice: PricingStructureItemWithPrice[]  = await getAllPricingStructureItemsWithPrice(1);

        // console.log(count);
        // console.log(util.inspect(pricingStructureItemsWithPrice));
        expect(count).toBe(7);
        expect(pricingStructureItemsWithPrice.length).toBe(7);
        expect(pricingStructureItemsWithPrice[0].itemName).toBe('Item-1');
        expect(pricingStructureItemsWithPrice[0].price).toBe(1.1);
        expect(pricingStructureItemsWithPrice[0].country).toBe('AUD');
        expect(pricingStructureItemsWithPrice[1].itemName).toBe('Item-2');
        expect(pricingStructureItemsWithPrice[1].price).toBe(2.2);
        expect(pricingStructureItemsWithPrice[1].country).toBe('AUD');
        expect(pricingStructureItemsWithPrice[2].itemName).toBe('Item-3');
        expect(pricingStructureItemsWithPrice[2].price).toBe(3.3);
        expect(pricingStructureItemsWithPrice[2].country).toBe('AUD');
        expect(pricingStructureItemsWithPrice[3].itemName).toBe('Item-4');
        expect(pricingStructureItemsWithPrice[3].price).toBe(4.4);
        expect(pricingStructureItemsWithPrice[3].country).toBe('AUD');
        expect(pricingStructureItemsWithPrice[4].itemName).toBe('Item-5');
        expect(pricingStructureItemsWithPrice[4].price).toBe(5.5);
        expect(pricingStructureItemsWithPrice[4].country).toBe('AUD');
        expect(pricingStructureItemsWithPrice[5].itemName).toBe('Item-6');
        expect(pricingStructureItemsWithPrice[5].price).toBe(6.6);
        expect(pricingStructureItemsWithPrice[5].country).toBe('AUD');
        expect(pricingStructureItemsWithPrice[6].itemName).toBe('Item-7');
        expect(pricingStructureItemsWithPrice[6].price).toBe(7.7);
        expect(pricingStructureItemsWithPrice[6].country).toBe('AUD');
    });

    it('test getAllPricingStructures', async () => {

        const pricingStructures: PricingStructure[]  = await getAllPricingStructures();
        const pricingStructureNames: string[] = pricingStructures.map((p: PricingStructure) => `${p.viewName} - ${p.name}`);

        // console.log(util.inspect(pricingStructures));
        expect(pricingStructures.length).toBeGreaterThanOrEqual(4);
        expect(pricingStructureNames).toContain('Test View 1 - Pricing Structure #1');
        expect(pricingStructureNames).toContain('Test View 1 - Pricing Structure #2');
        expect(pricingStructureNames).toContain('Test View 2 - Pricing Structure #1');
        expect(pricingStructureNames).toContain('Test View 2 - Pricing Structure #2');
    });


    it ('test getPricingStructureByName and getPricingStructureById', async () => {

        const pricingStructure: PricingStructure = await getPricingStructureByName(view.id, 'Pricing Structure #1');
        expect(pricingStructure).toBeTruthy();
        expect(pricingStructure.name).toBe('Pricing Structure #1');

        const pricingStructureById: PricingStructure = await getPricingStructureById(pricingStructure.id);
        expect(pricingStructureById).toBeTruthy();
        expect(pricingStructureById.name).toBe('Pricing Structure #1');
    });
});
