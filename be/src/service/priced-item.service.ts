import {ItemImage, PricedItem} from "../model/item.model";
import {Item2, ItemMetadata2, ItemMetadataEntry2, ItemValue2, PricedItem2} from "../server-side-model/server-side.model";
import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";
import {findChildrenItem2s} from "./item.service";
import {itemValueConvert} from "./conversion-item-value.service";

export const toPricedItems = (p: PricedItem2[]): PricedItem[] => {
    return p.map(toPricedItem);
}

export const toPricedItem = (p2: PricedItem2): PricedItem => {
    const p: PricedItem = {
        id: p2.id,
        name: p2.name,
        description: p2.description,
        parentId: p2.parentId,
        images: p2.images,
        country: p2.country,
        price: p2.price,
        creationDate: p2.creationDate,
        lastUpdate: p2.lastUpdate,
        children: toPricedItems(p2.children)
    };
    p2.values.reduce((p: PricedItem, i: ItemValue2) => {
        p[i.attributeId] = itemValueConvert(i);
        return p;
    }, p);
    return p;
}

export const getPricedItems = async (pricingStructureId: number): Promise<PricedItem2[]> => {
    const item2s: PricedItem2[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`
                SELECT
                    I.ID AS I_ID,
                    I.PARENT_ID AS I_PARENT_ID,
                    I.VIEW_ID AS I_VIEW_ID,
                    I.NAME AS I_NAME,
                    I.DESCRIPTION AS I_DESCRIPTION,
                    I.STATUS AS I_STATUS,
                    I.CREATION_DATE AS I_CREATION_DATE,
                    I.LAST_UPDATE AS I_LAST_UPDATE,
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
                    IMG.SIZE AS IMG_SIZE,
                    IMG.\`PRIMARY\` AS IMG_PRIMARY,
                    PSI.ITEM_ID AS PSI_ITEM_ID,
                    PSI.PRICING_STRUCTURE_ID AS PSI_PRICING_STRUCTURE_ID,
                    PSI.COUNTRY AS PSI_COUNTRY,
                    PSI.PRICE AS PSI_PRICE
                FROM TBL_ITEM AS I
                LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.VIEW_ID = I.VIEW_ID
                LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID AND V.VIEW_ATTRIBUTE_ID = A.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
                LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
                LEFT JOIN TBL_PRICING_STRUCTURE_ITEM AS PSI ON PSI.ITEM_ID = I.ID
                LEFT JOIN TBL_PRICING_STRUCTURE AS PS ON PS.ID = PSI.PRICING_STRUCTURE_ID
                WHERE PSI.PRICING_STRUCTURE_ID = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' AND PS.STATUS = 'ENABLED'
            `, [pricingStructureId]);

        return _doQ(q);
    });


    for (const item2 of item2s) {
        const itemId: number = item2.id;
        item2.children = await getChildrenPricedItems(pricingStructureId, itemId);
    }

    return item2s;
}

export const getChildrenPricedItems = async (pricingStructureId: number, parentItemId: number): Promise<PricedItem2[]> => {

    const item2s: PricedItem2[] =  await doInDbConnection(async (conn: Connection) => {

        const q: QueryA = await conn.query(`
                SELECT
                    I.ID AS I_ID,
                    I.PARENT_ID AS I_PARENT_ID,
                    I.VIEW_ID AS I_VIEW_ID,
                    I.NAME AS I_NAME,
                    I.DESCRIPTION AS I_DESCRIPTION,
                    I.STATUS AS I_STATUS,
                    I.CREATION_DATE AS I_CREATION_DATE,
                    I.LAST_UPDATE AS I_LAST_UPDATE,
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
                    IMG.SIZE AS IMG_SIZE,
                    IMG.\`PRIMARY\` AS IMG_PRIMARY,
                    PSI.ID AS PSI_ID,
                    PSI.ITEM_ID AS PSI_ITEM_ID,
                    PSI.PRICING_STRUCTURE_ID AS PSI_PRICING_STRUCTURE_ID,
                    PSI.COUNTRY AS PSI_COUNTRY,
                    PSI.PRICE AS PSI_PRICE
                FROM TBL_ITEM AS I
                LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.VIEW_ID = I.VIEW_ID
                LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID AND V.VIEW_ATTRIBUTE_ID = A.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
                LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
                LEFT JOIN TBL_PRICING_STRUCTURE_ITEM AS PSI ON PSI.ITEM_ID = I.ID
                LEFT JOIN TBL_PRICING_STRUCTURE AS PS ON PS.ID = PSI.PRICING_STRUCTURE_ID
                WHERE PSI.PRICING_STRUCTURE_ID = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' AND PS.STATUS = 'ENABLED' AND I.PARENT_ID = ?
            `, [pricingStructureId, parentItemId]);

        return _doQ(q);
    });


    for (const item2 of item2s) {
        const itemId: number = item2.id;
        item2.children = await getChildrenPricedItems(pricingStructureId, itemId);
    }

    return item2s;
}

const _doQ = (q: QueryA): PricedItem2[] => {

    const itemMap:  Map<string  /* itemId */,                                            Item2> = new Map();
    const imgMap:   Map<string  /* itemId_imageId */,                                    ItemImage> = new Map();
    const valueMap: Map<string  /* itemId_attributeId_valueId */,                        ItemValue2> = new Map();
    const metaMap:  Map<string  /* itemId_attributeId_valueId_metadataId> */,            ItemMetadata2> = new Map();
    const entMap:   Map<string  /* itemId_attributeId_valueId_metadataId_entryId */,     ItemMetadataEntry2> = new Map();

    const allItems2: PricedItem2[] =  q.reduce((acc: PricedItem2[], c: QueryI) => {

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
            const item: PricedItem2 = {
                id: itemId,
                parentId: c.I_PARENT_ID,
                name: c.I_NAME,
                description: c.I_DESCRIPTION,
                creationDate: c.I_CREATION_DATE,
                lastUpdate: c.I_LAST_UPDATE,
                images: [],
                values: [],
                children: [],
                price: c.PSI_PRICE,
                country: c.PSI_COUNTRY
            } as PricedItem2;

            itemMap.set(itemMapKey, item);
            acc.push(item);
        }

        if (!imgMap.has(imgMapKey)) {
            const img: ItemImage = {
                id: imageId,
                name: c.IMG_NAME,
                mimeType: c.IMG_MIMETYPE,
                size: c.IMG_SIZE,
                primary: c.IMG_PRIMARY,
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
}
