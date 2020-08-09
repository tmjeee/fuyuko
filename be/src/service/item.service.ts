import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {
    Item2,
    ItemMetadata2,
    ItemMetadataEntry2,
    ItemValue2,
} from "../server-side-model/server-side.model";
import {Item, ItemImage, ItemSearchType, ItemValTypes, Value} from "../model/item.model";
import {LimitOffset} from "../model/limit-offset.model";
import {LIMIT_OFFSET} from "../util/utils";
import {itemValueRevert} from "./conversion-item-value.service";
import {itemConvert, itemRevert, itemsConvert} from "./conversion-item.service";
import {ENABLED, Status} from "../model/status.model";
import {
    AddFavouriteItemIdsEvent,
    AddItemEvent,
    AddOrUpdateItemEvent, 
    fireEvent, GetAllFavouritedItemsInViewEvent,
    GetAllFavouriteItemIdsInViewEvent, GetAllItemsInViewEvent, GetItemByIdEvent, GetItemByNameEvent, GetItemsByIdsEvent,
    RemoveFavouriteItemIdsEvent,
    SearchForFavouriteItemsInViewEvent,
    SearchForItemsInViewEvent,
    UpdateItemEvent,
    UpdateItemsStatusEvent,
    UpdateItemValueEvent
} from "./event/event.service";

//////////////////////// SQLs //////////////////////////////////////////////////////////////////

const SQL = `
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
                LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.VIEW_ID = ?
                LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID AND V.VIEW_ATTRIBUTE_ID = A.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
                LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
                WHERE I.ID IN ?
`;


const SQL_INNER = (ext: string, limitoffset?: LimitOffset) => `
     SELECT 
         I.ID AS ID
     FROM TBL_ITEM AS I 
     WHERE I.VIEW_ID = ? AND I.STATUS = 'ENABLED' ${ext ? ext : ''}
     ${LIMIT_OFFSET(limitoffset)}
`;

const SQL_COUNT = (ext: string) => `
   SELECT 
       COUNT(I.ID) AS COUNT
   FROM TBL_ITEM AS I 
   WHERE I.VIEW_ID = ? AND I.STATUS = 'ENABLED' ${ext ? ext : ''}
`;

const SQL_FAV_ITEMS_INNER = (ext: string, limitoffset?: LimitOffset) => `
     SELECT 
         I.ID AS ID
     FROM TBL_ITEM AS I 
     INNER JOIN TBL_FAVOURITE_ITEM AS F ON F.ITEM_ID = I.ID AND F.USER_ID = ?
     WHERE I.VIEW_ID = ? AND I.STATUS = 'ENABLED' ${ext ? ext : ''}
     ${LIMIT_OFFSET(limitoffset)}
`;

const SQL_FAV_ITEMS_INNER_COUNT = (ext: string) => `
    SELECT
        COUNT(I.ID) AS COUNT
    FROM TBL_ITEM AS I
    INNER JOIN TBL_FAVOURITE_ITEM AS F ON F.ITEM_ID = I.ID AND F.USER_ID = ?
    WHERE I.VIEW_ID = ? AND I.STATUS = 'ENABLED' ${ext ? ext : ''}
`;


const SQL_1_A = (limitoffset: LimitOffset) => SQL_INNER('', limitoffset);
const SQL_1_A_COUNT = () => SQL_COUNT('');

const SQL_1_B = (limitoffset: LimitOffset) => SQL_INNER(`AND I.PARENT_ID IS NULL`, limitoffset);
const SQL_1_B_COUNT = () => SQL_COUNT(`AND I.PARENT_ID IS NULL`);

const SQL_2_A = (limitoffset: LimitOffset) => SQL_INNER(`AND I.ID IN ?`, limitoffset);
const SQL_2_A_COUNT = () => SQL_COUNT(`AND I.ID IN ?`);

const SQL_2_B = (limitoffset: LimitOffset) => SQL_INNER(`AND I.ID IN ? AND I.PARENT_ID IS NULL`, limitoffset);
const SQL_2_B_COUNT = () => SQL_COUNT(`AND I.ID IN ? AND I.PARENT_ID IS NULL`);

