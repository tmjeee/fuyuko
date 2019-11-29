import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {PoolConnection} from "mariadb";
import {param} from 'express-validator';
import {ItemValueAndAttribute, ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import moment from 'moment';
import {
    AreaValue,
    CurrencyValue, DateValue, DimensionValue, ItemImage,
    ItemValTypes,
    NumberValue,
    StringValue,
    TextValue,
    Value
} from "../../model/item.model";
import {Attribute, DEFAULT_DATE_FORMAT} from "../../model/attribute.model";
import {OperatorType} from "../../model/operator.model";
import {BulkEditItem, BulkEditPackage} from "../../model/bulk-edit.model";
import {ItemMetadata2, ItemMetadataEntry2} from "../model/ss-attribute.model";
import {fromItemMetadata2ToValue, toItemValTypes} from "../../service/item-conversion.service";
import {encodeXText} from "nodemailer/lib/shared";
import {Operator} from "semver";
import numeral from "numeral";
import {AreaUnits, DimensionUnits, HeightUnits, LengthUnits, WidthUnits} from "../../model/unit.model";

interface BulkEditItem2 {
    id: number;  // itemId
    name: string;
    description: string;
    parentId: number;
    images: ItemImage[];
    metadatas: ItemMetadata2[]
    children: BulkEditItem2[]
}


const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

      const viewId: number = Number(req.params.viewId);

      const bulkEditPackage: BulkEditPackage = await doInDbConnection(async (conn: PoolConnection) => {

        const changeClauses: ItemValueAndAttribute[] = req.body.changeClauses;
        const whenClauses: ItemValueOperatorAndAttribute[] = req.body.whereClauses;

        const q: QueryA = await conn.query(`
           SELECT 
            I.ID AS I_ID,
            I.PARENT_ID AS I_PARENT_ID,
            I.VIEW_ID AS I_VIEW_ID,
            I.NAME AS I_NAME,
            I.DESCRIPTION AS I_DESCRIPTION,
            I.STATUS AS I_STATUS,
            
            V.ID AS V_ID,
            V.ITEM_ID AS V_ITEM_ID,
            V.ITEM_ATTRIBUTE_ID AS V_ITEM_ATTRIBUTE_ID,
            
            A.ID AS A_ID,
            A.VIEW_ID AS A_VIEW_ID,
            A.TYPE AS A_TYPE,
            A.NAME AS A_NAME,
            A.STATUS AS A_STATUS,
            A.DESCRIPTION AS A_DESCRIPTION,
            
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
           LEFT JOIN TBL_ITEM_ATTRIBUTE AS A ON A.ID = V.ITEM_ATTRIBUTE_ID
           LEFT JOIN TBL_ITEM_VALUE_METADATA AS IM ON IM.ITEM_VALUE_ID = V.ID
           LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS IE ON IE.ITEM_VALUE_METADATA_ID = IM.ID
           LEFT JOIN TBL_ITEM_ATTRIBUTE_METADATA AS AM ON AM.ITEM_ATTRIBUTE_ID = A.ID
           LEFT JOIN TBL_ITEM_ATTRIBUTE_METADATA_ENTRY AS AE ON AE.ITEM_ATTRIBUTE_METADATA_ID = AM.ID
           LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
           WHERE I.STATUS = 'ENABLED' AND I.VIEW_ID=?
        `, [viewId]);


        const iMap: Map<string /* itemId */, BulkEditItem2> = new Map();
        const itemAttValueMetaMap: Map<string /* itemId_attributeId_metaId */, ItemMetadata2> = new Map();
        const itemAttValueMetaEntryMap: Map<string /* itemId_attributeId_metaId_entryId */, ItemMetadataEntry2> = new Map();
        const itemImageMap: Map<string /* itemId_imageId */, ItemImage> = new Map();

        const bulkEditItem2s: BulkEditItem2[] = q.reduce((acc: BulkEditItem2[], i: QueryI) => {

            const itemId: number = i.I_ID;
            const attributeId: number = i.A_ID;
            const metaId: number = i.IM_ID;
            const entryId: number = i.IE_ID;
            const itemImageId: number = i.IMG_ID;

            const iMapKey: string = `${itemId}`;
            const itemAttValueMetaMapKey: string = `${itemId}_${attributeId}_${metaId}`;
            const itemAttValueMetaEntryMapKey: string = `${itemId}_${attributeId}_${metaId}_${entryId}`;
            const itemImageMapKey: string = `${itemId}_${itemImageId}`;


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
                acc.push(item);
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
                   attributeId: i.IM_ATTRBUTE_ID,
                   attributeType: i.A_TYPE,
                   entries: []
                } as ItemMetadata2;
                itemAttValueMetaMap.set(itemAttValueMetaMapKey, meta);
                iMap.get(iMapKey).metadatas.push(meta);
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

            return acc;
        }, []);


        const matchedBulkEditItem2s: BulkEditItem2[] = bulkEditItem2s.filter((b: BulkEditItem2) => {
            for (const itemValueOperatorAndAttribute of whenClauses) {
                const value: Value = itemValueOperatorAndAttribute.itemValue;
                const attribute: Attribute = itemValueOperatorAndAttribute.attribute;
                const operator: OperatorType = itemValueOperatorAndAttribute.operator;

                const metas: ItemMetadata2[] = b.metadatas.filter((m: ItemMetadata2) =>  {
                    if (m.attributeId === attribute.id) {
                        switch(value.val.type) {
                            case "string": {
                                const eType: ItemMetadataEntry2 = findEntry(m.entries, 'type');
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, 'value');

                                const v1: string = (value.val as StringValue).value;
                                const v2: string = eValue.value;

                                return compare(v1, v2, operator);
                            }
                            case "text": {
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, 'value');

                                const v1: string = (value.val as TextValue).value;
                                const v2: string = eValue.value;

                                return compare(v1, v2, operator);
                            }
                            case "number": {
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, 'value');

                                const v1: number = (value.val as NumberValue).value;
                                const v2: number = Number(eValue.value);

                                return compare(v1, v2, operator);
                            }
                            case "area": {
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, "value");
                                const eUnit: ItemMetadataEntry2 = findEntry(m.entries, "unit");

                                const v1: number = (value.val as AreaValue).value;
                                const u1: AreaUnits = (value.val as AreaValue).unit;

                                const v2: number = Number((eValue.value));
                                const u2: AreaUnits = (eUnit.value) as AreaUnits;

                                const vv1: number = convertToCm2(v1, u1);
                                const vv2: number = convertToCm2(v2, u2);

                                return compare(vv1, vv2, operator);
                            }
                            case "currency": {
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, 'value');

                                const v1: number = (value.val as CurrencyValue).value;
                                const v2: number = Number(eValue.value);

                                return compare(v1, v2, operator);
                            }
                            case "date": {
                                const eValue: ItemMetadataEntry2 = findEntry(m.entries, 'value');
                                const format = attribute.format ? attribute.format : DEFAULT_DATE_FORMAT;

                                const v1: moment.Moment = moment((value.val as DateValue).value, format);
                                const v2: moment.Moment = moment(eValue.value, format);

                                return compareDate(v1, v2, operator);
                            }
                            case "dimension": {

                                ((value.val) as DimensionValue).height;

                                break;
                            }
                            case "height": {

                                break;
                            }
                            case "length": {

                                break;
                            }
                            case "volume": {

                                break;
                            }
                            case "width": {

                                break;
                            }
                            case "select": {

                                break;
                            }
                            case "doubleselect": {

                                break;
                            }
                        }
                        return true;
                    }
                    return false;
                });

                if (metas && metas.length) { //  this bulkEditItem2 match the 'when' criteria
                    return true;
                }
            }
            return false; // this bulkEditItem2 do not match the 'when' criteria
        });


        const bulkEditItems: BulkEditItem[] = convertToBulkEditItems(matchedBulkEditItem2s, changeClauses, whenClauses);
        const changeAttributes: Attribute[] = changeClauses.map((c: ItemValueAndAttribute) => c.attribute);
        const whenAttributes: Attribute[] = whenClauses.map((w: ItemValueOperatorAndAttribute) => w.attribute);
        const r = {
           changeAttributes,
           whenAttributes,
           bulkEditItems
        } as BulkEditPackage

        return r;
      });

      res.status(200).json(bulkEditPackage);
   }
]

