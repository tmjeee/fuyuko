import {Category, CategoryWithItems} from "../model/category.model";
import {Item} from "../model/item.model";
import {LimitOffset} from "../model/limit-offset.model";
import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import { Connection } from "mariadb";
import {DELETED, ENABLED} from "../model/status.model";
import {getItemsByIds, getItemsByIdsCount} from "./index";

export interface AddCategoryInput {
    name: string;
    description: string;
    children: AddCategoryInput[]
};

export interface UpdateCategoryInput {
    id: number;
    name: string;
    description: string;
};


export const updateCategory = async (viewId: number, parentId: number, c: UpdateCategoryInput): Promise<string[]> => {
    return await doInDbConnection(async(conn: Connection) => {
        const errors: string[] = [];
        // make sure this category id is valid
        const qc: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_VIEW_CATEGORY WHERE ID=? AND VIEW_ID=? AND STATUS=?`, [c.id, viewId, ENABLED]);
        if (qc[0].COUNT > 0) {
            if (c.name) {
                // make sure category name do not already exists
                const qc1: QueryA = await conn.query(
                    `SELECT COUNT(*) AS COUNT FROM TBL_VIEW_CATEGORY WHERE NAME=? AND VIEW_ID=? AND STATUS=? AND ${parentId>0 ? 'PARENT_ID=?' : 'PARENT_ID IS NULL'}`,
                    parentId>0 ? [c.name, viewId, ENABLED, parentId] : [c.name, viewId, ENABLED]);
                if (qc1[0].COUNT <= 0) {
                    if (c.name) {
                        const q: QueryResponse = await conn.query(`UPDATE TBL_VIEW_CATEGORY SET NAME=? WHERE VIEW_ID=? AND ID=?`, [c.name, viewId, c.id]);
                        if (q.affectedRows <= 0) {
                            errors.push(`Failed to update name of category id ${c.id} for view ${viewId}`);
                        }
                        if (parentId && parentId > 0) {
                            const q: QueryResponse = await conn.query(`UPDATE TBL_VIEW_CATEGORY SET PARENT_ID=? WHERE VIEW_ID=? AND ID=?`, [parentId, viewId, c.id]);
                            if (q.affectedRows <= 0) {
                                errors.push(`Failed to update parent of category id ${c.id} for view ${viewId}`);
                            }
                        }
                    }
                } else {
                    errors.push(`Cannot change category with id ${c.id} for view ${viewId} to name ${c.name} that already exists `);
                }
            }
            if (c.description) {
                const q: QueryResponse = await conn.query(`UPDATE TBL_VIEW_CATEGORY SET DESCRIPTION=? WHERE VIEW_ID=? AND ID=?`, [c.name, viewId, c.id]);
                if (q.affectedRows <= 0) {
                    errors.push(`Failed to update description of category id ${c.id} for view ${viewId}`);
                }
            }
            if (parentId != null || parentId != undefined) {
                const q: QueryResponse = await conn.query(`UPDATE TBL_VIEW_CATEGORY SET PARENT_ID=? WHERE VIEW_ID=? AND ID=?`,
                    [(parentId > 0 ? parentId : null), c.name, viewId, c.id]);
                if (q.affectedRows <= 0) {
                    errors.push(`Failed to move category id ${c.id} for view ${viewId} to new parent id ${parentId}`);
                }
            }

        } else {
            errors.push(`Category with id ${c.id} for view ${viewId} do not exists`);
        }
    });
}


const _addCategory = async (conn: Connection, viewId: number, parentId: number, c: AddCategoryInput): Promise<string[]> => {
    const errors: string[] = [];
    const qc: QueryA = await conn.query(
        `SELECT COUNT(*) AS COUNT FROM TBL_VIEW_CATEGORY WHERE NAME=? AND VIEW_ID=? AND STATUS=? AND ${parentId>0 ? 'PARENT_ID=?' : 'PARENT_ID IS NULL'}`,
        parentId>0 ? [c.name, viewId, ENABLED, parentId] : [c.name, viewId, ENABLED]);
    if (qc[0].COUNT <= 0) {
        const q: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_CATEGORY (NAME, DESCRIPTION, STATUS, VIEW_ID, PARENT_ID) VALUES (?,?,?,?,?)`,
            [c.name, c.description, ENABLED, viewId, (parentId && parentId > 0 ? parentId : null)]);
        if (q.affectedRows <= 0) {
            errors.push(`Failed to add category ${c.name} with view ${viewId}`);
        } else {
            const currentParentId: number = q.insertId;
            for (const _c of c.children) {
                errors.push(...await _addCategory(conn, viewId, currentParentId, _c));
            }
        }
    } else {
        errors.push(`Category with name ${c.name} for view ${viewId} already exists`);
    }
    return errors;
};

