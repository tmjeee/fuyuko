import {JASMINE_TIMEOUT, setupBeforeAll2, setupTestDatabase} from "../helpers/test-helper";
import {JobLogger, newJobLogger} from "../../src/service/job-log.service";
import {getViewByName} from "../../src/service/view.service";
import {View} from "../../src/model/view.model";
import {run} from "../../src/service/bulk-edit/job-do-bulk-edit.service";
import {BulkEditItem, BulkEditPackage} from "../../src/model/bulk-edit.model";
import {getAttributeInViewByName} from "../../src/service/attribute.service";
import {Attribute} from "../../src/model/attribute.model";
import {getItemById, getItemByName} from "../../src/service";
import {
  AreaValue,
  CurrencyValue,
  DateValue, DimensionValue, DoubleSelectValue, HeightValue,
  Item, LengthValue,
  NumberValue, SelectValue,
  StringValue,
  TextValue,
  Value,
  VolumeValue, WeightValue, WidthValue
} from "../../src/model/item.model";


describe(`job-do-bulk-edit.service.spec.ts`, () => {

  beforeAll(async () => {
    await setupTestDatabase();
    await setupBeforeAll2();
  }, JASMINE_TIMEOUT);

  const createChanges = (): { [attributeId: number]: { old: Value, new: Value} } => {
    return {
      [stringAttribute.id /* attribute id */]: {
        old: null,
        new: { attributeId: stringAttribute.id, val: {type: 'string', value: 'xxx_string_value'} as StringValue} as Value
      },
      [textAttribute.id /* attribute id */]: {
        old: null,
        new: { attributeId: textAttribute.id, val: { type: 'text', value: 'xxx_text_value'} as TextValue} as Value
      },
      [numberAttribute.id /* attribute id */]: {
        old: null,
        new: { attributeId: numberAttribute.id, val: { type: 'number', value: 99.99} as NumberValue} as Value
      },
      [dateAttribute.id /* attribute id */]: {
        old: null,
        new: { attributeId: dateAttribute.id, val: { type: 'date', value: '29-11-2020'} as DateValue} as Value
      },
      [currencyAttribute.id /* attribute id */]: {
        old: null,
        new: { attributeId: currencyAttribute.id, val: { type: 'currency', value: 99.99, country: 'AUD'} as CurrencyValue} as Value
      },
      [volumeAttribute.id /* attribute id */]: {
        old: null,
        new: { attributeId: volumeAttribute.id, val: { type: 'volume', value: 99.99, unit: 'ml'} as VolumeValue} as Value
      },
      [dimensionAttribute.id /* attribute id */]: {
        old: null,
        new: { attributeId: dimensionAttribute.id, val: { type: 'dimension', length: 99.99, width: 98.99, height: 97.99, unit: 'cm'} as DimensionValue} as Value
      },
      [areaAttribute.id /* attribute id */]: {
        old: null,
        new: { attributeId: areaAttribute.id, val: { type: 'area', value: 99.99, unit: 'cm2'} as AreaValue} as Value
      },
      [lengthAttribute.id /* attribute id */]: {
        old: null,
        new: { attributeId: lengthAttribute.id, val: { type: 'length', value: 99.99, unit: 'cm'} as LengthValue} as Value
      },
      [widthAttribute.id /* attribute id */]: {
        old: null,
        new: { attributeId: widthAttribute.id, val: { type: 'width', value: 99.99, unit: 'cm'} as WidthValue} as Value
      },
      [heightAttribute.id /* attribute id */]: {
        old: null,
        new: { attributeId: heightAttribute.id, val: { type: 'height', value: 99.99, unit: 'cm'} as HeightValue} as Value
      },
      [weightAttribute.id /* attribute id */]: {
        old: null,
        new: { attributeId: weightAttribute.id, val: { type: 'weight', value: 99.99, unit: 'g'} as WeightValue} as Value
      },
      [selectAttribute.id /* attribute id */]: {
        old: null,
        new: { attributeId: selectAttribute.id, val: { type: 'select', key: 'key2'} as SelectValue} as Value
      },
      [doubleSelectAttribute.id /* attribute id */]: {
        old: null,
        new: { attributeId: doubleSelectAttribute.id, val: { type: 'doubleselect', key1: 'key2', key2: 'key22'} as DoubleSelectValue} as Value
      }
    }
  };

  const validateItem = (i1: Item) => {
    // string
    expect(i1[stringAttribute.id].attributeId).toBe(stringAttribute.id);
    expect(i1[stringAttribute.id].val.type).toBe('string');
    expect((i1[stringAttribute.id].val as StringValue).value).toBe(`xxx_string_value`);

    // text
    expect(i1[textAttribute.id].attributeId).toBe(textAttribute.id);
    expect(i1[textAttribute.id].val.type).toBe('text');
    expect((i1[textAttribute.id].val as TextValue).value).toBe(`xxx_text_value`);

    // number
    expect(i1[numberAttribute.id].attributeId).toBe(numberAttribute.id);
    expect(i1[numberAttribute.id].val.type).toBe('number');
    expect((i1[numberAttribute.id].val as NumberValue).value).toBe(99.99);

    // date
    expect(i1[dateAttribute.id].attributeId).toBe(dateAttribute.id);
    expect(i1[dateAttribute.id].val.type).toBe('date');
    expect((i1[dateAttribute.id].val as DateValue).value).toBe(`29-11-2020`);

    // currency
    expect(i1[currencyAttribute.id].attributeId).toBe(currencyAttribute.id);
    expect(i1[currencyAttribute.id].val.type).toBe('currency');
    expect((i1[currencyAttribute.id].val as CurrencyValue).value).toBe(99.99);
    expect((i1[currencyAttribute.id].val as CurrencyValue).country).toBe('AUD');

    // dimension
    expect(i1[dimensionAttribute.id].attributeId).toBe(dimensionAttribute.id);
    expect(i1[dimensionAttribute.id].val.type).toBe('dimension');
    expect((i1[dimensionAttribute.id].val as DimensionValue).length).toBe(99.99);
    expect((i1[dimensionAttribute.id].val as DimensionValue).width).toBe(98.99);
    expect((i1[dimensionAttribute.id].val as DimensionValue).height).toBe(97.99);
    expect((i1[dimensionAttribute.id].val as DimensionValue).unit).toBe('cm');

    // volume
    expect(i1[volumeAttribute.id].attributeId).toBe(volumeAttribute.id);
    expect(i1[volumeAttribute.id].val.type).toBe('volume');
    expect((i1[volumeAttribute.id].val as VolumeValue).value).toBe(99.99);
    expect((i1[volumeAttribute.id].val as VolumeValue).unit).toBe('ml');

    // area
    expect(i1[areaAttribute.id].attributeId).toBe(areaAttribute.id);
    expect(i1[areaAttribute.id].val.type).toBe('area');
    expect((i1[areaAttribute.id].val as AreaValue).value).toBe(99.99);
    expect((i1[areaAttribute.id].val as AreaValue).unit).toBe('cm2');

    // length
    expect(i1[lengthAttribute.id].attributeId).toBe(lengthAttribute.id);
    expect(i1[lengthAttribute.id].val.type).toBe('length');
    expect((i1[lengthAttribute.id].val as LengthValue).value).toBe(99.99);
    expect((i1[lengthAttribute.id].val as LengthValue).unit).toBe('cm');

    // width
    expect(i1[widthAttribute.id].attributeId).toBe(widthAttribute.id);
    expect(i1[widthAttribute.id].val.type).toBe('width');
    expect((i1[widthAttribute.id].val as WidthValue).value).toBe(99.99);
    expect((i1[widthAttribute.id].val as WidthValue).unit).toBe('cm');

    // height
    expect(i1[heightAttribute.id].attributeId).toBe(heightAttribute.id);
    expect(i1[heightAttribute.id].val.type).toBe('height');
    expect((i1[heightAttribute.id].val as HeightValue).value).toBe(99.99);
    expect((i1[heightAttribute.id].val as HeightValue).unit).toBe('cm');

    // weight
    expect(i1[weightAttribute.id].attributeId).toBe(weightAttribute.id);
    expect(i1[weightAttribute.id].val.type).toBe('weight');
    expect((i1[weightAttribute.id].val as WeightValue).value).toBe(99.99);
    expect((i1[weightAttribute.id].val as WeightValue).unit).toBe('g');

    // select
    expect(i1[selectAttribute.id].attributeId).toBe(selectAttribute.id);
    expect(i1[selectAttribute.id].val.type).toBe('select');
    expect((i1[selectAttribute.id].val as SelectValue).key).toBe('key2');

    // doubleselect
    expect(i1[doubleSelectAttribute.id].attributeId).toBe(doubleSelectAttribute.id);
    expect(i1[doubleSelectAttribute.id].val.type).toBe('doubleselect');
    expect((i1[doubleSelectAttribute.id].val as DoubleSelectValue).key1).toBe('key2');
    expect((i1[doubleSelectAttribute.id].val as DoubleSelectValue).key2).toBe('key22');
  };

  let view: View;
  let stringAttribute: Attribute;
  let textAttribute: Attribute;
  let numberAttribute: Attribute;
  let dateAttribute: Attribute;
  let currencyAttribute: Attribute;
  let volumeAttribute: Attribute;
  let dimensionAttribute: Attribute;
  let areaAttribute: Attribute;
  let lengthAttribute: Attribute;
  let widthAttribute: Attribute;
  let heightAttribute: Attribute;
  let weightAttribute: Attribute;
  let selectAttribute: Attribute;
  let doubleSelectAttribute: Attribute;

  let item1: Item;
  let item2: Item;

  beforeAll(() => {
    setupTestDatabase();
  });

  /*
  beforeAll((done: DoneFn) => {
    setupBeforeAll(done);
  }, JASMINE_TIMEOUT);
   */

  beforeAll(async (done: DoneFn) => {
    try {
      view = await getViewByName('Test View 1');

      stringAttribute = await getAttributeInViewByName(view.id, 'string attribute');
      textAttribute = await getAttributeInViewByName(view.id, 'text attribute');
      numberAttribute = await getAttributeInViewByName(view.id, 'number attribute');
      dateAttribute = await getAttributeInViewByName(view.id, 'date attribute');
      currencyAttribute = await getAttributeInViewByName(view.id, 'currency attribute');
      volumeAttribute = await getAttributeInViewByName(view.id, 'volume attribute');
      dimensionAttribute = await getAttributeInViewByName(view.id, 'dimension attribute');
      areaAttribute = await getAttributeInViewByName(view.id, 'area attribute');
      lengthAttribute = await getAttributeInViewByName(view.id, 'length attribute');
      widthAttribute = await getAttributeInViewByName(view.id, 'width attribute');
      heightAttribute = await getAttributeInViewByName(view.id, 'height attribute');
      weightAttribute = await getAttributeInViewByName(view.id, 'weight attribute');
      selectAttribute = await getAttributeInViewByName(view.id, 'select attribute');
      doubleSelectAttribute = await getAttributeInViewByName(view.id, 'doubleselect attribute');

      item1 = await getItemByName(view.id, `Item-1`);
      item2 = await getItemByName(view.id, `Item-2`);

      done();
    } catch(e) {
      console.error(e);
    }
  });


  it(`run job`, async () => {
    const uid = `testing`;
    const viewId = view.id;
    const jobLogger: JobLogger = await newJobLogger(`BulkEditJob-${uid}`, `Bulk Edit Job (${uid}) for viewId ${viewId}`);

    await run(jobLogger, viewId, {
      bulkEditItems: [
        // item 1
        {
          id: item1.id, // item id
          name: item1.name,
          description: item1.description,
          parentId: item1.parentId,
          images: item1.images,
          whens: [],
          children: item1.children.map((i: Item) => {
            return {
              id: i.id,
              name: i.name,
              description: i.description,
              parentId: i.parentId,
              images: i.images,
              whens: [],
              children: [],
              changes: createChanges()
            } as BulkEditItem
          }),
          changes: createChanges()
        } as BulkEditItem,

        // item 2
        {
          id: item2.id, // item id
          name: item2.name,
          description: item2.description,
          parentId: item2.parentId,
          images: item2.images,
          whens: [],
          children: item2.children.map((i: Item) => {
            return {
              id: i.id,
              name: i.name,
              description: i.description,
              parentId: i.parentId,
              images: i.images,
              whens: [],
              children: [],
              changes: createChanges()
            } as BulkEditItem
          }),
          changes: createChanges()
        }
      ],
      whenAttributes: [],
      changeAttributes: [],
    } as BulkEditPackage);


    // validate item 1
    const i1: Item = await getItemById(viewId, item1.id);
    validateItem(i1);
    for(const childItem of i1.children) {
      validateItem(childItem);
    }

    // validate item 2
    const i2: Item = await getItemById(viewId, item2.id);
    validateItem(i2);
    for(const childItem of i2.children) {
      validateItem(childItem);
    }
  });
});