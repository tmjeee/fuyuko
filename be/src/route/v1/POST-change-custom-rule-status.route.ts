import {NextFunction, Router, Request, Response } from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {param} from "express-validator";
import {ROLE_EDIT} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";

// CHECKED

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('customRuleId').exists().isNumeric(),
        param('status').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const customRuleId: number = Number(req.params.customRuleId);
        const status: string = req.params.status;

        await doInDbConnection(async (conn: Connection) => {
            await conn.query(`
                UPDATE TBL_CUSTOM_RULE_VIEW SET STATUS=? WHERE CUSTOM_RULE_ID=? AND VIEW_ID=?
            `, [status, customRuleId, viewId]);
        });

        res.status(200).json({
           status: 'SUCCESS',
           message: `Custom rule with id ${customRuleId} for view ${viewId} updated`
        } as ApiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/custom-rules/:customRuleId/status/:status`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