export const addCategory = async (viewId: number, parentId: number, c: AddCategoryInput): Promise<string[]> => {
    return await doInDbConnection(async(conn: Connection) => {
        await _addCategory(conn, viewId, parentId, c);
    });
};

export const deleteCategory = async (viewId: number, categoryId: number): Promise<string[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = [];
        const q: QueryResponse = await conn.query(`UPDATE TBL_VIEW_CATEGORY SET STATUS=? WHERE ID=? AND VIEW_ID=?`, [DELETED, categoryId, viewId]);
        if (q.affectedRows <= 0) {
            errors.push(`Failed to delete category ${categoryId} in view ${viewId}`);
        }
        return errors;
    });
};

export const getViewCategoryByName = async (viewId: number, categoryName: string): Promise<Category> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`
            SELECT 
                ID, NAME, DESCRIPTION, STATUS, VIEW_ID, PARENT_ID, CREATION_DATE, LAST_UPDATE 
            FROM TBL_VIEW_CATEGORY WHERE VIEW_ID=? AND NAME=?
        `, [viewId, categoryName]);

        if (q && q.length) {
            const c: Category = {
                id: q[0].ID,
                name: q[0].NAME,
                description: q[0].DESCRIPTION,
                status: q[0].STATUS,
                creationDate: q[0].CREATION_DATE,
                lastUpdate: q[0].LAST_UPDATE,
                children: await getViewCategories(viewId, q[0].ID)
            };
            return c;
        }
        return null;
    });
}

export const getViewCategories = async (viewId: number, parentId: number = null): Promise<Category[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`
            SELECT 
                ID, NAME, DESCRIPTION, STATUS, VIEW_ID, PARENT_ID, CREATION_DATE, LAST_UPDATE 
            FROM TBL_VIEW_CATEGORY WHERE VIEW_ID=? AND ${parentId ? 'PARENT_ID=?' : 'PARENT_ID IS NULL'}
        `, parentId ? [viewId, parentId] : [viewId]);
        return q.reduce(async (acc: Promise<Category[]>, i: QueryI) => {
            const c: Category = {
                id: i.ID,
                name: i.NAME,
                description: i.DESCRIPTION,
                status: i.STATUS,
                creationDate: i.CREATION_DATE,
                lastUpdate: i.LAST_UPDATE,
                children: await getViewCategories(viewId, i.ID)
            };
            (await acc).push(c);
            return acc;
        }, Promise.resolve([]));
    });
};


export const getViewCategoriesWithItems = async (viewId: number, parentId: number = null): Promise<CategoryWithItems[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`
            SELECT 
                ID, NAME, DESCRIPTION, STATUS, VIEW_ID, PARENT_ID, CREATION_DATE, LAST_UPDATE 
            FROM TBL_VIEW_CATEGORY WHERE VIEW_ID=? AND ${parentId ? 'PARENT_ID=?' : 'PARENT_ID IS NULL'}
        `, parentId ? [viewId, parentId] : [viewId]);
        return q.reduce(async (a: Promise<Category[]>, i: QueryI) => {
            const categoryId: number = i.ID;
            const c: CategoryWithItems = {
                id: categoryId,
                name: i.NAME,
                description: i.DESCRIPTION,
                status: i.STATUS,
                creationDate: i.CREATION_DATE,
                lastUpdate: i.LAST_UPDATE,
                items: await _getCategoryItemSimple(viewId, categoryId),
                children: await getViewCategoriesWithItems(viewId, categoryId)
            };
            (await a).push(c);
            return a;
        }, Promise.resolve([]));
    });
};

const _getCategoryItemSimple = async (viewId: number, categoryId: number): Promise<{id: number, name: string, description: string}[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`
            SELECT 
                I.ID AS I_ID,
                I.NAME AS I_NAME,
                I.DESCRIPTION AS I_DESCRIPTION,
                I.PARENT_ID AS I_PARENT_ID,
                I.VIEW_ID AS I_VIEW_ID,
                I.STATUS AS I_STATUS,
                I.CREATION_DATE AS I_CREATION_DATE,
                I.LAST_UPDATE AS I_LAST_UPDATE
            FROM TBL_LOOKUP_VIEW_CATEGORY_ITEM AS VCI 
            LEFT JOIN TBL_ITEM AS I ON I.ID = VCI.ITEM_ID
            WHERE VCI.VIEW_CATEGORY_ID = ? AND I.VIEW_ID =? AND I.PARENT_ID IS NULL  AND I.STATUS=?
        `, [categoryId, viewId, ENABLED]);
        return q.reduce((a: {id: number, name: string, description: string}[], i: QueryI) => {
            const itm = {
               id: i.I_ID, name: i.I_NAME, description: i.I_DESCRIPTION
            };
            a.push(itm);
            return a;
        }, []);
    });
};

