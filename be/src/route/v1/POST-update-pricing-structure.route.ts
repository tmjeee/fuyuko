import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check, body} from 'express-validator';
import {doInDbConnection} from "../../db";
import {PoolConnection} from "mariadb";
import {PricingStructure} from "../../model/pricing-structure.model";
import {ApiResponse} from "../../model/response.model";

const httpAction: any[] = [
    [
       body('pricingStructures').isArray(),
       body('pricingStructures.*.name').exists(),
       body('pricingStructures.*.description').exists()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next:NextFunction) => {

        const pricingStructures: PricingStructure[] = req.body.pricingStructures;

        await doInDbConnection(async (conn: PoolConnection) => {

            for (const pricingStructure of pricingStructures) {
                if (pricingStructure.id <= 0) { // insert
                    conn.query(`
                        INSERT INTO TBL_PRICING_STRUCTURE (NAME, DESCRIPTION, STATUS) VALUE (?,?, 'ENABLED')
                    `, [pricingStructure.name, pricingStructure.description]);
                } else { // update
                    conn.query(`
                        UPDATE TBL_PRICING_STRUCTURE SET NAME=?, DESCRIPTION=? WHERE ID=? AND STATUS='ENABLED' 
                    `, [pricingStructure.name, pricingStructure.description, pricingStructure.id]);
                }
            }
        });

        res.status(200).json({
            status: "SUCCESS",
            message: `Pricing structure updated`
        } as ApiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructures`;
    registry.addItem('POST', p);
    router.post(p, ...httpAction);
}

export default reg;
