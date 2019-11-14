import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {PoolConnection} from "mariadb";
import {AddRoleToGroupResponse} from "../../model/role.model";

const httpAction: any[] = [
    [
        check('groupId').exists().isNumeric(),
        check('roleId').exists().isNumeric(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const groupId: number = Number(req.params.groupId);
        const roleId: number = Number(req.params.roleId);

        await doInDbConnection(async (conn: PoolConnection) => {
            const q: QueryA = await conn.query(`
               SELECT COUNT(*) AS COUNT FROM TBL_LOOKUP_GROUP_ROLE WHERE GROUP_ID = ? AND ROLE_ID = ? 
            `, [groupId, roleId]);

            if (!!q.length && !!Number(q[0].COUNT)) {
                const q1: QueryResponse = await conn.query(`INSERT INTO TBL_LOOKUP_GROUP_ROLE (GROUP_ID, ROLE_ID) VALUES (?, ?`, [groupId, roleId]);
                if (q1.affectedRows) {
                    res.status(200).json({
                        status: 'SUCCESS',
                        message: `Role ${roleId} added group ${groupId}`
                    } as AddRoleToGroupResponse);
                    return;
                } else {
                    res.status(200).json({
                        status: 'ERROR',
                        message: `Role ${roleId} failed to be added to group ${groupId}`
                    } as AddRoleToGroupResponse);
                    return;
                }
            }

            res.status(200).json({
                status: 'ERROR',
                message: `Role ${roleId} already exists in group ${groupId}`
            } as AddRoleToGroupResponse);

        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = '/group/:groupId/role/:roleId';
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;