export const getViewCategoryItemsCount = async (viewId: number, categoryId: number): Promise<number> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`SELECT COUNT(I.ID) AS COUNT 
            FROM TBL_LOOKUP_VIEW_CATEGORY_ITEM AS LVC 
            LEFT JOIN TBL_ITEM AS I ON I.ID = LVC.ITEM_ID
            WHERE I.STATUS = ? AND LVC.VIEW_CATEGORY_ID=? AND I.VIEW_ID=?`, [ENABLED, categoryId, viewId]);
        return q[0].COUNT;
    });
};

export const getViewCategoryItems = async (viewId: number, categoryId: number, limitOffset?: LimitOffset): Promise<Item[]> => {
    const itemIds: number[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`SELECT I.ID AS I_ID 
            FROM TBL_LOOKUP_VIEW_CATEGORY_ITEM AS LVC 
            LEFT JOIN TBL_ITEM AS I ON I.ID = LVC.ITEM_ID
            WHERE I.STATUS = ? AND LVC.VIEW_CATEGORY_ID=? AND I.VIEW_ID=?`, [ENABLED, categoryId, viewId]);
        return q.reduce((a: number[], i: QueryI) => {
            a.push(i.I_ID);
            return a;
        }, []);
    });
    return await getItemsByIds(viewId, itemIds, true, limitOffset);
};

export const addItemToViewCateogry = async (categoryId: number, itemId: number): Promise<string[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = [];
        const q1: QueryA = await conn.query(`SELECT VIEW_ID FROM TBL_VIEW_CATEGORY WHERE ID=?`, [categoryId]);
        const q2: QueryA = await conn.query(`SELECT VIEW_ID FROM TBL_ITEM WHERE ID=?`, [itemId]);
        if (!q1[0] || !q1[0].VIEW_ID) {
            errors.push(`invalid viewId for category id ${categoryId}`);
        }
        else if (!q2[0] || !q2[0].VIEW_ID) {
            errors.push(`invalid viewId for item id ${categoryId}`);
        }
        else if (q1[0].VIEW_ID !== q2[0].VIEW_ID) {
            errors.push(`category id ${categoryId} and item id ${itemId} have different view id`);
        }
        else {
            const q3: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_LOOKUP_VIEW_CATEGORY_ITEM WHERE VIEW_CATEGORY_ID=? AND ITEM_ID=?`, [categoryId, itemId]);
            if (q3[0].COUNT > 0) {
                errors.push(`Item ${itemId} is already in category id ${categoryId}`);
            } else {
                const q: QueryResponse = await conn.query(`INSERT INTO TBL_LOOKUP_VIEW_CATEGORY_ITEM (VIEW_CATEGORY_ID, ITEM_ID) VALUES (?, ?)`, [categoryId, itemId]);
                if (q.affectedRows <= 0) {
                    errors.push(`Failed to add item ${itemId} to category ${categoryId}`);
                }
            }
        }
        return errors;
    });
};

export const removeItemFromViewCategory = async (categoryId: number, itemId: number): Promise<string[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = [];
        const q1: QueryA = await conn.query(`SELECT VIEW_ID FROM TBL_VIEW_CATEGORY WHERE ID=?`, [categoryId]);
        const q2: QueryA = await conn.query(`SELECT VIEW_ID FROM TBL_ITEM WHERE ID=?`, [itemId]);
        if (!q1[0] || !q1[0].VIEW_ID) {
            errors.push(`invalid viewId for category id ${categoryId}`);
        }
        else if (!q2[0] || !q2[0].VIEW_ID) {
            errors.push(`invalid viewId for item id ${categoryId}`);
        }
        else if (q1[0].VIEW_ID !== q2[0].VIEW_ID) {
            errors.push(`category id ${categoryId} and item id ${itemId} have different view id`);
        }
        else {
            const q3: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_LOOKUP_VIEW_CATEGORY_ITEM WHERE VIEW_CATEGORY_ID=? AND ITEM_ID=?`, [categoryId, itemId]);
            if (q3[0].COUNT <= 0) {
                errors.push(`Item ${itemId} is not in category id ${categoryId}`);
            } else {
                const q: QueryResponse = await conn.query(`DELETE FROM TBL_LOOKUP_VIEW_CATEGORY_ITEM WHERE VIEW_CATEGORY_ID=? AND ITEM_ID=?`, [categoryId, itemId]);
                if (q.affectedRows <= 0) {
                    errors.push(`Failed to add item ${itemId} to category ${categoryId}`);
                }
            }
        }
        return errors;
    });
};

