import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check} from "express-validator";
import {doInDbConnection, QueryResponse} from "../../db";
import {PoolConnection} from "mariadb";
import {DeleteRoleFromGroupResponse} from "../../model/role.model";

const httpAction: any[] = [
    [
        check('groupId').exists().isNumeric(),
        check('roleId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const groupId: number = Number(req.params.groupId);
        const roleId: number = Number(req.params.roleId);

        await doInDbConnection(async (conn: PoolConnection) => {
            const q: QueryResponse = await conn.query(`
                DELETE FROM TBL_LOOKUP_GROUP_ROLE WHERE GROUP_ID = ? AND ROLE_ID = ?
            `, [groupId, roleId])

            res.status(200).json({
                status: (q.affectedRows ? 'SUCCESS' : 'ERROR'),
                message: (q.affectedRows ? `Role ${roleId} deleted` : `Role ${roleId} is not in group ${groupId}`),
                entriesDeleted: q.affectedRows
            } as DeleteRoleFromGroupResponse)
        });
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/group/:groupId/role/:roleId`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}

export default reg;
