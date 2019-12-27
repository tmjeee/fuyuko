import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check} from "express-validator";
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {makeApiError, makeApiErrorObj} from "../../util";
import {ApiResponse} from "../../model/response.model";

const httpAction: any[] = [
    [
        check('groupId').exists().isNumeric(),
        check('roleName').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const groupId: number = Number(req.params.groupId);
        const roleName: string = req.params.roleName;

        await doInDbConnection(async (conn: Connection) => {
            const qs: QueryA = await conn.query(`SELECT ID FROM TBL_ROLE WHERE NAME = ?`, [roleName]);
            if (qs.length <= 0) {
                res.status(400).json(makeApiErrorObj(
                    makeApiError(`Invalid role ${roleName}, roleName not found in system`, 'roleName', roleName, 'System')
                ));
                return;
            }
            const roleId: number = qs[0].ID;
            const q: QueryResponse = await conn.query(`
                DELETE FROM TBL_LOOKUP_GROUP_ROLE WHERE GROUP_ID = ? AND ROLE_ID = ?
            `, [groupId, roleId])

            res.status(200).json({
                status: (q.affectedRows ? 'SUCCESS' : 'ERROR'),
                message: (q.affectedRows ? `Role ${roleName} deleted from group ${groupId}` : `Role ${roleName} is not in group ${groupId}`),
            } as ApiResponse)
        });
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/group/:groupId/role/:roleName`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}

export default reg;
