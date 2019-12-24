import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
import { convertToString } from '../../shared-utils/ui-item-value-converters.util';
/**
 * Usage :
 *
 * {{ <value>|itemAttributeValueAsString:<an attribute object>}}
 *
 * where  value is either
 *  - a Value
 *  - a ItemValType
 */
let ItemAttributeValueAsStringPipe = class ItemAttributeValueAsStringPipe {
    transform(value, ...args) {
        if (!value) {
            return '';
        }
        const attribute = args[0];
        if (!attribute) {
            throw new Error('No attribute as argument');
        }
        if (!value) {
            throw new Error(`expect either Value or ItemValType as input not ${value}`);
        }
        return convertToString(attribute, value);
    }
};
ItemAttributeValueAsStringPipe = tslib_1.__decorate([
    Pipe({
        pure: false,
        name: 'itemAttributeValueAsString'
    })
], ItemAttributeValueAsStringPipe);
export { ItemAttributeValueAsStringPipe };
//# sourceMappingURL=item-attribute-value-as-string.pipe.js.map