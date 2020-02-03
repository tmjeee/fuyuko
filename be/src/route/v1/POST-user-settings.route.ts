import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import { param } from "express-validator";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {DEFAULT_SETTINGS} from "../../service/user-settings.service";

const httpAction: any[] = [
    [
        param('userId').exists().isNumeric(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const userId: number = Number(req.params.userId);

        for (const bodyParam in req.body) {
            const k = bodyParam;
            const v = req.body[bodyParam];

            // @ts-ignore
            const dv = DEFAULT_SETTINGS[k];
            const tv = (dv !== null && dv !== undefined) ? typeof dv : 'string';

            await doInDbConnection(async (conn: Connection) => {
               conn.query(`INSERT INTO TBL_USER_SETTING (USER_ID, SETTING, VALUE, TYPE) VALUES (?,?,?,?)`,
                   [userId, k, v, tv]);
            });
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/settings`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
};

export default reg;
