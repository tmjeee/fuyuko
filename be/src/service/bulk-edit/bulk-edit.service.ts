import {
    AreaValue,
    CurrencyValue, DATE_FORMAT,
    DateValue, DimensionValue, DoubleSelectValue, HeightValue,
    ItemImage, LengthValue,
    NumberValue, SelectValue,
    StringValue,
    TextValue,
    Value, VolumeValue, WeightValue, WidthValue
} from '@fuyuko-common/model/item.model';
import {
    Attribute2,
    AttributeMetadata2, AttributeMetadataEntry2,
    ItemMetadata2,
    ItemMetadataEntry2, ItemValue2
} from "../../server-side-model/server-side.model";
import {BulkEditItem, BulkEditPackage} from '@fuyuko-common/model/bulk-edit.model';
import {doInDbConnection, QueryA} from '../../db';
import {Connection} from 'mariadb';
import {ItemValueOperatorAndAttribute} from '@fuyuko-common/model/item-attribute.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {attributeConvert} from '../conversion-attribute.service';
import {OperatorType} from '@fuyuko-common/model/operator.model';
import {
    compareArea,
    compareCurrency,
    compareDate, compareDimension, compareDoubleselect, compareHeight, compareLength,
    compareNumber, compareSelect,
    compareString, compareVolume, compareWeight, compareWidth
} from "../compare-attribute-values.service";
import {
    AreaUnits,
    CountryCurrencyUnits,
    DimensionUnits,
    HeightUnits,
    LengthUnits,
    VolumeUnits, WeightUnits, WidthUnits
} from '@fuyuko-common/model/unit.model';
import moment from 'moment';
import {itemValueConvert} from '../conversion-item-value.service';
import {getAttributeInView} from '../attribute.service';
import {BulkEditPreviewEvent, fireEvent} from '../event/event.service';
import {e} from "../../logger";

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
            A.CREATION_DATE AS A_CREATION_DATE,
            A.LAST_UPDATE AS A_LAST_UPDATE,
            
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
           LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.VIEW_ID = I.VIEW_ID
           LEFT JOIN TBL_VIEW_ATTRIBUTE_METADATA AS AM ON AM.VIEW_ATTRIBUTE_ID = A.ID
           LEFT JOIN TBL_VIEW_ATTRIBUTE_METADATA_ENTRY AS AME ON AME.VIEW_ATTRIBUTE_METADATA_ID = AM.ID
           LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID AND V.VIEW_ATTRIBUTE_ID = A.ID
           LEFT JOIN TBL_ITEM_VALUE_METADATA AS IM ON IM.ITEM_VALUE_ID = V.ID
           LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS IE ON IE.ITEM_VALUE_METADATA_ID = IM.ID
           LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
           WHERE I.STATUS = 'ENABLED' AND I.VIEW_ID=? 
