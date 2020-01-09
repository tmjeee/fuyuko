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
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {Group} from "../../model/group.model";
import {Role, ROLE_VIEW} from "../../model/role.model";
import {Paginable} from "../../model/pagnination.model";

const httpAction: any[] = [
    [
        check('roleName').exists(),
        check('groupName')
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const roleName: string = req.params.roleName;
        const groupName: string = req.params.groupName;

        await doInDbConnection(async (conn: Connection) => {

            const qTotal: QueryA = await conn.query(`
                SELECT 
                    COUNT(*) AS COUNT
                FROM TBL_GROUP AS G
                WHERE G.STATUS = 'ENABLED'
                AND G.ID NOT IN (
                    SELECT 
                        G.ID
                     FROM TBL_GROUP AS G
                     LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                     LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                     WHERE R.NAME = ? 
                ) AND G.NAME LIKE ?
            `,[roleName, `%${groupName}%`]);
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
                LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                WHERE G.STATUS = 'ENABLED' 
                AND G.ID NOT IN (
                    SELECT 
                        G.ID
                     FROM TBL_GROUP AS G
                     LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS LGR ON LGR.GROUP_ID = G.ID
                     LEFT JOIN TBL_ROLE AS R ON R.ID = LGR.ROLE_ID
                     WHERE R.NAME = ? 
                ) AND G.NAME LIKE ?
            `, [roleName, `%${groupName}%`]);
            const m: Map<number/*groupId*/, Group> = new Map();
            const groups: Group[] = q.reduce((groups: Group[], c: QueryI) => {
                const groupId: number = c.G_ID;
                const groupName: string = c.G_NAME;
                const groupDescription: string = c.G_DESCRIPTION;
                const groupStatus: string = c.G_STATUS;
                if (!m.has(groupId)) {
                    const g: Group = {
                        id: groupId,
                        name: groupName,
                        description: groupDescription,
                        status: groupStatus,
                        roles: []
                    } as Group;
                    groups.push(g);
                    m.set(groupId, g);
                }
                const g: Group = m.get(groupId);
                const roleId: number = c.R_ID;
                const roleName: string = c.R_NAME;
                const roleDescription: string = c.R_DESCRIPTION;
                g.roles.push({
                    id: roleId,
                    name: roleName,
                    description: roleDescription
                } as Role);
                return groups;
            }, []);

            const totalGroups: number = qTotal[0].COUNT;
            res.status(200).json({
                total: totalGroups,
                limit: totalGroups,
                offset: 0,
                payload: groups
            } as Paginable<Group>);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/groups/no-role/:roleName/:groupName?`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);

};

export default reg;
