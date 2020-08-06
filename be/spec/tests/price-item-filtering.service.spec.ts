import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";
import {
    getAttributeInViewByName,
    getPricedItemsWithFiltering,
    PricedItemsWithFilteringResult
} from "../../src/service";
import {
    AreaValue,
    CurrencyValue,
    DateValue, DimensionValue, DoubleSelectValue, HeightValue, LengthValue,
    NumberValue, SelectValue,
    StringValue,
    TextValue,
    Value,
    VolumeValue, WeightValue, WidthValue
} from "../../src/model/item.model";
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

    beforeAll(async () => {
        await setupTestDatabase();
        await setupBeforeAll2();
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
    }, JASMINE_TIMEOUT);

    // string
    it('getPricedItemWithFiltering - string - eq', async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: stringAtt,
                operator: 'eq',
                itemValue: {
                    attributeId: stringAtt.id,
                    val: {
                        type: "string",
                        value: 'some string'
                    } as StringValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.b[0].name)).toBe('Item-1');
        expect((r.b[0][stringAtt.id].attributeId)).toBe(stringAtt.id)
        expect((r.b[0][stringAtt.id].val as StringValue).type).toBe('string');
        expect((r.b[0][stringAtt.id].val as StringValue).value).toBe('some string');
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemWithFiltering - string - not eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: stringAtt,
                operator: 'not eq',
                itemValue: {
                    attributeId: stringAtt.id,
                    val: {
                        type: "string",
                        value: 'string'
                    } as StringValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(7);
        expect((r.b[0].name)).toBe('Item-1');
        expect((r.b[0][stringAtt.id].attributeId)).toBe(stringAtt.id)
        expect((r.b[0][stringAtt.id].val as StringValue).type).toBe('string');
        expect((r.b[0][stringAtt.id].val as StringValue).value).not.toBe('string');
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - string - empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: stringAtt,
                operator: 'empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - string - not empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: stringAtt,
                operator: 'not empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - string - contain`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: stringAtt,
                operator: 'contain',
                itemValue: {
                    attributeId: stringAtt.id,
                    val: {
                        type: "string",
                        value: 'string'
                    } as StringValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);

    });
    it(`getPricedItemsWithFiltering - string - not contain`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: stringAtt,
                operator: 'not contain',
                itemValue: {
                    attributeId: stringAtt.id,
                    val: {
                        type: "string",
                        value: 'asd'
                    } as StringValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - string - regexp`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: stringAtt,
                operator: 'regexp',
                itemValue: {
                    attributeId: stringAtt.id,
                    val: {
                        type: "string",
                        value: '.*'
                    } as StringValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });

    // text
    it(`getPricedItemsWithFiltering - text - eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: textAtt,
                operator: 'eq',
                itemValue: {
                    attributeId: textAtt.id,
                    val: {
                        type: "text",
                        value: 'some text'
                    } as TextValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - text - not eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: textAtt,
                operator: 'not eq',
                itemValue: {
                    attributeId: textAtt.id,
                    val: {
                        type: "text",
                        value: 'some text'
                    } as TextValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering  -text - empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: textAtt,
                operator: 'empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering  -text - not empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: textAtt,
                operator: 'not empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering  -text - contain`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: textAtt,
                operator: 'contain',
                itemValue: {
                    attributeId: textAtt.id,
                    val: {
                        type: "text",
                        value: 'text'
                    } as TextValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering  -text - not contain`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: textAtt,
                operator: 'not contain',
                itemValue: {
                    attributeId: textAtt.id,
                    val: {
                        type: "text",
                        value: 'text'
                    } as TextValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(0);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering  -text - regexp`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: textAtt,
                operator: 'regexp',
                itemValue: {
                    attributeId: textAtt.id,
                    val: {
                        type: "text",
                        value: '.+'
                    } as TextValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });

    // number
    it(`getPricedItemsWithFiltering - number - eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: numberAtt,
                operator: 'eq',
                itemValue: {
                    attributeId: numberAtt.id,
                    val: {
                        type: "number",
                        value: 11
                    } as NumberValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - number - not eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: numberAtt,
                operator: 'not eq',
                itemValue: {
                    attributeId: numberAtt.id,
                    val: {
                        type: "number",
                        value: 11
                    } as NumberValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(0);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - number - empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: numberAtt,
                operator: 'empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - number - not empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: numberAtt,
                operator: 'not empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - number - lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: numberAtt,
                operator: 'lt',
                itemValue: {
                    attributeId: numberAtt.id,
                    val: {
                        type: "number",
                        value: 21
                    } as NumberValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - number - not lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: numberAtt,
                operator: 'not lt',
                itemValue: {
                    attributeId: numberAtt.id,
                    val: {
                        type: "number",
                        value: 1
                    } as NumberValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - number - gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: numberAtt,
                operator: 'gt',
                itemValue: {
                    attributeId: numberAtt.id,
                    val: {
                        type: "number",
                        value: 1
                    } as NumberValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - number - not gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: numberAtt,
                operator: 'not gt',
                itemValue: {
                    attributeId: numberAtt.id,
                    val: {
                        type: "number",
                        value: 21
                    } as NumberValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - number - lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: numberAtt,
                operator: 'lte',
                itemValue: {
                    attributeId: numberAtt.id,
                    val: {
                        type: "number",
                        value: 11
                    } as NumberValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - number - not lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: numberAtt,
                operator: 'not lte',
                itemValue: {
                    attributeId: numberAtt.id,
                    val: {
                        type: "number",
                        value: 10
                    } as NumberValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - number - gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: numberAtt,
                operator: 'gte',
                itemValue: {
                    attributeId: numberAtt.id,
                    val: {
                        type: "number",
                        value: 11
                    } as NumberValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - number - not gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: numberAtt,
                operator: 'not gte',
                itemValue: {
                    attributeId: numberAtt.id,
                    val: {
                        type: "number",
                        value: 20
                    } as NumberValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });

    // date
    it(`getPricedItemsWithFiltering - date - eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dateAtt,
                operator: 'eq',
                itemValue: {
                    attributeId: dateAtt.id,
                    val: {
                        type: "date",
                        value: '28-12-1988'
                    } as DateValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - date - not eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dateAtt,
                operator: 'not eq',
                itemValue: {
                    attributeId: dateAtt.id,
                    val: {
                        type: "date",
                        value: '29-12-1988'
                    } as DateValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - date - empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dateAtt,
                operator: 'empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - date - not empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dateAtt,
                operator: 'not empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - date - lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dateAtt,
                operator: 'lt',
                itemValue: {
                    attributeId: dateAtt.id,
                    val: {
                        type: "date",
                        value: '30-12-1988'
                    } as DateValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - date - not lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dateAtt,
                operator: 'not lt',
                itemValue: {
                    attributeId: dateAtt.id,
                    val: {
                        type: "date",
                        value: '10-12-1988'
                    } as DateValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - date - gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dateAtt,
                operator: 'gt',
                itemValue: {
                    attributeId: dateAtt.id,
                    val: {
                        type: "date",
                        value: '10-12-1988'
                    } as DateValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - date - not gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dateAtt,
                operator: 'not gt',
                itemValue: {
                    attributeId: dateAtt.id,
                    val: {
                        type: "date",
                        value: '30-12-1988'
                    } as DateValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - date - lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dateAtt,
                operator: 'lte',
                itemValue: {
                    attributeId: dateAtt.id,
                    val: {
                        type: "date",
                        value: '28-12-1988'
                    } as DateValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - date - not lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dateAtt,
                operator: 'not gt',
                itemValue: {
                    attributeId: dateAtt.id,
                    val: {
                        type: "date",
                        value: '30-12-1988'
                    } as DateValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - date - gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dateAtt,
                operator: 'gte',
                itemValue: {
                    attributeId: dateAtt.id,
                    val: {
                        type: "date",
                        value: '28-12-1988'
                    } as DateValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - date - not gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dateAtt,
                operator: 'not gte',
                itemValue: {
                    attributeId: dateAtt.id,
                    val: {
                        type: "date",
                        value: '30-12-1988'
                    } as DateValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });

    // currency
    it(`getPricedItemsWithFiltering - currency - eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: currencyAtt,
                operator: 'eq',
                itemValue: {
                    attributeId: currencyAtt.id,
                    val: {
                        type: "currency",
                        value: 10.10,
                        country: 'AUD'
                    } as CurrencyValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - currency - not eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: currencyAtt,
                operator: 'not eq',
                itemValue: {
                    attributeId: currencyAtt.id,
                    val: {
                        type: "currency",
                        value: 12.10,
                        country: 'AUD'
                    } as CurrencyValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - currency - empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: currencyAtt,
                operator: 'empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - currency - not empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: currencyAtt,
                operator: 'not empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - currency - lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: currencyAtt,
                operator: 'lt',
                itemValue: {
                    attributeId: currencyAtt.id,
                    val: {
                        type: "currency",
                        value: 20.10,
                        country: 'AUD'
                    } as CurrencyValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - currency - not lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: currencyAtt,
                operator: 'not lt',
                itemValue: {
                    attributeId: currencyAtt.id,
                    val: {
                        type: "currency",
                        value: 1.10,
                        country: 'AUD'
                    } as CurrencyValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - currency - gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: currencyAtt,
                operator: 'gt',
                itemValue: {
                    attributeId: currencyAtt.id,
                    val: {
                        type: "currency",
                        value: 1.10,
                        country: 'AUD'
                    } as CurrencyValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - currency - not gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: currencyAtt,
                operator: 'not gt',
                itemValue: {
                    attributeId: currencyAtt.id,
                    val: {
                        type: "currency",
                        value: 20.10,
                        country: 'AUD'
                    } as CurrencyValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - currency - lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: currencyAtt,
                operator: 'lte',
                itemValue: {
                    attributeId: currencyAtt.id,
                    val: {
                        type: "currency",
                        value: 10.10,
                        country: 'AUD'
                    } as CurrencyValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - currency - not lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: currencyAtt,
                operator: 'not lte',
                itemValue: {
                    attributeId: currencyAtt.id,
                    val: {
                        type: "currency",
                        value: 0.10,
                        country: 'AUD'
                    } as CurrencyValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - currency - gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: currencyAtt,
                operator: 'gte',
                itemValue: {
                    attributeId: currencyAtt.id,
                    val: {
                        type: "currency",
                        value: 10.10,
                        country: 'AUD'
                    } as CurrencyValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - currency - not gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: currencyAtt,
                operator: 'not gte',
                itemValue: {
                    attributeId: currencyAtt.id,
                    val: {
                        type: "currency",
                        value: 20.10,
                        country: 'AUD'
                    } as CurrencyValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });

    // volume
    it(`getPricedItemsWithFiltering - volume - eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: volumeAtt,
                operator: 'eq',
                itemValue: {
                    attributeId: volumeAtt.id,
                    val: {
                        type: "volume",
                        value: 11,
                        unit: 'ml'
                    } as VolumeValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - volume - not eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: volumeAtt,
                operator: 'not eq',
                itemValue: {
                    attributeId: volumeAtt.id,
                    val: {
                        type: "volume",
                        value: 12,
                        unit: 'ml'
                    } as VolumeValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - volume - empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: volumeAtt,
                operator: 'empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - volume - not empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: volumeAtt,
                operator: 'not empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - volume - lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: volumeAtt,
                operator: 'lt',
                itemValue: {
                    attributeId: volumeAtt.id,
                    val: {
                        type: "volume",
                        value: 12,
                        unit: 'ml'
                    } as VolumeValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - volume - not lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: volumeAtt,
                operator: 'not lt',
                itemValue: {
                    attributeId: volumeAtt.id,
                    val: {
                        type: "volume",
                        value: 10,
                        unit: 'ml'
                    } as VolumeValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - volume - gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: volumeAtt,
                operator: 'gt',
                itemValue: {
                    attributeId: volumeAtt.id,
                    val: {
                        type: "volume",
                        value: 9,
                        unit: 'ml'
                    } as VolumeValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - volume - not gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: volumeAtt,
                operator: 'not gt',
                itemValue: {
                    attributeId: volumeAtt.id,
                    val: {
                        type: "volume",
                        value: 12,
                        unit: 'ml'
                    } as VolumeValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - volume - lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: volumeAtt,
                operator: 'lte',
                itemValue: {
                    attributeId: volumeAtt.id,
                    val: {
                        type: "volume",
                        value: 11,
                        unit: 'ml'
                    } as VolumeValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - volume - not lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: volumeAtt,
                operator: 'not lte',
                itemValue: {
                    attributeId: volumeAtt.id,
                    val: {
                        type: "volume",
                        value: 10,
                        unit: 'ml'
                    } as VolumeValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - volume - gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: volumeAtt,
                operator: 'gte',
                itemValue: {
                    attributeId: volumeAtt.id,
                    val: {
                        type: "volume",
                        value: 11,
                        unit: 'ml'
                    } as VolumeValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - volume - not gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: volumeAtt,
                operator: 'not gte',
                itemValue: {
                    attributeId: volumeAtt.id,
                    val: {
                        type: "volume",
                        value: 15,
                        unit: 'ml'
                    } as VolumeValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });

    // area
    it(`getPricedItemsWithFiltering - area - eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: areaAtt,
                operator: 'eq',
                itemValue: {
                    attributeId: areaAtt.id,
                    val: {
                        type: "area",
                        value: 11,
                        unit: 'm2'
                    } as AreaValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - area - not eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: areaAtt,
                operator: 'not eq',
                itemValue: {
                    attributeId: areaAtt.id,
                    val: {
                        type: "area",
                        value: 13,
                        unit: 'm2'
                    } as AreaValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - area - empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: areaAtt,
                operator: 'empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - area - not empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: areaAtt,
                operator: 'not empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - area - lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: areaAtt,
                operator: 'lt',
                itemValue: {
                    attributeId: areaAtt.id,
                    val: {
                        type: "area",
                        value: 21,
                        unit: 'm2'
                    } as AreaValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - area - not lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: areaAtt,
                operator: 'not lt',
                itemValue: {
                    attributeId: areaAtt.id,
                    val: {
                        type: "area",
                        value: 1,
                        unit: 'm2'
                    } as AreaValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - area - gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: areaAtt,
                operator: 'gt',
                itemValue: {
                    attributeId: areaAtt.id,
                    val: {
                        type: "area",
                        value: 1,
                        unit: 'm2'
                    } as AreaValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - area - not gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: areaAtt,
                operator: 'not gt',
                itemValue: {
                    attributeId: areaAtt.id,
                    val: {
                        type: "area",
                        value: 21,
                        unit: 'm2'
                    } as AreaValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - area - lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: areaAtt,
                operator: 'lte',
                itemValue: {
                    attributeId: areaAtt.id,
                    val: {
                        type: "area",
                        value: 11,
                        unit: 'm2'
                    } as AreaValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - area - not lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: areaAtt,
                operator: 'not lte',
                itemValue: {
                    attributeId: areaAtt.id,
                    val: {
                        type: "area",
                        value: 1,
                        unit: 'm2'
                    } as AreaValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - area - gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: areaAtt,
                operator: 'gte',
                itemValue: {
                    attributeId: areaAtt.id,
                    val: {
                        type: "area",
                        value: 11,
                        unit: 'm2'
                    } as AreaValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - area - not gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: areaAtt,
                operator: 'not gte',
                itemValue: {
                    attributeId: areaAtt.id,
                    val: {
                        type: "area",
                        value: 221,
                        unit: 'm2'
                    } as AreaValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });


    // length
    it(`getPricedItemsWithFiltering - length - eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: lengthAtt,
                operator: 'eq',
                itemValue: {
                    attributeId: lengthAtt.id,
                    val: {
                        type: "length",
                        value: 11,
                        unit: 'cm'
                    } as LengthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - length - not eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: lengthAtt,
                operator: 'not eq',
                itemValue: {
                    attributeId: lengthAtt.id,
                    val: {
                        type: "length",
                        value: 10,
                        unit: 'cm'
                    } as LengthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - length - empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: lengthAtt,
                operator: 'empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - length - not empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: lengthAtt,
                operator: 'not empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - length - lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: lengthAtt,
                operator: 'lt',
                itemValue: {
                    attributeId: lengthAtt.id,
                    val: {
                        type: "length",
                        value: 21,
                        unit: 'cm'
                    } as LengthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - length - not lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: lengthAtt,
                operator: 'not lt',
                itemValue: {
                    attributeId: lengthAtt.id,
                    val: {
                        type: "length",
                        value: 1,
                        unit: 'cm'
                    } as LengthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - length - gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: lengthAtt,
                operator: 'gt',
                itemValue: {
                    attributeId: lengthAtt.id,
                    val: {
                        type: "length",
                        value: 1,
                        unit: 'cm'
                    } as LengthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - length - not gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: lengthAtt,
                operator: 'not gt',
                itemValue: {
                    attributeId: lengthAtt.id,
                    val: {
                        type: "length",
                        value: 31,
                        unit: 'cm'
                    } as LengthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - length - lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: lengthAtt,
                operator: 'lte',
                itemValue: {
                    attributeId: lengthAtt.id,
                    val: {
                        type: "length",
                        value: 11,
                        unit: 'cm'
                    } as LengthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - length - not lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: lengthAtt,
                operator: 'not lte',
                itemValue: {
                    attributeId: lengthAtt.id,
                    val: {
                        type: "length",
                        value: 1,
                        unit: 'cm'
                    } as LengthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - length - gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: lengthAtt,
                operator: 'gte',
                itemValue: {
                    attributeId: lengthAtt.id,
                    val: {
                        type: "length",
                        value: 11,
                        unit: 'cm'
                    } as LengthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - length - not gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: lengthAtt,
                operator: 'not gte',
                itemValue: {
                    attributeId: lengthAtt.id,
                    val: {
                        type: "length",
                        value: 31,
                        unit: 'cm'
                    } as LengthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });

    // width
    it(`getPricedItemsWithFiltering - width - eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: widthAtt,
                operator: 'eq',
                itemValue: {
                    attributeId: widthAtt.id,
                    val: {
                        type: "width",
                        value: 11,
                        unit: 'cm'
                    } as WidthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - width - not eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: widthAtt,
                operator: 'not eq',
                itemValue: {
                    attributeId: widthAtt.id,
                    val: {
                        type: "width",
                        value: 12,
                        unit: 'cm'
                    } as WidthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - width - empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: widthAtt,
                operator: 'empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - width - not empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: widthAtt,
                operator: 'not empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - width - lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: widthAtt,
                operator: 'lt',
                itemValue: {
                    attributeId: widthAtt.id,
                    val: {
                        type: "width",
                        value: 21,
                        unit: 'cm'
                    } as WidthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - width - not lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: widthAtt,
                operator: 'not lt',
                itemValue: {
                    attributeId: widthAtt.id,
                    val: {
                        type: "width",
                        value: 1,
                        unit: 'cm'
                    } as WidthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - width - gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: widthAtt,
                operator: 'gt',
                itemValue: {
                    attributeId: widthAtt.id,
                    val: {
                        type: "width",
                        value: 1,
                        unit: 'cm'
                    } as WidthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - width - not gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: widthAtt,
                operator: 'not gt',
                itemValue: {
                    attributeId: widthAtt.id,
                    val: {
                        type: "width",
                        value: 21,
                        unit: 'cm'
                    } as WidthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - width - lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: widthAtt,
                operator: 'lte',
                itemValue: {
                    attributeId: widthAtt.id,
                    val: {
                        type: "width",
                        value: 11,
                        unit: 'cm'
                    } as WidthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - width - not lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: widthAtt,
                operator: 'not lte',
                itemValue: {
                    attributeId: widthAtt.id,
                    val: {
                        type: "width",
                        value: 1,
                        unit: 'cm'
                    } as WidthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - width - gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: widthAtt,
                operator: 'gte',
                itemValue: {
                    attributeId: widthAtt.id,
                    val: {
                        type: "width",
                        value: 11,
                        unit: 'cm'
                    } as WidthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - width - not gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: widthAtt,
                operator: 'not gte',
                itemValue: {
                    attributeId: widthAtt.id,
                    val: {
                        type: "width",
                        value: 21,
                        unit: 'cm'
                    } as WidthValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });

    // height
    it(`getPricedItemsWithFiltering - height - eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: heightAtt,
                operator: 'eq',
                itemValue: {
                    attributeId: heightAtt.id,
                    val: {
                        type: "height",
                        value: 11,
                        unit: 'cm'
                    } as HeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - height - not eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: heightAtt,
                operator: 'not eq',
                itemValue: {
                    attributeId: heightAtt.id,
                    val: {
                        type: "height",
                        value: 10,
                        unit: 'cm'
                    } as HeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - height - empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: heightAtt,
                operator: 'empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - height - not empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: heightAtt,
                operator: 'not empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - height - lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: heightAtt,
                operator: 'lt',
                itemValue: {
                    attributeId: heightAtt.id,
                    val: {
                        type: "height",
                        value: 20,
                        unit: 'cm'
                    } as HeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - height - not lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: heightAtt,
                operator: 'not lt',
                itemValue: {
                    attributeId: heightAtt.id,
                    val: {
                        type: "height",
                        value: 1,
                        unit: 'cm'
                    } as HeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - height - gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: heightAtt,
                operator: 'gt',
                itemValue: {
                    attributeId: heightAtt.id,
                    val: {
                        type: "height",
                        value: 1,
                        unit: 'cm'
                    } as HeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - height - not gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: heightAtt,
                operator: 'not gt',
                itemValue: {
                    attributeId: heightAtt.id,
                    val: {
                        type: "height",
                        value: 100,
                        unit: 'cm'
                    } as HeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - height - lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: heightAtt,
                operator: 'lte',
                itemValue: {
                    attributeId: heightAtt.id,
                    val: {
                        type: "height",
                        value: 11,
                        unit: 'cm'
                    } as HeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - height - not lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: heightAtt,
                operator: 'not lte',
                itemValue: {
                    attributeId: heightAtt.id,
                    val: {
                        type: "height",
                        value: 1,
                        unit: 'cm'
                    } as HeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - height - gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: heightAtt,
                operator: 'gte',
                itemValue: {
                    attributeId: heightAtt.id,
                    val: {
                        type: "height",
                        value: 11,
                        unit: 'cm'
                    } as HeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - height - not gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: heightAtt,
                operator: 'not gte',
                itemValue: {
                    attributeId: heightAtt.id,
                    val: {
                        type: "height",
                        value: 100,
                        unit: 'cm'
                    } as HeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });

    // weight
    it(`getPricedItemsWithFiltering - weight - eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: weightAtt,
                operator: 'eq',
                itemValue: {
                    attributeId: weightAtt.id,
                    val: {
                        type: "weight",
                        value: 11,
                        unit: 'kg'
                    } as WeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - weight - not eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: weightAtt,
                operator: 'not eq',
                itemValue: {
                    attributeId: weightAtt.id,
                    val: {
                        type: "weight",
                        value: 10,
                        unit: 'kg'
                    } as WeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - weight - empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: weightAtt,
                operator: 'empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - weight - not empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: weightAtt,
                operator: 'not empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - weight - lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: weightAtt,
                operator: 'lt',
                itemValue: {
                    attributeId: weightAtt.id,
                    val: {
                        type: "weight",
                        value: 21,
                        unit: 'kg'
                    } as WeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - weight - not lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: weightAtt,
                operator: 'not lt',
                itemValue: {
                    attributeId: weightAtt.id,
                    val: {
                        type: "weight",
                        value: 1,
                        unit: 'kg'
                    } as WeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - weight - gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: weightAtt,
                operator: 'gt',
                itemValue: {
                    attributeId: weightAtt.id,
                    val: {
                        type: "weight",
                        value: 1,
                        unit: 'kg'
                    } as WeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - weight - not gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: weightAtt,
                operator: 'not gt',
                itemValue: {
                    attributeId: weightAtt.id,
                    val: {
                        type: "weight",
                        value: 21,
                        unit: 'kg'
                    } as WeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - weight - lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: weightAtt,
                operator: 'lte',
                itemValue: {
                    attributeId: weightAtt.id,
                    val: {
                        type: "weight",
                        value: 11,
                        unit: 'kg'
                    } as WeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - weight - not lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: weightAtt,
                operator: 'not lte',
                itemValue: {
                    attributeId: weightAtt.id,
                    val: {
                        type: "weight",
                        value: 10,
                        unit: 'kg'
                    } as WeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - weight - gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: weightAtt,
                operator: 'gte',
                itemValue: {
                    attributeId: weightAtt.id,
                    val: {
                        type: "weight",
                        value: 11,
                        unit: 'kg'
                    } as WeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - weight - not gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: weightAtt,
                operator: 'not gte',
                itemValue: {
                    attributeId: weightAtt.id,
                    val: {
                        type: "weight",
                        value: 21,
                        unit: 'kg'
                    } as WeightValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });

    // select
    it(`getPricedItemsWithFiltering - select - eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: selectAtt,
                operator: 'eq',
                itemValue: {
                    attributeId: selectAtt.id,
                    val: {
                        type: "select",
                        key: 'key3',
                    } as SelectValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - select - not eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: selectAtt,
                operator: 'not eq',
                itemValue: {
                    attributeId: selectAtt.id,
                    val: {
                        type: "select",
                        key: 'key1',
                    } as SelectValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(7);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - select - empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: selectAtt,
                operator: 'empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - select - not empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: selectAtt,
                operator: 'not empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });

    // doubleselect
    it(`getPricedItemsWithFiltering - doubleselect - eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: doubleSelectAtt,
                operator: 'eq',
                itemValue: {
                    attributeId: doubleSelectAtt.id,
                    val: {
                        type: "doubleselect",
                        key1: 'key3',
                        key2: 'key33'
                    } as DoubleSelectValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - doubleselect - not eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: doubleSelectAtt,
                operator: 'not eq',
                itemValue: {
                    attributeId: doubleSelectAtt.id,
                    val: {
                        type: "doubleselect",
                        key1: 'key3',
                        key2: 'key33'
                    } as DoubleSelectValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - doubleselect - empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: doubleSelectAtt,
                operator: 'empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - doubleselect - not empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: doubleSelectAtt,
                operator: 'not empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });


    // dimension
    it(`getPricedItemsWithFiltering - dimension - eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dimensionAtt,
                operator: 'eq',
                itemValue: {
                    attributeId: dimensionAtt.id,
                    val: {
                        type: "dimension",
                        length: 11,
                        width: 12,
                        height: 13,
                        unit: 'cm'
                    } as DimensionValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - dimension - not eq`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dimensionAtt,
                operator: 'not eq',
                itemValue: {
                    attributeId: dimensionAtt.id,
                    val: {
                        type: "dimension",
                        length: 10,
                        width: 12,
                        height: 13,
                        unit: 'cm'
                    } as DimensionValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - dimension - empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dimensionAtt,
                operator: 'empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(6);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - dimension - not empty`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dimensionAtt,
                operator: 'not empty',
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - dimension - lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dimensionAtt,
                operator: 'lt',
                itemValue: {
                    attributeId: dimensionAtt.id,
                    val: {
                        type: "dimension",
                        length: 100,
                        width: 12,
                        height: 13,
                        unit: 'cm'
                    } as DimensionValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - dimension - not lt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dimensionAtt,
                operator: 'not lt',
                itemValue: {
                    attributeId: dimensionAtt.id,
                    val: {
                        type: "dimension",
                        length: 1,
                        width: 12,
                        height: 13,
                        unit: 'cm'
                    } as DimensionValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - dimension - gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dimensionAtt,
                operator: 'gt',
                itemValue: {
                    attributeId: dimensionAtt.id,
                    val: {
                        type: "dimension",
                        length: 1,
                        width: 12,
                        height: 13,
                        unit: 'cm'
                    } as DimensionValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - dimension - not gt`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dimensionAtt,
                operator: 'not gt',
                itemValue: {
                    attributeId: dimensionAtt.id,
                    val: {
                        type: "dimension",
                        length: 100,
                        width: 12,
                        height: 13,
                        unit: 'cm'
                    } as DimensionValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - dimension - lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dimensionAtt,
                operator: 'lte',
                itemValue: {
                    attributeId: dimensionAtt.id,
                    val: {
                        type: "dimension",
                        length: 11,
                        width: 12,
                        height: 13,
                        unit: 'cm'
                    } as DimensionValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - dimension - not lte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dimensionAtt,
                operator: 'not lte',
                itemValue: {
                    attributeId: dimensionAtt.id,
                    val: {
                        type: "dimension",
                        length: 1,
                        width: 12,
                        height: 13,
                        unit: 'cm'
                    } as DimensionValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - dimension - gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dimensionAtt,
                operator: 'gte',
                itemValue: {
                    attributeId: dimensionAtt.id,
                    val: {
                        type: "dimension",
                        length: 11,
                        width: 12,
                        height: 13,
                        unit: 'cm'
                    } as DimensionValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
    it(`getPricedItemsWithFiltering - dimension - not gte`, async () => {
        const r: PricedItemsWithFilteringResult = await getPricedItemsWithFiltering(viewId, pricingStructureId, null, [
            {
                attribute: dimensionAtt,
                operator: 'not gte',
                itemValue: {
                    attributeId: dimensionAtt.id,
                    val: {
                        type: "dimension",
                        length: 110,
                        width: 12,
                        height: 13,
                        unit: 'cm'
                    } as DimensionValue
                } as Value
            } as ItemValueOperatorAndAttribute
        ]);
        expect((r)).toBeDefined();
        expect((r.b)).toBeDefined();
        expect((r.b.length)).toBe(1);
        expect((r.m)).toBeDefined();
        expect((r.m.size)).toBe(14);
    });
});