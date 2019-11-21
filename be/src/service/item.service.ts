import {doInDbConnection, QueryA, QueryI} from "../db";
import {PoolConnection} from "mariadb";
import {Item2, ItemMetadata2, ItemMetadataEntry2, ItemValue2} from "../route/model/ss-attribute.model";
import {Item, ItemImage} from "../model/item.model";
import {convert} from "./item-conversion.service";


export const findChildrenItems = async (viewId: number, parentItemId: number): Promise<Item2[]> => {

    const item2s: Item2[] =  await doInDbConnection(async (conn: PoolConnection) => {

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
                WHERE I.VIEW_ID = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' AND I.PARENT_ID IS ?
            `, [viewId, parentItemId]);

        const itemMap:  Map<string  /* itemId */,                                            Item2> = new Map();
        const imgMap:   Map<string  /* itemId_imageId */,                                    ItemImage> = new Map();
        const valueMap: Map<string  /* itemId_attributeId_valueId */,                        ItemValue2> = new Map();
        const metaMap:  Map<string  /* itemId_attributeId_valueId_metadataId> */,            ItemMetadata2> = new Map();
        const entMap:   Map<string  /* itemId_attributeId_valueId_metadataId_entryId */,     ItemMetadataEntry2> = new Map();

        const allItems2: Item2[] =  q.reduce((acc: Item2[], c: QueryI) => {

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
                const item: Item2 = {
                    id: itemId,
                    parentId: c.I_PARENT_ID,
                    name: c.I_NAME,
                    description: c.I_DESCRIPTION,
                    images: [],
                    values: [],
                    children: []
                } as Item2;

                itemMap.set(itemMapKey, item);
                acc.push(item);
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

            return acc;
        }, []);

        return allItems2;
    });


    for (const item2 of item2s) {
        const itemId: number = item2.id;
        item2.children = await findChildrenItems(viewId, itemId);
    }

    return item2s;

}