import {operatorNeedsItemValue} from './attribute-operators.util';
import {hasItemValues} from './ui-item-value-getter.util';
import {ItemValueOperatorAndAttributeWithId} from '../component/rules-component/rule-editor.component';
import {PartialBy} from '@fuyuko-common/model/types';


export const isItemValueOperatorAndAttributeWithIdValid =
    (i: PartialBy<ItemValueOperatorAndAttributeWithId, 'operator' | 'attribute'>): boolean => {
    if (i) {
        if (!i.attribute) {
            return false;
        }
        if (!i.operator) {
            return false;
        } else if (i.operator && !operatorNeedsItemValue(i.operator)) {
            return true;
        }
        if (!hasItemValues(i.attribute, i.itemValue)) {
           return false;
        }
        return true;
    }
    return false;
};
