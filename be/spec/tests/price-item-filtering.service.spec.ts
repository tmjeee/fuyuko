import {setupTestDatabase} from "../helpers/test-helper";
import {getAttributeInViewByName, getPricedItemsWithFiltering, PricedItemsWithFilteringResult} from "../../src/service";
import {StringValue, Value} from "../../src/model/item.model";
import {ItemValueOperatorAndAttribute} from "../../src/model/item-attribute.model";
import {Attribute} from "../../src/model/attribute.model";
import * as util from "util";

describe(`price-item-filtering.service`, () => {

    const viewId = 2;
    const pricingStructureId = 1;

    let stringAtt: Attribute;
    let textAtt: Attribute;
    let numberAtt: Attribute;
    let dateAtt: Attribute;
    let currencyAtt: Attribute;
    let volumeAtt: Attribute;
    let dimensionAtt: Attribute;
    let areaAtt: Attribute;
    let lengthAtt: Attribute;
    let widthAtt: Attribute;
    let heightAtt: Attribute;
    let weightAtt: Attribute;
    let selectAtt: Attribute;
    let doubleSelectAtt: Attribute;

    beforeAll(() => {
        setupTestDatabase();
    });
    /*
    beforeAll((done: DoneFn) => {
        setupBeforeAll(done);
    }, JASMINE_TIMEOUT);
    */

    beforeAll(async () => {
        stringAtt = await getAttributeInViewByName(viewId, 'string attribute');
        textAtt = await getAttributeInViewByName(viewId, 'text attribute');
        numberAtt = await getAttributeInViewByName(viewId, 'number attribute');
        dateAtt = await getAttributeInViewByName(viewId, 'date attribute');
        currencyAtt = await getAttributeInViewByName(viewId, 'currency attribute');
        volumeAtt = await getAttributeInViewByName(viewId, 'volume attribute');
        dimensionAtt = await getAttributeInViewByName(viewId, 'dimension attribute');
        areaAtt = await getAttributeInViewByName(viewId, 'area attribute');
        lengthAtt = await getAttributeInViewByName(viewId, 'length attribute');
        widthAtt = await getAttributeInViewByName(viewId, 'width attribute');
        heightAtt = await getAttributeInViewByName(viewId, 'height attribute');
        weightAtt = await getAttributeInViewByName(viewId, 'weight attribute');
        selectAtt = await getAttributeInViewByName(viewId, 'select attribute');
        doubleSelectAtt = await getAttributeInViewByName(viewId, 'doubleselect attribute');
    });

    it(`filter`, async () => {

        const r: PricedItemsWithFilteringResult  = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: stringAtt,
                operator: 'eq',
                itemValue: {
                    attributeId: stringAtt.id,
                    val: {
                        type: "string",
                        value: 'string'
                    } as StringValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);

        console.log(util.inspect(r, {depth: 100}));

    });

});