import {itemValTypesConvert, itemValTypesRevert} from '../../src/service';
import {ItemMetadata2, ItemMetadataEntry2} from '../../src/server-side-model/server-side.model';
import {
    AreaValue,
    CurrencyValue,
    DateValue, DimensionValue, DoubleSelectValue, HeightValue,
    ItemValTypes, LengthValue,
    NumberValue, SelectValue,
    StringValue,
    TextValue,
    VolumeValue, WeightValue, WidthValue
} from '@fuyuko-common/model/item.model';
import {setupTestDatabase} from '../helpers/test-helper';

describe('conversion-item-value-types.service.ts', () => {

    beforeAll(async () => {
        await setupTestDatabase();
    });

    it ('itemValTypesConvert (string)', () => {
        const i: ItemValTypes = itemValTypesConvert([{
            entries: [
                { id: -1, key: 'type', value: 'string', dataType: 'string'} as ItemMetadataEntry2,
                { id: -2, key: 'value', value: 'test', dataType: 'string'} as ItemMetadataEntry2,
            ]
        } as ItemMetadata2])
        const _i: StringValue = i as StringValue;
        expect(_i.type).toBe('string');
        expect(_i.value).toBe('test');
    });

    it ('itemValTypesConvert (text)', () => {
        const i: ItemValTypes = itemValTypesConvert([{
           entries: [
               {id: -1, key: 'type', value: 'text', dataType: 'string'} as ItemMetadataEntry2,
               {id: -1, key: 'value', value: 'asdasd', dataType: 'string'} as ItemMetadataEntry2,
           ]
        } as ItemMetadata2]);
        const _i: TextValue = i as TextValue;
        expect(_i.type).toBe('text');
        expect(_i.value).toBe('asdasd');
    });

    it ('itemValTypesConvert (number)', () => {
        const i: ItemValTypes = itemValTypesConvert([{
            entries: [
                {id: -1, key: 'type', value: 'number', dataType: 'string'} as ItemMetadataEntry2,
                {id: -1, key: 'value', value: '100', dataType: 'number'} as ItemMetadataEntry2,
            ]
        } as ItemMetadata2]);
        const _i: NumberValue = i as NumberValue;
        expect(_i.type).toBe('number');
        expect(_i.value).toBe(100);
    });

    it ('itemValTypesConvert (date)', () => {
        const i: ItemValTypes = itemValTypesConvert([{
            entries: [
                {id: -1, key: 'type', value: 'date', dataType: 'string'} as ItemMetadataEntry2,
                {id: -1, key: 'value', value: '12-10-1988', dataType: 'string'} as ItemMetadataEntry2,
            ]
        } as ItemMetadata2]);
        const _i: DateValue = i as DateValue;
        expect(_i.type).toBe('date');
        expect(_i.value).toBe('12-10-1988');
    });

    it ('itemValTypesConvert (currency)', () => {
        const i: ItemValTypes = itemValTypesConvert([{
            entries: [
                {id: -1, key: 'type', value: 'currency', dataType: 'string'} as ItemMetadataEntry2,
                {id: -1, key: 'value', value: '10.15', dataType: 'number'} as ItemMetadataEntry2,
                {id: -1, key: 'country', value: 'AUD', dataType: 'string'} as ItemMetadataEntry2,
            ]
        } as ItemMetadata2]);
        const _i: CurrencyValue = i as CurrencyValue;
        expect(_i.type).toBe('currency');
        expect(_i.value).toBe(10.15);
        expect(_i.country).toBe('AUD');
    });

    it ('itemValTypesConvert (volume)', () => {
        const i: ItemValTypes = itemValTypesConvert([{
           entries: [
               {id: -1, key: 'type', value: 'volume', dataType: 'string'} as ItemMetadataEntry2,
               {id: -1, key: 'value', value: '10.11', dataType: 'number'} as ItemMetadataEntry2,
               {id: -1, key: 'unit', value: 'ml', dataType: 'string'} as ItemMetadataEntry2,
           ]
        } as ItemMetadata2]);
        const _i: VolumeValue = i as VolumeValue;
        expect(_i.type).toBe('volume');
        expect(_i.value).toBe(10.11);
        expect(_i.unit).toBe('ml');
    });

    it ('itemValTypesConvert (dimension)', () => {
        const i: ItemValTypes = itemValTypesConvert([{
            entries: [
                {id: -1, key: 'type', value: 'dimension', dataType: 'string'} as ItemMetadataEntry2,
                {id: -1, key: 'length', value: '10.11', dataType: 'number'} as ItemMetadataEntry2,
                {id: -1, key: 'width', value: '11.11', dataType: 'number'} as ItemMetadataEntry2,
                {id: -1, key: 'height', value: '12.11', dataType: 'number'} as ItemMetadataEntry2,
                {id: -1, key: 'unit', value: 'cm', dataType: 'string'} as ItemMetadataEntry2,
            ]
        } as ItemMetadata2]);
        const _i: DimensionValue = i as DimensionValue;
        expect(_i.type).toBe('dimension');
        expect(_i.length).toBe(10.11);
        expect(_i.width).toBe(11.11);
        expect(_i.height).toBe(12.11);
        expect(_i.unit).toBe('cm');
    });

    it ('itemValTypesConvert (area)', () => {
        const i: ItemValTypes = itemValTypesConvert([{
            entries: [
                {id: -1, key: 'type', value: 'area', dataType: 'string'} as ItemMetadataEntry2,
                {id: -1, key: 'value', value: '10.11', dataType: 'number'} as ItemMetadataEntry2,
                {id: -1, key: 'unit', value: 'm2', dataType: 'string'} as ItemMetadataEntry2,
            ]
        } as ItemMetadata2]);
        const _i: AreaValue = i as AreaValue;
        expect(_i.type).toBe('area');
        expect(_i.value).toBe(10.11);
        expect(_i.unit).toBe('m2');
    });

    it ('itemValTypesConvert (width)', () => {
        const i: ItemValTypes = itemValTypesConvert([{
            entries: [
                {id: -1, key: 'type', value: 'width', dataType: 'string'} as ItemMetadataEntry2,
                {id: -1, key: 'value', value: '10.11', dataType: 'number'} as ItemMetadataEntry2,
                {id: -1, key: 'unit', value: 'cm', dataType: 'string'} as ItemMetadataEntry2,
            ]
        } as ItemMetadata2]);
        const _i: WidthValue = i as WidthValue;
        expect(_i.type).toBe('width');
        expect(_i.value).toBe(10.11);
        expect(_i.unit).toBe('cm');
    });

    it ('itemValTypesConvert (length)', () => {
        const i: ItemValTypes = itemValTypesConvert([{
            entries: [
                {id: -1, key: 'type', value: 'length', dataType: 'string'} as ItemMetadataEntry2,
                {id: -1, key: 'value', value: '10.11', dataType: 'number'} as ItemMetadataEntry2,
                {id: -1, key: 'unit', value: 'cm', dataType: 'string'} as ItemMetadataEntry2,
            ]
        } as ItemMetadata2]);
        const _i: LengthValue = i as LengthValue;
        expect(_i.type).toBe('length');
        expect(_i.value).toBe(10.11);
        expect(_i.unit).toBe('cm');
    });

    it ('itemValTypesConvert (height)', () => {
        const i: ItemValTypes = itemValTypesConvert([{
            entries: [
                {id: -1, key: 'type', value: 'height', dataType: 'string'} as ItemMetadataEntry2,
                {id: -1, key: 'value', value: '10.11', dataType: 'number'} as ItemMetadataEntry2,
                {id: -1, key: 'unit', value: 'cm', dataType: 'string'} as ItemMetadataEntry2,
            ]
        } as ItemMetadata2]);
        const _i: LengthValue = i as LengthValue;
        expect(_i.type).toBe('height');
        expect(_i.value).toBe(10.11);
        expect(_i.unit).toBe('cm');
    });

    it ('itemValTypesConvert (weight)', () => {
        const i: ItemValTypes = itemValTypesConvert([{
            entries: [
                {id: -1, key: 'type', value: 'weight', dataType: 'string'} as ItemMetadataEntry2,
                {id: -1, key: 'value', value: '10.11', dataType: 'number'} as ItemMetadataEntry2,
                {id: -1, key: 'unit', value: 'kg', dataType: 'string'} as ItemMetadataEntry2,
            ]
        } as ItemMetadata2]);
        const _i: WeightValue = i as WeightValue;
        expect(_i.type).toBe('weight');
        expect(_i.value).toBe(10.11);
        expect(_i.unit).toBe('kg');
    });

    it ('itemValTypesConvert (select)', () => {
        const i: ItemValTypes = itemValTypesConvert([{
            entries: [
                {id: -1, key: 'type', value: 'select', dataType: 'string'} as ItemMetadataEntry2,
                {id: -1, key: 'key', value: 'key1', dataType: 'string'} as ItemMetadataEntry2,
            ]
        } as ItemMetadata2]);
        const _i: SelectValue = i as SelectValue;
        expect(_i.type).toBe('select');
        expect(_i.key).toBe('key1');
    });

    it ('itemValTypesConvert (doubleselect)', () => {
        const i: ItemValTypes = itemValTypesConvert([{
            entries: [
                {id: -1, key: 'type', value: 'doubleselect', dataType: 'string'} as ItemMetadataEntry2,
                {id: -1, key: 'key1', value: 'key1', dataType: 'string'} as ItemMetadataEntry2,
                {id: -1, key: 'key2', value: 'key2', dataType: 'string'} as ItemMetadataEntry2,
            ]
        } as ItemMetadata2]);
        const _i: DoubleSelectValue = i as DoubleSelectValue;
        expect(_i.type).toBe('doubleselect');
        expect(_i.key1).toBe('key1');
        expect(_i.key2).toBe('key2');
    });

    it('itemValTypesRevert (string)', () => {
        const i: ItemMetadata2[] = itemValTypesRevert({
            type: 'string',
            value: 'test'
        } as StringValue, 1);
        expect(i.length).toBe(1);
        expect(i[0].entries.length).toBe(2);

        expect(i[0].entries[0].key).toBe('type');
        expect(i[0].entries[0].value).toBe('string');
        expect(i[0].entries[0].dataType).toBe('string');

        expect(i[0].entries[1].key).toBe('value');
        expect(i[0].entries[1].value).toBe('test');
        expect(i[0].entries[1].dataType).toBe('string');
    });

    it('itemValTypesRevert (text)', () => {
        const i: ItemMetadata2[] = itemValTypesRevert({
           type: 'text', value: 'test'
        } as TextValue, 1);

        expect(i.length).toBe(1);
        expect(i[0].entries.length).toBe(2);

        expect(i[0].entries[0].key).toBe('type');
        expect(i[0].entries[0].value).toBe('text');
        expect(i[0].entries[0].dataType).toBe('string');

        expect(i[0].entries[1].key).toBe('value');
        expect(i[0].entries[1].value).toBe('test');
        expect(i[0].entries[1].dataType).toBe('string');
    });
    it('itemValTypesRevert (number)', () => {
        const i: ItemMetadata2[] = itemValTypesRevert({
            type: 'number', value: 10.22
        } as NumberValue, 1);

        expect(i.length).toBe(1);
        expect(i[0].entries.length).toBe(2);

        expect(i[0].entries[0].key).toBe('type');
        expect(i[0].entries[0].value).toBe('number');
        expect(i[0].entries[0].dataType).toBe('string');

        expect(i[0].entries[1].key).toBe('value');
        expect(i[0].entries[1].value).toBe('10.22');
        expect(i[0].entries[1].dataType).toBe('number');
    });
    it('itemValTypesRevert (date)', () => {
        const i: ItemMetadata2[] = itemValTypesRevert({
            type: 'date', value: '11-09-2010'
        } as DateValue, 1);

        expect(i.length).toBe(1);
        expect(i[0].entries.length).toBe(2);

        expect(i[0].entries[0].key).toBe('type');
        expect(i[0].entries[0].value).toBe('date');
        expect(i[0].entries[0].dataType).toBe('string');

        expect(i[0].entries[1].key).toBe('value');
        expect(i[0].entries[1].value).toBe('11-09-2010');
        expect(i[0].entries[1].dataType).toBe('string');
    });
    it('itemValTypesRevert (currency)', () => {
        const i: ItemMetadata2[] = itemValTypesRevert({
            type: 'currency', value: 10.22, country: 'AUD'
        } as CurrencyValue, 1);

        expect(i.length).toBe(1);
        expect(i[0].entries.length).toBe(3);

        expect(i[0].entries[0].key).toBe('type');
        expect(i[0].entries[0].value).toBe('currency');
        expect(i[0].entries[0].dataType).toBe('string');

        expect(i[0].entries[1].key).toBe('value');
        expect(i[0].entries[1].value).toBe('10.22');
        expect(i[0].entries[1].dataType).toBe('number');

        expect(i[0].entries[2].key).toBe('country');
        expect(i[0].entries[2].value).toBe('AUD');
        expect(i[0].entries[2].dataType).toBe('string');
    });
    it('itemValTypesRevert (volume)', () => {
        const i: ItemMetadata2[] = itemValTypesRevert({
            type: 'volume', value: 10.22, unit: 'ml'
        } as VolumeValue, 1);

        expect(i.length).toBe(1);
        expect(i[0].entries.length).toBe(3);

        expect(i[0].entries[0].key).toBe('type');
        expect(i[0].entries[0].value).toBe('volume');
        expect(i[0].entries[0].dataType).toBe('string');

        expect(i[0].entries[1].key).toBe('value');
        expect(i[0].entries[1].value).toBe('10.22');
        expect(i[0].entries[1].dataType).toBe('number');

        expect(i[0].entries[2].key).toBe('unit');
        expect(i[0].entries[2].value).toBe('ml');
        expect(i[0].entries[2].dataType).toBe('string');
    });
    it('itemValTypesRevert (dimension)', () => {
        const i: ItemMetadata2[] = itemValTypesRevert({
            type: 'dimension', length: 10.22, width: 11.22, height: 12.22, unit: 'cm'
        } as DimensionValue, 1);

        expect(i.length).toBe(1);
        expect(i[0].entries.length).toBe(5);

        expect(i[0].entries[0].key).toBe('type');
        expect(i[0].entries[0].value).toBe('dimension');
        expect(i[0].entries[0].dataType).toBe('string');

        expect(i[0].entries[1].key).toBe('length');
        expect(i[0].entries[1].value).toBe('10.22');
        expect(i[0].entries[1].dataType).toBe('number');

        expect(i[0].entries[2].key).toBe('width');
        expect(i[0].entries[2].value).toBe('11.22');
        expect(i[0].entries[2].dataType).toBe('number');

        expect(i[0].entries[3].key).toBe('height');
        expect(i[0].entries[3].value).toBe('12.22');
        expect(i[0].entries[3].dataType).toBe('number');

        expect(i[0].entries[4].key).toBe('unit');
        expect(i[0].entries[4].value).toBe('cm');
        expect(i[0].entries[4].dataType).toBe('string');
    });
    it('itemValTypesRevert (area)', () => {
        const i: ItemMetadata2[] = itemValTypesRevert({
            type: 'area', value: 10.22, unit: 'm2'
        } as AreaValue, 1);

        expect(i.length).toBe(1);
        expect(i[0].entries.length).toBe(3);

        expect(i[0].entries[0].key).toBe('type');
        expect(i[0].entries[0].value).toBe('area');
        expect(i[0].entries[0].dataType).toBe('string');

        expect(i[0].entries[1].key).toBe('value');
        expect(i[0].entries[1].value).toBe('10.22');
        expect(i[0].entries[1].dataType).toBe('number');

        expect(i[0].entries[2].key).toBe('unit');
        expect(i[0].entries[2].value).toBe('m2');
        expect(i[0].entries[2].dataType).toBe('string');
    });
    it('itemValTypesRevert (width)', () => {
        const i: ItemMetadata2[] = itemValTypesRevert({
            type: 'width', value: 10.22, unit: 'cm'
        } as WidthValue, 1);

        expect(i.length).toBe(1);
        expect(i[0].entries.length).toBe(3);

        expect(i[0].entries[0].key).toBe('type');
        expect(i[0].entries[0].value).toBe('width');
        expect(i[0].entries[0].dataType).toBe('string');

        expect(i[0].entries[1].key).toBe('value');
        expect(i[0].entries[1].value).toBe('10.22');
        expect(i[0].entries[1].dataType).toBe('number');

        expect(i[0].entries[2].key).toBe('unit');
        expect(i[0].entries[2].value).toBe('cm');
        expect(i[0].entries[2].dataType).toBe('string');
    });
    it('itemValTypesRevert (length)', () => {
        const i: ItemMetadata2[] = itemValTypesRevert({
            type: 'length', value: 10.22, unit: 'cm'
        } as LengthValue, 1);

        expect(i.length).toBe(1);
        expect(i[0].entries.length).toBe(3);

        expect(i[0].entries[0].key).toBe('type');
        expect(i[0].entries[0].value).toBe('length');
        expect(i[0].entries[0].dataType).toBe('string');

        expect(i[0].entries[1].key).toBe('value');
        expect(i[0].entries[1].value).toBe('10.22');
        expect(i[0].entries[1].dataType).toBe('number');

        expect(i[0].entries[2].key).toBe('unit');
        expect(i[0].entries[2].value).toBe('cm');
        expect(i[0].entries[2].dataType).toBe('string');
    });
    it('itemValTypesRevert (height)', () => {
        const i: ItemMetadata2[] = itemValTypesRevert({
            type: 'height', value: 10.22, unit: 'cm'
        } as HeightValue, 1);

        expect(i.length).toBe(1);
        expect(i[0].entries.length).toBe(3);

        expect(i[0].entries[0].key).toBe('type');
        expect(i[0].entries[0].value).toBe('height');
        expect(i[0].entries[0].dataType).toBe('string');

        expect(i[0].entries[1].key).toBe('value');
        expect(i[0].entries[1].value).toBe('10.22');
        expect(i[0].entries[1].dataType).toBe('number');

        expect(i[0].entries[2].key).toBe('unit');
        expect(i[0].entries[2].value).toBe('cm');
        expect(i[0].entries[2].dataType).toBe('string');
    });
    it('itemValTypesRevert (weight)', () => {
        const i: ItemMetadata2[] = itemValTypesRevert({
            type: 'weight', value: 10.22, unit: 'kg'
        } as WeightValue, 1);

        expect(i.length).toBe(1);
        expect(i[0].entries.length).toBe(3);

        expect(i[0].entries[0].key).toBe('type');
        expect(i[0].entries[0].value).toBe('weight');
        expect(i[0].entries[0].dataType).toBe('string');

        expect(i[0].entries[1].key).toBe('value');
        expect(i[0].entries[1].value).toBe('10.22');
        expect(i[0].entries[1].dataType).toBe('number');

        expect(i[0].entries[2].key).toBe('unit');
        expect(i[0].entries[2].value).toBe('kg');
        expect(i[0].entries[2].dataType).toBe('string');
    });
    it('itemValTypesRevert (select)', () => {
        const i: ItemMetadata2[] = itemValTypesRevert({
            type: 'select', key: 'key1'
        } as SelectValue, 1);

        expect(i.length).toBe(1);
        expect(i[0].entries.length).toBe(2);

        expect(i[0].entries[0].key).toBe('type');
        expect(i[0].entries[0].value).toBe('select');
        expect(i[0].entries[0].dataType).toBe('string');

        expect(i[0].entries[1].key).toBe('key');
        expect(i[0].entries[1].value).toBe('key1');
        expect(i[0].entries[1].dataType).toBe('string');
    });
    it('itemValTypesRevert (doubleselect)', () => {
        const i: ItemMetadata2[] = itemValTypesRevert({
            type: 'doubleselect', key1: 'key1', key2: 'key2'
        } as DoubleSelectValue, 1);

        expect(i.length).toBe(1);
        expect(i[0].entries.length).toBe(3);

        expect(i[0].entries[0].key).toBe('type');
        expect(i[0].entries[0].value).toBe('doubleselect');
        expect(i[0].entries[0].dataType).toBe('string');

        expect(i[0].entries[1].key).toBe('key1');
        expect(i[0].entries[1].value).toBe('key1');
        expect(i[0].entries[1].dataType).toBe('string');

        expect(i[0].entries[2].key).toBe('key2');
        expect(i[0].entries[2].value).toBe('key2');
        expect(i[0].entries[2].dataType).toBe('string');
    });
});
