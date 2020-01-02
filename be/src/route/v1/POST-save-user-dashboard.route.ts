import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response } from "express";
import {param, body} from 'express-validator';
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {SerializedDashboardFormat} from "../../model/dashboard-serialzable.model";
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {Connection} from "mariadb";


const httpAction: any[] = [
    [
        param('userId').exists().isNumeric(),
        body('serializeFormat').exists()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const userId: number = Number(req.params.userId);
        const serializeFormat: SerializedDashboardFormat =  req.body.serializeFormat;

        const serializeFormatInString: string = JSON.stringify(serializeFormat);

        await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query('SELECT COUNT(*) FROM TBL_USER_DASHBOARD WHERE USER_ID=?', [userId]);
            const c: number = q[0].COUNT;
            if (c > 0) { // update
                const q1: QueryResponse = await conn.query(`UPDATETBL_USER_DASHBOARD SET USER_ID=?, SERIALIZED_DATA=?`, [userId, serializeFormatInString]);

            } else { // insert
                const q1: QueryResponse = await conn.query(`INSERT INTO TBL_USER_DASHBOARD (USER_ID, SERIALIZED_DATA) VALUES(?,?)`, [userId, serializeFormatInString]);
            }
        });

        res.status(200).json(true);
    }
]



const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/dashboard/save`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);

}

export default reg;