const SQL_SEARCH = (limitOffset?: LimitOffset) => ` 
    SELECT DISTINCT
       I.ID AS I_ID
    FROM TBL_ITEM AS I
    LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.VIEW_ID = ?
    LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID AND V.VIEW_ATTRIBUTE_ID = A.ID
    LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
    LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
    LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
    WHERE I.VIEW_ID = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' 
    AND I.PARENT_ID IS NULL
    AND (I.NAME LIKE ? OR 
         I.DESCRIPTION LIKE ? OR
         (E.KEY = 'value' AND E.VALUE LIKE ?)
    ) 
    ${LIMIT_OFFSET(limitOffset)}
`;
const SQL_SEARCH_COUNT = () => ` 
    SELECT DISTINCT
       COUNT(DISTINCT I.ID) AS COUNT 
    FROM TBL_ITEM AS I
    LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.VIEW_ID = ?
    LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID AND V.VIEW_ATTRIBUTE_ID = A.ID
    LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
    LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
    LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
    WHERE I.VIEW_ID = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' 
    AND I.PARENT_ID IS NULL
    AND (I.NAME LIKE ? OR 
         I.DESCRIPTION LIKE ? OR
         (E.KEY = 'value' AND E.VALUE LIKE ?)
    ) 
`;

const SQL_FAV_ITEMS = (limitoffset: LimitOffset) => SQL_FAV_ITEMS_INNER(`AND I.PARENT_ID IS NULL`, limitoffset);
const SQL_FAV_ITEMS_COUNT = () => SQL_FAV_ITEMS_INNER_COUNT(``);
const SQL_FAV_ITEMS_SEARCH = (limitOffset?: LimitOffset) => ` 
    SELECT DISTINCT
       I.ID AS I_ID
    FROM TBL_ITEM AS I
    INNER JOIN TBL_FAVOURITE_ITEM AS F ON F.ITEM_ID = I.ID AND F.USER_ID = ?
    LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.VIEW_ID = ?
    LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID AND V.VIEW_ATTRIBUTE_ID = A.ID
    LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
    LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
    LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
    WHERE I.VIEW_ID = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' 
    AND I.PARENT_ID IS NULL
    AND (I.NAME LIKE ? OR 
         I.DESCRIPTION LIKE ? OR
         (E.KEY = 'value' AND E.VALUE LIKE ?)
    ) 
    ${LIMIT_OFFSET(limitOffset)}
`;
const SQL_FAV_ITEMS_SEARCH_COUNT = () => ` 
    SELECT DISTINCT
       COUNT(DISTINCT I.ID) AS COUNT
    FROM TBL_ITEM AS I
    INNER JOIN TBL_FAVOURITE_ITEM AS F ON F.ITEM_ID = I.ID AND F.USER_ID = ?
    LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.VIEW_ID = ?
    LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID AND V.VIEW_ATTRIBUTE_ID = A.ID
    LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
    LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
    LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
    WHERE I.VIEW_ID = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' 
    AND I.PARENT_ID IS NULL
    AND (I.NAME LIKE ? OR 
         I.DESCRIPTION LIKE ? OR
         (E.KEY = 'value' AND E.VALUE LIKE ?)
    ) 
`;

// updateItemsStatus  updateItemValue   updateItem   addItem  addOrUpdateItem  searchForFavouriteItemsInView   searchForItemsInView   addFavouriteItemIds  removeFavouriteItemIds  getAllFavouriteItemIdsInView   getAllFavouritedItemInView    getAllItemsInView    getItemsByIds    getItemById    getItemByName   findChildrenItems

/////////////////////////////////////////////////////////////////////////////////////////////////


// =============================
// === updateItemsStatus(...) ===
// =============================
export const updateItemsStatus = async (itemIds: number[], status: Status): Promise<string[]> => {
    const errors: string[] = await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = [];
        for (const itemId of itemIds) {
            // await conn.query(`UPDATE TBL_ITEM SET STATUS = ? WHERE ID=?`, [status,itemId]);
            if (itemId) {
                const errs: string[] = await updateItemStatus(conn, itemId, status);
                errors.push(...errs);
            }
        }
        return errors;
    });
    fireEvent({
       type: "UpdateItemsStatusEvent", 
       itemIds, status,
       errors 
    } as UpdateItemsStatusEvent);
    return errors;
};

