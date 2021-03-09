import {Connection} from 'mariadb';
import {ItemValueOperatorAndAttribute} from '@fuyuko-common/model/item-attribute.model';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {doInDbConnection, QueryA} from '../db';
import {
    Attribute2,
    AttributeMetadata2,
    AttributeMetadataEntry2,
    ItemMetadata2,
    ItemMetadataEntry2, ItemValue2, PricedItem2
} from '../server-side-model/server-side.model';
import {
    AreaValue,
    CurrencyValue, DATE_FORMAT,
    DateValue, DimensionValue, DoubleSelectValue, HeightValue, Item,
    ItemImage, LengthValue,
    NumberValue, PricedItem, SelectValue,
    StringValue,
    TextValue,
    Value, VolumeValue, WeightValue, WidthValue
} from '@fuyuko-common/model/item.model';
import {attributeConvert} from './conversion-attribute.service';
import {OperatorType} from '@fuyuko-common/model/operator.model';
import {
    AreaUnits,
    DimensionUnits,
    HeightUnits,
    LengthUnits,
    VolumeUnits,
    WeightUnits,
    WidthUnits
} from '@fuyuko-common/model/unit.model';
import moment from 'moment';
import {
    compareDate, compareDimension,
    compareNumber,
    compareString,
    convertToCm,
    convertToCm2, convertToG,
    convertToMl
} from './compare-attribute-values.service';
import {pricedItemsConvert} from './conversion-priced-item.service';
import {fireEvent, GetPricedItemsWithFilteringEvent} from './event/event.service';

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
            IMG.\`PRIMARY\` AS IMG_PRIMARY,
            IMG.MIME_TYPE AS IMG_MIME_TYPE,
            IMG.NAME AS IMG_NAME,
            IMG.SIZE AS IMG_SIZE,
            
            PSI.ID AS PSI_ID,
            PSI.ITEM_ID AS PSI_ITEM_ID,
            PSI.PRICING_STRUCTURE_ID AS PSI_PRICING_STRUCTURE_ID,
            PSI.COUNTRY AS PSI_COUNTRY,
            PSI.PRICE AS PSI_PRICE
           
           FROM TBL_ITEM AS I
           LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID 
           LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.VIEW_ID = I.VIEW_ID AND A.ID = V.VIEW_ATTRIBUTE_ID
           LEFT JOIN TBL_VIEW_ATTRIBUTE_METADATA AS AM ON AM.VIEW_ATTRIBUTE_ID = A.ID
           LEFT JOIN TBL_VIEW_ATTRIBUTE_METADATA_ENTRY AS AME ON AME.VIEW_ATTRIBUTE_METADATA_ID = AM.ID
           LEFT JOIN TBL_ITEM_VALUE_METADATA AS IM ON IM.ITEM_VALUE_ID = V.ID
           LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS IE ON IE.ITEM_VALUE_METADATA_ID = IM.ID
           LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
           LEFT JOIN TBL_PRICING_STRUCTURE_ITEM AS PSI ON PSI.ITEM_ID = I.ID
           WHERE I.STATUS = 'ENABLED' AND PSI.PRICING_STRUCTURE_ID=? AND I.VIEW_ID=? 
`

const SQL_WITH_NULL_PARENT = `${SQL} AND I.PARENT_ID IS NULL`;
const SQL_WITH_PARAMETERIZED_PARENT = `${SQL} AND I.PARENT_ID = ? `;

export type PricedItem2sWithFilteringResult = {b: PricedItem2[], m: Map<string /* attributeId */, Attribute>};
export type PricedItemsWithFilteringResult = {b: PricedItem[], m: Map<string /* attributeId */, Attribute>};

class PricedItemFilteringService {

