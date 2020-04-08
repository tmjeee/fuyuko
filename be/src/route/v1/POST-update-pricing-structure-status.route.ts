import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {param} from 'express-validator';
import {doInDbConnection} from "../../db";
import {Connection} from "mariadb";
import {ApiResponse} from "../../model/api-response.model";
import {ROLE_EDIT} from "../../model/role.model";

const httpAction: any[] = [
    [
       param('pricingStructureId').exists().isNumeric(),
       param('status').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const status: string = req.params.status;

        await doInDbConnection(async (conn: Connection) => {
            conn.query(`
                UPDATE TBL_PRICING_STRUCTURE SET STATUS=? WHERE ID=?
            `, [status, pricingStructureId]);
        });

        res.status(200).json({
            status: "SUCCESS",
            message: `Pricing Structure status updated`
        } as ApiResponse)
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructure/:pricingStructureId/status/:status`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
