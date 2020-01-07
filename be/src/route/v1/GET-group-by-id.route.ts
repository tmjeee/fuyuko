import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn, validateUserInAnyRoleMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {Group} from "../../model/group.model";
import {Role, ROLE_VIEW} from "../../model/role.model";


const httpAction: any[] = [
    [
        check('groupId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    validateUserInAnyRoleMiddlewareFn([ROLE_VIEW]),
    async (req: Request, res: Response, next: NextFunction) => {
        doInDbConnection(async (conn: Connection) => {
            const groupId: number = Number(req.params.groupId);
            const q: QueryA = await conn.query(`
                SELECT 
                    G.ID AS G_ID,
                    G.NAME AS G_NAME,
                    G.DESCRIPTION AS G_DESCRIPTION,
                    G.STATUS AS G_STATUS,
                    R.ID AS R_ID,
                    R.NAME AS R_NAME,
                    R.DESCRIPTION AS R_DESCRIPTION
                FROM TBL_GROUP AS G
                LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                LEFT JOIN TBL_GROUP AS G ON G.ID = LGR.GROUP_ID
                LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                WHERE G.STATUS = 'ENABLED' AND G.ID=?
            `, [groupId]);

            const group: Group = q.reduce((group: Group, c: QueryI, index: number) => {
                const groupId: number = c.G_ID;
                const groupName: string = c.G_NAME;
                const groupDescription: string = c.G_DESCRIPTION;
                const groupStatus: string = c.G_STATUS;
                if (!!!group) {
                    group = {
                        id: groupId,
                        name: groupName,
                        description: groupDescription,
                        status: groupStatus,
                        roles: []
                    } as Group;
                }
                const roleId: number = c.R_ID;
                const roleName: string = c.R_NAME;
                const roleDescription: string = c.R_DESCRIPTION;
                group.roles.push({
                    id: roleId,
                    name: roleName,
                    description: roleDescription
                } as Role);
                return group;
            }, null);

            res.status(200).json(group);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/group/:groupId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
