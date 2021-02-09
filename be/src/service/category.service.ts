import {Category, CategorySimpleItem, CategoryWithItems} from "../model/category.model";
import {Item} from "../model/item.model";
import {LimitOffset} from "../model/limit-offset.model";
import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import { Connection } from "mariadb";
import {DELETED, ENABLED} from "../model/status.model";
import {getItemsByIds, getItemsByIdsCount} from "./index";
import {LIMIT_OFFSET} from "../util/utils";
import {
    AddCategoryEvent, AddItemToViewCategoryEvent,
    CategorySimpleItemsInCategoryEvent,
    CategorySimpleItemsNotInCategoryEvent,
    DeleteCategoryEvent,
    fireEvent,
    GetViewCategoriesEvent,
    GetViewCategoriesWithItemsEvent,
    GetViewCategoryByNameEvent,
    GetViewCategoryItemsEvent, RemoveItemFromViewCategoryEvent,
    UpdateCategoryEvent
} from "./event/event.service";

export interface UpdateCategoryInput { id: number; name: string; description: string; };
export interface AddCategoryInput { name: string; description: string; children: AddCategoryInput[] };

class CategoryService {
    /**
     *  =======================================
     *  === categorySimpleItemsInCategory() ===
     *  =======================================
     */
    async categorySimpleItemsInCategoryCount(viewId: number, categoryId: number): Promise<number> {
        return await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
            SELECT COUNT(*) AS COUNT FROM TBL_LOOKUP_VIEW_CATEGORY_ITEM WHERE VIEW_CATEGORY_ID = ?
        `, [categoryId]);
            return q[0].COUNT;
        });
    };
    async categorySimpleItemsInCategory(viewId: number, categoryId: number, limitOffset?: LimitOffset): Promise<CategorySimpleItem[]> {
        const categorySimpleItems: CategorySimpleItem[] = await doInDbConnection(async (conn: Connection) => {
            const q1: QueryA = await conn.query(`
                SELECT ITEM_ID 
                FROM TBL_LOOKUP_VIEW_CATEGORY_ITEM
                WHERE VIEW_CATEGORY_ID = ? 
                ${LIMIT_OFFSET(limitOffset)}
        `, [categoryId]);
            const itemIds: number[] = q1.reduce((a: number[], i: QueryI) => {
                a.push(i.ITEM_ID);
                return a;
            }, []);
            if (!itemIds.length) { // if length is zero
                itemIds.push(-1); // so we don't get sql exception for putting in empty []
            }
            const q: QueryA = await conn.query(`
            SELECT 
                I.ID AS I_ID,
                I.NAME AS I_NAME,
                I.DESCRIPTION AS I_DESCRIPTION, 
                I.CREATION_DATE AS I_CREATION_DATE,
                I.LAST_UPDATE AS I_LAST_UPDATE
            FROM TBL_ITEM AS I
            WHERE I.ID IN ? AND I.STATUS = ? AND I.PARENT_ID IS NULL
        `, [itemIds, ENABLED]);

            return q.reduce((a: CategorySimpleItem[], i: QueryI) => {
                const itm: CategorySimpleItem = {
                    id: i.I_ID,
                    name: i.I_NAME,
                    description: i.I_DESCRIPTION,
                    creationDate: i.I_CREATION_DATE,
                    lastUpdate: i.I_LAST_UPDATE,
                };
                a.push(itm);
                return a;
            }, []);
        });
        fireEvent({
            type: 'CategorySimpleItemsInCategoryEvent',
            viewId, categoryId, limitOffset,
            items: categorySimpleItems
        } as CategorySimpleItemsInCategoryEvent);
        return categorySimpleItems;
    };


    /**
     *  ==========================================
     *  === categorySimpleItemsNotInCategory() ===
     *  ==========================================
     */
    async categorySimpleItemsNotInCategoryCount(viewId: number, categoryId: number): Promise<number> {
        return await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
            SELECT COUNT(*) AS COUNT FROM TBL_ITEM WHERE PARENT_ID IS NULL AND VIEW_ID = ? AND ID NOT IN (SELECT ITEM_ID FROM TBL_LOOKUP_VIEW_CATEGORY_ITEM WHERE VIEW_CATEGORY_ID = ?)
        `, [viewId, categoryId]);
            return q[0].COUNT;
        });
    };
    async categorySimpleItemsNotInCategory(viewId: number, categoryId: number, limitOffset?: LimitOffset): Promise<CategorySimpleItem[]> {
        const categorySimpleItems: CategorySimpleItem[] = await doInDbConnection(async (conn: Connection) => {
            const q1: QueryA = await conn.query(`
                SELECT ITEM_ID 
                FROM TBL_LOOKUP_VIEW_CATEGORY_ITEM
                WHERE VIEW_CATEGORY_ID = ? 
        `, [categoryId]);
            const itemIds: number[] = q1.reduce((a: number[], i: QueryI) => {
                a.push(i.ITEM_ID);
                return a;
            }, []);
            if (!itemIds.length) { // if length is zero
                itemIds.push(-1); // so we don't get sql exception for putting in empty []
            }
            const q: QueryA = await conn.query(`
            SELECT 
                I.ID AS I_ID,
                I.NAME AS I_NAME,
                I.DESCRIPTION AS I_DESCRIPTION ,
                I.CREATION_DATE AS I_CREATION_DATE,
                I.LAST_UPDATE AS I_LAST_UPDATE
            FROM TBL_ITEM AS I
            WHERE I.ID NOT IN ? AND I.STATUS = ? AND I.PARENT_ID IS NULL AND I.VIEW_ID=?
            ${LIMIT_OFFSET(limitOffset)}
        `, [itemIds, ENABLED, viewId]);

            return q.reduce((a: CategorySimpleItem[], i: QueryI) => {
                const itm: CategorySimpleItem = {
                    id: i.I_ID,
                    name: i.I_NAME,
                    description: i.I_DESCRIPTION,
                    creationDate: i.I_CREATION_DATE,
                    lastUpdate: i.I_LAST_UPDATE,
                };
                a.push(itm);
                return a;
            }, []);
        });

        fireEvent({
            type: 'CategorySimpleItemsNotInCategoryEvent',
            viewId, categoryId, limitOffset,
            items: categorySimpleItems
        } as CategorySimpleItemsNotInCategoryEvent);

        return categorySimpleItems;
    };

    /**
     *  ======================
     *  === updateCategory ===
     *  ======================
     */
    async updateCategory(viewId: number, parentCategoryId: number, c: UpdateCategoryInput): Promise<string[]> {
        const errors: string[] = await doInDbConnection(async(conn: Connection) => {
            const errors: string[] = [];
            // make sure this category id is valid
            const qc: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_VIEW_CATEGORY WHERE ID=? AND VIEW_ID=? AND STATUS=?`, [c.id, viewId, ENABLED]);
            if (qc[0].COUNT > 0) {
                if (c.name) {
                    // make sure category name do not already exists
                    const qc1: QueryA = await conn.query(
                        `SELECT COUNT(*) AS COUNT FROM TBL_VIEW_CATEGORY WHERE NAME=? AND VIEW_ID=? AND STATUS=? AND ${(parentCategoryId && parentCategoryId>0) ? 'PARENT_ID=?' : 'PARENT_ID IS NULL'}`,
                        (parentCategoryId && parentCategoryId>0) ? [c.name, viewId, ENABLED, parentCategoryId] : [c.name, viewId, ENABLED]);
                    if (qc1[0].COUNT <= 0) {
                        if (c.name) {
                            const q: QueryResponse = await conn.query(`UPDATE TBL_VIEW_CATEGORY SET NAME=? WHERE VIEW_ID=? AND ID=?`, [c.name, viewId, c.id]);
                            if (q.affectedRows <= 0) {
                                errors.push(`Failed to update name of category id ${c.id} for view ${viewId}`);
                            }
                            if (parentCategoryId && parentCategoryId > 0) {
                                const q: QueryResponse = await conn.query(`UPDATE TBL_VIEW_CATEGORY SET PARENT_ID=? WHERE VIEW_ID=? AND ID=?`, [parentCategoryId, viewId, c.id]);
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
                if (parentCategoryId != null || parentCategoryId != undefined) {
                    const q: QueryResponse = await conn.query(`UPDATE TBL_VIEW_CATEGORY SET PARENT_ID=? WHERE VIEW_ID=? AND ID=?`,
                        [(parentCategoryId > 0 ? parentCategoryId : null), c.name, viewId, c.id]);
                    if (q.affectedRows <= 0) {
                        errors.push(`Failed to move category id ${c.id} for view ${viewId} to new parent id ${parentCategoryId}`);
                    }
                }

            } else {
                errors.push(`Category with id ${c.id} for view ${viewId} do not exists`);
            }
        });

        fireEvent({
            type: "UpdateCategoryEvent",
            viewId, parentCategoryId,
            input: c, errors
        } as UpdateCategoryEvent);

        return errors;
    };


    /**
     *  ===================
     *  === addCategory ===
     *  ===================
     */
    async _addCategory(conn: Connection, viewId: number, parentCategoryId: number, c: AddCategoryInput): Promise<string[]> {
        const errors: string[] = [];
        const qc: QueryA = await conn.query(
            `SELECT COUNT(*) AS COUNT FROM TBL_VIEW_CATEGORY WHERE NAME=? AND VIEW_ID=? AND STATUS=? AND ${parentCategoryId>0 ? 'PARENT_ID=?' : 'PARENT_ID IS NULL'}`,
            parentCategoryId>0 ? [c.name, viewId, ENABLED, parentCategoryId] : [c.name, viewId, ENABLED]);
        if (qc[0].COUNT <= 0) {
            const q: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_CATEGORY (NAME, DESCRIPTION, STATUS, VIEW_ID, PARENT_ID) VALUES (?,?,?,?,?)`,
                [c.name, c.description, ENABLED, viewId, (parentCategoryId && parentCategoryId > 0 ? parentCategoryId : null)]);
            if (q.affectedRows <= 0) {
                errors.push(`Failed to add category ${c.name} with view ${viewId}`);
            } else {
                const currentParentId: number = q.insertId;
                for (const _c of c.children) {
                    errors.push(...await this._addCategory(conn, viewId, currentParentId, _c));
                }
            }
        } else {
            errors.push(`Category with name ${c.name} for view ${viewId} already exists`);
        }

        fireEvent({
            type: 'AddCategoryEvent',
            viewId, parentCategoryId, input: c, errors
        } as AddCategoryEvent);
        return errors;
    };
    async addCategory(viewId: number, parentId: number, c: AddCategoryInput): Promise<string[]> {
        return await doInDbConnection(async(conn: Connection) => {
            await this._addCategory(conn, viewId, parentId, c);
        });
    };



    /**
     *  ======================
     *  === deleteCategory ===
     *  ======================
     */
    async deleteCategory(viewId: number, categoryId: number): Promise<string[]> {
        const errors: string[] = await doInDbConnection(async (conn: Connection) => {
            const errors: string[] = [];
            const q: QueryResponse = await conn.query(`UPDATE TBL_VIEW_CATEGORY SET STATUS=? WHERE ID=? AND VIEW_ID=?`, [DELETED, categoryId, viewId]);
            if (q.affectedRows <= 0) {
                errors.push(`Failed to delete category ${categoryId} in view ${viewId}`);
            }
            return errors;
        });
        fireEvent({
            type: 'DeleteCategoryEvent',
            viewId, categoryId, errors
        } as DeleteCategoryEvent);
        return errors;
    };


    /**
     *  ===============================
     *  === getViewCategoryByName() ===
     *  ===============================
     */
    async getViewCategoryByName(viewId: number, categoryName: string, parentCategoryId?: number): Promise<Category> {
        const q: QueryA = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(
                parentCategoryId ?
                    // when parentCategoryId is given
                    `
                   SELECT 
                       ID, NAME, DESCRIPTION, STATUS, VIEW_ID, PARENT_ID, CREATION_DATE, LAST_UPDATE 
                   FROM TBL_VIEW_CATEGORY WHERE VIEW_ID=? AND NAME=? AND PARENT_ID = ?
               ` :
                    // when parentCategoryId is not given
                    `
                   SELECT 
                       ID, NAME, DESCRIPTION, STATUS, VIEW_ID, PARENT_ID, CREATION_DATE, LAST_UPDATE 
                   FROM TBL_VIEW_CATEGORY WHERE VIEW_ID=? AND NAME=? AND PARENT_ID IS NULL
               `,
                parentCategoryId ? [viewId, categoryName, parentCategoryId] : [viewId, categoryName]
            );
            return q;
        });

        let category: Category = null;
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
            category = c;
        }

        fireEvent({
            type: "GetViewCategoryByNameEvent",
            viewId,
            categoryName,
            category
        } as GetViewCategoryByNameEvent);
        return category;
    }


    /**
     *  ===========================
     *  === getViewCategories() ===
     *  ===========================
     */
    async getViewCategories(viewId: number, parentCategoryId: number = null): Promise<Category[]> {
        const q: QueryA = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT 
                    ID, NAME, DESCRIPTION, STATUS, VIEW_ID, PARENT_ID, CREATION_DATE, LAST_UPDATE 
                FROM TBL_VIEW_CATEGORY WHERE VIEW_ID=? AND ${parentCategoryId ? 'PARENT_ID=? AND STATUS=?' : 'PARENT_ID IS NULL AND STATUS = ?'}
            `, parentCategoryId ? [viewId, parentCategoryId, ENABLED] : [viewId, ENABLED]);
            return q;
        });

        let categories: Category[] = [];
        for (const i of q) {
            const categoryId: number = i.ID;
            const c: CategoryWithItems = {
                id: categoryId,
                name: i.NAME,
                description: i.DESCRIPTION,
                status: i.STATUS,
                creationDate: i.CREATION_DATE,
                lastUpdate: i.LAST_UPDATE,
                items: await this._getCategoryItemSimple(viewId, categoryId),
                children: await getViewCategoriesWithItems(viewId, categoryId)
            };
            categories.push(c);
        }

        fireEvent({
            type: 'GetViewCategoriesEvent',
            viewId, parentCategoryId, categories
        } as GetViewCategoriesEvent);
        return categories;
    };


    /**
     *  ====================================
     *  === getViewCategoriesWithItems() ===
     *  ====================================
     */
    async getViewCategoriesWithItems(viewId: number, parentCategoryId: number = null): Promise<CategoryWithItems[]> {
        const q: QueryA = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT 
                    ID, NAME, DESCRIPTION, STATUS, VIEW_ID, PARENT_ID, CREATION_DATE, LAST_UPDATE 
                FROM TBL_VIEW_CATEGORY WHERE VIEW_ID=? AND ${parentCategoryId ? 'PARENT_ID=? AND STATUS=?' : 'PARENT_ID IS NULL AND STATUS=? '}
            `, parentCategoryId ? [viewId, parentCategoryId, ENABLED] : [viewId, ENABLED]);
            return q;
        });

        const categoryWithItems: CategoryWithItems[] = [];
        for (const i of q) {
            const categoryId: number = i.ID;
            const c: CategoryWithItems = {
                id: categoryId,
                name: i.NAME,
                description: i.DESCRIPTION,
                status: i.STATUS,
                creationDate: i.CREATION_DATE,
                lastUpdate: i.LAST_UPDATE,
                items: await this._getCategoryItemSimple(viewId, categoryId),
                children: await getViewCategoriesWithItems(viewId, categoryId)
            };
            categoryWithItems.push(c);
        }

        fireEvent({
            type: 'GetViewCategoriesWithItemsEvent',
            viewId,
            parentCategoryId,
            categories: categoryWithItems
        } as GetViewCategoriesWithItemsEvent);

        return categoryWithItems;
    };
    async _getCategoryItemSimple(viewId: number, categoryId: number): Promise<{id: number, name: string, description: string, creationDate: Date, lastUpdate: Date}[]> {
        const q: QueryA =  await doInDbConnection(async (conn: Connection) => {
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
            return q;
        });

        return q.reduce((a: {id: number, name: string, description: string, creationDate: Date, lastUpdate: Date}[], i: QueryI) => {
            const itm = {
                id: i.I_ID, name: i.I_NAME, description: i.I_DESCRIPTION, creationDate: i.I_CREATION_DATE, lastUpdate: i.I_LAST_UPDATE
            };
            a.push(itm);
            return a;
        }, []);
    };




    /**
     *  ============================
     *  === getViewCategoryItems ===
     *  ============================
     */
    async getViewCategoryItemsCount(viewId: number, categoryId: number): Promise<number> {
        return await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`SELECT COUNT(I.ID) AS COUNT 
                FROM TBL_LOOKUP_VIEW_CATEGORY_ITEM AS LVC 
                LEFT JOIN TBL_ITEM AS I ON I.ID = LVC.ITEM_ID
                WHERE I.STATUS = ? AND LVC.VIEW_CATEGORY_ID=? AND I.VIEW_ID=?`, [ENABLED, categoryId, viewId]);
            return q[0].COUNT;
        });
    };
    async getViewCategoryItems(viewId: number, categoryId: number, limitOffset?: LimitOffset): Promise<Item[]> {
        const q: QueryA = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`SELECT I.ID AS I_ID 
                FROM TBL_LOOKUP_VIEW_CATEGORY_ITEM AS LVC 
                LEFT JOIN TBL_ITEM AS I ON I.ID = LVC.ITEM_ID
                WHERE I.STATUS = ? AND LVC.VIEW_CATEGORY_ID=? AND I.VIEW_ID=?`, [ENABLED, categoryId, viewId]);
            return q;
        });

        const itemIds: number[] = []
        for (const i of q) {
            const itemId: number = i.I_ID;
            itemIds.push(itemId);
        }
        const items: Item[] = await getItemsByIds(viewId, itemIds, true, limitOffset);

        fireEvent({
            type: "GetViewCategoryItemsEvent",
            viewId, categoryId, limitOffset, items
        } as GetViewCategoryItemsEvent);
        return items;
    };


    /**
     *  ===============================
     *  === addItemToViewCategory() ===
     *  ===============================
     */
    async addItemToViewCateogry(categoryId: number, itemId: number): Promise<string[]> {
        const errors: string[] = await doInDbConnection(async (conn: Connection) => {
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
        fireEvent({
            type: "AddItemToViewCategoryEvent",
            categoryId, itemId, errors
        } as AddItemToViewCategoryEvent);
        return errors;
    };


    /**
     *  ====================================
     *  === removeItemFromViewCategory() ===
     *  ====================================
     */
    async removeItemFromViewCategory(categoryId: number, itemId: number): Promise<string[]> {
        const errors: string[] = await doInDbConnection(async (conn: Connection) => {
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
        fireEvent({
            type: "RemoveItemFromViewCategoryEvent",
            categoryId, itemId, errors
        } as RemoveItemFromViewCategoryEvent);
        return errors;
    };


    /**
     * =================================
     * === updateCategoryHierarchy() ===
     * =================================
     */
    async updateCategoryHierarchy(categoryId: number, parentId: number): Promise<string[]> {
        return await doInDbConnection(async (conn: Connection) => {
            const errors: string[] = [];
            const q1: QueryA = await conn.query(`
                 SELECT ID, PARENT_ID, STATUS FROM TBL_VIEW_CATEGORY WHERE ID = ?            
            `, [categoryId]);

            if (!q1.length) {
                errors.push(`Category with id ${categoryId} not found`);
            } else {
                if (parentId) {
                    const q2: QueryResponse = await conn.query(`UPDATE TBL_VIEW_CATEGORY SET PARENT_ID = ? WHERE ID = ? `, [parentId, categoryId]);
                    if (q2.affectedRows <= 0) {
                        errors.push(`Failed to update PARENT_ID for category ${categoryId} to ${parentId}`);
                    }
                } else if (categoryId == parentId) {
                    errors.push(`Cannot move category ${categoryId} to a parent that is itself`);
                } else {
                    const q2: QueryResponse = await conn.query(`UPDATE TBL_VIEW_CATEGORY SET PARENT_ID = NULL WHERE ID = ? `, [categoryId]);
                    if (q2.affectedRows <= 0) {
                        errors.push(`Failed to update PARENT_ID for category ${categoryId} to NULL`);
                    }
                }
            }
            return errors;
        });
    }
}

const s = new CategoryService()
export const
    categorySimpleItemsInCategoryCount = s.categorySimpleItemsInCategoryCount.bind(s),
    categorySimpleItemsInCategory = s.categorySimpleItemsInCategory.bind(s),
    categorySimpleItemsNotInCategoryCount = s.categorySimpleItemsNotInCategoryCount.bind(s),
    categorySimpleItemsNotInCategory = s.categorySimpleItemsNotInCategory.bind(s),
    updateCategory = s.updateCategory.bind(s),
    addCategory = s.addCategory.bind(s),
    deleteCategory = s.deleteCategory.bind(s),
    getViewCategoryByName = s.getViewCategoryByName.bind(s),
    getViewCategories = s.getViewCategories.bind(s),
    getViewCategoriesWithItems = s.getViewCategoriesWithItems.bind(s),
    getViewCategoryItemsCount = s.getViewCategoryItemsCount.bind(s),
    getViewCategoryItems = s.getViewCategoryItems.bind(s),
    addItemToViewCateogry = s.addItemToViewCateogry.bind(s),
    removeItemFromViewCategory = s.removeItemFromViewCategory.bind(s),
    updateCategoryHierarchy = s.updateCategoryHierarchy.bind(s);