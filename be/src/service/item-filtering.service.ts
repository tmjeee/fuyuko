import {Connection} from "mariadb";
import {ItemValueOperatorAndAttribute} from "../model/item-attribute.model";
import {Attribute, DEFAULT_DATE_FORMAT} from "../model/attribute.model";
import {QueryA} from "../db";
import {
    Attribute2,
    AttributeMetadata2,
    AttributeMetadataEntry2, Item2,
    ItemMetadata2,
    ItemMetadataEntry2,
    ItemValue2
} from "../route/model/server-side.model";
import {
    AreaValue,
    CurrencyValue,
    DateValue, DimensionValue, DoubleSelectValue, HeightValue, Item,
    ItemImage, LengthValue,
    NumberValue, SelectValue,
    StringValue,
    TextValue,
    Value, VolumeValue, WidthValue
} from "../model/item.model";
import {_convert as _attributeConvert} from "./conversion-attribute.service";
import {OperatorType} from "../model/operator.model";
import {
    AreaUnits,
    CountryCurrencyUnits,
    DimensionUnits,
    HeightUnits,
    LengthUnits,
    VolumeUnits,
    WidthUnits
} from "../model/unit.model";
import moment from "moment";
import {
    compareArea,
    compareCurrency,
    compareDate, compareDimension, compareDoubleselect, compareHeight, compareLength,
    compareNumber, compareSelect,
    compareString, compareVolume, compareWidth
} from "./compare-attribute-values.service";

const SQL: string = `
           SELECT 
            I.ID AS I_ID,
            I.PARENT_ID AS I_PARENT_ID,
            I.VIEW_ID AS I_VIEW_ID,
            I.NAME AS I_NAME,
            I.DESCRIPTION AS I_DESCRIPTION,
            I.STATUS AS I_STATUS,
            
            V.ID AS V_ID,
            V.ITEM_ID AS V_ITEM_ID,
            V.VIEW_ATTRIBUTE_ID AS V_VIEW_ATTRIBUTE_ID,
            
            A.ID AS A_ID,
            A.VIEW_ID AS A_VIEW_ID,
            A.TYPE AS A_TYPE,
            A.NAME AS A_NAME,
            A.STATUS AS A_STATUS,
            A.DESCRIPTION AS A_DESCRIPTION,
            
            AM.ID AS AM_ID,
            AM.VIEW_ATTRIBUTE_ID AS AM_VIEW_ATTRIBUTE_ID,
            AM.NAME AS AM_NAME,
            
            AME.ID AS AME_ID,
            AME.VIEW_ATTRIBUTE_METADATA_ID AS AME_VIEW_ATTRIBUTE_METADATA_ID,
            AME.KEY AS AME_KEY,
            AME.VALUE AS AME_VALUE,
            
            IM.ID AS IM_ID,
            IM.ITEM_VALUE_ID AS IM_ITEM_VALUE_ID,
            IM.NAME AS IM_NAME,
            
            IE.ID AS IE_ID,
            IE.ITEM_VALUE_METADATA_ID AS IE_ITEM_VALUE_METADATA_ID,
            IE.KEY AS IE_KEY,
            IE.VALUE AS IE_VALUE,
            IE.DATA_TYPE AS IE_DATA_TYPE,
            
            IMG.ID AS IMG_ID,
            IMG.ITEM_ID AS IMG_ITEM_ID,
            IMG.PRIMARY AS IMG_PRIMARY,
            IMG.MIME_TYPE AS IMG_MIME_TYPE,
            IMG.NAME AS IMG_NAME,
            IMG.SIZE AS IMG_SIZE
           
           FROM TBL_ITEM AS I
           LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID
           LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.ID = V.VIEW_ATTRIBUTE_ID
           LEFT JOIN TBL_VIEW_ATTRIBUTE_METADATA AS AM ON AM.VIEW_ATTRIBUTE_ID = A.ID
           LEFT JOIN TBL_VIEW_ATTRIBUTE_METADATA_ENTRY AS AME ON AME.VIEW_ATTRIBUTE_METADATA_ID = AM.ID
           LEFT JOIN TBL_ITEM_VALUE_METADATA AS IM ON IM.ITEM_VALUE_ID = V.ID
           LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS IE ON IE.ITEM_VALUE_METADATA_ID = IM.ID
           LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
           WHERE I.STATUS = 'ENABLED' AND I.VIEW_ID=? 
`

const SQL_WITH_NULL_PARENT = `${SQL} AND I.PARENT_ID IS NULL`;
const SQL_WITH_PARAMETERIZED_PARENT = `${SQL} AND I.PARENT_ID = ? `;

