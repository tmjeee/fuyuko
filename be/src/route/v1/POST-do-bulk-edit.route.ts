import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {PoolConnection} from "mariadb";
import {param} from 'express-validator';
import {ItemValueAndAttribute, ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import {AreaValue, ItemValTypes, NumberValue, StringValue, TextValue, Value} from "../../model/item.model";
import {Attribute} from "../../model/attribute.model";
import {OperatorType} from "../../model/operator.model";
import {BulkEditItem, BulkEditPackage} from "../../model/bulk-edit.model";
import {ItemMetadata2, ItemMetadataEntry2} from "../model/ss-attribute.model";
import {toItemValTypes} from "../../service/item-conversion.service";
import {encodeXText} from "nodemailer/lib/shared";
import {Operator} from "semver";
import numeral from "numeral";

interface BulkEditItem2 {
    id: number;  // itemId
    name: string;
    description: string;
    parentId: number;
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

      await doInDbConnection(async (conn: PoolConnection) => {

        const changeClauses: ItemValueAndAttribute[] = req.body.changeClauses;
        const whenClauses: ItemValueOperatorAndAttribute[] = req.body.whereClauses;

        let exp = '';
        for (const itemValueOperatorAndAttribute of whenClauses) {
           const value: Value = itemValueOperatorAndAttribute.itemValue;
           const attribute: Attribute = itemValueOperatorAndAttribute.attribute;
           const operator: OperatorType = itemValueOperatorAndAttribute.operator;

           exp += `A.ID = '${attribute.id}' `;
           exp += `AND IE.VALUE `;
           constructExp(operator, value, exp);
        }

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
            IE.DATA_TYPE AS IE_DATA_TYPE
           
           FROM TBL_ITEM AS I
           LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID
           LEFT JOIN TBL_ITEM_ATTRIBUTE AS A ON A.ID = V.ITEM_ATTRIBUTE_ID
           LEFT JOIN TBL_ITEM_VALUE_METADATA AS IM ON IM.ITEM_VALUE_ID = V.ID
           LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS IE ON IE.ITEM_VALUE_METADATA_ID = IM.ID
           LEFT JOIN TBL_ITEM_ATTRIBUTE_METADATA AS AM ON AM.ITEM_ATTRIBUTE_ID = A.ID
           LEFT JOIN TBL_ITEM_ATTRIBUTE_METADATA_ENTRY AS AE ON AE.ITEM_ATTRIBUTE_METADATA_ID = AM.ID
           WHERE I.STATUS = 'ENABLED'
        `);


        const iMap: Map<string /* itemId */, BulkEditItem2> = new Map();
        const itemAttValueMetaMap: Map<string /* itemId_attributeId_metaId */, ItemMetadata2> = new Map();
        const itemAttValueMetaEntryMap: Map<string /* itemId_attributeId_metaId_entryId */, ItemMetadataEntry2> = new Map();

        const bulkEditItem2s: BulkEditItem2[] = q.reduce((acc: BulkEditItem2[], i: QueryI) => {

            const itemId: number = i.I_ID;
            const attributeId: number = i.A_ID;
            const metaId: number = i.IM_ID;
            const entryId: number = i.IE_ID;

            const iMapKey: string = `${itemId}`;
            const itemAttValueMetaMapKey: string = `${itemId}_${attributeId}_${metaId}`;
            const itemAttValueMetaEntryMapKey: string = `${itemId}_${attributeId}_${metaId}_${entryId}`;


            if (!iMap.has(iMapKey)) {
                const item: BulkEditItem2 = {
                    id: i.I_ID,
                    name: i.I_NAME,
                    description: i.I_DESCRIPTION,
                    parentId: i.I_PARENTID,
                    metadatas: [],
                    children: []
                } as BulkEditItem2;
                iMap.set(iMapKey, item);
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


        bulkEditItem2s.filter((b: BulkEditItem2) => {
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
                                const u1: string = (value.val as AreaValue).unit;

                                const v2: number = Number((eValue.value));
                                const u2: string = (eUnit.value);

                                const vv1: number = converToCm(v1, u1);
                                const vv2: number = convertToCm(v2,u2);

                                return compare(vv1, vv2, operator);
                            }
                            case "currency": {

                                break;
                            }
                            case "date": {

                                break;
                            }
                            case "dimension": {

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

            }
        });


        const r = {
           changeAttributes: [],
           whenAttributes: [],
           bulkEditItems: []
        } as BulkEditPackage
      });
   }
]


const compare = (a: any, b: any, operator: OperatorType): boolean => {

    switch (operator) { // construct operator
        case "empty":
            exp += ` = '' `;
            break;
        case "eq":
            exp += ` = `;
            constructValue(operator, value, exp);
            break;
        case "gt":
            exp += ` > `;
            constructValue(operator, value, exp);
            break;
        case "gte":
            exp += ` >= `;
            constructValue(operator, value, exp);
            break;
        case "lt":
            exp += ` < `;
            constructValue(operator, value, exp);
            break;
        case "lte":
            exp += ` <= `;
            constructValue(operator, value, exp);
            break;
        case "not empty":
            exp += ` <> '' `;
            break;
        case "not eq":
            exp += ` <> `;
            constructValue(operator, value, exp);
            break;
        case "not gt":
            exp += `not >`
            break;
        case "not gte":
            break;
        case "not lt":
            break;
        case "not lte":
            break;
    }
}

const findEntry = (entries: ItemMetadataEntry2[], key: string): ItemMetadataEntry2 {
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
