import {NextFunction, Router, Request, Response} from "express";
require('express-async-errors');
import {Registry} from "../../registry";
import {check} from 'express-validator';
import {validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA} from "../../db";
import {PoolConnection} from "mariadb";
import {makeApiError, makeApiErrorObj} from "../../util";

const httpAction: any[] = [
    [
        check(`itemImageId`).exists().isNumeric()
    ],
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const itemImageId: number = Number(req.params.itemImageId);

        doInDbConnection(async (conn: PoolConnection) => {

            const q: QueryA = await conn.query(`
                SELECT 
                    ID, 
                    ITEM_ID,
                    \`PRIMARY\`,
                    MIME_TYPE,
                    NAME,
                    SIZE,
                    CONTENT
                FROM TBL_ITEM_IMAGE WHERE ID = ?
            `, [itemImageId]);

            if (q.length <= 0) {
                const q1: QueryA = await conn.query(`
                    SELECT
                        ID, TAG, NAME, MIME_TYPE, SIZE, CONTENT 
                    FROM TBL_GLOBAL_IMAGE WHERE TAG = ?
                `, ['no-item-image']);


                if (q1.length <= 0) {
                    res.status(400).json(
                        makeApiErrorObj(
                            makeApiError(`No Item image for item image id ${itemImageId}`, `itemImageId`, `${itemImageId}`, `API`)
                        )
                    );
                    return;
                }

                const contentLength: number = q1[0].SIZE;
                const contentType: string = q1[0].MIME_TYPE;
                const buffer: Buffer = q1[0].CONTENT;

                res.header('Content-Length', String(contentLength));
                res.status(200)
                    .contentType(contentType)
                    .end(buffer);
                return;
            }

            const contentLength: number = q[0].SIZE;
            const contentType: string = q[0].MIME_TYPE;
            const buffer: Buffer = q[0].CONTENT;

            res.header('Content-Length', String(contentLength));
            res.status(200)
                .contentType(contentType)
                .end(buffer);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/item/image/:itemImageId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;