// =============================
// === updateItemStatus(...) ===
// =============================
const updateItemStatus = async (conn: Connection, itemId: number, status: Status): Promise<string[]> => {
    const errors: string[] = [];
    if (itemId) {
        const q: QueryA = await conn.query(`SELECT ID FROM TBL_ITEM WHERE PARENT_ID=?`, [itemId]);
        for (const i of q) {
            const itemId: number = i.ID;
            const errs: string[] = await updateItemStatus(conn, itemId, status);
            errors.push (...errs);
        }
        const _q: QueryResponse = await conn.query(`UPDATE TBL_ITEM SET STATUS = ? WHERE ID=?`, [status, itemId]);
        if (_q.affectedRows <= 0) {
           errors.push(`Failed to update item id ${itemId} to status ${status}`);
        }
    }
    return errors;
};


// ============================
// === updateItemValue(...) ===
// ============================
export const updateItemValue = async (viewId: number, itemId: number, value: Value) => {
    const itemValue: ItemValue2 = itemValueRevert(value);
    await updateItemValue2(viewId, itemId, itemValue);
    fireEvent({
       type: "UpdateItemValueEvent",
       viewId, itemId, value 
    } as UpdateItemValueEvent);
}
const updateItemValue2 = async (viewId: number, itemId: number, itemValue: ItemValue2) => {
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


// ============================
// === updateItem(...) ===
// ============================
export const updateItem = async (viewId: number, item: Item): Promise<string[]> => {
   const item2: Item2 = itemRevert(item);
   const errors: string[] =  await updateItem2(viewId, item2);
  
   fireEvent({
      type: "UpdateItemEvent",
      viewId, item, errors 
   } as UpdateItemEvent);
   
   return errors;
}
const updateItem2 = async (viewId: number, item2: Item2): Promise<string[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        return await _updateItem2(conn, viewId, item2);
    });
}
const _updateItem2 = async (conn: Connection, viewId: number, item2: Item2): Promise<string[]> => {
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
            const  errs: string[] = await _addOrUpdateItem2(conn, viewId, child);
            errors.push(...errs);
        }
    }

    return errors;
}


