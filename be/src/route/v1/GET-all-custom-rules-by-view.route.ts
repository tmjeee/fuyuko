import {NextFunction, Router, Request, Response } from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {CustomRuleForView} from "../../model/custom-rule.model";
import { param } from "express-validator";
import {ROLE_VIEW} from "../../model/role.model";

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const r: CustomRuleForView[] = await doInDbConnection(async (conn: Connection) => {
            return (await conn.query(`
                SELECT 
                    R.ID AS R_ID,
                    R.NAME AS R_NAME,
                    R.DESCRIPTION AS R_DESCRIPTION,
                    V.ID AS V_ID,
                    V.CUSTOM_RULE_ID AS V_CUSTOM_RULE_ID,
                    V.STATUS AS V_STATUS,
                    V.VIEW_ID AS V_VIEW_ID,
                    V.CREATION_DATE AS V_CREATION_DATE,
                    V.LAST_UPDATE AS V_LAST_UPDATE
                FROM TBL_CUSTOM_RULE_VIEW AS V
                INNER JOIN TBL_CUSTOM_RULE AS R ON R.ID = V.CUSTOM_RULE_ID
            `) as QueryA).reduce((acc: CustomRuleForView[], i: QueryI) => {
                const r: CustomRuleForView = {
                    id: i.R_ID,
                    name: i.R_NAME,
                    description: i.R_DESCRIPTION,
                    status: i.V_STATUS,
                    customRuleViewId: i.V_ID,
                    viewId: i.V_VIEW_ID_
                };
                acc.push(r);
                return acc;
            }, []);
        });
        res.status(200).json(r);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/custom-rules`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
