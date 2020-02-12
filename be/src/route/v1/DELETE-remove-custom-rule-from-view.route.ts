import {NextFunction, Router, Request, Response } from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {param, body} from "express-validator";
import {ROLE_EDIT} from "../../model/role.model";

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        body('customRuleIds').exists().isArray(),
        body('customRuleIds.*').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const customRuleIds: number[] = req.body.customRuleIds;

        await doInDbConnection(async (conn: Connection) => {
            for (const customRuleId of customRuleIds) {
                await conn.query(`
                    DELETE FROM TBL_CUSTOM_RULE_VIEW WHERE CUSTOM_RULE_ID=? AND VIEW_ID=?
                `, [customRuleId, viewId]);
            }
        });

        res.status(200).json(true);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/custom-rules`;
    registry.addItem('DELETE', p);
    router.delete(p, ...httpAction);
}

export default reg;
