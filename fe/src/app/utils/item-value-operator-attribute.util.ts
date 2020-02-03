import {operatorNeedsItemValue} from './attribute-operators.util';
import {hasItemValue} from './ui-item-value-getter.util';
import {ItemValueOperatorAndAttributeWithId} from '../component/rules-component/rule-editor.component';


export const isItemValueOperatorAndAttributeWithIdValid = (i: ItemValueOperatorAndAttributeWithId): boolean => {
    if (i) {
        if (!i.attribute) {
            return false;
        }
        if (!i.operator) {
            return false;
        } else if (i.operator && !operatorNeedsItemValue(i.operator)) {
            return true;
        }
        console.log('****** itemValueOperatorAndAttribute', i);
        if (!hasItemValue(i.attribute, i.itemValue)) {
           console.log('***** false (invalid)');
           return false;
        }
        console.log('***** true (valid)');
        return true;
    }
    return false;
};
