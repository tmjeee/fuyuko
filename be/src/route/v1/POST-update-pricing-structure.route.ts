import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {body} from 'express-validator';
import {doInDbConnection, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {PricingStructure} from "../../model/pricing-structure.model";
import {ApiResponse} from "../../model/response.model";
import {ROLE_EDIT} from "../../model/role.model";

const httpAction: any[] = [
    [
       body('pricingStructures').isArray(),
       body('pricingStructures.*.name').exists(),
       body('pricingStructures.*.description').exists(),
       body('pricingStructures.*.viewId').exists().isNumeric(),
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next:NextFunction) => {

        const pricingStructures: PricingStructure[] = req.body.pricingStructures;

        const q: QueryResponse = await doInDbConnection(async (conn: Connection) => {
            for (const pricingStructure of pricingStructures) {
                if (pricingStructure.id <= 0) { // insert
                    const q: QueryResponse = await conn.query(`
                        INSERT INTO TBL_PRICING_STRUCTURE (NAME, DESCRIPTION, VIEW_ID, STATUS) VALUE (?,?,?, 'ENABLED')
                    `, [pricingStructure.name, pricingStructure.description, pricingStructure.viewId]);
                    return q;
                } else { // update
                    const q: QueryResponse = await conn.query(`
                        UPDATE TBL_PRICING_STRUCTURE SET NAME=?, DESCRIPTION=? WHERE ID=? AND VIEW_ID=? AND STATUS='ENABLED' 
                    `, [pricingStructure.name, pricingStructure.description, pricingStructure.id, pricingStructure.viewId]);
                    return q;
                }
            }
        });

        if (q.affectedRows > 0) {
            res.status(200).json({
                status: `SUCCESS`,
                message: `Pricing structure updated`
            } as ApiResponse);
        } else {
            res.status(400).json({
                status: `ERROR`,
                message: `Pricing structure not updated`
            } as ApiResponse);
        }
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructures`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
