import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {param} from 'express-validator';
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {Validation} from "../../model/validation.model";
import {ApiResponse} from "../../model/api-response.model";

// CHECKED
const httpAction: any[] = [
    [
       param('viewId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const v: Validation[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT 
                    ID, VIEW_ID, NAME, DESCRIPTION, PROGRESS, CREATION_DATE, LAST_UPDATE                
                FROM TBL_VIEW_VALIDATION WHERE VIEW_ID=?
            `, [viewId]);

            return q.reduce((acc: Validation[], i: QueryI) => {
                const val: Validation = {
                    id: i.ID,
                    name: i.NAME,
                    description: i.DESCRIPTION,
                    progress: i.PROGRESS,
                    viewId: i.VIEW_ID,
                    creationDate: i.CREATION_DATE,
                    lastUpdate: i.LAST_UPDATE
                };
                acc.push(val);
                return acc;
            }, []);
        });

        res.status(200).json({
            status: 'SUCCESS',
            message: `Validations retrieved successfully`,
            payload: v
        } as ApiResponse<Validation[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/validations`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