`

const SQL_WITH_NULL_PARENT = `${SQL} AND I.PARENT_ID IS NULL`;
const SQL_WITH_PARAMETERIZED_PARENT = `${SQL} AND I.PARENT_ID = ? `;

interface BulkEditItem2 {
    id: number;  // itemId
    name: string;
    description: string;
    images: ItemImage[];
    parentId: number;
    metadatas: ItemMetadata2[]
    children: BulkEditItem2[]
}

/**
 * ===========================
 * === preview ===
 * ===========================
 */
export type PreviewItemValueAndAttribute = { itemValue: Value, attribute: {id: number}};
export type PreviewItemValueOperatorAndAttribute = { itemValue: Value, attribute: {id: number}, operator: OperatorType };
export const preview = async (viewId: number,
                              changeClauses: PreviewItemValueAndAttribute[],
                              whenClauses: PreviewItemValueOperatorAndAttribute[]):
    Promise<BulkEditPackage> => {

    const bulkEditPackage: BulkEditPackage = await doInDbConnection(async (conn: Connection) => {

        const {b: matchedBulkEditItem2s, m: attributeMap } = await doInDbConnection(async (conn: Connection) => {
            return await getBulkEditItem2s(conn, viewId, undefined, whenClauses);
        });

        const bulkEditItems: BulkEditItem[] = convertToBulkEditItems(matchedBulkEditItem2s, changeClauses,
            whenClauses.map((wc: PreviewItemValueOperatorAndAttribute) => {
                return {
                    operator: wc.operator,
                    itemValue: wc.itemValue,
                    attribute: attributeMap.get(`${wc.attribute.id}`)
                } as ItemValueOperatorAndAttribute;
            }));
        const changeAttributes: Attribute[] = changeClauses.map((c: PreviewItemValueAndAttribute) => attributeMap.get(`${c.attribute.id}`));
        const whenAttributes: Attribute[] = whenClauses.map((w: PreviewItemValueOperatorAndAttribute) => attributeMap.get(`${w.attribute.id}`));
        const r = {
            changeAttributes,
            whenAttributes,
            bulkEditItems
        } as BulkEditPackage
        return r;
    });
    fireEvent({
       type: 'BulkEditPreviewEvent',
       bulkEditPackage 
    } as BulkEditPreviewEvent)
    return bulkEditPackage;
};

const getBulkEditItem2s = async (conn: Connection,
                                 viewId: number,
                                 parentItemId: number | undefined,
                                 whenClauses: PreviewItemValueOperatorAndAttribute[]):
    Promise<{b: BulkEditItem2[], m: Map<string /* attributeId */, Attribute>}> => {

    const q: QueryA = !!parentItemId ?
        await conn.query( SQL_WITH_PARAMETERIZED_PARENT, [viewId, parentItemId]) :
        await conn.query( SQL_WITH_NULL_PARENT, [viewId]);

    const iMap: Map<string /* itemId */, BulkEditItem2> = new Map();
    const itemAttValueMetaMap: Map<string /* itemId_attributeId_metaId */, ItemMetadata2> = new Map();
    const itemAttValueMetaEntryMap: Map<string /* itemId_attributeId_metaId_entryId */, ItemMetadataEntry2> = new Map();
    const itemImageMap: Map<string /* itemId_imageId */, ItemImage> = new Map();
    const attributeMap: Map<string /* attributeId*/, Attribute2> = new Map();
    const attributeMetadataMap: Map<string /* attributeId_metadataId */, AttributeMetadata2> = new Map();
    const attributeMetadataEntryMap: Map<string /* attributeId_metadataId_entryId */, AttributeMetadataEntry2> = new Map();

    const bulkEditItem2s: BulkEditItem2[] = [];
    for (const i of q) {

        const itemId: number = i.I_ID;
        const attributeId: number = i.A_ID;
        const attributeMetadataId: number = i.AM_ID;
        const attributeMetadataEntryId: number = i.AME_ID;
        const metaId: number = i.IM_ID;
        const entryId: number = i.IE_ID;
        const itemImageId: number = i.IMG_ID;

        const iMapKey: string = `${itemId}`;
        const itemAttValueMetaMapKey = metaId ? `${itemId}_${attributeId}_${metaId}` : undefined;
        const itemAttValueMetaEntryMapKey = metaId ? `${itemId}_${attributeId}_${metaId}_${entryId}`: undefined;
        const itemImageMapKey = itemImageId ? `${itemId}_${itemImageId}` : undefined;
        const attributeMapKey: string = `${attributeId}`;
        const attributeMetadataMapKey: string = `${attributeId}_${attributeMetadataId}`;
        const attributeMetadataEntryMapKey: string = `${attributeId}_${attributeMetadataId}_${attributeMetadataEntryId}`;

        if (!iMap.has(iMapKey)) {
            const item: BulkEditItem2 = {
                id: i.I_ID,
                name: i.I_NAME,
                description: i.I_DESCRIPTION,
                parentId: i.I_PARENTID,
                metadatas: [],
                images: [],
                children: []
            } as BulkEditItem2;
            iMap.set(iMapKey, item);
            bulkEditItem2s.push(item);

            const { b /* BulkEditItem2[] */, } = await getBulkEditItem2s(conn, viewId, itemId, whenClauses);
            item.children = b;
        }

        if (itemImageMapKey && !itemImageMap.has(itemImageMapKey)) {
            const itemImage = {
                id: i.IMG_ID,
                name: i.IMG_NAME,
                primary: i.IMG_PRIMARY,
                mimeType: i.IMG_MIME_TYPE,
                size: i.IMG_SIZE
            } as ItemImage;
            itemImageMap.set(itemImageMapKey, itemImage);
            const bulkEditItem2 = iMap.get(iMapKey);
            if (bulkEditItem2) {
                bulkEditItem2.images.push(itemImage);
            }
        }

        if (itemAttValueMetaMapKey && !itemAttValueMetaMap.has(itemAttValueMetaMapKey)) {
            const meta: ItemMetadata2 = {
                id: i.IM_ID,
                name: i.IM_NAME,
                attributeId: i.A_ID,
                attributeType: i.A_TYPE,
                entries: []
            } as ItemMetadata2;
            itemAttValueMetaMap.set(itemAttValueMetaMapKey, meta);
            const bulkEditItem2 = iMap.get(iMapKey);
            if (bulkEditItem2) {
                bulkEditItem2.metadatas.push(meta);
            }
        }

        if (itemAttValueMetaEntryMapKey && !itemAttValueMetaEntryMap.has(itemAttValueMetaEntryMapKey)) {
            const entry: ItemMetadataEntry2 = {
                id: i.IE_ID,
                key: i.IE_KEY,
                value: i.IE_VALUE,
                dataType: i.IE_DATA_TYPE
            } as ItemMetadataEntry2;
            itemAttValueMetaEntryMap.set(itemAttValueMetaEntryMapKey, entry);
            if (itemAttValueMetaMapKey) {
                const itemMetadata2 = itemAttValueMetaMap.get(itemAttValueMetaMapKey);
                if (itemMetadata2) {
                    itemMetadata2.entries.push(entry);
                }
            }
        }

        if (!attributeMap.has(attributeMapKey)) {
            const a = {
                id: i.A_ID,
                name: i.A_NAME,
                description: i.A_DESCRIPTION,
                type: i.A_TYPE,
                creationDate: i.A_CREATION_DATE,
                lastUpdate: i.A_LAST_UPDATE,
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
            const attribute2 = attributeMap.get(attributeMapKey);
            if (attribute2) {
                attribute2.metadatas.push(m);
            }
        }

        if (!attributeMetadataEntryMap.has(attributeMetadataEntryMapKey)) {
            const e = {
                id: i.AME_ID,
                key: i.AME_KEY,
                value: i.AME_VALUE
            } as AttributeMetadataEntry2;
            attributeMetadataEntryMap.set(attributeMetadataEntryMapKey, e);
            const attributeMetadata2 = attributeMetadataMap.get(attributeMetadataMapKey);
            if (attributeMetadata2) {
                attributeMetadata2.entries.push(e);
            }
        }
    };

    const attMap: Map<string /* attributeId */, Attribute> =
        ([...attributeMap.values()]).reduce((m: Map<string /* attributeId */, Attribute>, i: Attribute2) => {
                m.set(`${i.id}`, attributeConvert(i));
                return m;
            }, new Map()
        );

    const matchedBulkEditItem2s: BulkEditItem2[] = [];
    for (const b of bulkEditItem2s) {
        let r: boolean = false;

        L2:
        for (const itemValueOperatorAndAttribute of whenClauses) {
            const value: Value = itemValueOperatorAndAttribute.itemValue;
            const attributeId: number = itemValueOperatorAndAttribute.attribute.id;
            const operator: OperatorType = itemValueOperatorAndAttribute.operator;
            const attribute: Attribute | undefined = await getAttributeInView(viewId, attributeId);

            if (!attribute) {
               e(`Cannot get bulk edit Items, can't find attribute id ${attributeId} in view ${viewId}`);
               continue;
            }


            if (!b.metadatas || !b.metadatas.length) { // no metadatas which means there is no value for the item attribute
                // return true;
                switch(attribute.type) {
                    case "string": {
                        const v1 = (value ? (value.val as StringValue).value : undefined); // from rest API
                        const v2 = undefined; // from actual item attribute value

                        const b: boolean =  compareString(v1, v2, operator);
                        r = b;
                        break L2;
                    }
                    case "text": {
                        const v1 = (value ? (value.val as TextValue).value : undefined); // from rest api
                        const v2 = undefined; // from actual item attribute value

                        r = compareString(v1, v2, operator);
                        break L2;
                    }
                    case "number": {
                        const v1 = (value ? (value.val as NumberValue).value : undefined);
                        const v2 = undefined;  // from actual item attribute value

                        r = compareNumber(v1, v2, operator);
                        break L2;
                    }
                    case "area": {
                        // from REST api
                        const v1 = (value ? (value.val as AreaValue).value : undefined);
                        const u1 = (value ? (value.val as AreaValue).unit : undefined);

                        // from actual item attribute value
                        const v2 = undefined;
                        const u2 = undefined;

                        r = compareArea(v1, u1, v2, u2, operator);
                        break L2;
                    }
                    case "currency": {
                        const v1 = (value ? (value.val as CurrencyValue).value : undefined);
                        const u1 = (value ? (value.val as CurrencyValue).country : undefined);

                        const v2 = undefined;
                        const u2 = undefined;

                        r = compareCurrency(v1, u1, v2, u2, operator);
                    }
                    case "date": {
                        const format = attribute.format ? attribute.format : DATE_FORMAT;
                        const v1 = (value ? moment((value.val as DateValue).value, format) : undefined);
                        const v2 = undefined;

                        r = compareDate(v1, v2, operator);
                        break L2;
                    }
                    case "dimension": {
                        const h1 = (value ? ((value.val) as DimensionValue).height: undefined);
                        const w1 = (value ? ((value.val) as DimensionValue).width : undefined);
                        const l1 = (value ? ((value.val) as DimensionValue).length : undefined);
                        const u1 = (value ? ((value.val) as DimensionValue).unit : undefined);

                        const h2 = undefined;
                        const w2 = undefined;
                        const l2 = undefined;
                        const u2 = undefined;

                        r = compareDimension(l1, w1, h1, u1, l2, w2, h2, u2, operator);
                        break L2;
                    }
                    case "height": {
                        const v1 = (value ? (value.val as HeightValue).value : undefined);
                        const u1 = (value ? (value.val as HeightValue).unit : undefined);

                        const v2 = undefined;
                        const u2 = undefined;

                        r = compareHeight(v1, u1, v2, u2, operator);
                        break L2;
                    }
                    case "length": {
                        const v1 = (value ? (value.val as LengthValue).value : undefined);
                        const u1 = (value ? (value.val as LengthValue).unit : undefined);

                        const v2 = undefined;
                        const u2 = undefined;

                        r = compareLength(v1, u1, v2, u2, operator);
                        break L2;
                    }
                    case "volume": {
                        const v1 = (value ? (value.val as VolumeValue).value : undefined);
                        const u1 = (value ? (value.val as VolumeValue).unit : undefined);

                        const v2 = undefined;
                        const u2 = undefined;

                        r = compareVolume(v1, u1, v2, u2, operator);
                        break L2;
                    }
                    case "width": {
                        const v1 = (value ? (value.val as WidthValue).value : undefined);
                        const u1 = (value ? (value.val as WidthValue).unit : undefined);

                        const v2 = undefined;
                        const u2 = undefined;

                        r = compareWidth(v1, u1, v2, u2, operator);
                        break L2;
                    }
                    case 'weight': {
                        const v1 = (value ? (value.val as WeightValue).value : undefined);
                        const u1 = (value ? (value.val as WeightValue).unit : undefined);

                        const v2 = undefined;
                        const u2 = undefined;

                        r = compareWeight(v1, u1, v2, u2, operator);
                        break L2;
                    }
                    case "select": {
                        const k1 = (value ? (value.val as SelectValue).key : undefined);
                        const k2 = undefined;

                        r = compareSelect(k1, k2, operator);
                        break L2;
                    }
                    case "doubleselect": {
                        const kOne1 = (value ? (value.val as DoubleSelectValue).key1 : undefined);
                        const kTwo1 = (value ? (value.val as DoubleSelectValue).key2 : undefined);

                        const kOne2 = undefined;
                        const kTwo2 = undefined;

                        r = compareDoubleselect(kOne1, kTwo1, kOne1, kOne2, operator);
                        break L2;
                    }
                }
            } else {
                const metas: ItemMetadata2[] = b.metadatas.filter((m: ItemMetadata2) =>  {
                    if (m.attributeId === attribute.id) {
                        switch(attribute.type) {
                            case "string": {
                                const eType = findEntry(m.entries, 'type');
                                const eValue = findEntry(m.entries, 'value');

                                const v1 = (value ? (value.val as StringValue).value : undefined); // from rest API
                                const v2 = eValue ? eValue.value : undefined; // actual item attribute value

                                const b: boolean =  compareString(v1, v2, operator);
                                return b;
                            }
                            case "text": {
                                const eValue = findEntry(m.entries, 'value');

                                const v1 = (value ? (value.val as TextValue).value : undefined); // from rest api
                                const v2 = eValue ? eValue.value : undefined; // from actual item attribute value

                                return compareString(v1, v2, operator);
                            }
                            case "number": {
                                const eValue = findEntry(m.entries, 'value');

                                const v1 = (value ? (value.val as NumberValue).value : undefined);
                                const v2 = eValue ? Number(eValue.value) : undefined;

                                return compareNumber(v1, v2, operator);
                            }
                            case "area": {
                                const eValue = findEntry(m.entries, "value");
                                const eUnit = findEntry(m.entries, "unit");

                                const v1 = (value ? (value.val as AreaValue).value : undefined);
                                const u1 = (value ? (value.val as AreaValue).unit : undefined);

                                const v2 = eValue ? Number((eValue.value)): undefined;
                                const u2 = eUnit ? (eUnit.value) as AreaUnits : undefined;

                                return compareArea(v1, u1, v2, u2, operator);
                            }
                            case "currency": {
                                const eValue = findEntry(m.entries, 'value');
                                const eUnit = findEntry(m.entries, "country");

                                const v1 = (value ? (value.val as CurrencyValue).value : undefined);
                                const u1 = (value ? (value.val as CurrencyValue).country : undefined);

                                const v2 = eValue ? Number(eValue.value) : undefined;
                                const u2 = eUnit ? (eUnit.value) as CountryCurrencyUnits : undefined;

                                return compareCurrency(v1, u1, v2, u2, operator);
                            }
                            case "date": {
                                const eValue = findEntry(m.entries, 'value');
                                const format = attribute.format ? attribute.format : DATE_FORMAT;

                                const v1 = (value ? moment((value.val as DateValue).value, format) : undefined);
                                const v2 = (eValue && eValue.value ? moment(eValue.value, format) : undefined);

                                return compareDate(v1, v2, operator);
                            }
                            case "dimension": {
                                const eH = findEntry(m.entries, 'height');
                                const eW = findEntry(m.entries, 'width');
                                const eL = findEntry(m.entries, 'length');
                                const eU = findEntry(m.entries, 'unit');

                                const h1 = (value ? ((value.val) as DimensionValue).height: undefined);
                                const w1 = (value ? ((value.val) as DimensionValue).width : undefined);
                                const l1 = (value ? ((value.val) as DimensionValue).length : undefined);
                                const u1 = (value ? ((value.val) as DimensionValue).unit : undefined);

                                const h2 = eH ? Number(eH.value) : undefined;
                                const w2 = eW ? Number(eW.value) : undefined;
                                const l2 = eL ? Number(eL.value) : undefined;
                                const u2 = eU ? (eU.value) as DimensionUnits : undefined;

                                return compareDimension(l1, w1, h1, u1, l2, w2, h2, u2, operator);
                            }
                            case "height": {
                                const eV = findEntry(m.entries, 'value');
                                const eU = findEntry(m.entries, 'unit');

                                const v1 = (value ? (value.val as HeightValue).value : undefined);
                                const u1 = (value ? (value.val as HeightValue).unit : undefined);

                                const v2 = eV ?  Number(eV.value) : undefined;
                                const u2 = eU ? eU.value as HeightUnits : undefined;

                                return compareHeight(v1, u1, v2, u2, operator);
                            }
                            case "length": {
                                const eV = findEntry(m.entries, 'value');
                                const eU = findEntry(m.entries, 'unit');

                                const v1 = (value ? (value.val as LengthValue).value : undefined);
                                const u1 = (value ? (value.val as LengthValue).unit : undefined);

                                const v2 = eV ? Number(eV.value) : undefined;
                                const u2 = eU ? eU.value as LengthUnits : undefined;

                                return compareLength(v1, u1, v2, u2, operator);
                            }
                            case "volume": {
                                const eV = findEntry(m.entries, 'value');
                                const eU = findEntry(m.entries, 'unit');

                                const v1 = (value ? (value.val as VolumeValue).value : undefined);
                                const u1 = (value ? (value.val as VolumeValue).unit : undefined);

                                const v2 = eV ? Number(eV.value) : undefined;
                                const u2 = eU ? eU.value as VolumeUnits : undefined;

                                return compareVolume(v1, u1, v2, u2, operator);
                            }
                            case "width": {
                                const eV = findEntry(m.entries, 'value');
                                const eU = findEntry(m.entries, 'unit');

                                const v1 = (value ? (value.val as WidthValue).value : undefined);
                                const u1 = (value ? (value.val as WidthValue).unit : undefined);

                                const v2 = eV ? Number(eV.value) : undefined;
                                const u2 = eU ? eU.value as WidthUnits : undefined;

                                return compareWidth(v1, u1, v2, u2, operator);
                            }
                            case "weight": {
                                const eV = findEntry(m.entries, 'value');
                                const eU = findEntry(m.entries, 'unit');

                                const v1 = (value ? (value.val as WeightValue).value : undefined);
                                const u1 = (value ? (value.val as WeightValue).unit : undefined);

                                const v2 = eV ? Number(eV.value) : undefined;
                                const u2 = eU ? eU.value as WeightUnits : undefined;

                                return compareWeight(v1, u1, v2, u2, operator);
                            }
                            case "select": {

                                const eK = findEntry(m.entries, 'key');

                                const k1 = (value ? (value.val as SelectValue).key : undefined);
                                const k2 = eK ? eK.value : undefined;

                                return compareSelect(k1, k2, operator);
                            }
                            case "doubleselect": {
                                const eOne = findEntry(m.entries, 'key1');
                                const eTwo = findEntry(m.entries, 'key2');

                                const kOne1 = (value ? (value.val as DoubleSelectValue).key1 : undefined); // condition
                                const kTwo1 = (value ? (value.val as DoubleSelectValue).key2 : undefined);  // condition
                                const kOne2 = eOne ? eOne.value : undefined;  // actual
                                const kTwo2 = eTwo ? eTwo.value : undefined;   // actual

                                const r = compareDoubleselect(kOne1, kTwo1, kOne2, kTwo2, operator);
                                return r;
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
        if (r) {    // this bulkEditItem2 do not match the 'when' criteria
            matchedBulkEditItem2s.push(b)
        }
    };
    return { b: matchedBulkEditItem2s, m: attMap};
}

const convertToBulkEditItems = (b2s: BulkEditItem2[], changes: PreviewItemValueAndAttribute[], whens: ItemValueOperatorAndAttribute[]): BulkEditItem[] => {
    return b2s.map((b2: BulkEditItem2) => convertToBulkEditItem(b2, changes, whens));
}


const convertToBulkEditItem = (b2: BulkEditItem2, changes: PreviewItemValueAndAttribute[], whens: ItemValueOperatorAndAttribute[]): BulkEditItem => {
    const c = changes.reduce((acc: any, change: PreviewItemValueAndAttribute) => {
        const met: ItemMetadata2 | undefined = b2.metadatas.find((m: ItemMetadata2) => m.attributeId === change.attribute.id);
        const attributeId: number = met ? met.attributeId: change.attribute.id;
        const _c = {
            old: itemValueConvert({
                id: -1,
                attributeId,
                metadatas: met? [met] : []
            } as ItemValue2),
            new: change.itemValue
        };
        acc[attributeId] = _c ;
        return acc;
    }, {});
    const w = whens.reduce((acc: any, when: ItemValueOperatorAndAttribute) => {
        const z = {
            attributeId: when.attribute.id,
            operator: when.operator,
            val: (when ? when.itemValue ? when.itemValue.val : null : null)
        };
        acc[when.attribute.id] = z;
        return acc;
    }, {} as any);
    const b: BulkEditItem = {
        id: b2.id,
        name: b2.name,
        description: b2.description,
        parentId: b2.parentId,
        children: convertToBulkEditItems(b2.children, changes, whens),
        images: [],
        changes: c,
        whens: w
    } as BulkEditItem;
    return b;
}

const findEntry = (entries: ItemMetadataEntry2[], key: string): ItemMetadataEntry2 | undefined => {
    return entries.find((e: ItemMetadataEntry2) => e.key === key);
}