// ============================
// === addItem(...) ===
// ============================
export const addItem = async (viewId: number, item: Item): Promise<string[]> => {
    const item2: Item2 = itemRevert(item);
    const errors: string[] =  await addItem2(viewId, item2);
   
    fireEvent({
       type: "AddItemEvent",
       viewId, item, errors, 
    } as AddItemEvent);
    
    return errors;
}
const addItem2 = async (viewId: number, item2: Item2): Promise<string[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        return await _addItem2(conn, viewId, item2);
    });
}
const _addItem2 = async (conn: Connection, viewId: number, item2: Item2): Promise<string[]> => {
    const errors: string[] = [];
    const name: string = item2.name;
    const description: string = item2.description;
    const parentId: number = item2.parentId ? item2.parentId : null;

    const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_ITEM WHERE NAME=? AND VIEW_ID=? AND STATUS='ENABLED' `, [name, viewId]);
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
            const errs: string[] = await _addOrUpdateItem2(conn, viewId, child);
            errors.push(...errs);
        }
    }
    return errors;
};



// ============================
// === addOrUpdateItem(...) ===
// ============================

export const addOrUpdateItem = async (viewId: number, item: Item): Promise<string[]> =>  {
    const item2: Item2 = itemRevert(item);
    const errors: string[] = await addOrUpdateItem2(viewId, item2);
   
    fireEvent({
        type: 'AddOrUpdateItemEvent',
        viewId, item, errors
    } as AddOrUpdateItemEvent);
    
    return errors;
}
export const addOrUpdateItem2 = async (viewId: number, item2: Item2): Promise<string[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        return await _addOrUpdateItem2(conn, viewId, item2);
    }) ;
}
const _addOrUpdateItem2 = async (conn: Connection, viewId: number, item2: Item2): Promise<string[]> => {
    if (item2.id > 0) {
        return await _updateItem2(conn, viewId, item2);
    } else {
        return await _addItem2(conn, viewId, item2);
    }
}

// ==========================================
// === searchForFavouriteItemsInView(...) ===
// ==========================================
export const searchForFavouriteItemsInViewCount = async (viewId: number, userId: number, searchType: ItemSearchType, search: string): Promise<number> => {
    // todo: support advance search type
    const iSearch = `%${search}%`;
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_FAV_ITEMS_SEARCH_COUNT(), [userId, viewId, viewId, iSearch, iSearch, iSearch]);
        return q[0].COUNT;
    });
};
export const searchForFavouriteItemsInView = async (viewId: number, userId: number, searchType: ItemSearchType, search: string, limitOffset?: LimitOffset): Promise<Item[]> => {
    const item2s: Item2[] = await searchForFavouriteItem2sInView(viewId, userId, searchType, search, limitOffset);
    const items: Item[] =  itemsConvert(item2s);
    fireEvent({
       type: "SearchForFavouriteItemsInViewEvent",
       viewId, userId, searchType, search, limitOffset, items 
    } as SearchForFavouriteItemsInViewEvent);
    return items;
};
export const searchForFavouriteItem2sInView = async (viewId: number, userId: number, searchType: ItemSearchType, search: string, limitOffset?: LimitOffset): Promise<Item2[]> => {
    // todo: support advance search type
    const iSearch = `%${search}%`;
    const itemIds: number[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_FAV_ITEMS_SEARCH(limitOffset), [userId, viewId, viewId, iSearch, iSearch, iSearch]);
        return q.reduce((acc: number[], curr: QueryI) => {
            acc.push(curr.I_ID)
            return acc;
        }, []);
    });
    if (itemIds.length) {
        const item2s: Item2[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(SQL, [viewId, itemIds]);
            return _doQ(q);
        });
        await w(viewId, item2s);
        return item2s;
    }
    return [];
};


// ======================================
// === searchForItemsInView(...) ===
// ======================================
export const searchForItemsInViewCount = async (viewId: number, searchType: ItemSearchType, search: string): Promise<number> => {
    const iSearch = `%${search}%`;
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_SEARCH_COUNT(), [viewId, viewId, iSearch, iSearch, iSearch])
        return q[0].COUNT;
    });
}
export const searchForItemsInView = async (viewId: number, searchType: ItemSearchType, search: string, limitOffset?: LimitOffset): Promise<Item[]> => {
    const item2s: Item2[] = await searchForItem2sInView(viewId, searchType, search, limitOffset);
    const items: Item[] =  itemsConvert(item2s);
    
    fireEvent({
       type: 'SearchForItemsInViewEvent',
       viewId, searchType, search, limitOffset, items 
    } as SearchForItemsInViewEvent);
    return items;
}
export const searchForItem2sInView = async (viewId: number, searchType: ItemSearchType, search: string, limitOffset?: LimitOffset): Promise<Item2[]> => {
    // todo: support advance search type
    const iSearch = `%${search}%`;
    const itemIds: number[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_SEARCH(limitOffset), [viewId, viewId, iSearch, iSearch, iSearch]);
        return q.reduce((acc: number[], curr: QueryI) => {
            acc.push(curr.I_ID)
            return acc;
        }, []);
    });

    if (itemIds.length) {
        const item2s: Item2[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(SQL, [viewId, itemIds]);
            return _doQ(q);
        });
        await w(viewId, item2s);
        return item2s;
    }
    return [];
};



// ================================
// === addFavouriteItemIds(...) ===
// ================================
export const addFavouriteItemIds = async (userId: number, itemIds: number[]): Promise<string[]> => {
    const errors: string[] =  await doInDbConnection(async(conn: Connection) => {
       const errors: string[] = [];
       for (const itemId of itemIds) {
           const qc: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_FAVOURITE_ITEM WHERE USER_ID = ? AND ITEM_ID = ?
           `, [userId, itemId]);
           const count: number = qc[0].COUNT;
           if (count <= 0) { // not yet added to favourite, we can now add it
              const r: QueryResponse = await conn.query(`
                INSERT INTO TBL_FAVOURITE_ITEM (USER_ID, ITEM_ID) VALUES (?,?)
              `, [userId, itemId])
              if(r.affectedRows <= 0) {
                  errors.push(`Failed to add favourite items`);
              }
           }
       }
       return errors;
    });
    
    fireEvent({
       type: "AddFavouriteItemIdsEvent",
       userId, itemIds, errors 
    } as AddFavouriteItemIdsEvent);
    
    return errors;
}


