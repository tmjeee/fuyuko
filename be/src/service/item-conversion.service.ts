import {
    AreaValue, CurrencyValue, DateValue,
    DimensionValue, DoubleSelectValue, HeightValue, Item,
    ItemValTypes, LengthValue,
    NumberValue, SelectValue,
    StringValue,
    TextValue, Value, VolumeValue,
    WidthValue
} from "../model/item.model";
import {Item2, ItemMetadata2, ItemMetadataEntry2, ItemValue2} from "../route/model/ss-attribute.model";


export const convert = (item2s: Item2[]): Item[] => {
   return item2s.map(_convert);
}

export const _convert = (item2: Item2): Item => {
    const item: Item = {
        id: item2.id,
        parentId: item2.parentId,
        images: item2.images,
        description: item2.description,
        name: item2.name,
        children: []
    } as Item;

    for (const value2 of item2.values) {
        const value: Value = {
            attributeId: value2.attributeId,
            val: toValue(value2.metadatas)
        } as Value;
        item[value2.attributeId] = value;
    }

    return item;
}

export const revert = (items: Item[]): Item2[] => {
    return items.map(_revert);
}

export const _revert = (item: Item): Item2 => {
    // todo:
    const item2: Item2 = {
        id: item.id,
        name: item.name,
        description: item.description,
        images: item.images,
        parentId: item.parentId,
        values: []
    } as Item2;

    for (const i in item) {
        if (item.hasOwnProperty(i) && (typeof i == 'number')) {
            const value: Value = item[i];
            const val: ItemValTypes = value.val;

            const entries: ItemMetadataEntry2[] =[];
            

            const value2: ItemValue2 = {
                id: -1,
                attributeId: value.attributeId,
                metadatas: [{
                    id: -1,
                    attributeType: val.type,
                    attributeId: value.attributeId,
                    name: '',
                    entries
                } as ItemMetadata2]
            } as ItemValue2;

        }
    }


    return item2;
}


const toValue = (metadatas: ItemMetadata2[]): any => {
    const o: any = {};
    for (const metadata of metadatas) {
        for (const entry of metadata.entries) {
            const k: string = entry.key;
            const t: string = entry.dataType;
            const v: string = entry.value;
            let _v: string | number = null;
            switch (t) {
                case 'string':
                    _v = String(v);
                    break;
                case 'number':
                    _v = Number(v);
                    break;
            }
            o[k] = _v;
        }
    }
    return o;
}

/*
let val: ItemValTypes = null;
let attributeType: string = null;
switch(attributeType) {
    case 'string':
        val = {
            type: 'string',
            value: ''
        } as StringValue;
        break;
    case 'text':
        val = {

        } as TextValue;
        break;
    case 'number':
        val = {

        } as NumberValue;
        break;
    case 'area':
        val = {

        } as AreaValue;
        break;
    case 'dimension':
        val = {

        } as DimensionValue;
        break;
    case 'width':
        val = {

        } as WidthValue;
        break;
    case 'length':
        val = {

        } as LengthValue;
        break;
    case 'height':
        val = {

        } as HeightValue;
        break;
    case "volume":
        val = {

        } as VolumeValue;
        break;
    case 'date':
        val = {

        } as DateValue;
        break;
    case 'currency':
        val = {

        } as CurrencyValue;
        break;
    case 'select':
        val = {

        } as SelectValue;
        break;
    case 'doubleselect':
        val = {

        } as DoubleSelectValue;
        break;
}
 */
