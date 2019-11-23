import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {PoolConnection} from "mariadb";
import {
    AreaValue, CurrencyValue, DateValue,
    DimensionValue, DoubleSelectValue, HeightValue,
    Item, ItemImage,
    ItemValTypes, LengthValue,
    NumberValue, SelectValue,
    StringValue,
    TextValue,
    Value, VolumeValue, WidthValue
} from "../../model/item.model";
import {Attribute, DEFAULT_DATE_FORMAT, DEFAULT_NUMERIC_FORMAT} from "../../model/attribute.model";
import {Item2, ItemMetadata2, ItemMetadataEntry2, ItemValue2} from "../model/ss-attribute.model";
import {convert} from "../../service/item-conversion.service";
import {findChildrenItems} from "../../service/item.service";

const httpAction: any[] = [
   [
       check('viewId').exists().isNumeric()
   ],
   validateMiddlewareFn,
   validateJwtMiddlewareFn,
   async(req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);

        await doInDbConnection(async (conn: PoolConnection) => {

            const q: QueryA = await conn.query(`
                SELECT
                    I.ID AS I_ID,
                    I.PARENT_ID AS I_PARENT_ID,
                    I.VIEW_ID AS I_VIEW_ID,
                    I.NAME AS I_NAME,
                    I.DESCRIPTION AS I_DESCRIPTION,
                    I.STATUS AS I_STATUS,
                    A.ID AS A_ID,
                    A.TYPE AS A_TYPE,
                    A.NAME AS A_NAME,
                    A.STATUS AS A_STATUS,
                    A.DESCRIPTION AS A_DESCRIPTION,
                    V.ID AS V_ID,
                    M.ID AS M_ID,
                    M.NAME AS M_NAME,
                    E.ID AS E_ID,
                    E.KEY AS E_KEY,
                    E.VALUE AS E_VALUE,
                    E.DATA_TYPE AS E_DATA_TYPE,
                    IMG.ID AS IMG_ID,
                    IMG.MIME_TYPE AS IMG_MIME_TYPE,
                    IMG.NAME AS IMG_NAME,
                    IMG.SIZE AS IMG_SIZE
                FROM TBL_ITEM AS I
                LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
                LEFT JOIN TBL_ITEM_ATTRIBUTE AS A ON A.ID = V.ITEM_ATTRIBUTE_ID
                LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
                WHERE I.VIEW_ID = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' AND I.PARENT_ID IS NULL
            `, [viewId]);

            const itemMap:  Map<string  /* itemId */,                                            Item2> = new Map();
            const imgMap:   Map<string  /* itemId_imageId */,                                    ItemImage> = new Map();
            const valueMap: Map<string  /* itemId_attributeId_valueId */,                        ItemValue2> = new Map();
            const metaMap:  Map<string  /* itemId_attributeId_valueId_metadataId> */,            ItemMetadata2> = new Map();
            const entMap:   Map<string  /* itemId_attributeId_valueId_metadataId_entryId */,     ItemMetadataEntry2> = new Map();

            const allItems2: Item2[] = [];
            for (const c of q) {

                const itemId: number = c.I_ID;
                const itemMapKey: string = `${itemId}`;

                const attributeId: number = c.A_ID;
                const attributeType: string = c.A_TYPE;
                const valueId: number = c.V_ID;
                const valueMapKey: string = `${itemId}_${attributeId}_${valueId}`;

                const metadataId: number = c.M_ID;
                const metaMapKey = `${itemId}_${attributeId}_${valueId}_${metadataId}`;

                const entryId: number = c.E_ID;
                const entryMapKey = `${itemId}_${attributeId}_${metadataId}_${entryId}`;

                const imageId: number = c.IMG_ID;
                const imgMapKey: string = `${itemId}_${imageId}`;


                if (!itemMap.has(itemMapKey)) {
                    const children: Item2[] = await findChildrenItems(viewId, itemId);
                    const item: Item2 = {
                        id: itemId,
                        parentId: c.I_PARENT_ID,
                        name: c.I_NAME,
                        description: c.I_DESCRIPTION,
                        images: [],
                        values: [],
                        children
                    } as Item2;

                    itemMap.set(itemMapKey, item);
                    allItems2.push(item);
                }

                if (!imgMap.has(imgMapKey)) {
                    const img: ItemImage = {
                        id: imageId,
                        name: c.IMG_NAME,
                        mimeType: c.IMG_MIMETYPE,
                        size: c.IMG_SIZE
                    } as ItemImage;
                    imgMap.set(imgMapKey, img);
                    const item: Item2 = itemMap.get(itemMapKey);
                    item.images.push(img);
                }

                if (!valueMap.has(valueMapKey)) {
                    const itemValue: ItemValue2 = {
                        id: valueId,
                        attributeId,
                        metadatas: []
                    } as ItemValue2;
                    valueMap.set(valueMapKey, itemValue);
                    const item: Item2 = itemMap.get(itemMapKey);
                    item.values.push(itemValue);
                }

                if (!metaMap.has(metaMapKey)) {
                    const itemMetadata: ItemMetadata2 = {
                        id: metadataId,
                        name: c.M_NAME,
                        attributeId,
                        attributeType: c.A_TYPE,
                        entries: []
                    } as ItemMetadata2;
                    metaMap.set(metaMapKey, itemMetadata);
                    const value: ItemValue2 = valueMap.get(valueMapKey);
                    value.metadatas.push(itemMetadata);
                }

                if (!entMap.has(entryMapKey)) {
                    const entry: ItemMetadataEntry2 = {
                        id: entryId,
                        key: c.E_KEY,
                        value: c.E_VALUE,
                        dataType: c.E_DATA_TYPE
                    };
                    entMap.set(entryMapKey, entry);
                    const meta: ItemMetadata2 = metaMap.get(metaMapKey);
                    meta.entries.push(entry);
                }
            }


            const allItems: Item[] = convert(allItems2);
            res.status(200).json(allItems);
        });
   }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/items`;
    registry.addItem('GET',p);
    router.get(p, ...httpAction);
};

export default reg;
