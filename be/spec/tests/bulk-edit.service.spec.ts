import { preview } from "../../src/service/bulk-edit/bulk-edit.service";
import {ItemValueAndAttribute, ItemValueOperatorAndAttribute} from "../../src/model/item-attribute.model";
import {BulkEditPackage} from "../../src/model/bulk-edit.model";
import {
    JASMINE_TIMEOUT,
    setupBeforeAll, setupTestDatabase,
} from "../helpers/test-helper";
import {Attribute} from "../../src/model/attribute.model";
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
import {View} from "../../src/model/view.model";
import {getViewByName} from "../../src/service/view.service";
import {getAttributeInViewByName} from "../../src/service/attribute.service";
import * as util from "util";

describe('bulk-edit.service', () => {

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

  beforeAll(() => {
      setupTestDatabase();
  });

  beforeAll((done: DoneFn) => {
     setupBeforeAll(done);
  }, JASMINE_TIMEOUT);

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
          done();
      } catch(e) {
          console.error(e);
      }
  });


  it('preview, make sure changes are in place', async () => {
      try {
          const bulkEditPackage: BulkEditPackage = await preview(2,
              [
                  {
                      attribute: {id: stringAttribute.id},
                      itemValue: {
                          attributeId: stringAttribute.id,
                          val: {type: 'string', value: 'new string value'} as StringValue
                      } as Value
                  } as ItemValueAndAttribute,
                  {
                      attribute: { id: textAttribute.id },
                      itemValue: {
                          attributeId: textAttribute.id,
                          val: {type: 'text', value: 'new text value'} as TextValue
                      }
                  } as ItemValueAndAttribute,
                  {
                      attribute: { id: numberAttribute.id },
                      itemValue: {
                          attributeId: numberAttribute.id,
                          val: {type: 'number', value: 99} as NumberValue
                      }
                  } as ItemValueAndAttribute,
                  {
                     attribute: {id: dateAttribute.id },
                     itemValue: {
                         attributeId: dateAttribute.id,
                         val: { type: 'date', value: '30-11-1999'} as DateValue
                     }
                  } as ItemValueAndAttribute,
                  {
                      attribute: { id: currencyAttribute.id },
                      itemValue: {
                          attributeId: currencyAttribute.id,
                          val: { type: 'currency', value: 99.99, country: 'MYR'} as CurrencyValue
                      } as Value
                  } as ItemValueAndAttribute,
                  {
                      attribute: { id: volumeAttribute.id },
                      itemValue: {
                        attributeId: volumeAttribute.id,
                        val: { type: 'volume', value: 99, unit: 'l'} as VolumeValue
                      } as Value
                  } as ItemValueAndAttribute,
                  {
                     attribute: {id: dimensionAttribute.id },
                     itemValue: {
                         attributeId: dimensionAttribute.id,
                         val: { type: 'dimension', length: 91, width: 92, height: 93, unit: 'm'} as DimensionValue
                     } as Value
                  } as ItemValueAndAttribute,
                  {
                     attribute: {id: areaAttribute.id},
                     itemValue: {
                        attributeId: areaAttribute.id,
                        val: { type: 'area', value: 99, unit: 'cm2'}  as AreaValue
                     } as Value
                  } as ItemValueAndAttribute,
                  {
                      attribute: { id: lengthAttribute.id },
                      itemValue: {
                          attributeId: lengthAttribute.id,
                          val: { type: 'length', value: 99, unit: 'm'} as LengthValue
                      } as Value
                  } as ItemValueAndAttribute,
                  {
                      attribute: { id: widthAttribute.id},
                      itemValue: {
                         attributeId: widthAttribute.id,
                         val: { type: 'width', value: 99, unit: 'm'} as WidthValue
                      } as Value
                  } as ItemValueAndAttribute,
                  {
                      attribute: { id: heightAttribute.id},
                      itemValue: {
                          attributeId: heightAttribute.id,
                          val: { type: 'height', value: 99, unit: 'm'} as HeightValue
                      } as Value
                  } as ItemValueAndAttribute,
                  {
                      attribute: { id: weightAttribute.id},
                      itemValue: {
                          attributeId: weightAttribute.id,
                          val: { type: 'weight', value: 99, unit: 'g'} as WeightValue
                      } as Value
                  } as ItemValueAndAttribute,
                  {
                      attribute: { id: selectAttribute.id},
                      itemValue: {
                          attributeId: selectAttribute.id,
                          val: { type: 'select', key: 'key4'} as SelectValue
                      } as Value
                  } as ItemValueAndAttribute,
                  {
                      attribute: { id: doubleSelectAttribute.id},
                      itemValue: {
                          attributeId: doubleSelectAttribute.id,
                          val: { type: 'doubleselect', key1: 'key4', key2: 'key44'} as DoubleSelectValue
                      } as Value
                  } as ItemValueAndAttribute,
              ],
              [
                  {
                      attribute: {id: stringAttribute.id} as Attribute,
                      itemValue: {
                          attributeId: stringAttribute.id,
                          val: {type: 'string', value: 'some string'} as StringValue
                      } as Value,
                      operator: 'eq'
                  } as ItemValueOperatorAndAttribute
              ]);

          expect(bulkEditPackage.bulkEditItems).toBeDefined();
          expect(bulkEditPackage.bulkEditItems.length).toBe(1);
          expect(bulkEditPackage.bulkEditItems[0].name).toBe('Item-1');

          expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].attributeId).toBe(stringAttribute.id);
          expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].operator).toBe('eq');
          expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].val.type).toBe('string');
          expect((bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].val as StringValue).value).toBe('some string');

          // string
          expect(bulkEditPackage.bulkEditItems[0].changes[stringAttribute.id].old.attributeId).toBe(stringAttribute.id);
          expect((bulkEditPackage.bulkEditItems[0].changes[stringAttribute.id].old.val as StringValue).type).toBe('string');
          expect((bulkEditPackage.bulkEditItems[0].changes[stringAttribute.id].old.val as StringValue).value).toBe('some string');
          expect((bulkEditPackage.bulkEditItems[0].changes[stringAttribute.id].new.val as StringValue).type).toBe('string');
          expect((bulkEditPackage.bulkEditItems[0].changes[stringAttribute.id].new.val as StringValue).value).toBe('new string value');

          // text
          expect(bulkEditPackage.bulkEditItems[0].changes[textAttribute.id].old.attributeId).toBe(textAttribute.id);
          expect((bulkEditPackage.bulkEditItems[0].changes[textAttribute.id].old.val as TextValue).type).toBe('text');
          expect((bulkEditPackage.bulkEditItems[0].changes[textAttribute.id].old.val as TextValue).value).toBe('some text');
          expect((bulkEditPackage.bulkEditItems[0].changes[textAttribute.id].new.val as TextValue).type).toBe('text');
          expect((bulkEditPackage.bulkEditItems[0].changes[textAttribute.id].new.val as TextValue).value).toBe('new text value');

          // number
          expect(bulkEditPackage.bulkEditItems[0].changes[numberAttribute.id].old.attributeId).toBe(numberAttribute.id);
          expect((bulkEditPackage.bulkEditItems[0].changes[numberAttribute.id].old.val as NumberValue).type).toBe('number');
          expect((bulkEditPackage.bulkEditItems[0].changes[numberAttribute.id].old.val as NumberValue).value).toBe(11);
          expect((bulkEditPackage.bulkEditItems[0].changes[numberAttribute.id].new.val as NumberValue).type).toBe('number');
          expect((bulkEditPackage.bulkEditItems[0].changes[numberAttribute.id].new.val as NumberValue).value).toBe(99);

          // date
          expect(bulkEditPackage.bulkEditItems[0].changes[dateAttribute.id].old.attributeId).toBe(dateAttribute.id);
          expect((bulkEditPackage.bulkEditItems[0].changes[dateAttribute.id].old.val as DateValue).type).toBe('date');
          expect((bulkEditPackage.bulkEditItems[0].changes[dateAttribute.id].old.val as DateValue).value).toBe('28-12-1988');
          expect((bulkEditPackage.bulkEditItems[0].changes[dateAttribute.id].new.val as DateValue).type).toBe('date');
          expect((bulkEditPackage.bulkEditItems[0].changes[dateAttribute.id].new.val as DateValue).value).toBe('30-11-1999');

          // currency
          expect(bulkEditPackage.bulkEditItems[0].changes[currencyAttribute.id].old.attributeId).toBe(currencyAttribute.id);
          expect((bulkEditPackage.bulkEditItems[0].changes[currencyAttribute.id].old.val as CurrencyValue).type).toBe('currency');
          expect((bulkEditPackage.bulkEditItems[0].changes[currencyAttribute.id].old.val as CurrencyValue).value).toBe(10.10);
          expect((bulkEditPackage.bulkEditItems[0].changes[currencyAttribute.id].old.val as CurrencyValue).country).toBe('AUD');
          expect((bulkEditPackage.bulkEditItems[0].changes[currencyAttribute.id].new.val as CurrencyValue).type).toBe('currency');
          expect((bulkEditPackage.bulkEditItems[0].changes[currencyAttribute.id].new.val as CurrencyValue).value).toBe(99.99);
          expect((bulkEditPackage.bulkEditItems[0].changes[currencyAttribute.id].new.val as CurrencyValue).country).toBe('MYR');

          // volume
          expect(bulkEditPackage.bulkEditItems[0].changes[volumeAttribute.id].old.attributeId).toBe(volumeAttribute.id);
          expect((bulkEditPackage.bulkEditItems[0].changes[volumeAttribute.id].old.val as VolumeValue).type).toBe('volume');
          expect((bulkEditPackage.bulkEditItems[0].changes[volumeAttribute.id].old.val as VolumeValue).value).toBe(11);
          expect((bulkEditPackage.bulkEditItems[0].changes[volumeAttribute.id].old.val as VolumeValue).unit).toBe('ml');
          expect((bulkEditPackage.bulkEditItems[0].changes[volumeAttribute.id].new.val as VolumeValue).type).toBe('volume');
          expect((bulkEditPackage.bulkEditItems[0].changes[volumeAttribute.id].new.val as VolumeValue).value).toBe(99);
          expect((bulkEditPackage.bulkEditItems[0].changes[volumeAttribute.id].new.val as VolumeValue).unit).toBe('l');

          // dimension
          expect(bulkEditPackage.bulkEditItems[0].changes[dimensionAttribute.id].old.attributeId).toBe(dimensionAttribute.id);
          expect((bulkEditPackage.bulkEditItems[0].changes[dimensionAttribute.id].old.val as DimensionValue).type).toBe('dimension');
          expect((bulkEditPackage.bulkEditItems[0].changes[dimensionAttribute.id].old.val as DimensionValue).length).toBe(11);
          expect((bulkEditPackage.bulkEditItems[0].changes[dimensionAttribute.id].old.val as DimensionValue).width).toBe(12);
          expect((bulkEditPackage.bulkEditItems[0].changes[dimensionAttribute.id].old.val as DimensionValue).height).toBe(13);
          expect((bulkEditPackage.bulkEditItems[0].changes[dimensionAttribute.id].old.val as DimensionValue).unit).toBe('cm');
          expect((bulkEditPackage.bulkEditItems[0].changes[dimensionAttribute.id].new.val as DimensionValue).type).toBe('dimension');
          expect((bulkEditPackage.bulkEditItems[0].changes[dimensionAttribute.id].new.val as DimensionValue).length).toBe(91);
          expect((bulkEditPackage.bulkEditItems[0].changes[dimensionAttribute.id].new.val as DimensionValue).width).toBe(92);
          expect((bulkEditPackage.bulkEditItems[0].changes[dimensionAttribute.id].new.val as DimensionValue).height).toBe(93);
          expect((bulkEditPackage.bulkEditItems[0].changes[dimensionAttribute.id].new.val as DimensionValue).unit).toBe('m');

          // area
          expect(bulkEditPackage.bulkEditItems[0].changes[areaAttribute.id].old.attributeId).toBe(areaAttribute.id);
          expect((bulkEditPackage.bulkEditItems[0].changes[areaAttribute.id].old.val as AreaValue).type).toBe('area');
          expect((bulkEditPackage.bulkEditItems[0].changes[areaAttribute.id].old.val as AreaValue).value).toBe(11);
          expect((bulkEditPackage.bulkEditItems[0].changes[areaAttribute.id].old.val as AreaValue).unit).toBe('m2');
          expect((bulkEditPackage.bulkEditItems[0].changes[areaAttribute.id].new.val as AreaValue).type).toBe('area');
          expect((bulkEditPackage.bulkEditItems[0].changes[areaAttribute.id].new.val as AreaValue).value).toBe(99);
          expect((bulkEditPackage.bulkEditItems[0].changes[areaAttribute.id].new.val as AreaValue).unit).toBe('cm2');

          // length
          expect(bulkEditPackage.bulkEditItems[0].changes[lengthAttribute.id].old.attributeId).toBe(lengthAttribute.id);
          expect((bulkEditPackage.bulkEditItems[0].changes[lengthAttribute.id].old.val as LengthValue).type).toBe('length');
          expect((bulkEditPackage.bulkEditItems[0].changes[lengthAttribute.id].old.val as LengthValue).value).toBe(11);
          expect((bulkEditPackage.bulkEditItems[0].changes[lengthAttribute.id].old.val as LengthValue).unit).toBe('cm');
          expect((bulkEditPackage.bulkEditItems[0].changes[lengthAttribute.id].new.val as LengthValue).type).toBe('length');
          expect((bulkEditPackage.bulkEditItems[0].changes[lengthAttribute.id].new.val as LengthValue).value).toBe(99);
          expect((bulkEditPackage.bulkEditItems[0].changes[lengthAttribute.id].new.val as LengthValue).unit).toBe('m');

          // width
          expect(bulkEditPackage.bulkEditItems[0].changes[widthAttribute.id].old.attributeId).toBe(widthAttribute.id);
          expect((bulkEditPackage.bulkEditItems[0].changes[widthAttribute.id].old.val as WidthValue).type).toBe('width');
          expect((bulkEditPackage.bulkEditItems[0].changes[widthAttribute.id].old.val as WidthValue).value).toBe(11);
          expect((bulkEditPackage.bulkEditItems[0].changes[widthAttribute.id].old.val as WidthValue).unit).toBe('cm');
          expect((bulkEditPackage.bulkEditItems[0].changes[widthAttribute.id].new.val as WidthValue).type).toBe('width');
          expect((bulkEditPackage.bulkEditItems[0].changes[widthAttribute.id].new.val as WidthValue).value).toBe(99);
          expect((bulkEditPackage.bulkEditItems[0].changes[widthAttribute.id].new.val as WidthValue).unit).toBe('m');

          // height
          expect(bulkEditPackage.bulkEditItems[0].changes[heightAttribute.id].old.attributeId).toBe(heightAttribute.id);
          expect((bulkEditPackage.bulkEditItems[0].changes[heightAttribute.id].old.val as HeightValue).type).toBe('height');
          expect((bulkEditPackage.bulkEditItems[0].changes[heightAttribute.id].old.val as HeightValue).value).toBe(11);
          expect((bulkEditPackage.bulkEditItems[0].changes[heightAttribute.id].old.val as HeightValue).unit).toBe('cm');
          expect((bulkEditPackage.bulkEditItems[0].changes[heightAttribute.id].new.val as HeightValue).type).toBe('height');
          expect((bulkEditPackage.bulkEditItems[0].changes[heightAttribute.id].new.val as HeightValue).value).toBe(99);
          expect((bulkEditPackage.bulkEditItems[0].changes[heightAttribute.id].new.val as HeightValue).unit).toBe('m');

          // weight
          expect(bulkEditPackage.bulkEditItems[0].changes[weightAttribute.id].old.attributeId).toBe(weightAttribute.id);
          expect((bulkEditPackage.bulkEditItems[0].changes[weightAttribute.id].old.val as HeightValue).type).toBe('weight');
          expect((bulkEditPackage.bulkEditItems[0].changes[weightAttribute.id].old.val as HeightValue).value).toBe(11);
          expect((bulkEditPackage.bulkEditItems[0].changes[weightAttribute.id].old.val as HeightValue).unit).toBe('kg');
          expect((bulkEditPackage.bulkEditItems[0].changes[weightAttribute.id].new.val as HeightValue).type).toBe('weight');
          expect((bulkEditPackage.bulkEditItems[0].changes[weightAttribute.id].new.val as HeightValue).value).toBe(99);
          expect((bulkEditPackage.bulkEditItems[0].changes[weightAttribute.id].new.val as HeightValue).unit).toBe('g');

          // select
          expect(bulkEditPackage.bulkEditItems[0].changes[selectAttribute.id].old.attributeId).toBe(selectAttribute.id);
          expect((bulkEditPackage.bulkEditItems[0].changes[selectAttribute.id].old.val as SelectValue).type).toBe('select');
          expect((bulkEditPackage.bulkEditItems[0].changes[selectAttribute.id].old.val as SelectValue).key).toBe('key3');
          expect((bulkEditPackage.bulkEditItems[0].changes[selectAttribute.id].new.val as SelectValue).type).toBe('select');
          expect((bulkEditPackage.bulkEditItems[0].changes[selectAttribute.id].new.val as SelectValue).key).toBe('key4');

          // doubleselect
          expect(bulkEditPackage.bulkEditItems[0].changes[doubleSelectAttribute.id].old.attributeId).toBe(doubleSelectAttribute.id);
          expect((bulkEditPackage.bulkEditItems[0].changes[doubleSelectAttribute.id].old.val as DoubleSelectValue).type).toBe('doubleselect');
          expect((bulkEditPackage.bulkEditItems[0].changes[doubleSelectAttribute.id].old.val as DoubleSelectValue).key1).toBe('key3');
          expect((bulkEditPackage.bulkEditItems[0].changes[doubleSelectAttribute.id].old.val as DoubleSelectValue).key2).toBe('key33');
          expect((bulkEditPackage.bulkEditItems[0].changes[doubleSelectAttribute.id].new.val as DoubleSelectValue).type).toBe('doubleselect');
          expect((bulkEditPackage.bulkEditItems[0].changes[doubleSelectAttribute.id].new.val as DoubleSelectValue).key1).toBe('key4');
          expect((bulkEditPackage.bulkEditItems[0].changes[doubleSelectAttribute.id].new.val as DoubleSelectValue).key2).toBe('key44');
      } catch(e) {
          console.error(e);
      }
  });

    /**
     *  ============================
     *  string
     *  =============================
     */

  it(`preview when condition (string eq)`, async () => {
    try {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: stringAttribute.id},
                  itemValue: {
                      attributeId: stringAttribute.id,
                      val: {type: 'string', value: 'new string value'} as StringValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: stringAttribute.id} as Attribute,
                  itemValue: {
                      attributeId: stringAttribute.id,
                      val: {type: 'string', value: 'some string'} as StringValue
                  } as Value,
                  operator: 'eq'
              } as ItemValueOperatorAndAttribute
          ]);

        expect(bulkEditPackage.bulkEditItems).toBeDefined();
        expect(bulkEditPackage.bulkEditItems.length).toBe(1);
        expect(bulkEditPackage.bulkEditItems[0].name).toBe('Item-1');

        expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].attributeId).toBe(stringAttribute.id);
        expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].operator).toBe('eq');
        expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].val.type).toBe('string');
        expect((bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].val as StringValue).value).toBe('some string');
    } catch(e) { console.error(e); }
  });

  it(`preview when condition (string not eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: stringAttribute.id},
                  itemValue: {
                      attributeId: stringAttribute.id,
                      val: {type: 'string', value: 'new string value'} as StringValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: stringAttribute.id} as Attribute,
                  itemValue: {
                      attributeId: stringAttribute.id,
                      val: {type: 'string', value: 'some string'} as StringValue
                  } as Value,
                  operator: 'not eq'
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(6);
      expect(bulkEditPackage.bulkEditItems[0].name).toBe('Item-2');
      expect(bulkEditPackage.bulkEditItems[1].name).toBe('Item-3');
      expect(bulkEditPackage.bulkEditItems[2].name).toBe('Item-4');
      expect(bulkEditPackage.bulkEditItems[3].name).toBe('Item-5');
      expect(bulkEditPackage.bulkEditItems[4].name).toBe('Item-6');
      expect(bulkEditPackage.bulkEditItems[5].name).toBe('Item-7');

      expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].attributeId).toBe(stringAttribute.id);
      expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].operator).toBe('not eq');
      expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].val.type).toBe('string');
      expect((bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].val as StringValue).value).toBe('some string');
  });

  it(`preview when condition (string empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: stringAttribute.id},
                  itemValue: {
                      attributeId: stringAttribute.id,
                      val: {type: 'string', value: 'new string value'} as StringValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: stringAttribute.id} as Attribute,
                  itemValue: undefined,
                  operator: 'empty'
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(6);
      expect(bulkEditPackage.bulkEditItems[0].name).toBe('Item-2');
      expect(bulkEditPackage.bulkEditItems[1].name).toBe('Item-3');
      expect(bulkEditPackage.bulkEditItems[2].name).toBe('Item-4');
      expect(bulkEditPackage.bulkEditItems[3].name).toBe('Item-5');
      expect(bulkEditPackage.bulkEditItems[4].name).toBe('Item-6');
      expect(bulkEditPackage.bulkEditItems[5].name).toBe('Item-7');

      expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].attributeId).toBe(stringAttribute.id);
      expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].operator).toBe('empty');
      expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].val).toBeFalsy();
  });
  it(`preview when condition (string not empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: stringAttribute.id},
                  itemValue: {
                      attributeId: stringAttribute.id,
                      val: {type: 'string', value: 'new string value'} as StringValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: stringAttribute.id} as Attribute,
                  itemValue: undefined,
                  operator: 'not empty'
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
      expect(bulkEditPackage.bulkEditItems[0].name).toBe('Item-1');

      expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].attributeId).toBe(stringAttribute.id);
      expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].operator).toBe('not empty');
      expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].val).toBeFalsy();
  });
  it(`preview when condition (string contain)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: stringAttribute.id},
                  itemValue: {
                      attributeId: stringAttribute.id,
                      val: {type: 'string', value: 'new string value'} as StringValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: stringAttribute.id} as Attribute,
                  operator: 'contain',
                  itemValue: {
                      attributeId: stringAttribute.id,
                      val: {type: 'string', value: 'string'} as StringValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
      expect(bulkEditPackage.bulkEditItems[0].name).toBe('Item-1');

      expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].attributeId).toBe(stringAttribute.id);
      expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].operator).toBe('contain');
      expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].val.type).toBe('string');
      expect((bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].val as StringValue).value).toBe('string');
  });
  it(`preview when condition (string not contain)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: stringAttribute.id},
                  itemValue: {
                      attributeId: stringAttribute.id,
                      val: {type: 'string', value: 'new string value'} as StringValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: stringAttribute.id} as Attribute,
                  operator: 'not contain',
                  itemValue: {
                      attributeId: stringAttribute.id,
                      val: {type: 'string', value: 'string'} as StringValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (string regexp) #1`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: stringAttribute.id},
                  itemValue: {
                      attributeId: stringAttribute.id,
                      val: {type: 'string', value: 'new string value'} as StringValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: stringAttribute.id} as Attribute,
                  operator: 'regexp',
                  itemValue: {
                      attributeId: stringAttribute.id,
                      val: {type: 'string', value: '[asd]'} as StringValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });

  it(`preview when condition (string regexp) #2`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: stringAttribute.id},
                  itemValue: {
                      attributeId: stringAttribute.id,
                      val: {type: 'string', value: 'new string value'} as StringValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: stringAttribute.id} as Attribute,
                  operator: 'regexp',
                  itemValue: {
                      attributeId: stringAttribute.id,
                      val: {type: 'string', value: '[ad]'} as StringValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });

    /**
     *  ============================
     *  text
     *  =============================
     */
    it(`preview when condition (text eq)`, async () => {
      try {
          const bulkEditPackage: BulkEditPackage = await preview(2,
              [
                  {
                      attribute: {id: textAttribute.id},
                      itemValue: {
                          attributeId: textAttribute.id,
                          val: {type: 'text', value: 'new text value'} as TextValue
                      } as Value
                  } as ItemValueAndAttribute,
              ],
              [
                  {
                      attribute: {id: textAttribute.id} as Attribute,
                      itemValue: {
                          attributeId: textAttribute.id,
                          val: {type: 'text', value: 'some text'} as TextValue
                      } as Value,
                      operator: 'eq'
                  } as ItemValueOperatorAndAttribute
              ]);

          expect(bulkEditPackage.bulkEditItems).toBeDefined();
          expect(bulkEditPackage.bulkEditItems.length).toBe(1);
          expect(bulkEditPackage.bulkEditItems[0].name).toBe('Item-1');
      }catch(e) {console.error(e);}
  });
  it(`preview when condition (text not eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: textAttribute.id},
                  itemValue: {
                      attributeId: textAttribute.id,
                      val: {type: 'text', value: 'new text value'} as TextValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: textAttribute.id} as Attribute,
                  itemValue: {
                      attributeId: textAttribute.id,
                      val: {type: 'text', value: 'some text'} as TextValue
                  } as Value,
                  operator: 'not eq'
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(6);
      expect(bulkEditPackage.bulkEditItems[0].name).toBe('Item-2');
      expect(bulkEditPackage.bulkEditItems[1].name).toBe('Item-3');
      expect(bulkEditPackage.bulkEditItems[2].name).toBe('Item-4');
      expect(bulkEditPackage.bulkEditItems[3].name).toBe('Item-5');
      expect(bulkEditPackage.bulkEditItems[4].name).toBe('Item-6');
      expect(bulkEditPackage.bulkEditItems[5].name).toBe('Item-7');
  });
  it(`preview when condition (text empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: textAttribute.id},
                  itemValue: {
                      attributeId: textAttribute.id,
                      val: {type: 'text', value: 'new text value'} as TextValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: textAttribute.id} as Attribute,
                  itemValue: undefined,
                  operator: 'empty'
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(6);
      expect(bulkEditPackage.bulkEditItems[0].name).toBe('Item-2');
      expect(bulkEditPackage.bulkEditItems[1].name).toBe('Item-3');
      expect(bulkEditPackage.bulkEditItems[2].name).toBe('Item-4');
      expect(bulkEditPackage.bulkEditItems[3].name).toBe('Item-5');
      expect(bulkEditPackage.bulkEditItems[4].name).toBe('Item-6');
      expect(bulkEditPackage.bulkEditItems[5].name).toBe('Item-7');
  });
  it(`preview when condition (text not empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: textAttribute.id},
                  itemValue: {
                      attributeId: textAttribute.id,
                      val: {type: 'text', value: 'new text value'} as TextValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: textAttribute.id} as Attribute,
                  itemValue: undefined,
                  operator: 'not empty'
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
      expect(bulkEditPackage.bulkEditItems[0].name).toBe('Item-1');
  });
  it(`preview when condition (text contain)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: textAttribute.id},
                  itemValue: {
                      attributeId: textAttribute.id,
                      val: {type: 'text', value: 'new text value'} as TextValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: textAttribute.id} as Attribute,
                  operator: 'contain',
                  itemValue: {
                      attributeId: textAttribute.id,
                      val: {type: 'text', value: 'text'} as TextValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
      expect(bulkEditPackage.bulkEditItems[0].name).toBe('Item-1');
  });
  it(`preview when condition (text not contain)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: textAttribute.id},
                  itemValue: {
                      attributeId: textAttribute.id,
                      val: {type: 'text', value: 'new text value'} as TextValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: textAttribute.id} as Attribute,
                  operator: 'not contain',
                  itemValue: {
                      attributeId: textAttribute.id,
                      val: {type: 'text', value: 'text'} as TextValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (text regexp) #1`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: textAttribute.id},
                  itemValue: {
                      attributeId: textAttribute.id,
                      val: {type: 'text', value: 'new text value'} as TextValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: stringAttribute.id} as Attribute,
                  operator: 'regexp',
                  itemValue: {
                      attributeId: stringAttribute.id,
                      val: {type: 'text', value: '[asd]'} as TextValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (text regexp) #2`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: textAttribute.id},
                  itemValue: {
                      attributeId: textAttribute.id,
                      val: {type: 'text', value: 'new text value'} as TextValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: textAttribute.id} as Attribute,
                  operator: 'regexp',
                  itemValue: {
                      attributeId: textAttribute.id,
                      val: {type: 'text', value: '[ad]'} as TextValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });

    /**
     *  ============================
     *  number
     *  =============================
     */
    it(`preview when condition (number eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: numberAttribute.id},
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 88} as NumberValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: numberAttribute.id} as Attribute,
                  operator: 'eq',
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 11} as NumberValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (number not eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: numberAttribute.id},
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 88} as NumberValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: numberAttribute.id} as Attribute,
                  operator: 'not eq',
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 11} as NumberValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (number empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: numberAttribute.id},
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 88} as NumberValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: numberAttribute.id} as Attribute,
                  operator: 'empty',
                  itemValue: undefined,
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(6);
  });
  it(`preview when condition (number not empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: numberAttribute.id},
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 88} as NumberValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: numberAttribute.id} as Attribute,
                  operator: 'not empty',
                  itemValue: undefined,
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (number lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: numberAttribute.id},
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 88} as NumberValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: numberAttribute.id} as Attribute,
                  operator: 'lt',
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 20} as NumberValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (number not lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: numberAttribute.id},
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 88} as NumberValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: numberAttribute.id} as Attribute,
                  operator: 'not lt',
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 20} as NumberValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (number gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: numberAttribute.id},
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 88} as NumberValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: numberAttribute.id} as Attribute,
                  operator: 'gt',
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 7} as NumberValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (number not gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: numberAttribute.id},
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 88} as NumberValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: numberAttribute.id} as Attribute,
                  operator: 'not gt',
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 7} as NumberValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (number lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: numberAttribute.id},
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 88} as NumberValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: numberAttribute.id} as Attribute,
                  operator: 'lte',
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 11} as NumberValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (number not lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: numberAttribute.id},
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 88} as NumberValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: numberAttribute.id} as Attribute,
                  operator: 'not lte',
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 11} as NumberValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (number gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: numberAttribute.id},
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 88} as NumberValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: numberAttribute.id} as Attribute,
                  operator: 'gte',
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 11} as NumberValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (number not gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: numberAttribute.id},
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 88} as NumberValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: numberAttribute.id} as Attribute,
                  operator: 'not gte',
                  itemValue: {
                      attributeId: numberAttribute.id,
                      val: {type: 'number', value: 11} as NumberValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });

    /**
     *  ============================
     *  date
     *  =============================
     */
    it(`preview when condition (date eq)`, async () => {
        const bulkEditPackage: BulkEditPackage = await preview(2,
            [
                {
                    attribute: {id: dateAttribute.id},
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '11-11-1911'} as DateValue
                    } as Value
                } as ItemValueAndAttribute,
            ],
            [
                {
                    attribute: {id: dateAttribute.id} as Attribute,
                    operator: 'eq',
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '28-12-1988'} as DateValue
                    } as Value
                } as ItemValueOperatorAndAttribute
            ]);
        expect(bulkEditPackage.bulkEditItems).toBeDefined();
        expect(bulkEditPackage.bulkEditItems.length).toBe(1);
    });
    it(`preview when condition (date not eq)`, async () => {
        const bulkEditPackage: BulkEditPackage = await preview(2,
            [
                {
                    attribute: {id: dateAttribute.id},
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '11-11-1911'} as DateValue
                    } as Value
                } as ItemValueAndAttribute,
            ],
            [
                {
                    attribute: {id: dateAttribute.id} as Attribute,
                    operator: 'not eq',
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '28-12-1988'} as DateValue
                    } as Value
                } as ItemValueOperatorAndAttribute
            ]);
        expect(bulkEditPackage.bulkEditItems).toBeDefined();
        expect(bulkEditPackage.bulkEditItems.length).toBe(0);
    });
    it(`preview when condition (date empty)`, async () => {
        const bulkEditPackage: BulkEditPackage = await preview(2,
            [
                {
                    attribute: {id: dateAttribute.id},
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '11-11-1911'} as DateValue
                    } as Value
                } as ItemValueAndAttribute,
            ],
            [
                {
                    attribute: {id: dateAttribute.id} as Attribute,
                    operator: 'empty',
                    itemValue: undefined
                } as ItemValueOperatorAndAttribute
            ]);
        expect(bulkEditPackage.bulkEditItems).toBeDefined();
        expect(bulkEditPackage.bulkEditItems.length).toBe(6);
    });
    it(`preview when condition (date not empty)`, async () => {
        const bulkEditPackage: BulkEditPackage = await preview(2,
            [
                {
                    attribute: {id: dateAttribute.id},
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '11-11-1911'} as DateValue
                    } as Value
                } as ItemValueAndAttribute,
            ],
            [
                {
                    attribute: {id: dateAttribute.id} as Attribute,
                    operator: 'not empty',
                    itemValue: undefined
                } as ItemValueOperatorAndAttribute
            ]);
        expect(bulkEditPackage.bulkEditItems).toBeDefined();
        expect(bulkEditPackage.bulkEditItems.length).toBe(1);
    });
    it(`preview when condition (date lt)`, async () => {
        const bulkEditPackage: BulkEditPackage = await preview(2,
            [
                {
                    attribute: {id: dateAttribute.id},
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '11-11-1911'} as DateValue
                    } as Value
                } as ItemValueAndAttribute,
            ],
            [
                {
                    attribute: {id: dateAttribute.id} as Attribute,
                    operator: 'lt',
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '28-12-2010'} as DateValue
                    } as Value
                } as ItemValueOperatorAndAttribute
            ]);
        expect(bulkEditPackage.bulkEditItems).toBeDefined();
        expect(bulkEditPackage.bulkEditItems.length).toBe(1);
    });
    it(`preview when condition (date not lt)`, async () => {
        const bulkEditPackage: BulkEditPackage = await preview(2,
            [
                {
                    attribute: {id: dateAttribute.id},
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '11-11-1911'} as DateValue
                    } as Value
                } as ItemValueAndAttribute,
            ],
            [
                {
                    attribute: {id: dateAttribute.id} as Attribute,
                    operator: 'not lt',
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '28-12-2010'} as DateValue
                    } as Value
                } as ItemValueOperatorAndAttribute
            ]);
        expect(bulkEditPackage.bulkEditItems).toBeDefined();
        expect(bulkEditPackage.bulkEditItems.length).toBe(0);
    });
    it(`preview when condition (date gt)`, async () => {
        const bulkEditPackage: BulkEditPackage = await preview(2,
            [
                {
                    attribute: {id: dateAttribute.id},
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '11-11-1911'} as DateValue
                    } as Value
                } as ItemValueAndAttribute,
            ],
            [
                {
                    attribute: {id: dateAttribute.id} as Attribute,
                    operator: 'gt',
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '28-12-1910'} as DateValue
                    } as Value
                } as ItemValueOperatorAndAttribute
            ]);
        expect(bulkEditPackage.bulkEditItems).toBeDefined();
        expect(bulkEditPackage.bulkEditItems.length).toBe(1);
    });
    it(`preview when condition (date not gt)`, async () => {
        const bulkEditPackage: BulkEditPackage = await preview(2,
            [
                {
                    attribute: {id: dateAttribute.id},
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '11-11-1911'} as DateValue
                    } as Value
                } as ItemValueAndAttribute,
            ],
            [
                {
                    attribute: {id: dateAttribute.id} as Attribute,
                    operator: 'not gt',
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '28-12-1910'} as DateValue
                    } as Value
                } as ItemValueOperatorAndAttribute
            ]);
        expect(bulkEditPackage.bulkEditItems).toBeDefined();
        expect(bulkEditPackage.bulkEditItems.length).toBe(0);
    });
    it(`preview when condition (date lte)`, async () => {
        const bulkEditPackage: BulkEditPackage = await preview(2,
            [
                {
                    attribute: {id: dateAttribute.id},
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '11-11-1911'} as DateValue
                    } as Value
                } as ItemValueAndAttribute,
            ],
            [
                {
                    attribute: {id: dateAttribute.id} as Attribute,
                    operator: 'lte',
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '28-12-1988'} as DateValue
                    } as Value
                } as ItemValueOperatorAndAttribute
            ]);
        expect(bulkEditPackage.bulkEditItems).toBeDefined();
        expect(bulkEditPackage.bulkEditItems.length).toBe(1);
    });
    it(`preview when condition (date not lte)`, async () => {
        const bulkEditPackage: BulkEditPackage = await preview(2,
            [
                {
                    attribute: {id: dateAttribute.id},
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '11-11-1911'} as DateValue
                    } as Value
                } as ItemValueAndAttribute,
            ],
            [
                {
                    attribute: {id: dateAttribute.id} as Attribute,
                    operator: 'not lte',
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '28-12-1988'} as DateValue
                    } as Value
                } as ItemValueOperatorAndAttribute
            ]);
        expect(bulkEditPackage.bulkEditItems).toBeDefined();
        expect(bulkEditPackage.bulkEditItems.length).toBe(0);
    });
    it(`preview when condition (date gte)`, async () => {
        const bulkEditPackage: BulkEditPackage = await preview(2,
            [
                {
                    attribute: {id: dateAttribute.id},
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '11-11-1911'} as DateValue
                    } as Value
                } as ItemValueAndAttribute,
            ],
            [
                {
                    attribute: {id: dateAttribute.id} as Attribute,
                    operator: 'gte',
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '28-12-1988'} as DateValue
                    } as Value
                } as ItemValueOperatorAndAttribute
            ]);
        expect(bulkEditPackage.bulkEditItems).toBeDefined();
        expect(bulkEditPackage.bulkEditItems.length).toBe(1);
    });
    it(`preview when condition (date not gte)`, async () => {
        const bulkEditPackage: BulkEditPackage = await preview(2,
            [
                {
                    attribute: {id: dateAttribute.id},
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '11-11-1911'} as DateValue
                    } as Value
                } as ItemValueAndAttribute,
            ],
            [
                {
                    attribute: {id: dateAttribute.id} as Attribute,
                    operator: 'not gte',
                    itemValue: {
                        attributeId: dateAttribute.id,
                        val: {type: 'date', value: '28-12-1988'} as DateValue
                    } as Value
                } as ItemValueOperatorAndAttribute
            ]);
        expect(bulkEditPackage.bulkEditItems).toBeDefined();
        expect(bulkEditPackage.bulkEditItems.length).toBe(0);
    });

    /**
     *  ============================
     *  currency
     *  =============================
     */
    it(`preview when condition (currency eq)`, async () => {
        const bulkEditPackage: BulkEditPackage = await preview(2,
            [
                {
                    attribute: {id: currencyAttribute.id},
                    itemValue: {
                        attributeId: currencyAttribute.id,
                        val: {type: 'currency', value: 12, country: 'MYR'} as CurrencyValue
                    } as Value
                } as ItemValueAndAttribute,
            ],
            [
                {
                    attribute: {id: currencyAttribute.id} as Attribute,
                    operator: 'eq',
                    itemValue: {
                        attributeId: currencyAttribute.id,
                        val: {type: 'currency', value: 10.10, country: 'AUD'} as CurrencyValue
                    } as Value
                } as ItemValueOperatorAndAttribute
            ]);
        expect(bulkEditPackage.bulkEditItems).toBeDefined();
        expect(bulkEditPackage.bulkEditItems.length).toBe(1);
    });
  it(`preview when condition (currency not eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: currencyAttribute.id},
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 12, country: 'MYR'} as CurrencyValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: currencyAttribute.id} as Attribute,
                  operator: 'eq',
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 10.11, country: 'AUD'} as CurrencyValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (currency empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: currencyAttribute.id},
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 12, country: 'MYR'} as CurrencyValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: currencyAttribute.id} as Attribute,
                  operator: 'empty',
                  itemValue: undefined
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(6);
  });
  it(`preview when condition (currency not empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: currencyAttribute.id},
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 12, country: 'MYR'} as CurrencyValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: currencyAttribute.id} as Attribute,
                  operator: 'not empty',
                  itemValue: undefined
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (currency lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: currencyAttribute.id},
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 12, country: 'MYR'} as CurrencyValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: currencyAttribute.id} as Attribute,
                  operator: 'lt',
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 15.11, country: 'AUD'} as CurrencyValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (currency not lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: currencyAttribute.id},
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 12, country: 'MYR'} as CurrencyValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: currencyAttribute.id} as Attribute,
                  operator: 'not lt',
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 15.11, country: 'AUD'} as CurrencyValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (currency gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: currencyAttribute.id},
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 12, country: 'MYR'} as CurrencyValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: currencyAttribute.id} as Attribute,
                  operator: 'gt',
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 1.11, country: 'AUD'} as CurrencyValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (currency not gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: currencyAttribute.id},
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 12, country: 'MYR'} as CurrencyValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: currencyAttribute.id} as Attribute,
                  operator: 'not gt',
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 15.11, country: 'AUD'} as CurrencyValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (currency lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: currencyAttribute.id},
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 12, country: 'MYR'} as CurrencyValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: currencyAttribute.id} as Attribute,
                  operator: 'lte',
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 10.10, country: 'AUD'} as CurrencyValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (currency not lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: currencyAttribute.id},
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 12, country: 'MYR'} as CurrencyValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: currencyAttribute.id} as Attribute,
                  operator: 'not lte',
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 10.10, country: 'AUD'} as CurrencyValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (currency gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: currencyAttribute.id},
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 12, country: 'MYR'} as CurrencyValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: currencyAttribute.id} as Attribute,
                  operator: 'gte',
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 10.10, country: 'AUD'} as CurrencyValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);

  });
  it(`preview when condition (currency not gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(2,
          [
              {
                  attribute: {id: currencyAttribute.id},
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 12, country: 'MYR'} as CurrencyValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: currencyAttribute.id} as Attribute,
                  operator: 'not gte',
                  itemValue: {
                      attributeId: currencyAttribute.id,
                      val: {type: 'currency', value: 10.10, country: 'AUD'} as CurrencyValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });

  /**
   *  ============================
   *  volume
   *  =============================
   */
  it(`preview when condition (volume eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: volumeAttribute.id},
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml' } as VolumeValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: volumeAttribute.id} as Attribute,
                  operator: 'eq',
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml'} as VolumeValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (volume not eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: volumeAttribute.id},
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml' } as VolumeValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: volumeAttribute.id} as Attribute,
                  operator: 'not eq',
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml'} as VolumeValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (volume empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: volumeAttribute.id},
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml' } as VolumeValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: volumeAttribute.id} as Attribute,
                  operator: 'empty',
                  itemValue: undefined,
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(6);
  });
  it(`preview when condition (volume not empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: volumeAttribute.id},
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml' } as VolumeValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: volumeAttribute.id} as Attribute,
                  operator: 'not empty',
                  itemValue: undefined,
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (volume lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: volumeAttribute.id},
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml' } as VolumeValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: volumeAttribute.id} as Attribute,
                  operator: 'lt',
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 21, unit: 'ml'} as VolumeValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (volume not lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: volumeAttribute.id},
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml' } as VolumeValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: volumeAttribute.id} as Attribute,
                  operator: 'not lt',
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 21, unit: 'ml'} as VolumeValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (volume gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: volumeAttribute.id},
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml' } as VolumeValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: volumeAttribute.id} as Attribute,
                  operator: 'gt',
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 1, unit: 'ml'} as VolumeValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (volume not gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: volumeAttribute.id},
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml' } as VolumeValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: volumeAttribute.id} as Attribute,
                  operator: 'not gt',
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 1, unit: 'ml'} as VolumeValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (volume lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: volumeAttribute.id},
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml' } as VolumeValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: volumeAttribute.id} as Attribute,
                  operator: 'lte',
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml'} as VolumeValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (volume not lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: volumeAttribute.id},
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml' } as VolumeValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: volumeAttribute.id} as Attribute,
                  operator: 'not lte',
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml'} as VolumeValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (volume gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: volumeAttribute.id},
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml' } as VolumeValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: volumeAttribute.id} as Attribute,
                  operator: 'gte',
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml'} as VolumeValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (volume not gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: volumeAttribute.id},
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml' } as VolumeValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: volumeAttribute.id} as Attribute,
                  operator: 'not gte',
                  itemValue: {
                      attributeId: volumeAttribute.id,
                      val: {type: 'volume', value: 11, unit: 'ml'} as VolumeValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });

  /**
   *  ============================
   *  area
   *  =============================
   */
  it(`preview when condition (area eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: areaAttribute.id},
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: areaAttribute.id} as Attribute,
                  operator: 'eq',
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2'} as AreaValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (area not eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: areaAttribute.id},
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: areaAttribute.id} as Attribute,
                  operator: 'not eq',
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2'} as AreaValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (area empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: areaAttribute.id},
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: areaAttribute.id} as Attribute,
                  operator: 'empty',
                  itemValue: undefined
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(6);
  });
  it(`preview when condition (area not empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: areaAttribute.id},
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: areaAttribute.id} as Attribute,
                  operator: 'not empty',
                  itemValue: undefined
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (area lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: areaAttribute.id},
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: areaAttribute.id} as Attribute,
                  operator: 'lt',
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 12, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (area not lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: areaAttribute.id},
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: areaAttribute.id} as Attribute,
                  operator: 'not lt',
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 10, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (area gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: areaAttribute.id},
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: areaAttribute.id} as Attribute,
                  operator: 'gt',
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 10, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (area not gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: areaAttribute.id},
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: areaAttribute.id} as Attribute,
                  operator: 'not gt',
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 15, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (area lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: areaAttribute.id},
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: areaAttribute.id} as Attribute,
                  operator: 'lte',
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (area not lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: areaAttribute.id},
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: areaAttribute.id} as Attribute,
                  operator: 'not lte',
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (area gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: areaAttribute.id},
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: areaAttribute.id} as Attribute,
                  operator: 'gte',
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (area not gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: areaAttribute.id},
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: areaAttribute.id} as Attribute,
                  operator: 'not gte',
                  itemValue: {
                      attributeId: areaAttribute.id,
                      val: {type: 'area', value: 11, unit: 'm2' } as AreaValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });

    /**
     *  ============================
     *  length
     *  =============================
     */
  it(`preview when condition (length eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: lengthAttribute.id},
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: lengthAttribute.id} as Attribute,
                  operator: 'eq',
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (length not eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: lengthAttribute.id},
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: lengthAttribute.id} as Attribute,
                  operator: 'not eq',
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (length empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: lengthAttribute.id},
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: lengthAttribute.id} as Attribute,
                  operator: 'empty',
                  itemValue: undefined,
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(6);
  });
  it(`preview when condition (length not empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: lengthAttribute.id},
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: lengthAttribute.id} as Attribute,
                  operator: 'not empty',
                  itemValue: undefined,
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (length lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: lengthAttribute.id},
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: lengthAttribute.id} as Attribute,
                  operator: 'lt',
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 15, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (length not lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: lengthAttribute.id},
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: lengthAttribute.id} as Attribute,
                  operator: 'not lt',
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 15, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (length gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: lengthAttribute.id},
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: lengthAttribute.id} as Attribute,
                  operator: 'gt',
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 10, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (length not gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: lengthAttribute.id},
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: lengthAttribute.id} as Attribute,
                  operator: 'not gt',
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 10, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (length lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: lengthAttribute.id},
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: lengthAttribute.id} as Attribute,
                  operator: 'lte',
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (length not lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: lengthAttribute.id},
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: lengthAttribute.id} as Attribute,
                  operator: 'not lte',
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (length gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: lengthAttribute.id},
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: lengthAttribute.id} as Attribute,
                  operator: 'gte',
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (length not gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: lengthAttribute.id},
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: lengthAttribute.id} as Attribute,
                  operator: 'not gte',
                  itemValue: {
                      attributeId: lengthAttribute.id,
                      val: {type: 'length', value: 11, unit: 'cm' } as LengthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });

    /**
     *  ============================
     *  width
     *  =============================
     */
  it(`preview when condition (width eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: widthAttribute.id},
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: widthAttribute.id} as Attribute,
                  operator: 'eq',
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (width not eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: widthAttribute.id},
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: widthAttribute.id} as Attribute,
                  operator: 'not eq',
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (width empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: widthAttribute.id},
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: widthAttribute.id} as Attribute,
                  operator: 'empty',
                  itemValue: undefined
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(6);
  });
  it(`preview when condition (width not empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: widthAttribute.id},
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: widthAttribute.id} as Attribute,
                  operator: 'not empty',
                  itemValue: undefined,
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (width lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: widthAttribute.id},
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: widthAttribute.id} as Attribute,
                  operator: 'lt',
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 15, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (width not lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: widthAttribute.id},
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: widthAttribute.id} as Attribute,
                  operator: 'not lt',
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 15, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (width gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: widthAttribute.id},
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: widthAttribute.id} as Attribute,
                  operator: 'gt',
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 10, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (width not gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: widthAttribute.id},
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: widthAttribute.id} as Attribute,
                  operator: 'not gt',
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 15, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (width lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: widthAttribute.id},
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: widthAttribute.id} as Attribute,
                  operator: 'lte',
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (width not lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: widthAttribute.id},
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: widthAttribute.id} as Attribute,
                  operator: 'not lte',
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (width gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: widthAttribute.id},
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: widthAttribute.id} as Attribute,
                  operator: 'gte',
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (width not gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: widthAttribute.id},
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: widthAttribute.id} as Attribute,
                  operator: 'not gte',
                  itemValue: {
                      attributeId: widthAttribute.id,
                      val: {type: 'width', value: 11, unit: 'cm' } as WidthValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });

    /**
     *  ============================
     *  height
     *  =============================
     */
  it(`preview when condition (height eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: heightAttribute.id},
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: heightAttribute.id} as Attribute,
                  operator: 'eq',
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (height not eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: heightAttribute.id},
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: heightAttribute.id} as Attribute,
                  operator: 'not eq',
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (height empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: heightAttribute.id},
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: heightAttribute.id} as Attribute,
                  operator: 'empty',
                  itemValue: undefined,
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(6);
  });
  it(`preview when condition (height not empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: heightAttribute.id},
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: heightAttribute.id} as Attribute,
                  operator: 'not empty',
                  itemValue: undefined,
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (height lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: heightAttribute.id},
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: heightAttribute.id} as Attribute,
                  operator: 'lt',
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 15, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (height not lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: heightAttribute.id},
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: heightAttribute.id} as Attribute,
                  operator: 'not lt',
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 10, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (height gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: heightAttribute.id},
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: heightAttribute.id} as Attribute,
                  operator: 'gt',
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 10, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (height not gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: heightAttribute.id},
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: heightAttribute.id} as Attribute,
                  operator: 'not gt',
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 15, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (height lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: heightAttribute.id},
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: heightAttribute.id} as Attribute,
                  operator: 'lte',
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (height not lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: heightAttribute.id},
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: heightAttribute.id} as Attribute,
                  operator: 'not lte',
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (height gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: heightAttribute.id},
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: heightAttribute.id} as Attribute,
                  operator: 'gte',
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (height not gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: heightAttribute.id},
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: heightAttribute.id} as Attribute,
                  operator: 'not gte',
                  itemValue: {
                      attributeId: heightAttribute.id,
                      val: {type: 'height', value: 11, unit: 'cm' } as HeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });

    /**
     *  ============================
     *  weight
     *  =============================
     */
  it(`preview when condition (weight eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: weightAttribute.id},
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: weightAttribute.id} as Attribute,
                  operator: 'eq',
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (weight not eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: weightAttribute.id},
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: weightAttribute.id} as Attribute,
                  operator: 'not eq',
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (weight empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: weightAttribute.id},
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: weightAttribute.id} as Attribute,
                  operator: 'empty',
                  itemValue: undefined,
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(6);
  });
  it(`preview when condition (weight not empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: weightAttribute.id},
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: weightAttribute.id} as Attribute,
                  operator: 'not empty',
                  itemValue: undefined,
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (weight lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: weightAttribute.id},
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: weightAttribute.id} as Attribute,
                  operator: 'lt',
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 15, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (weight not lt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: weightAttribute.id},
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: weightAttribute.id} as Attribute,
                  operator: 'not lt',
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 10, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (weight gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: weightAttribute.id},
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: weightAttribute.id} as Attribute,
                  operator: 'gt',
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 10, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (weight not gt)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: weightAttribute.id},
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: weightAttribute.id} as Attribute,
                  operator: 'not gt',
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 15, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (weight lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: weightAttribute.id},
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: weightAttribute.id} as Attribute,
                  operator: 'lte',
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (weight not lte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: weightAttribute.id},
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: weightAttribute.id} as Attribute,
                  operator: 'not lte',
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });
  it(`preview when condition (weight gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: weightAttribute.id},
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: weightAttribute.id} as Attribute,
                  operator: 'gte',
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (weight not gte)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: weightAttribute.id},
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: weightAttribute.id} as Attribute,
                  operator: 'not gte',
                  itemValue: {
                      attributeId: weightAttribute.id,
                      val: {type: 'weight', value: 11, unit: 'kg' } as WeightValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(0);
  });

    /**
     *  ============================
     *  select
     *  =============================
     */
  it(`preview when condition (select eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: selectAttribute.id},
                  itemValue: {
                      attributeId: selectAttribute.id,
                      val: {type: 'select', key: 'key1'} as SelectValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: selectAttribute.id} as Attribute,
                  operator: 'eq',
                  itemValue: {
                      attributeId: selectAttribute.id,
                      val: {type: 'select', key: 'key3'} as SelectValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (select not eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: selectAttribute.id},
                  itemValue: {
                      attributeId: selectAttribute.id,
                      val: {type: 'select', key: 'key1'} as SelectValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: selectAttribute.id} as Attribute,
                  operator: 'not eq',
                  itemValue: {
                      attributeId: selectAttribute.id,
                      val: {type: 'select', key: 'key1'} as SelectValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (select empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: selectAttribute.id},
                  itemValue: {
                      attributeId: selectAttribute.id,
                      val: {type: 'select', key: 'key1'} as SelectValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: selectAttribute.id} as Attribute,
                  operator: 'empty',
                  itemValue: undefined,
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(6);
  });
  it(`preview when condition (select not empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: selectAttribute.id},
                  itemValue: {
                      attributeId: selectAttribute.id,
                      val: {type: 'select', key: 'key1'} as SelectValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: selectAttribute.id} as Attribute,
                  operator: 'not empty',
                  itemValue: undefined,
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });

    /**
     *  ============================
     *  doubleselect
     *  =============================
     */
  it(`preview when condition (doubleselect eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: doubleSelectAttribute.id},
                  itemValue: {
                      attributeId: doubleSelectAttribute.id,
                      val: {type: 'doubleselect', key1: 'key1', key2: 'key22'} as DoubleSelectValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: doubleSelectAttribute.id} as Attribute,
                  operator: 'eq',
                  itemValue: {
                      attributeId: doubleSelectAttribute.id,
                      val: {type: 'doubleselect', key1: 'key3', key2: 'key33'} as DoubleSelectValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (doubleselect not eq)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: doubleSelectAttribute.id},
                  itemValue: {
                      attributeId: doubleSelectAttribute.id,
                      val: {type: 'doubleselect', key1: 'key1', key2: 'key22'} as DoubleSelectValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: doubleSelectAttribute.id} as Attribute,
                  operator: 'not eq',
                  itemValue: {
                      attributeId: doubleSelectAttribute.id,
                      val: {type: 'doubleselect', key1: 'key4', key2: 'key44'} as DoubleSelectValue
                  } as Value
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
  it(`preview when condition (doubleselect empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: doubleSelectAttribute.id},
                  itemValue: {
                      attributeId: doubleSelectAttribute.id,
                      val: {type: 'doubleselect', key1: 'key1', key2: 'key22'} as DoubleSelectValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: doubleSelectAttribute.id} as Attribute,
                  operator: 'empty',
                  itemValue: undefined,
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(6);
  });
  it(`preview when condition (doubleselect not empty)`, async () => {
      const bulkEditPackage: BulkEditPackage = await preview(view.id,
          [
              {
                  attribute: {id: doubleSelectAttribute.id},
                  itemValue: {
                      attributeId: doubleSelectAttribute.id,
                      val: {type: 'doubleselect', key1: 'key1', key2: 'key22'} as DoubleSelectValue
                  } as Value
              } as ItemValueAndAttribute,
          ],
          [
              {
                  attribute: {id: doubleSelectAttribute.id} as Attribute,
                  operator: 'not empty',
                  itemValue: undefined
              } as ItemValueOperatorAndAttribute
          ]);
      expect(bulkEditPackage.bulkEditItems).toBeDefined();
      expect(bulkEditPackage.bulkEditItems.length).toBe(1);
  });
});