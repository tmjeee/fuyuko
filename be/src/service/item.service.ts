import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {Item2, ItemMetadata2, ItemMetadataEntry2, ItemValue2} from "../server-side-model/server-side.model";
import {ItemImage, ItemSearchType, ItemValTypes, Value} from "../model/item.model";


export const updateItemValue = async (viewId: number, itemId: number, itemValue: ItemValue2) => {
    await doInDbConnection(async (conn: Connection) => {
        const q0: QueryResponse = await conn.query(`DELETE FROM TBL_ITEM_VALUE WHERE ITEM_ID=? AND VIEW_ATTRIBUTE_ID=?`, [itemId, itemValue.attributeId]);

        const q1: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_VALUE (ITEM_ID, VIEW_ATTRIBUTE_ID) VALUES (?,?)`, [itemId, itemValue.attributeId]);
        const newItemValueId: number = q1.insertId;

        for (const metadata of itemValue.metadatas) {
            const q2: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_VALUE_METADATA (ITEM_VALUE_ID, NAME) VALUE (?,?)`, [newItemValueId, metadata.name]);
            const newMetadataId: number = q2.insertId;

            for (const entry of metadata.entries) {
                const q3: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_VALUE_METADATA_ENTRY (ITEM_VALUE_METADATA_ID, \`KEY\`, \`VALUE\`, DATA_TYPE) VALUES (?,?,?,?)`,
                    [newMetadataId, entry.key, entry.value, entry.dataType]);
                const newMetadataEntryId = q3.insertId;
            }
        }
    });
}

export const updateItem = async (viewId: number, item2: Item2) => {
    await doInDbConnection(async (conn: Connection) => {
        return await _updateItem(conn, viewId, item2);
    });
}
const _updateItem = async (conn: Connection, viewId: number, item2: Item2): Promise<string[]> => {
    const errors: string[] = [];
    const itemId: number = item2.id;
    const name: string = item2.name;
    const description: string = item2.description;

    const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_ITEM WHERE ID=?`, [itemId]);
    if (qq[0].COUNT <= 0) { // item with id do not exists
        errors.push(`Item with id ${itemId} do not exists`);
    } else {
        const q: QueryResponse = await conn.query(`UPDATE TBL_ITEM SET NAME=? , DESCRIPTION=? WHERE STATUS='ENABLED' AND ID=?`,[ name, description, itemId]);

        for (const itemValue of  item2.values) {

            const q0: QueryResponse = await conn.query(`DELETE FROM TBL_ITEM_VALUE WHERE ITEM_ID=? AND VIEW_ATTRIBUTE_ID=?`, [itemId, itemValue.attributeId]);

            const q1: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_VALUE (ITEM_ID, VIEW_ATTRIBUTE_ID) VALUES (?,?)`, [itemId, itemValue.attributeId]);
            const newItemValueId: number = q1.insertId;

            for (const metadata of itemValue.metadatas) {
                const q2: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_VALUE_METADATA (ITEM_VALUE_ID, NAME) VALUE (?,?)`, [newItemValueId, metadata.name]);
                const newMetadataId: number = q2.insertId;

                for (const entry of metadata.entries) {
                    const q3: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_VALUE_METADATA_ENTRY (ITEM_VALUE_METADATA_ID, \`KEY\`, \`VALUE\`, DATA_TYPE) VALUES (?,?,?,?)`,
                        [newMetadataId, entry.key, entry.value, entry.dataType]);
                    const newMetadataEntryId = q3.insertId;
                }
            }
        }

        for (const child of item2.children) {
            const  errs: string[] = await _addOrUpdateItem(conn, viewId, child);
            errors.push(...errs);
        }
    }

    return errors;
}

export const addItem = async (viewId: number, item2: Item2): Promise<string[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        return await _addItem(conn, viewId, item2);
    });
}
const _addItem = async (conn: Connection, viewId: number, item2: Item2): Promise<string[]> => {
    const errors: string[] = [];
    const name: string = item2.name;
    const description: string = item2.description;
    const parentId: number = item2.parentId ? item2.parentId : null;

    const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_ITEM WHERE NAME=? AND VIEW_ID=?`, [name, viewId]);
    if (qq[0].COUNT > 0) { // item with name already exists in view
        errors.push(`Item with name ${name} already exists in view id ${viewId}`);
    } else {
        const q: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM (PARENT_ID, VIEW_ID, NAME, DESCRIPTION, STATUS) VALUES (?,?,?,?,'ENABLED')`,[parentId, viewId, name, description]);
        const newItemId: number = q.insertId;

        for (const itemValue of item2.values) {
            const q1: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_VALUE (ITEM_ID, VIEW_ATTRIBUTE_ID) VALUES (?,?)`, [newItemId, itemValue.attributeId]);
            const newItemValueId: number = q1.insertId;

            for (const metadata of itemValue.metadatas) {
                const q2: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_VALUE_METADATA (ITEM_VALUE_ID, NAME) VALUE (?,?)`, [newItemValueId, metadata.name]);
                const newMetadataId: number = q2.insertId;

                for (const entry of metadata.entries) {
                    const q3: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_VALUE_METADATA_ENTRY (ITEM_VALUE_METADATA_ID, \`KEY\`, \`VALUE\`, DATA_TYPE) VALUES (?,?,?,?)`,
                        [newMetadataId, entry.key, entry.value ? entry.value : '', entry.dataType]);
                }
            }
        }

        for (const child of item2.children) {
            child.parentId = newItemId;
            const errs: string[] = await _addOrUpdateItem(conn, viewId, child);
            errors.push(...errs);
        }
    }
    return errors;
}

