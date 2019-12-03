import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check, body} from 'express-validator';
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {PoolConnection} from "mariadb";
import {Attribute} from "../../model/attribute.model";
import {revert} from "../../service/conversion-attribute.service";
import {Attribute2} from "../model/server-side.model";
import {ApiResponse} from "../../model/response.model";

const httpAction: any[] = [
    [
        body('attributes').isArray(),
        body('attributes.*.id').exists().isNumeric(),
        body('attributes.*.type').exists(),
        body('attributes.*.name').exists(),
        body('attributes.*.description').exists()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const atts: Attribute[] = req.body.attributes;

        await doInDbConnection(async (conn: PoolConnection) => {
            const atts2: Attribute2[] = revert(atts);
            const failed: Attribute2[] = [];

            for (const att2 of atts2) {

                const q: QueryA = await conn.query('SELECT STATUS FROM TBL_ITEM_ATTRIBUTE WHERE ID = ?', [att2.id]);
                if (q.length && q[0].STATUS !== 'ENABLED') {
                    failed.push(att2);
                    continue;
                }

                await conn.query(`DELETE FROM TBL_ITEM_ATTRIBUTE_METADATA WHERE ITEM_ATTRIBUTE_ID = ? `, [att2.id]);
                await conn.query(`UPDATE TBL_ITEM_ATTRIBUTE SET TYPE=?, NAME=?, DESCRPTION=? WHERE ID=? `, [att2.type, att2.name, att2.description]);

                for (const metadata of att2.metadatas) {
                    const qMeta: QueryResponse = await conn.query(`INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA (ITEM_ATTRIBUTE_ID, NAME) VALUES (?,?)`, [att2.id, metadata.name]);
                    const metadataId: number = qMeta.insertId;
                    for (const entry of metadata.entries) {
                        await conn.query(`INSERT INTO TBL_ITEM_ATTRIBUTE_METADATA_ENTRY (ITEM_ATTRIBUTE_METADATA_ID, KEY, VALUE) VALUES (?,?,?)`, [metadataId, entry.key, entry.value]);
                    }
                }
            }

            if (failed.length) {
                const allFailedAttributeIds = failed.reduce((acc: number[], i: Attribute2)=>{
                    acc.push(i.id);
                    return acc;
                },[]);
                res.status(200).json({
                    status: 'ERROR',
                    message: `Attributes ${allFailedAttributeIds.join(',')} failed to be updated`
                } as ApiResponse);

                return;
            }

            const allAttributeIds = atts2.reduce((acc: number[], i: Attribute2)=>{
                acc.push(i.id);
                return acc;
            },[]);

            res.status(200).json({
                status: 'SUCCESS',
                message: `Attributes ${allAttributeIds.join(',')} updated`
            } as ApiResponse);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p1 = `/attributes/update`;
    registry.addItem('POST', p1);
    router.post(p1, ...httpAction);
}

export default reg;