    /**
     * ==================================
     * === getPricedItemsWithFiltering ===
     * ==================================
     */
    async getPricedItemsWithFiltering(viewId: number,
                                      pricingStructureId: number,
                                      parentItemId: number,
                                      whenClauses: ItemValueOperatorAndAttribute[]): Promise<PricedItemsWithFilteringResult> {
        return await doInDbConnection(async (conn: Connection) => {
            return this._getPricedItemsWithFiltering(conn, viewId, pricingStructureId, parentItemId, whenClauses);
        });
    }
    async _getPricedItemsWithFiltering(conn: Connection,
                                       viewId: number,
                                       pricingStructureId: number,
                                       parentItemId: number,
                                       whenClauses: ItemValueOperatorAndAttribute[]): Promise<PricedItemsWithFilteringResult> {
        const r2: PricedItem2sWithFilteringResult = await getPricedItem2sWithFiltering(conn, viewId, pricingStructureId, parentItemId, whenClauses);
        const r: PricedItemsWithFilteringResult = {
            b: pricedItemsConvert(r2.b),
            m: r2.m
        } as PricedItemsWithFilteringResult;
        fireEvent({
            type: 'GetPricedItemsWithFilteringEvent',
            viewId, pricingStructureId, parentItemId, whenClauses,
            result: r
        } as GetPricedItemsWithFilteringEvent);
        return r;
    }
    async getPricedItem2sWithFiltering(conn: Connection,
                                       viewId: number,
                                       pricingStructureId: number,
                                       parentItemId: number,
                                       whenClauses: ItemValueOperatorAndAttribute[]): Promise<PricedItem2sWithFilteringResult> {

        const q: QueryA = !!parentItemId ?
            await conn.query( SQL_WITH_PARAMETERIZED_PARENT, [pricingStructureId, viewId, parentItemId]) :
            await conn.query( SQL_WITH_NULL_PARENT, [pricingStructureId, viewId]);

        const iMap: Map<string /* itemId */, PricedItem2> = new Map();
        const itemValueMap: Map<string /* itemId_itemValueId */, ItemValue2> = new Map();
        const itemAttValueMetaMap: Map<string /* itemId_attributeId_metaId */, ItemMetadata2> = new Map();
        const itemAttValueMetaEntryMap: Map<string /* itemId_attributeId_metaId_entryId */, ItemMetadataEntry2> = new Map();
        const itemImageMap: Map<string /* itemId_imageId */, ItemImage> = new Map();
        const attributeMap: Map<string /* attributeId*/, Attribute2> = new Map();
        const attributeMetadataMap: Map<string /* attributeId_metadataId */, AttributeMetadata2> = new Map();
        const attributeMetadataEntryMap: Map<string /* attributeId_metadataId_entryId */, AttributeMetadataEntry2> = new Map();
        const priceMap: Map<string /* pricingStructureItemId_itemId */, {price: number, country: string}> = new Map();

        const bulkEditItem2s: PricedItem2[] = [];
        for (const i of q) {

            const itemId: number = i.I_ID;
            const itemValueId: number = i.V_ID;
            const attributeId: number = i.A_ID;
            const attributeMetadataId: number = i.AM_ID;
            const attributeMetadataEntryId: number = i.AME_ID;
            const metaId: number = i.IM_ID;
            const entryId: number = i.IE_ID;
            const itemImageId: number = i.IMG_ID;
            const pricingStructureItemId: number = i.PSI_ID;

            const iMapKey: string = `${itemId}`;
            const itemValueMapKey: string = itemId && itemValueId ? `${itemId}_${itemValueId}` : undefined;
            const itemAttValueMetaMapKey: string = metaId && itemValueId ? `${itemId}_${itemValueId}_${metaId}` : undefined;
            const itemAttValueMetaEntryMapKey: string = entryId && itemValueId && metaId ? `${itemId}_${attributeId}_${metaId}_${entryId}` : undefined;
            const itemImageMapKey: string = itemImageId && itemId ? `${itemId}_${itemImageId}` : undefined;
            const attributeMapKey: string = attributeId ? `${attributeId}` : undefined;
            const attributeMetadataMapKey: string = attributeId && attributeMetadataId ? `${attributeId}_${attributeMetadataId}` : undefined;
            const attributeMetadataEntryMapKey: string = attributeId && attributeMetadataId && attributeMetadataEntryId ? `${attributeId}_${attributeMetadataId}_${attributeMetadataEntryId}` : undefined;
            const priceMapKey: string = pricingStructureItemId && itemId ? `${pricingStructureItemId}_${itemId}` : undefined;


            if (!iMap.has(iMapKey)) {
                const item: PricedItem2 = {
                    id: i.I_ID,
                    name: i.I_NAME,
                    description: i.I_DESCRIPTION,
                    parentId: i.I_PARENTID,
                    price: undefined,
                    country: undefined,
                    values: [],
                    images: [],
                    children: []
                } as PricedItem2;
                iMap.set(iMapKey, item);
                bulkEditItem2s.push(item);

                const { b /* BulkEditItem2[] */, } = await getPricedItem2sWithFiltering(conn, viewId, pricingStructureId, itemId, whenClauses);
                item.children = b;
            }

            if (priceMapKey && !priceMap.has(priceMapKey)) {
                const p = {
                    price: i.PSI_PRICE,
                    country: i.PSI_COUNTRY
                };
                priceMap.set(priceMapKey, p);
                iMap.get(iMapKey).price = p.price;
                iMap.get(iMapKey).country = p.country;
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
                iMap.get(iMapKey).images.push(itemImage);
            }

            if (itemValueMapKey && !itemValueMap.has(itemValueMapKey)) {
                const itemValue2: ItemValue2 = {
                    id: i.V_ID,
                    attributeId: i.V_VIEW_ATTRIBUTE_ID,
                    metadatas: []
                } as ItemValue2;
                itemValueMap.set(itemValueMapKey, itemValue2);
                iMap.get(iMapKey).values.push(itemValue2);
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
                itemValueMap.get(itemValueMapKey).metadatas.push(meta);
            }

            if (itemAttValueMetaEntryMapKey && !itemAttValueMetaEntryMap.has(itemAttValueMetaEntryMapKey)) {
                const entry: ItemMetadataEntry2 = {
                    id: i.IE_ID,
                    key: i.IE_KEY,
                    value: i.IE_VALUE,
                    dataType: i.IE_DATA_TYPE
                } as ItemMetadataEntry2;
                itemAttValueMetaEntryMap.set(itemAttValueMetaEntryMapKey, entry);
                itemAttValueMetaMap.get(itemAttValueMetaMapKey).entries.push(entry);
            }

            if (attributeMapKey && !attributeMap.has(attributeMapKey)) {
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

            if (attributeMetadataMapKey && !attributeMetadataMap.has(attributeMetadataMapKey)) {
                const m = {
                    id: i.AM_ID,
                    name: i.AM_NAME,
                    entries: []
                } as AttributeMetadata2;
                attributeMetadataMap.set(attributeMetadataMapKey, m);
                attributeMap.get(attributeMapKey).metadatas.push(m);
            }

            if (attributeMetadataEntryMapKey && !attributeMetadataEntryMap.has(attributeMetadataEntryMapKey)) {
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
                    m.set(`${i.id}`, attributeConvert(i));
                    return m;
                }, new Map()
            );


        const matchedBulkEditItem2s: PricedItem2[] = bulkEditItem2s.filter((b: PricedItem2) => {
            let r: boolean = true;
            for (const itemValueOperatorAndAttribute of whenClauses) {
                r = false;
                const value: Value = itemValueOperatorAndAttribute.itemValue;
                const attribute: Attribute = itemValueOperatorAndAttribute.attribute;
                const operator: OperatorType = itemValueOperatorAndAttribute.operator;

                for (const itemValue2 of b.values.length ? b.values : [{
                    id: -1,
                    attributeId: attribute.id,
                    metadatas: [
                        {
                            id: -1,
                            attributeId: attribute.id,
                            attributeType: attribute.type,
                            name: '',
                            entries: []
                        } as ItemMetadata2
                    ]
                } as ItemValue2]) {
                    const metas: ItemMetadata2[] = itemValue2.metadatas.filter((m: ItemMetadata2) => {
                        if (m.attributeId === attribute.id) {
                            switch (attribute.type) {
                                case "string": {
                                    const eType: ItemMetadataEntry2 = this.findEntry(m.entries, 'type');
                                    const eValue: ItemMetadataEntry2 = this.findEntry(m.entries, 'value');

                                    const v1: string = (value ? (value.val as StringValue).value : null); // from rest API
                                    const v2: string = eValue ? eValue.value : null; // actual item attribute value

                                    return compareString(v1, v2, operator);
                                }
                                case "text": {
                                    const eValue: ItemMetadataEntry2 = this.findEntry(m.entries, 'value');

                                    const v1: string = (value ? (value.val as TextValue).value : null); // from rest api
                                    const v2: string = eValue ? eValue.value : null; // from actual item attribute value

                                    return compareString(v1, v2, operator);
                                }
                                case "number": {
                                    const eValue: ItemMetadataEntry2 = this.findEntry(m.entries, 'value');

                                    const v1: number = (value ? (value.val as NumberValue).value : null);
                                    const v2: number = eValue ? Number(eValue.value) : null;

                                    return compareNumber(v1, v2, operator);
                                }
                                case "area": {
                                    const eValue: ItemMetadataEntry2 = this.findEntry(m.entries, "value");
                                    const eUnit: ItemMetadataEntry2 = this.findEntry(m.entries, "unit");

                                    const v1: number = (value ? (value.val as AreaValue).value : null);
                                    const u1: AreaUnits = (value ? (value.val as AreaValue).unit : null);

                                    const v2: number = eValue ? Number((eValue.value)): null;
                                    const u2: AreaUnits = eUnit ? (eUnit.value) as AreaUnits : null;

                                    const vv1: number = convertToCm2(v1, u1);
                                    const vv2: number = convertToCm2(v2, u2);

                                    return compareNumber(vv1, vv2, operator);
                                }
                                case "currency": {
                                    const eValue: ItemMetadataEntry2 = this.findEntry(m.entries, 'value');

                                    const v1: number = (value ? (value.val as CurrencyValue).value : null);
                                    const v2: number = eValue ? Number(eValue.value) : null;

                                    return compareNumber(v1, v2, operator);
                                }
                                case "date": {
                                    const eValue: ItemMetadataEntry2 = this.findEntry(m.entries, 'value');
                                    const format = attribute.format ? attribute.format : DATE_FORMAT;

                                    const v1: moment.Moment = (value ? moment((value.val as DateValue).value, format) : null);
                                    const v2: moment.Moment = eValue ? (eValue.value ? moment(eValue.value, format) : undefined) : undefined;

                                    return compareDate(v1, v2, operator);
                                }
                                case "dimension": {
                                    const eH: ItemMetadataEntry2 = this.findEntry(m.entries, 'height');
                                    const eW: ItemMetadataEntry2 = this.findEntry(m.entries, 'width');
                                    const eL: ItemMetadataEntry2 = this.findEntry(m.entries, 'length');
                                    const eU: ItemMetadataEntry2 = this.findEntry(m.entries, 'unit');

                                    const h1: number = (value ? ((value.val) as DimensionValue).height : null);
                                    const w1: number = (value ? ((value.val) as DimensionValue).width : null);
                                    const l1: number = (value ? ((value.val) as DimensionValue).length : null);
                                    const u1: DimensionUnits = (value ? ((value.val) as DimensionValue).unit : null);

                                    const h2: number = eH ? Number(eH.value) : null;
                                    const w2: number = eW ? Number(eW.value) : null;
                                    const l2: number = eL ? Number(eL.value) : null;
                                    const u2: DimensionUnits = eU ? (eU.value) as DimensionUnits : null;

                                    return compareDimension(l1, w1, h1, u1, l2, w2, h2, u2, operator);
                                }
                                case "height": {
                                    const eV: ItemMetadataEntry2 = this.findEntry(m.entries, 'value');
                                    const eU: ItemMetadataEntry2 = this.findEntry(m.entries, 'unit');

                                    const v1: number = (value ? (value.val as HeightValue).value : null);
                                    const u1: HeightUnits = (value ? (value.val as HeightValue).unit : null);

                                    const v2: number = eV ? Number(eV.value) : null;
                                    const u2: HeightUnits = eU ? eU.value as HeightUnits : null;

                                    const vv1: number = convertToCm(v1, u1);
                                    const vv2: number = convertToCm(v2, u2);

                                    return compareNumber(vv1, vv2, operator);
                                }
                                case "weight": {
                                    const eV: ItemMetadataEntry2 = this.findEntry(m.entries, 'value');
                                    const eU: ItemMetadataEntry2 = this.findEntry(m.entries, 'unit');

                                    const v1: number = (value ? (value.val as WeightValue).value : null);
                                    const u1: WeightUnits = (value ? (value.val as WeightValue).unit : null);

                                    const v2: number = eV ? Number(eV.value) : null;
                                    const u2: WeightUnits = eU ? eU.value as WeightUnits : null;

                                    const vv1: number = convertToG(v1, u1);
                                    const vv2: number = convertToG(v2, u2);

                                    return compareNumber(vv1, vv2, operator);
                                }
                                case "length": {
                                    const eV: ItemMetadataEntry2 = this.findEntry(m.entries, 'value');
                                    const eU: ItemMetadataEntry2 = this.findEntry(m.entries, 'unit');

                                    const v1: number = (value ? (value.val as LengthValue).value : null);
                                    const u1: LengthUnits = (value ? (value.val as LengthValue).unit : null);

                                    const v2: number = eV ? Number(eV.value) : null;
                                    const u2: LengthUnits = eU ? eU.value as LengthUnits : null;

                                    const vv1: number = convertToCm(v1, u1);
                                    const vv2: number = convertToCm(v2, u2);

                                    return compareNumber(vv1, vv2, operator);
                                }
                                case "volume": {
                                    const eV: ItemMetadataEntry2 = this.findEntry(m.entries, 'value');
                                    const eU: ItemMetadataEntry2 = this.findEntry(m.entries, 'unit');

                                    const v1: number = (value ? (value.val as VolumeValue).value : null);
                                    const u1: VolumeUnits = (value ? (value.val as VolumeValue).unit : null);

                                    const v2: number = eV ? Number(eV.value) : null;
                                    const u2: VolumeUnits = eU ? eU.value as VolumeUnits : null;

                                    const vv1: number = convertToMl(v1, u1);
                                    const vv2: number = convertToMl(v2, u2);

                                    return compareNumber(vv1, vv2, operator);
                                }
                                case "width": {
                                    const eV: ItemMetadataEntry2 = this.findEntry(m.entries, 'value');
                                    const eU: ItemMetadataEntry2 = this.findEntry(m.entries, 'unit');

                                    const v1: number = (value ? (value.val as WidthValue).value : null);
                                    const u1: WidthUnits = (value ? (value.val as WidthValue).unit : null);

                                    const v2: number = eV ? Number(eV.value) : null;
                                    const u2: WidthUnits = eU ? eU.value as WidthUnits : null;

                                    const vv1: number = convertToCm(v1, u1);
                                    const vv2: number = convertToCm(v2, u2);

                                    return compareNumber(vv1, vv2, operator);
                                }
                                case "select": {

                                    const eK: ItemMetadataEntry2 = this.findEntry(m.entries, 'key');

                                    const k1: string = (value ? (value.val as SelectValue).key : null);
                                    const k2: string = eK ? eK.value : null;

                                    return compareString(k1, k2, operator);
                                }
                                case "doubleselect": {
                                    const eOne: ItemMetadataEntry2 = this.findEntry(m.entries, 'key1');
                                    const eTwo: ItemMetadataEntry2 = this.findEntry(m.entries, 'key2');

                                    const kOne1: string = (value ? (value.val as DoubleSelectValue).key1 : null);
                                    const kTwo1: string = (value ? (value.val as DoubleSelectValue).key2 : null);
                                    const kOne2: string = eOne ? eOne.value : null;
                                    const kTwo2: string = eTwo ? eTwo.value : null;

                                    return (compareString(kOne1, kOne2, operator) && compareString(kTwo1, kTwo2, operator));
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

    // ==== helper functions ======================

    findEntry(entries: ItemMetadataEntry2[], key: string): ItemMetadataEntry2 {
        return entries.find((e: ItemMetadataEntry2) => e.key === key);
    }
}

const s = new PricedItemFilteringService();
export const
    getPricedItemsWithFiltering = s.getPricedItemsWithFiltering.bind(s),
    getPricedItem2sWithFiltering = s.getPricedItem2sWithFiltering.bind(s);
