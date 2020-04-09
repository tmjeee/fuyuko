import {NextFunction, Router, Request, Response } from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {CustomRule} from "../../model/custom-rule.model";
import {ROLE_VIEW} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";

// CHECKED
const httpAction: any[] = [
    [],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const r: CustomRule[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT ID, NAME, DESCRIPTION FROM TBL_CUSTOM_RULE
            `);
            return q.reduce((customRules: CustomRule[], qi: QueryI) => {
                const r: CustomRule = {
                    id: qi.ID,
                    name: qi.NAME,
                    description: qi.DESCRIPTION
                };
                customRules.push(r);
                return customRules;
            }, []);
        });
        res.status(200).json({
            status: 'SUCCESS',
            message: `Custom Rule Retrieval Success`,
            payload: r
        } as ApiResponse<CustomRule[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/custom-rules`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