const _addOrUpdateItem = async (conn: Connection, viewId: number, item2: Item2): Promise<string[]> => {
    if (item2.id > 0) {
        return await _updateItem(conn, viewId, item2);
    } else {
        return await _addItem(conn, viewId, item2);
    }
}

export const addOrUpdateItem = async (viewId: number, item2: Item2): Promise<string[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        return await _addOrUpdateItem(conn, viewId, item2);
    }) ;
}

const SQL_1_A = `
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
                    IMG.\`PRIMARY\` AS IMG_PRIMARY
                FROM TBL_ITEM AS I
                LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
                LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.ID = V.VIEW_ATTRIBUTE_ID
                LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
                WHERE I.VIEW_ID = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' 
`;

const SQL_1_B = `${SQL_1_A} AND I.PARENT_ID IS NULL`;

const SQL_2_A = `${SQL_1_A} AND I.ID IN ?`;

const SQL_2_B = `${SQL_2_A} AND I.PARENT_ID IS NULL`;


const SQL_SEARCH = ` 
    SELECT DISTINCT
       I.ID AS I_ID
    FROM TBL_ITEM AS I
    LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID
    LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
    LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
    LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.ID = V.VIEW_ATTRIBUTE_ID
    LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
    WHERE I.VIEW_ID = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' 
    AND I.PARENT_ID IS NULL
    AND (I.NAME LIKE ? OR 
         I.DESCRIPTION LIKE ? OR
         (E.KEY = 'value' AND E.VALUE LIKE ?)
    ) 
`

export const searchForItemsInView = async (viewId: number, searchType: ItemSearchType, search: string) => {
    // todo: support advance search type
    const iSearch = `%${search}%`;
    const itemIds: number[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_SEARCH, [viewId, iSearch, iSearch, iSearch]);
        return q.reduce((acc: number[], curr: QueryI) => {
            acc.push(curr.I_ID)
            return acc;
        }, []);
    });

    if (itemIds.length) {
        const item2s: Item2[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`${SQL_2_B}`, [viewId, itemIds]);
            return _doQ(q);
        });
        await w(viewId, item2s);
        return item2s;
    }
    return [];
};


export const getAllItemsInView = async (viewId: number, parentOnly: boolean = true): Promise<Item2[]> => {
    const item2s: Item2[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(parentOnly ? SQL_1_B : SQL_1_A, [viewId]);
        return _doQ(q);
    });

    await w(viewId, item2s);
    return item2s;
}

export const getItemsByIds = async (viewId: number, itemIds: number[], parentOnly: boolean = true): Promise<Item2[]> => {
    const item2s: Item2[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(parentOnly ? SQL_2_B : SQL_2_A, [viewId, itemIds]);

        return _doQ(q);
    });

    await w(viewId, item2s);
    return item2s;
}

export const getItemById = async (viewId: number, itemId: number): Promise<Item2> => {

    const item2s: Item2[] = await doInDbConnection(async (conn: Connection) => {
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
                    IMG.SIZE AS IMG_SIZE,
                    IMG.\`PRIMARY\` AS IMG_PRIMARY
                FROM TBL_ITEM AS I
                LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
                LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.ID = V.VIEW_ATTRIBUTE_ID
                LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
                WHERE I.ID = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' 
            `, [itemId]);

        return _doQ(q);
    });


    await w(viewId, item2s);
    return (item2s && item2s.length > 0 ? item2s[0] : undefined);
}

// work out the children in each item
const w = async (viewId: number, item2s: Item2[]) => {
    for (const item2 of item2s) {
        const itemId: number = item2.id;
        item2.children = await findChildrenItems(viewId, itemId);
    }
}

export const findChildrenItems = async (viewId: number, parentItemId: number): Promise<Item2[]> => {

    const item2s: Item2[] =  await doInDbConnection(async (conn: Connection) => {

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
                    IMG.\`PRIMARY\` AS IMG_PRIMARY
                FROM TBL_ITEM AS I
                LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
                LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.ID = V.VIEW_ATTRIBUTE_ID
                LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
                WHERE I.VIEW_ID = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' AND I.PARENT_ID = ?
            `, [viewId, parentItemId]);

        return _doQ(q);
    });


    for (const item2 of item2s) {
        const itemId: number = item2.id;
        item2.children = await findChildrenItems(viewId, itemId);
    }

    return item2s;

}

// for findChildrenItems(...) and findItemById(...) only
const _doQ = (q: QueryA): Item2[] => {

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
                creationDate: c.I_CREATION_DATE,
                lastUpdate: c.I_LAST_UPDATE,
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
