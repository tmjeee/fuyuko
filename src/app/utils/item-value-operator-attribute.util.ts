import {ItemValueOperatorAndAttribute} from '../model/item-attribute.model';
import {operatorNeedsItemValue} from './attribute-operators.util';
import {hasItemValue} from './ui-item-value-getter.util';


export const isItemValueOperatorAndAttributeValid = (i: ItemValueOperatorAndAttribute): boolean => {
    if (i) {
        if (!i.attribute) {
            return false;
        }
        if (!i.operator) {
            return false;
        } else if (i.operator && !operatorNeedsItemValue(i.operator)) {
            return true;
        }
        if (!hasItemValue(i.attribute, i.itemValue)) {
           return false;
        }
        return true;
    }
    return false;
};
