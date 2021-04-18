import {Value} from '@fuyuko-common/model/item.model';
import {ItemValue2} from '../server-side-model/server-side.model';
import {itemValTypesConvert as itemValueTypesConvert, itemValTypesRevert as itemValueTypesRevert} from './conversion-item-value-types.service';

class ConversionItemValueService {

    itemValueConvert(itemValue2: ItemValue2): Value {
        return {
            attributeId: itemValue2.attributeId,
            val: itemValueTypesConvert(itemValue2.metadatas)
        } as Value;
    }

    itemValueRevert(value: Value): ItemValue2 {
        if (value && value.val) {
            return {
                id: -1,
                attributeId: value.attributeId,
                metadatas: itemValueTypesRevert(value.val, value.attributeId)
            } as ItemValue2
        }
        return null;
    }
}

const s = new ConversionItemValueService()
export const
    itemValueConvert = s.itemValueConvert.bind(s),
    itemValueRevert = s.itemValueRevert.bind(s);