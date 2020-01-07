import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {ApiResponse} from "../../model/response.model";
import {makeApiError, makeApiErrorObj} from "../../util";
import {ROLE_ADMIN, ROLE_EDIT} from "../../model/role.model";

const httpAction: any[] = [
    [
        check('groupId').exists().isNumeric(),
        check('roleName').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_ADMIN])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const groupId: number = Number(req.params.groupId);
        const roleName: string = req.params.roleName;

        await doInDbConnection(async (conn: Connection) => {

            const qa: QueryA = await conn.query('SELECT ID FROM TBL_ROLE WHERE NAME = ?', [roleName]);
            if (!!!qa.length) {
                res.status(400).json(makeApiErrorObj(
                    makeApiError(`Invalid role ${roleName}`, 'roleName', roleName, 'System')
                ));
                return;
            }
            const roleId: number = qa[0].ID;

            const q: QueryA = await conn.query(`
               SELECT COUNT(*) AS COUNT FROM TBL_LOOKUP_GROUP_ROLE WHERE GROUP_ID = ? AND ROLE_ID = ?
            `, [groupId, roleId]);

            if (!!q.length && !!!Number(q[0].COUNT)) {
                const q1: QueryResponse = await conn.query(`INSERT INTO TBL_LOOKUP_GROUP_ROLE (GROUP_ID, ROLE_ID) VALUES (?, ?)`, [groupId, roleId]);
                if (q1.affectedRows) {
                    res.status(200).json({
                        status: 'SUCCESS',
                        message: `Role ${roleName} added to group ${groupId}`
                    } as ApiResponse);
                    return;
                } else {
                    res.status(200).json({
                        status: 'ERROR',
                        message: `Role ${roleName} failed to be added to group ${groupId}`
                    } as ApiResponse);
                    return;
                }
            }

            res.status(200).json({
                status: 'ERROR',
                message: `Role ${roleName} already exists in group ${groupId}`
            } as ApiResponse);

        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/group/:groupId/role/:roleName';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
