import {Value} from "../model/item.model";
import {ItemValue2} from "../server-side-model/server-side.model";
import {itemValTypesConvert as itemValueTypesConvert, itemValTypesRevert as itemValueTypesRevert} from "./conversion-item-value-types.service";

export const itemValueConvert = (itemValue2: ItemValue2): Value => {
    return {
        attributeId: itemValue2.attributeId,
        val: itemValueTypesConvert(itemValue2.metadatas)
    } as Value;
}

export const itemValueRevert = (value: Value): ItemValue2 => {
    return {
        id: -1,
        attributeId: value.attributeId,
        metadatas: itemValueTypesRevert(value.val, value.attributeId)
    } as ItemValue2
}