// ===================================
// === removeFavouriteItemIds(...) ===
// ===================================
export const removeFavouriteItemIds = async (userId: number, itemIds: number[]): Promise<string[]> => {
    const errors: string[] = await doInDbConnection(async(conn: Connection) => {
        const errors: string[] = [];
        for (const itemId of itemIds) {
            const qc: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_FAVOURITE_ITEM WHERE USER_ID = ? AND ITEM_ID = ?
           `, [userId, itemId]);
            const count: number = qc[0].COUNT;
            if (count > 0) { // already added to favourite, we can now remove it
                const r: QueryResponse = await conn.query(`
                DELETE FROM TBL_FAVOURITE_ITEM WHERE USER_ID = ? AND ITEM_ID = ?
              `, [userId, itemId])
                if(r.affectedRows <= 0) {
                    errors.push(`Failed to remove favourite items`);
                }
            }
        }
        return errors;
    });
   
    fireEvent({
       type: "RemoveFavouriteItemIdsEvent",
       userId, itemIds, errors 
    } as RemoveFavouriteItemIdsEvent);
    
    return errors;
}


// ============================================
// === getAllFavouriteItemIdsInView(...) ===
// ============================================
export const getAllFavouriteItemIdsInView = async (viewId: number, userId: number): Promise<number[]> => {
    const itemIds: number[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`
            SELECT 
                F.ID AS F_ID,
                F.USER_ID AS F_USER_ID,
                F.ITEM_ID AS F_ITEM_ID,
                I.VIEW_ID AS I_VIEW_ID
            FROM TBL_FAVOURITE_ITEM AS F
            LEFT JOIN TBL_ITEM AS I ON I.ID = F.ITEM_ID
            WHERE F.USER_ID = ? AND I.VIEW_ID = ? AND I.STATUS = ?
        `, [userId, viewId, ENABLED]);
        return q.reduce((acc: number[], i: QueryI) => {
           acc.push(i.F_ITEM_ID)
           return acc;
        }, []);
    });
   
    fireEvent({
       type: "GetAllFavouriteItemIdsInViewEvent",
       viewId, userId, itemIds 
    } as GetAllFavouriteItemIdsInViewEvent);
    
    return itemIds;
};




// ============================================
// === getAllFavouritedItemInView(...) ===
// ============================================
export const getAllFavouriteItemsInViewCount = async (viewId: number, userId: number): Promise<number> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_FAV_ITEMS_COUNT(), [userId, viewId]);
        return q[0].COUNT;
    });
};
export const getAllFavouriteItemsInView = async (viewId: number, userId: number, limitOffset?: LimitOffset): Promise<Item[]> => {
    const item2s: Item2[] = await getAllFavouriteItem2sInView(viewId, userId, limitOffset);
    const items: Item[] =  itemsConvert(item2s);
    fireEvent({
        type: "GetAllFavouritedItemsInViewEvent",
        viewId, userId, limitOffset, items
    } as GetAllFavouritedItemsInViewEvent);
    return items;
};
export const getAllFavouriteItem2sInView = async (viewId: number, userId: number, limitoffset?: LimitOffset): Promise<Item2[]> => {
    const item2s: Item2[] = await doInDbConnection(async (conn: Connection) => {
        const qq: QueryA = await conn.query(SQL_FAV_ITEMS(limitoffset), [userId, viewId]);
        const itemIds: number[] = qq.reduce((acc: number[], i: QueryI) => {
            acc.push(i.ID);
            return acc;
        }, []);
        const q: QueryA = await conn.query(SQL, [viewId, itemIds && itemIds.length ? itemIds : [-1]]);
        return _doQ(q);
    });
    return item2s;
};



// ===================================
// === getAllItemsInView(...) ===
// ===================================
export const getAllItemsInViewCount = async (viewId: number, parentOnly: boolean = true): Promise<number> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(parentOnly ? SQL_1_B_COUNT() : SQL_1_A_COUNT(), [viewId]);
        return q[0].COUNT;
    });
};
export const getAllItemsInView = async (viewId: number, parentOnly: boolean = true, limitOffset?: LimitOffset): Promise<Item[]> => {
    const item2s: Item2[] = await getAllItem2sInView(viewId, parentOnly, limitOffset);
    const items: Item[] = itemsConvert(item2s);
    
    fireEvent({
        type: "GetAllItemsInViewEvent",
        viewId, parentOnly, limitOffset, items
    } as GetAllItemsInViewEvent);
    
    return items;
};
export const getAllItem2sInView = async (viewId: number, parentOnly: boolean = true, limitoffset?: LimitOffset): Promise<Item2[]> => {
    const item2s: Item2[] = await doInDbConnection(async (conn: Connection) => {
        const qq: QueryA = await conn.query(parentOnly ? SQL_1_B(limitoffset) : SQL_1_A(limitoffset), [viewId]);
        const itemIds: number[] = qq.reduce((acc: number[], i: QueryI) => {
           acc.push(i.ID);
           return acc;
        }, []);
        const q: QueryA = await conn.query(SQL, [viewId, itemIds && itemIds.length ? itemIds : [-1]]);
        return _doQ(q);
    });

    await w(viewId, item2s);
    return item2s;
};





// ===============================
// === getItemsByIds(...) ===
// ===============================
export const getItemsByIdsCount = async (viewId: number, itemIds: number[], parentOnly: boolean = true): Promise<number> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(parentOnly ? SQL_2_B_COUNT() : SQL_2_A_COUNT(), [viewId, itemIds]);
        return q[0].COUNT;
    });
};
export const getItemsByIds = async (viewId: number, itemIds: number[], parentOnly: boolean = true, limitOffset?: LimitOffset): Promise<Item[]> => {
    const item2s: Item2[] = await getItem2sByIds(viewId, itemIds, parentOnly, limitOffset);
    const items: Item[] = itemsConvert(item2s);
    fireEvent({
       type: "GetItemsByIdsEvent",
       viewId, itemIds, parentOnly, limitOffset, items 
    } as GetItemsByIdsEvent);
    return items;
};
export const getItem2sByIds = async (viewId: number, itemIds: number[], parentOnly: boolean = true, limitoffset?: LimitOffset): Promise<Item2[]> => {
    const item2s: Item2[] = await doInDbConnection(async (conn: Connection) => {
        const qq: QueryA = await conn.query(parentOnly ? SQL_2_B(limitoffset) : SQL_2_A(limitoffset), [viewId, itemIds]);
        const _itemIds: number[] = qq.reduce((acc: number[], i: QueryI) => {
           acc.push(i.ID);
           return acc;
        }, []);
        const q: QueryA = await conn.query(SQL, [viewId, _itemIds]);
        return _doQ(q);
    });

    await w(viewId, item2s);
    return item2s;
};



// ============================
// === getItemById(...) ===
// ============================
export const getItemById = async (viewId: number, itemId: number): Promise<Item> => {
    const item2: Item2 = await getItem2ById(viewId, itemId);
    const item: Item = itemConvert(item2);
    
    fireEvent({
       type: "GetItemByIdEvent",
       viewId, itemId, item 
    } as GetItemByIdEvent);
    return item;
}
export const getItem2ById = async (viewId: number, itemId: number): Promise<Item2> => {

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
                LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.VIEW_ID = ?
                LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID AND V.VIEW_ATTRIBUTE_ID = A.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
                LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
                WHERE I.ID = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' 
            `, [viewId, itemId]);

        return _doQ(q);
    });

    await w(viewId, item2s);
    return (item2s && item2s.length > 0 ? item2s[0] : undefined);
}