const convertToBulkEditItems = (b2s: BulkEditItem2[], changes: ItemValueAndAttribute[], whens: ItemValueOperatorAndAttribute[]): BulkEditItem[] => {
   return b2s.map((b2: BulkEditItem2) => convertToBulkEditItem(b2, changes, whens));
}


const convertToBulkEditItem = (b2: BulkEditItem2, changes: ItemValueAndAttribute[], whens: ItemValueOperatorAndAttribute[]): BulkEditItem => {
    const c = changes.reduce((acc: any, change: ItemValueAndAttribute) => {
        const met: ItemMetadata2 = b2.metadatas.find((m: ItemMetadata2) => m.attributeId === change.attribute.id);
        const _new = {
            attributeId: met.attributeId,
            val: {}
        } as Value;
        const _c = {
            [change.attribute.id] : {
                old: fromItemMetadata2ToValue(met.attributeId, [met]),
                new: change.itemValue
            }
        };
        acc[met.attributeId] = _c ;
        return acc;
    }, {});
    const w = whens.reduce((acc: any, when: ItemValueOperatorAndAttribute) => {
        acc[when.attribute.id] = when.itemValue
        return acc;
    }, {});
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

const convertToCm = (v: number, u: DimensionUnits | WidthUnits | LengthUnits | HeightUnits): number => {

}

const convertToCm2 = (v: number, u: AreaUnits): number => {

}

const compareDate = (a: moment.Moment, b: moment.Moment, operator: OperatorType): boolean => {
    switch (operator) {
        case "empty":
            break;
        case "eq":
            break;
        case "gt":
            break;
        case "gte":
            break;
        case "lt":
            break;
        case "lte":
            break;
        case "not empty":
            break;
        case "not eq":
            break;
        case "not gt":
            break;
        case "not gte":
            break;
        case "not lt":
            break;
        case "not lte":
            break;
    }

}

const compareNumber = (a: number, b: number, operator: OperatorType): boolean => {
    switch (operator) {
        case "empty":
            break;
        case "eq":
            break;
        case "gt":
            break;
        case "gte":
            break;
        case "lt":
            break;
        case "lte":
            break;
        case "not empty":
            break;
        case "not eq":
            break;
        case "not gt":
            break;
        case "not gte":
            break;
        case "not lt":
            break;
        case "not lte":
            break;
    }
}

const compareString = (a: string, b: string, operator: OperatorType): boolean => {
    switch (operator) {
        case "empty":
            break;
        case "eq":
            break;
        case "gt":
            break;
        case "gte":
            break;
        case "lt":
            break;
        case "lte":
            break;
        case "not empty":
            break;
        case "not eq":
            break;
        case "not gt":
            break;
        case "not gte":
            break;
        case "not lt":
            break;
        case "not lte":
            break;
    }
}

const findEntry = (entries: ItemMetadataEntry2[], key: string): ItemMetadataEntry2 => {
    return entries.find((e: ItemMetadataEntry2) => e.key === key);
}

const filterFn = (changeClauses: ItemValueAndAttribute[], whenClauses: ItemValueOperatorAndAttribute[]) => (i: QueryI): boolean => {

    for (const whenClause of whenClauses) {
        const value: Value = whenClause.itemValue;
        const attribute: Attribute = whenClause.attribute;
        const operator: OperatorType = whenClause.operator;


    }
    return true;
}

const reg = (router: Router, registry: Registry) => {
   const p = `/view/:viewId/bulk-edit`;
   registry.addItem('POST', p);
   router.post(p, ...httpAction);
}

export default reg;
