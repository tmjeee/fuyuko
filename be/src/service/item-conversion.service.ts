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
            val: toItemValTypes(value2.metadatas)
        } as Value;
        item[value2.attributeId] = value;
    }

    return item;
}

export const revert = (items: Item[]): Item2[] => {
    return items.map(_revert);
}

export const _revert = (item: Item): Item2 => {
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

            item2.values.push(toItem2Value2(value));
        }
    }
    return item2;
}

const toItem2Value2 = (value: Value): ItemValue2 => {
    const val: ItemValTypes = value.val;
    let i: ItemValue2 = null;
    switch(val.type) {
        case 'string': {
            const v: StringValue = val as StringValue;
            i = {
                id: -1,
                attributeId: value.attributeId,
                metadatas: [{
                    id: -1,
                    attributeType: val.type,
                    attributeId: value.attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: val.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: val.value,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2]
            } as ItemValue2;
            break;
        }
        case 'text': {
            const v: TextValue = val as TextValue;
            i = {
                id: -1,
                attributeId: value.attributeId,
                metadatas: [{
                    id: -1,
                    attributeType: val.type,
                    attributeId: value.attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: val.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: val.value,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2]
            } as ItemValue2;
            break;
        }
        case 'number': {
            const v: NumberValue = val as NumberValue;
            i = {
                id: -1,
                attributeId: value.attributeId,
                metadatas: [{
                    id: -1,
                    attributeType: val.type,
                    attributeId: value.attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: val.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${val.value}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2]
            } as ItemValue2;
            break;
        }
        case 'area': {
            const v: AreaValue = val as AreaValue;
            i = {
                id: -1,
                attributeId: value.attributeId,
                metadatas: [{
                    id: -1,
                    attributeType: val.type,
                    attributeId: value.attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: val.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'unit',
                            value: val.unit,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${val.value}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2]
            } as ItemValue2;
            break;
        }
        case 'dimension': {
            const v: DimensionValue = val as DimensionValue;
            i = {
                id: -1,
                attributeId: value.attributeId,
                metadatas: [{
                    id: -1,
                    attributeType: val.type,
                    attributeId: value.attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: val.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'width',
                            value: `${val.width}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'height',
                            value: `${val.height}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'length',
                            value: `${val.length}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'unit',
                            value: `${val.unit}`,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2]
            } as ItemValue2;
            break;
        }
        case 'width': {
            const v: WidthValue = val as WidthValue;
            i = {
                id: -1,
                attributeId: value.attributeId,
                metadatas: [{
                    id: -1,
                    attributeType: val.type,
                    attributeId: value.attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: val.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${v.value}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'unit',
                            value: `${v.unit}`,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2]
            } as ItemValue2;
            break;
        }
        case 'length': {
            const v: LengthValue = val as LengthValue;
            i = {
                id: -1,
                attributeId: value.attributeId,
                metadatas: [{
                    id: -1,
                    attributeType: val.type,
                    attributeId: value.attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: val.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${val.value}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'unit',
                            value: `${val.unit}`,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2]
            } as ItemValue2;
            break;
        }
        case 'height': {
            const v: HeightValue = val as HeightValue;
            i = {
                id: -1,
                attributeId: value.attributeId,
                metadatas: [{
                    id: -1,
                    attributeType: val.type,
                    attributeId: value.attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: val.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${val.value}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'unit',
                            value: `${val.unit}`,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2]
            } as ItemValue2;
            break;
        }
        case "volume": {
            const v: VolumeValue = val as VolumeValue;
            i = {
                id: -1,
                attributeId: value.attributeId,
                metadatas: [{
                    id: -1,
                    attributeType: val.type,
                    attributeId: value.attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: val.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${val.value}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'unit',
                            value: `${val.unit}`,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2]
            } as ItemValue2;
            break;
        }
        case 'date': {
            const v: DateValue = val as DateValue;
            i = {
                id: -1,
                attributeId: value.attributeId,
                metadatas: [{
                    id: -1,
                    attributeType: val.type,
                    attributeId: value.attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: val.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${val.value}`,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2]
            } as ItemValue2;
            break;
        }
        case 'currency': {
            const v: CurrencyValue = val as CurrencyValue;
            i = {
                id: -1,
                attributeId: value.attributeId,
                metadatas: [{
                    id: -1,
                    attributeType: val.type,
                    attributeId: value.attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: val.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${val.value}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'country',
                            value: `${val.country}`,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2]
            } as ItemValue2;
            break;
        }
        case 'select': {
            const v: SelectValue = val as SelectValue;
            i = {
                id: -1,
                attributeId: value.attributeId,
                metadatas: [{
                    id: -1,
                    attributeType: val.type,
                    attributeId: value.attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: val.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'key',
                            value: `${val.key}`,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2]
            } as ItemValue2;
            break;
        }
        case 'doubleselect': {
            const v: DoubleSelectValue = val as DoubleSelectValue;
            i = {
                id: -1,
                attributeId: value.attributeId,
                metadatas: [{
                    id: -1,
                    attributeType: val.type,
                    attributeId: value.attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: val.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'key1',
                            value: `${val.key1}`,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'key2',
                            value: `${val.key2}`,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2]
            } as ItemValue2;
            break;
        }
    }
    return i;
}


const toItemValTypes = (metadatas: ItemMetadata2[]): ItemValTypes => {
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
        break;
    case 'text':
        break;
    case 'number':
        break;
    case 'area':
        break;
    case 'dimension':
        break;
    case 'width':
        break;
    case 'length':
        break;
    case 'height':
        break;
    case "volume":
        break;
    case 'date':
        break;
    case 'currency':
        break;
    case 'select':
        break;
    case 'doubleselect':
        break;
}
 */
