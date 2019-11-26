import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {param} from 'express-validator';
import {doInDbConnection} from "../../db";
import {PoolConnection} from "mariadb";
import {ApiResponse} from "../../model/response.model";

const httpAction: any[] = [
    [
       param('viewId').exists().isNumeric(),
       param('pricingStructureId').exists().isNumeric(),
       param('status').exists()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const status: string = req.params.status;

        await doInDbConnection(async (conn: PoolConnection) => {
            conn.query(`
                UPDATE TBL_PRICING_STRUCTURE SET STATUS=? WHERE ID=? AND VIEW_ID=?
            `, [status, pricingStructureId, viewId]);
        });

        res.status(200).json({
            status: "SUCCESS",
            message: `Pricing Structure status updated`
        } as ApiResponse)
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/pricingStructure/:pricingStructureId/status/:status`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