export type Item2WithFilteringResult = {b: Item2[], m: Map<string /* attributeId */, Attribute>};
export const getItem2WithFiltering = async (conn: Connection,
                                 viewId: number,
                                 parentItemId: number,
                                 whenClauses: ItemValueOperatorAndAttribute[]):
    Promise<Item2WithFilteringResult> => {

    const q: QueryA = !!parentItemId ?
        await conn.query( SQL_WITH_PARAMETERIZED_PARENT, [viewId, parentItemId]) :
        await conn.query( SQL_WITH_NULL_PARENT, [viewId]);

    const iMap: Map<string /* itemId */, Item2> = new Map();
    const itemValueMap: Map<string /* itemId_itemValueId */, ItemValue2> = new Map();
    const itemAttValueMetaMap: Map<string /* itemId_attributeId_metaId */, ItemMetadata2> = new Map();
    const itemAttValueMetaEntryMap: Map<string /* itemId_attributeId_metaId_entryId */, ItemMetadataEntry2> = new Map();
    const itemImageMap: Map<string /* itemId_imageId */, ItemImage> = new Map();
    const attributeMap: Map<string /* attributeId*/, Attribute2> = new Map();
    const attributeMetadataMap: Map<string /* attributeId_metadataId */, AttributeMetadata2> = new Map();
    const attributeMetadataEntryMap: Map<string /* attributeId_metadataId_entryId */, AttributeMetadataEntry2> = new Map();

    const bulkEditItem2s: Item2[] = [];
    for (const i of q) {

        const itemId: number = i.I_ID;
        const itemValueId: number = i.V_ID;
        const attributeId: number = i.A_ID;
        const attributeMetadataId: number = i.AM_ID;
        const attributeMetadataEntryId: number = i.AME_ID;
        const metaId: number = i.IM_ID;
        const entryId: number = i.IE_ID;
        const itemImageId: number = i.IMG_ID;

        const iMapKey: string = `${itemId}`;
        const itemValueMapKey: string = `${itemId}_${itemValueId}`;
        const itemAttValueMetaMapKey: string = `${itemId}_${attributeId}_${metaId}`;
        const itemAttValueMetaEntryMapKey: string = `${itemId}_${attributeId}_${metaId}_${entryId}`;
        const itemImageMapKey: string = `${itemId}_${itemImageId}`;
        const attributeMapKey: string = `${attributeId}`;
        const attributeMetadataMapKey: string = `${attributeId}_${attributeMetadataId}`;
        const attributeMetadataEntryMapKey: string = `${attributeId}_${attributeMetadataId}_${attributeMetadataEntryId}`;


        if (!iMap.has(iMapKey)) {
            const item: Item2 = {
                id: i.I_ID,
                name: i.I_NAME,
                description: i.I_DESCRIPTION,
                parentId: i.I_PARENT_ID,
                values: [],
                images: [],
                children: []
            } as Item2;
            iMap.set(iMapKey, item);
            bulkEditItem2s.push(item);

            const { b /* BulkEditItem2[] */, } = await getItem2WithFiltering(conn, viewId, itemId, whenClauses);
            item.children = b;
        }

        if (!itemValueMap.has(itemValueMapKey)) {
            const itemValue2: ItemValue2 = {
                id: i.V_ID,
                attributeId: i.V_VIEW_ATTRIBUTE_ID,
                metadatas: []
            } as ItemValue2;
            itemValueMap.set(itemValueMapKey, itemValue2);
            iMap.get(iMapKey).values.push(itemValue2);
        }


        if (!itemImageMap.has(itemImageMapKey)) {
            const itemImage = {
                id: i.IMG_ID,
                name: i.IMG_NAME,
                primary: i.IMG_PRIMARY,
                mimeType: i.IMG_MIME_TYPE,
                size: i.IMG_SIZE
            } as ItemImage;
            itemImageMap.set(itemImageMapKey, itemImage);
            iMap.get(iMapKey).images.push(itemImage);
        }

        if (!itemAttValueMetaMap.has(itemAttValueMetaMapKey)) {
            const meta: ItemMetadata2 = {
                id: i.IM_ID,
                name: i.IM_NAME,
                attributeId: i.A_ID,
                attributeType: i.A_TYPE,
                entries: []
            } as ItemMetadata2;
            itemAttValueMetaMap.set(itemAttValueMetaMapKey, meta);
            // iMap.get(iMapKey).metadatas.push(meta);
            itemValueMap.get(itemValueMapKey).metadatas.push(meta);
        }

        if (!itemAttValueMetaEntryMap.has(itemAttValueMetaEntryMapKey)) {
            const entry: ItemMetadataEntry2 = {
                id: i.IE_ID,
                key: i.IE_KEY,
                value: i.IE_VALUE,
                dataType: i.IE_DATA_TYPE
            } as ItemMetadataEntry2;
            itemAttValueMetaEntryMap.set(itemAttValueMetaEntryMapKey, entry);
            itemAttValueMetaMap.get(itemAttValueMetaMapKey).entries.push(entry);
        }

        if (!attributeMap.has(attributeMapKey)) {
            const a = {
                id: i.A_ID,
                name: i.A_NAME,
                description: i.A_DESCRIPTION,
                type: i.A_TYPE,
                metadatas: []
            } as Attribute2;
            attributeMap.set(attributeMapKey, a);
        }

        if (!attributeMetadataMap.has(attributeMetadataMapKey)) {
            const m = {
                id: i.AM_ID,
                name: i.AM_NAME,
                entries: []
            } as AttributeMetadata2;
            attributeMetadataMap.set(attributeMetadataMapKey, m);
            attributeMap.get(attributeMapKey).metadatas.push(m);
        }

        if (!attributeMetadataEntryMap.has(attributeMetadataEntryMapKey)) {
            const e = {
                id: i.AME_ID,
                key: i.AME_KEY,
                value: i.AME_VALUE
            } as AttributeMetadataEntry2;
            attributeMetadataEntryMap.set(attributeMetadataEntryMapKey, e);
            attributeMetadataMap.get(attributeMetadataMapKey).entries.push(e);
        }
    };

    const attMap: Map<string /* attributeId */, Attribute> =
        ([...attributeMap.values()]).reduce((m: Map<string /* attributeId */, Attribute>, i: Attribute2) => {
                m.set(`${i.id}`, _attributeConvert(i));
                return m;
            }, new Map()
        );


    const matchedBulkEditItem2s: Item2[] = bulkEditItem2s.filter((b: Item2) => {
        let r: boolean = true;
        for (const itemValueOperatorAndAttribute of whenClauses) {
            r = false;
            console.log('*********************** itemValueOperatorAndAttribute', itemValueOperatorAndAttribute);
            const value: Value = itemValueOperatorAndAttribute.itemValue;
            const attribute: Attribute = itemValueOperatorAndAttribute.attribute;
            const operator: OperatorType = itemValueOperatorAndAttribute.operator;

            for (const itemValue2 of b.values) {
                const metas: ItemMetadata2[] = itemValue2.metadatas.filter((m: ItemMetadata2) => {
                    if (m.attributeId === attribute.id) {
                        switch (attribute.type) {
                            case "string": {
                                const eType: ItemMetadataEntry2 = findEntry(m.entries, 'type');
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, 'value');

                                const v1: string = (value ? (value.val as StringValue).value : null); // from rest API
                                const v2: string = eValue.value; // actual item attribute value

                                return compareString(v1, v2, operator);
                            }
                            case "text": {
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, 'value');

                                const v1: string = (value ? (value.val as TextValue).value : null); // from rest api
                                const v2: string = eValue.value; // from actual item attribute value

                                return compareString(v1, v2, operator);
                            }
                            case "number": {
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, 'value');

                                const v1: number = (value ? (value.val as NumberValue).value : null);
                                const v2: number = Number(eValue.value);

                                return compareNumber(v1, v2, operator);
                            }
                            case "area": {
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, "value");
                                const eUnit: ItemMetadataEntry2 = findEntry(m.entries, "unit");

                                // conditions
                                const v1: number = (value ? (value.val as AreaValue).value : null);
                                const u1: AreaUnits = (value ? (value.val as AreaValue).unit : null);

                                // actuals
                                const v2: number = Number((eValue.value));
                                const u2: AreaUnits = (eUnit.value) as AreaUnits;

                                return compareArea(v1, u1, v2, u2, operator);
                            }
                            case "currency": {
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, 'value');
                                const eCountry: ItemMetadataEntry2 = findEntry(m.entries, 'country');

                                // conditions
                                const v1: number = (value ? (value.val as CurrencyValue).value : null);
                                const u1: CountryCurrencyUnits = (value ? (value.val as CurrencyValue).country : null);

                                // actuals
                                const v2: number = Number(eValue.value);
                                const u2: CountryCurrencyUnits = eCountry.value as CountryCurrencyUnits;

                                return compareCurrency(v1, u1, v2, u2, operator);
                            }
                            case "date": {
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, 'value');
                                const format = attribute.format ? attribute.format : DEFAULT_DATE_FORMAT;

                                const v1: moment.Moment = (value ? moment((value.val as DateValue).value, format) : null);
                                const v2: moment.Moment = (eValue.value ? moment(eValue.value, format) : undefined);

                                return compareDate(v1, v2, operator);
                            }
                            case "dimension": {
                                const eH: ItemMetadataEntry2 = findEntry(m.entries, 'height');
                                const eW: ItemMetadataEntry2 = findEntry(m.entries, 'width');
                                const eL: ItemMetadataEntry2 = findEntry(m.entries, 'length');
                                const eU: ItemMetadataEntry2 = findEntry(m.entries, 'unit');

                                // condition
                                const h1: number = (value ? ((value.val) as DimensionValue).height : null);
                                const w1: number = (value ? ((value.val) as DimensionValue).width : null);
                                const l1: number = (value ? ((value.val) as DimensionValue).length : null);
                                const u1: DimensionUnits = (value ? ((value.val) as DimensionValue).unit : null);

                                // actuals
                                const h2: number = Number(eH.value);
                                const w2: number = Number(eW.value);
                                const l2: number = Number(eL.value);
                                const u2: DimensionUnits = (eU.value) as DimensionUnits;

                                return compareDimension(l1, w1, h1, u1, l2, w2, h2, u2, operator);
                            }
                            case "height": {
                                const eV: ItemMetadataEntry2 = findEntry(m.entries, 'value');
                                const eU: ItemMetadataEntry2 = findEntry(m.entries, 'unit');

                                // condition
                                const v1: number = (value ? (value.val as HeightValue).value : null);
                                const u1: HeightUnits = (value ? (value.val as HeightValue).unit : null);

                                // actuals
                                const v2: number = Number(eV.value);
                                const u2: HeightUnits = eU.value as HeightUnits;

                                return compareHeight(v1, u1, v2, u2, operator);
                            }
                            case "length": {
                                const eV: ItemMetadataEntry2 = findEntry(m.entries, 'value');
                                const eU: ItemMetadataEntry2 = findEntry(m.entries, 'unit');

                                const v1: number = (value ? (value.val as LengthValue).value : null);
                                const u1: LengthUnits = (value ? (value.val as LengthValue).unit : null);

                                const v2: number = Number(eV.value);
                                const u2: LengthUnits = eU.value as LengthUnits;

                                return compareLength(v1, u1, v2, u1, operator);
                            }
                            case "volume": {
                                const eV: ItemMetadataEntry2 = findEntry(m.entries, 'value');
                                const eU: ItemMetadataEntry2 = findEntry(m.entries, 'unit');

                                const v1: number = (value ? (value.val as VolumeValue).value : null);
                                const u1: VolumeUnits = (value ? (value.val as VolumeValue).unit : null);

                                const v2: number = Number(eV.value);
                                const u2: VolumeUnits = eU.value as VolumeUnits;

                                return compareVolume(v1, u1, v2, u2, operator);
                            }
                            case "width": {
                                const eV: ItemMetadataEntry2 = findEntry(m.entries, 'value');
                                const eU: ItemMetadataEntry2 = findEntry(m.entries, 'unit');

                                const v1: number = (value ? (value.val as WidthValue).value : null);
                                const u1: WidthUnits = (value ? (value.val as WidthValue).unit : null);

                                const v2: number = Number(eV.value);
                                const u2: WidthUnits = eU.value as WidthUnits;

                                return compareWidth(v1, u1, v2, u2, operator);
                            }
                            case "select": {

                                const eK: ItemMetadataEntry2 = findEntry(m.entries, 'key');

                                const k1: string = (value ? (value.val as SelectValue).key : null);
                                const k2: string = eK.value;

                                return compareSelect(k1, k2, operator);
                            }
                            case "doubleselect": {
                                const eOne: ItemMetadataEntry2 = findEntry(m.entries, 'key1');
                                const eTwo: ItemMetadataEntry2 = findEntry(m.entries, 'key2');

                                const kOne1: string = (value ? (value.val as DoubleSelectValue).key1 : null);
                                const kTwo1: string = (value ? (value.val as DoubleSelectValue).key2 : null);
                                const kOne2: string = eOne.value;
                                const kTwo2: string = eTwo.value;

                                return compareDoubleselect(kOne1, kTwo1, kOne2, kTwo2, operator);
                            }
                        }
                        return true;
                    }
                    return false;
                });

                if (metas && metas.length) { //  this bulkEditItem2 match the 'when' criteria
                    r = true;
                }
            }
        }
        return r; // this bulkEditItem2 do not match the 'when' criteria
    });
    return { b: matchedBulkEditItem2s, m: attMap};
}

const findEntry = (entries: ItemMetadataEntry2[], key: string): ItemMetadataEntry2 => {
    return entries.find((e: ItemMetadataEntry2) => e.key === key);
}
