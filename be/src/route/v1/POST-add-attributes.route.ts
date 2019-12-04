import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {param, body, check} from 'express-validator';
import {doInDbConnection, QueryResponse} from "../../db";
import {PoolConnection} from "mariadb";
import {revert} from "../../service/conversion-attribute.service";
import {Attribute2} from "../model/server-side.model";
import {ApiResponse} from "../../model/response.model";

const httpAction: any[] = [
    [
       check('viewId').exists().isNumeric(),
       body('attributes').isArray(),
       body('attributes.*.type').exists(),
       body('attributes.*.name').exists(),
       body('attributes.*.description').exists(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const attrs2: Attribute2[] = revert(req.body.attributes);

        await doInDbConnection(async (conn: PoolConnection) => {

            for (const att2 of attrs2) {

                const qAtt: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (TYPE, NAME, DESCRPTION, STATUS) VALUES (?,?,?, 'ENABLED') `, [att2.type, att2.name, att2.description]);
                const attrbuteId: number = qAtt.insertId;

                for (const meta of att2.metadatas) {

                    const qMeta: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?,?)`, [attrbuteId, meta.name]);
                    const metaId: number = qMeta.insertId;

                    for (const entry of meta.entries) {
                        await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, KEY, VALUE) VALUES (?,?,?)`, [metaId, entry.key, entry.value]);
                    }
                }
            }

            res.status(200).json({
               status: 'SUCCESS',
               message: `Attributes added`
            } as ApiResponse);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p1 = `/view/:viewId/attrbutes/add`;
    registry.addItem('POST', p1);
    router.post(p1, ...httpAction);
}

export default reg;