// ============================
// === getItemByName(...) ===
// ============================
export const getItemByName = async (viewId: number, itemName: string): Promise<Item> => {
    const item2: Item2 = await getItem2ByName(viewId, itemName);
    const item: Item = (item2 ? itemConvert(item2) : undefined);
    
    fireEvent({
        type: "GetItemByNameEvent",
        viewId, itemName, item
    } as GetItemByNameEvent);
    
    return item;
};
export const getItem2ByName = async (viewId: number, itemName: string): Promise<Item2> => {

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
                LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.VIEW_ID = ?
                LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID AND V.VIEW_ATTRIBUTE_ID = A.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
                LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
                WHERE I.VIEW_ID =? AND I.NAME = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' 
            `, [viewId, viewId, itemName]);

        return _doQ(q);
    });

    await w(viewId, item2s);
    return (item2s && item2s.length > 0 ? item2s[0] : undefined);
}

////////////////////////////////////////////////////////////////////  ==== misc helpers ====

const findChildrenItems = async (viewId: number, parentItemId: number): Promise<Item[]> => {
   const item2s: Item2[] = await findChildrenItem2s(viewId, parentItemId);
   const items: Item[] = itemsConvert(item2s);
   return items;
}
const findChildrenItem2s = async (viewId: number, parentItemId: number): Promise<Item2[]> => {

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
                LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.VIEW_ID = ?
                LEFT JOIN TBL_ITEM_VALUE AS V ON V.ITEM_ID = I.ID AND V.VIEW_ATTRIBUTE_ID = A.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA AS M ON M.ITEM_VALUE_ID = V.ID
                LEFT JOIN TBL_ITEM_VALUE_METADATA_ENTRY AS E ON E.ITEM_VALUE_METADATA_ID = M.ID   
                LEFT JOIN TBL_ITEM_IMAGE AS IMG ON IMG.ITEM_ID = I.ID
                WHERE I.VIEW_ID = ? AND I.STATUS = 'ENABLED' AND A.STATUS = 'ENABLED' AND I.PARENT_ID = ?
            `, [viewId, viewId, parentItemId]);

        return _doQ(q);
    });


    for (const item2 of item2s) {
        const itemId: number = item2.id;
        item2.children = await findChildrenItem2s(viewId, itemId);
    }

    return item2s;

}




