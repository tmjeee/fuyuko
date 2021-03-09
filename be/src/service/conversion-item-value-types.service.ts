import {ItemMetadata2, ItemMetadataEntry2} from '../server-side-model/server-side.model';
import {
    AreaValue, CurrencyValue, DateValue,
    DimensionValue, DoubleSelectValue, HeightValue,
    ItemValTypes, LengthValue,
    NumberValue, SelectValue,
    StringValue,
    TextValue, VolumeValue, WeightValue,
    WidthValue
} from '@fuyuko-common/model/item.model';

class ConversionItemValueTypesService {

    itemValTypesConvert(metadatas: ItemMetadata2[]): ItemValTypes {
        let o: any = null;
        for (const metadata of metadatas) {
            for (const entry of metadata.entries) {
                const k: string = entry.key;
                const t: string = entry.dataType;
                const v: string = entry.value;
                let _v: string | number = null;
                if (k) {
                    switch (t) {
                        case 'string':
                            _v = String(v);
                            break;
                        case 'number':
                            _v = Number(v);
                            break;
                    }
                    if (!o) {
                        o = {};
                    }
                    o[k] = _v;
                }
            }
        }
        return o;
    }

    // todo: tmjeee: make sure undefined doesn't get printed out as string
    itemValTypesRevert(itemValTypes: ItemValTypes, attributeId: number): ItemMetadata2[] {
        switch (itemValTypes.type) {
            case 'string': {
                const v: StringValue = itemValTypes as StringValue;
                return [{
                    id: -1,
                    attributeType: itemValTypes.type,
                    attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: v.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: v.value,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2];
            }
            case 'text': {
                const v: TextValue = itemValTypes as TextValue;
                return [{
                    id: -1,
                    attributeType: itemValTypes.type,
                    attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: v.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: v.value,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2];
            }
            case 'number': {
                const v: NumberValue = itemValTypes as NumberValue;
                return [{
                    id: -1,
                    attributeType: itemValTypes.type,
                    attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: v.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${v.value ? v.value : ''}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2];
            }
            case 'area': {
                const v: AreaValue = itemValTypes as AreaValue;
                return [{
                    id: -1,
                    attributeType: itemValTypes.type,
                    attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: v.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${v.value ? v.value : ''}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'unit',
                            value: v.unit,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2];
            }
            case 'dimension': {
                const v: DimensionValue = itemValTypes as DimensionValue;
                return [{
                    id: -1,
                    attributeType: itemValTypes.type,
                    attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: v.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'length',
                            value: `${v.length ? v.length : ''}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'width',
                            value: `${v.width ? v.width : ''}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'height',
                            value: `${v.height ? v.height : ''}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'unit',
                            value: v.unit,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2];
            }
            case 'width': {
                const v: WidthValue = itemValTypes as WidthValue;
                return [{
                    id: -1,
                    attributeType: itemValTypes.type,
                    attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: v.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${v.value ? v.value : ''}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'unit',
                            value: v.unit,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2];
            }
            case 'weight': {
                const v: WeightValue = itemValTypes as WeightValue;
                return [{
                    id: -1,
                    attributeType: itemValTypes.type,
                    attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: v.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${v.value ? v.value : ''}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'unit',
                            value: v.unit,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2];
            }
            case 'length': {
                const v: LengthValue = itemValTypes as LengthValue;
                return [{
                    id: -1,
                    attributeType: itemValTypes.type,
                    attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: v.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${v.value ? v.value : ''}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'unit',
                            value: v.unit,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2];
            }
            case 'height': {
                const v: HeightValue = itemValTypes as HeightValue;
                return [{
                    id: -1,
                    attributeType: itemValTypes.type,
                    attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: v.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${v.value ? v.value : ''}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'unit',
                            value: v.unit,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2];
            }
            case "volume": {
                const v: VolumeValue = itemValTypes as VolumeValue;
                return [{
                    id: -1,
                    attributeType: itemValTypes.type,
                    attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: v.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${v.value ? v.value : ''}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'unit',
                            value: v.unit,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2];
            }
            case 'date': {
                const v: DateValue = itemValTypes as DateValue;
                return [{
                    id: -1,
                    attributeType: itemValTypes.type,
                    attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: v.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${v.value ? v.value : ''}`,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2];
            }
            case 'currency': {
                const v: CurrencyValue = itemValTypes as CurrencyValue;
                return [{
                    id: -1,
                    attributeType: itemValTypes.type,
                    attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: v.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'value',
                            value: `${v.value ? v.value : ''}`,
                            dataType: 'number'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'country',
                            value: v.country,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2];
            }
            case 'select': {
                const v: SelectValue = itemValTypes as SelectValue;
                return [{
                    id: -1,
                    attributeType: itemValTypes.type,
                    attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: v.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'key',
                            value: `${v.key ? v.key : ''}`,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2];
            }
            case 'doubleselect': {
                const v: DoubleSelectValue = itemValTypes as DoubleSelectValue;
                return [{
                    id: -1,
                    attributeType: itemValTypes.type,
                    attributeId,
                    name: '',
                    entries: [
                        {
                            id: -1,
                            key: 'type',
                            value: v.type,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'key1',
                            value: `${v.key1 ? v.key1 : ''}`,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                        {
                            id: -1,
                            key: 'key2',
                            value: `${v.key2 ? v.key2 : ''}`,
                            dataType: 'string'
                        } as ItemMetadataEntry2,
                    ]
                } as ItemMetadata2];
            }
        }
    }
}

const s = new ConversionItemValueTypesService()
export const
    itemValTypesConvert = s.itemValTypesConvert.bind(s),
    itemValTypesRevert = s.itemValTypesRevert.bind(s);