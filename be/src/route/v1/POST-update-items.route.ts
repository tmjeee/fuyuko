import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {body, param} from 'express-validator';
import {Item} from "../../model/item.model";
import {Item2} from "../model/ss-attribute.model";
import {convert, revert} from "../../service/item-conversion.service";
import {PoolConnection} from "mariadb";
import {doInDbConnection, QueryResponse} from "../../db";
import {ApiResponse} from "../../model/response.model";
import util from 'util';

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        //body('items').isArray(),
        //body('items.*.name').exists(),
        //body('items.*.description').exists(),
        //body('items.*.parentId').exists()
        // todo: need to check [0].attributeId etc.
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const items: Item[] = req.body.items;
        const item2s: Item2[]  = revert(items);

        console.log(util.inspect(item2s, {depth: 10}));

        for (const item2 of item2s) {

            if (item2.id > 0) {
                await doInDbConnection(async (conn: PoolConnection) => {
                    console.log('**** update');
                    await updateItem(conn, viewId, item2);
                })
            } else {
                await doInDbConnection(async (conn: PoolConnection) => {
                    console.log('**** add');
                    await addItem(conn, viewId, item2);
                });
            }
        }



        res.status(200).json({
            status: 'SUCCESS',
            message: `item(s) updated`
        } as ApiResponse);
    }
];

const updateItem = async (conn: PoolConnection, viewId: number, item2: Item2) => {
    const itemId: number = item2.id;
    const name: string = item2.name;
    const description: string = item2.description;

    const q: QueryResponse = await conn.query(`UPDATE TBL_ITEM SET NAME=? , DESCRIPTION=? WHERE STATUS='ENABLED' AND ID=?`,[ name, description, itemId]);

    for (const itemValue of  item2.values) {

        const q0: QueryResponse = await conn.query(`DELETE FROM TBL_ITEM_VALUE WHERE ITEM_ID=? AND ITEM_ATTRIBUTE_ID=?`, [itemId, itemValue.attributeId]);

        const q1: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_VALUE (ITEM_ID, ITEM_ATTRIBUTE_ID) VALUES (?,?)`, [itemId, itemValue.attributeId]);
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
        updateItem(conn, viewId, child);
    }
}

const addItem = async (conn: PoolConnection, viewId: number, item2: Item2, parentId: number = null) => {

    const name: string = item2.name;
    const description: string = item2.description;

    const q: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM (PARENT_ID, VIEW_ID, NAME, DESCRIPTION, STATUS) VALUES (?,?,?,?,'ENABLED')`,[parentId, viewId, name, description]);
    const newItemId: number = q.insertId;

    for (const itemValue of item2.values) {
        const q1: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_VALUE (ITEM_ID, ITEM_ATTRIBUTE_ID) VALUES (?,?)`, [newItemId, itemValue.attributeId]);
        const newItemValueId: number = q1.insertId;

        for (const metadata of itemValue.metadatas) {
            const q2: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_VALUE_METADATA (ITEM_VALUE_ID, NAME) VALUE (?,?)`, [newItemValueId, metadata.name]);
            const newMetadataId: number = q2.insertId;

            for (const entry of metadata.entries) {
                const q3: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_VALUE_METADATA_ENTRY (ITEM_VALUE_METADATA_ID, \`KEY\`, \`VALUE\`, DATA_TYPE) VALUES (?,?,?,?)`,
                    [newMetadataId, entry.key, entry.value, entry.dataType]);
            }
        }
    }

    for (const child of item2.children) {
        addItem(conn, viewId, child, newItemId);
    }
}

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/items/update`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