// work out the children in each item
const w = async (viewId: number, item2s: Item2[]) => {
    for (const item2 of item2s) {
        const itemId: number = item2.id;
        item2.children = await findChildrenItem2s(viewId, itemId);
    }
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
        const valueMapKey: string = valueId ? `${itemId}_${attributeId}_${valueId}` : undefined;

        const metadataId: number = c.M_ID;
        const metaMapKey = valueId ? `${itemId}_${attributeId}_${valueId}_${metadataId}` : undefined;

        const entryId: number = c.E_ID;
        const entryMapKey = `${itemId}_${attributeId}_${metadataId}_${entryId}`;

        const imageId: number = c.IMG_ID;
        const imgMapKey: string = imageId ? `${itemId}_${imageId}` : undefined;

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

        if (imgMapKey && !imgMap.has(imgMapKey)) {
            const img: ItemImage = {
                id: imageId,
                name: c.IMG_NAME,
                mimeType: c.IMG_MIME_TYPE,
                size: c.IMG_SIZE,
                primary: !!c.IMG_PRIMARY,
            } as ItemImage;
            imgMap.set(imgMapKey, img);
            const item: Item2 = itemMap.get(itemMapKey);
            item.images.push(img);
        }

        if (valueMapKey && !valueMap.has(valueMapKey)) {
            const itemValue: ItemValue2 = {
                id: valueId,
                attributeId,
                metadatas: []
            } as ItemValue2;
            valueMap.set(valueMapKey, itemValue);
            const item: Item2 = itemMap.get(itemMapKey);
            item.values.push(itemValue);
        }

        if (metaMapKey && !metaMap.has(metaMapKey)) {
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
            if(metaMapKey) {
                const meta: ItemMetadata2 = metaMap.get(metaMapKey); // item value metas
                meta.entries.push(entry);
            }
        }

        return acc;
    }, []);

    return allItems2;
}
