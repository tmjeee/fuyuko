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
    VolumeValue, WidthValue
} from "../../src/model/item.model";
import {View} from "../../src/model/view.model";
import {getViewByName} from "../../src/service/view.service";
import {getAttributeInViewByName} from "../../src/service/attribute.service";

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
  let selectAttribute: Attribute;
  let doubleSelectAttribute: Attribute;

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
          selectAttribute = await getAttributeInViewByName(view.id, 'select attribute');
          doubleSelectAttribute = await getAttributeInViewByName(view.id, 'doubleselect attribute');
          console.log('**** view ', view);
          done();
      } catch(e) {
          console.error(e);
      }
  });


  it('preview (eq)', async () => {
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
                          val: { type: 'currency', value: 99.99, country: 'AUD'} as CurrencyValue
                      } as Value
                  } as ItemValueAndAttribute,
                  {
                      attribute: { id: volumeAttribute.id },
                      itemValue: {
                        attributeId: volumeAttribute.id,
                        val: { type: 'volume', value: 99, unit: 'ml'} as VolumeValue
                      } as Value
                  } as ItemValueAndAttribute,
                  {
                     attribute: {id: dimensionAttribute.id },
                     itemValue: {
                         attributeId: dimensionAttribute.id,
                         val: { type: 'dimension', length: 91, width: 92, height: 93, unit: 'cm'} as DimensionValue
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
                          val: { type: 'length', value: 99, unit: 'cm'} as LengthValue
                      } as Value
                  } as ItemValueAndAttribute,
                  {
                      attribute: { id: widthAttribute.id},
                      itemValue: {
                         attributeId: widthAttribute.id,
                         val: { type: 'width', value: 99, unit: 'cm'} as WidthValue
                      } as Value
                  } as ItemValueAndAttribute,
                  {
                      attribute: { id: heightAttribute.id},
                      itemValue: {
                          attributeId: heightAttribute.id,
                          val: { type: 'height', value: 99, unit: 'cm'} as HeightValue
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

          console.log('bulkEditItems', bulkEditPackage.bulkEditItems);
          console.log('bulkEditItems changes', bulkEditPackage.bulkEditItems[0].changes);
          console.log('changeAttributes', bulkEditPackage.changeAttributes);
          console.log('whenAttributes', bulkEditPackage.whenAttributes);

          expect(bulkEditPackage.bulkEditItems).toBeDefined();
          expect(bulkEditPackage.bulkEditItems.length).toBe(1);
          expect(bulkEditPackage.bulkEditItems[0].name).toBe('Item-1');

          expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].attributeId).toBe(stringAttribute.id);
          expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].operator).toBe('eq');
          expect(bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].val.type).toBe('string');
          expect((bulkEditPackage.bulkEditItems[0].whens[stringAttribute.id].val as StringValue).value).toBe('some string');

          expect(bulkEditPackage.bulkEditItems[0].changes[stringAttribute.id].old.attributeId).toBe(stringAttribute.id);
          expect((bulkEditPackage.bulkEditItems[0].changes[stringAttribute.id].old.val as StringValue).type).toBe('string');
          expect((bulkEditPackage.bulkEditItems[0].changes[stringAttribute.id].old.val as StringValue).value).toBe('some string');
      } catch(e) {
          console.error(e);
      }
  });
});