import {ItemImage, PricedItem} from '@fuyuko-common/model/item.model';
import {Item2, ItemMetadata2, ItemMetadataEntry2, ItemValue2, PricedItem2} from '../server-side-model/server-side.model';
import {doInDbConnection, QueryA, QueryI} from '../db';
import {Connection} from 'mariadb';
import {fireEvent, GetPricedItemsEvent} from './event/event.service';
import {pricedItemsConvert} from './conversion-priced-item.service';
import {View} from "@fuyuko-common/model/view.model";
import {PricingStructure} from "@fuyuko-common/model/pricing-structure.model";

class PricedItemService {

    /**
     *  =======================================
     *  === getPricingStructureOfPricedItem ===
     *  =======================================
     */
    async getPricingStructureOfPricedItem(pricedItemId: number): Promise<PricingStructure> {
        return await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT 
                    PS.ID AS PS_ID,
                    PS.VIEW_ID AS PS_VIEW_ID,
                    PS.NAME AS PS_NAME,
                    PS.DESCRIPTION AS PS_DESCRIPTION,
                    PS.STATUS AS PS_STATUS,
                    PS.CREATION_DATE AS PS_CREATION_DATE,
                    PS.LAST_UPDATE AS PS_LAST_UPDATE,
                    V.NAME AS V_NAME
                FROM TBL_PRICING_STRUCTURE AS PS 
                INNER JOIN TBL_PRICING_STRUCTURE_ITEM  AS PSI ON PSI.PRICING_STRUCTURE_ID = PS.ID
                INNER JOIN TBL_VIEW AS V ON V.ID = PS.VIEW_ID
                WHERE PSI.ID = ?
            `, [pricedItemId]);
            if (q.length) {
                const ps: PricingStructure = {
                    id: q[0].PS_ID,
                    name: q[0].PS_NAME,
                    description: q[0].PS_DESCRIPTION,
                    viewId: q[0].PS_VIEW_ID,
                    status: q[0].PS_STATUS,
                    viewName: q[0].V_NAME,
                    creationDate: q[0].PS_CREATION_DATE,
                    lastUpdate: q[0].PS_LAST_UPDATE,
                }
                return ps;
            }
            return null
        });
    }


    /**
     *  ==============================
     *  === getPricedItems ===
     *  ==============================
     */
    async getViewOfPriceItem(priceItemId: number): Promise<View> {
        return await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT 
                   V.ID AS V_ID,
                   V.NAME AS V_NAME,
                   V.DESCRIPTION AS V_DESCRIPTION,                     
                   V.CREATION_DATE AS V_CREATION_DATE,
                   V.LAST_UPDATE AS V_LAST_UPDATE
                FROM TBL_VIEW AS V 
                INNER JOIN TBL_PRICING_STRUCTURE AS PS ON PS.VIEW_ID = V.ID
                INNER JOIN TBL_PRICING_STRUCTURE_ITEM AS PSI ON PSI.PRICING_STRUCTURE_ID = PS.ID
                WHERE PSI.ID = ?
            `, [priceItemId]);
            if (q.length > 0) {
                const view: View = {
                    id: q[0].V_ID,
                    name: q[0].V_NAME,
                    description: q[0].V_DESCRIPTION,
                    creationDate: q[0].V_CREATION_DATE,
                    lastUpdate: q[0].V_LAST_UPDATE,
                };
                return view;
            }
            return null;
        });
    }

    /**
     *  ==============================
     *  === getPricedItem ===
     *  ==============================
     */
    async getPricedItem(pricedItemId: number): Promise<PricedItem | undefined> {
        const pricedItem2: PricedItem2 | undefined = await this.getPricedItem2(pricedItemId);
        if (pricedItem2) {
            const pricedItems: PricedItem[] = pricedItemsConvert([pricedItem2]);
            return pricedItems[0];
        }
        return undefined;
    }
    async getPricedItem2(priceItemId: number): Promise<PricedItem2 | undefined> {
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
                WHERE PSI.ID = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' AND PS.STATUS = 'ENABLED'
            `, [priceItemId]);

            return this._doQ(q);
        });
        if (item2s && item2s.length) {
            return item2s[0];
        }
        return undefined;
    }



    /**
     *  ==============================
     *  === getPricedItems ===
     *  ==============================
     */
    async getPricedItems(pricingStructureId: number): Promise<PricedItem[]> {
        const pricedItem2s: PricedItem2[] = await getPricedItem2s(pricingStructureId);
        const pricedItems: PricedItem[] = pricedItemsConvert(pricedItem2s);
        fireEvent({
            type: 'GetPricedItemsEvent',
            pricingStructureId,
            pricedItems
        } as GetPricedItemsEvent);
        return pricedItems;
    };
    async getPricedItem2s(pricingStructureId: number): Promise<PricedItem2[]> {
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

            return this._doQ(q);
        });

        for (const item2 of item2s) {
            const itemId: number = item2.id;
            item2.children = await getChildrenPricedItems(pricingStructureId, itemId);
        }

        return item2s;
    }
    async getChildrenPricedItems(pricingStructureId: number, parentItemId: number): Promise<PricedItem2[]> {

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

            return this._doQ(q);
        });


        for (const item2 of item2s) {
            const itemId: number = item2.id;
            item2.children = await getChildrenPricedItems(pricingStructureId, itemId);
        }

        return item2s;
    }


    // === helper functions ================
    private _doQ(q: QueryA): PricedItem2[] {

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
                const item: Item2 | undefined = itemMap.get(itemMapKey);
                if (item) {
                    item.images.push(img);
                }
            }

            if (!valueMap.has(valueMapKey)) {
                const itemValue: ItemValue2 = {
                    id: valueId,
                    attributeId,
                    metadatas: []
                } as ItemValue2;
                valueMap.set(valueMapKey, itemValue);
                const item: Item2 | undefined = itemMap.get(itemMapKey);
                if (item) {
                    item.values.push(itemValue);
                }
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
                const value: ItemValue2 | undefined = valueMap.get(valueMapKey);
                if (value) {
                    value.metadatas.push(itemMetadata);
                }
            }

            if (!entMap.has(entryMapKey)) {
                const entry: ItemMetadataEntry2 = {
                    id: entryId,
                    key: c.E_KEY,
                    value: c.E_VALUE,
                    dataType: c.E_DATA_TYPE
                };
                entMap.set(entryMapKey, entry);
                const meta: ItemMetadata2 | undefined = metaMap.get(metaMapKey);
                if (meta) {
                    meta.entries.push(entry);
                }
            }

            return acc;
        }, []);

        return allItems2;
    }
}

const s = new PricedItemService();
export const
    getPricingStructureOfPricedItem = s.getPricingStructureOfPricedItem.bind(s),
    getPricedItem = s.getPricedItem.bind(s),
    getPricedItems = s.getPricedItems.bind(s),
    getPricedItem2s = s.getPricedItem2s.bind(s),
    getViewOfPriceItem = s.getViewOfPriceItem.bind(s),
    getChildrenPricedItems = s.getChildrenPricedItems.bind(s);
