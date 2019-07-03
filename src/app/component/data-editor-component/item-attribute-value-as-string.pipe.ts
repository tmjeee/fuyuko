import {Pipe, PipeTransform} from '@angular/core';
import {TableItem, ItemValTypes, StringValue, TextValue, Value} from '../../model/item.model';
import {Attribute, AttributeType} from '../../model/attribute.model';
import {convertToString, isItemValue, isItemValueType} from '../../utils/ui-item-value-converters.util';


/**
 * Usage :
 *
 * {{ <value>|itemAttributeValueAsString:<an attribute object>}}
 *
 * where  value is either
 *  - a Value
 *  - a ItemValType
 */
@Pipe({
  pure: false,
  name: 'itemAttributeValueAsString'
})
export class ItemAttributeValueAsStringPipe implements PipeTransform {
  transform(value: Value | ItemValTypes, ...args): string {
    if (!value) {
      return '';
    }

    const attribute: Attribute = args[0];
    if (!attribute) {
      throw new Error('No attribute as argument');
    }

    if (!value) {
      throw new Error(`expect either Value or ItemValType as input not ${value}`);
    }
    return convertToString(attribute, value);
  }
}
