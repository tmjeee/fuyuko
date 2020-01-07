import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn, validateUserInAnyRoleMiddlewareFn} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {Role, ROLE_VIEW} from "../../model/role.model";

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
                FROM TBL_ROLE
            `);

            const roles: Role[] = q.map((i: QueryI) => {
                return {
                   id: i.ID,
                   name: i.NAME,
                   description: i.DESCRIPTION
                } as Role;
            });

            res.status(200).json(roles);
        });
    }
]

const reg = (router: Router, registry: Registry) => {
    const p = `/roles`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
