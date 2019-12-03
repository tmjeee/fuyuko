import {Value} from "../model/item.model";
import {ItemValue2} from "../route/model/server-side.model";
import {convert as itemValueTypesConvert, revert as itemValueTypesRevert} from "./conversion-item-value-types.service";

export const convert = (itemValue2: ItemValue2): Value => {
    return {
        attributeId: itemValue2.attributeId,
        val: itemValueTypesConvert(itemValue2.metadatas)
    } as Value;
}

export const revert = (value: Value): ItemValue2 => {
    return {
        id: -1,
        attributeId: value.attributeId,
        metadatas: itemValueTypesRevert(value.val, value.attributeId)
    } as ItemValue2
}

