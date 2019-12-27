import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {check, body} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {View} from "../../model/view.model";
import {doInDbConnection, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {e} from '../../logger';
import {ApiResponse} from "../../model/response.model";

const httpAction: any[] = [
    [
         body().isArray(),
         body('*.name').exists(),
         body('*.description').exists(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const views: View[] = req.body;

        const badUpdates: any[] = [];
        const badInserts: any[] = [];
        for (const view of views) {
            await doInDbConnection(async (conn: Connection) => {
                const id = view.id;
                const name = view.name;
                const descrption = view.description;

                if (!!!id || id <= 0) { // create new copy
                    const q: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW (NAME, DESCRIPTION, STATUS) VALUES (?, ?, 'ENABLED')`, [name, descrption]);
                    if (q.affectedRows == 0) {
                       badInserts.push(view);
                    }
                } else { // update
                    const q: QueryResponse = await conn.query(`UPDATE TBL_VIEW SET NAME=?, DESCRIPTION=? WHERE ID=? AND STATUS='ENABLED'`, [id, name, descrption]);
                    if (q.affectedRows == 0) {
                        badUpdates.push(view);
                    }
                }
            });
        }


        if (badInserts.length > 0) {
            e(`bad inserts`, ...badInserts);
            res.status(200).json({
                status: 'ERROR',
                message: `bad view inserts`
            } as ApiResponse)
            return;
        }
        if (badUpdates.length > 0) {
            e(`bad updates`, ...badInserts);
            res.status(200).json({
                status: 'ERROR',
                message: `bad views updates`
            } as ApiResponse)
            return;
        }


        res.status(200).json({
           status: 'SUCCESS',
           message: `views updated`
        } as ApiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p =`/views/update`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
