import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn, validateUserInAnyRoleMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryI} from "../../db";
import {Connection} from "mariadb";
import {QueryA} from "../../db/db";
import {View} from "../../model/view.model";
import {ROLE_VIEW} from "../../model/role.model";

const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    validateUserInAnyRoleMiddlewareFn([ROLE_VIEW]),
    async (req: Request, res: Response, next: NextFunction) => {
        await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT 
                     ID, NAME, DESCRIPTION
                FROM TBL_VIEW WHERE STATUS = 'ENABLED'
            `);

            const views: View[] = q.map((i: QueryI) => {
                return {
                    id: i.ID,
                    name: i.NAME,
                    description: i.DESCRIPTION
                } as View
            });

            res.status(200).json(views);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
   const p = `/views`;
   registry.addItem('GET', p);
   router.get(p, ...httpAction);
};

export default reg;
