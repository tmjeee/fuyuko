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
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {PricingStructure} from "../../model/pricing-structure.model";
import {ApiResponse} from "../../model/api-response.model";
import {ROLE_EDIT} from "../../model/role.model";

// CHECKED

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
        const badUpdates: string[] = [];

        await doInDbConnection(async (conn: Connection) => {
            for (const pricingStructure of pricingStructures) {
                const viewId: number = pricingStructure.viewId;
                if (pricingStructure.id <= 0) { // insert
                    const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_PRICING_STRUCTURE WHERE NAME=? AND VIEW_ID=?`, [pricingStructure.name, viewId]);
                    if (qq[0].COUNT > 0) {
                        badUpdates.push(`Pricing structure with name ${pricingStructure.name} aready exists in view id ${viewId}`);
                    } else {
                        const q: QueryResponse = await conn.query(`
                            INSERT INTO TBL_PRICING_STRUCTURE (NAME, DESCRIPTION, VIEW_ID, STATUS) VALUE (?,?,?, 'ENABLED')
                        `, [pricingStructure.name, pricingStructure.description, pricingStructure.viewId]);
                        if (q.affectedRows <= 0) {
                            badUpdates.push(`Unable to persist pricing structure name ${pricingStructure.name}`);
                        }
                    }
                } else { // update
                    const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_PRICING_STRUCTURE WHERE ID=?`, [pricingStructure.id]);
                    if (qq[0].COUNT <= 0) { // pricing structure with id do not exists
                        badUpdates.push(`Pricing structrue with id ${pricingStructure.id} do not exists`);
                    } else {
                        const q: QueryResponse = await conn.query(`
                        UPDATE TBL_PRICING_STRUCTURE SET NAME=?, DESCRIPTION=? WHERE ID=? AND VIEW_ID=? AND STATUS='ENABLED' 
                    `, [pricingStructure.name, pricingStructure.description, pricingStructure.id, pricingStructure.viewId]);
                        if (q.affectedRows <= 0) {
                            badUpdates.push(`Unable to update pricing structure id ${pricingStructure.id}`);
                        }
                    }
                }
            }
        });

        if (badUpdates.length <= 0) {
            res.status(200).json({
                status: `SUCCESS`,
                message: `Pricing structure updated`
            } as ApiResponse);
        } else {
            res.status(200).json({
                status: `ERROR`,
                message: badUpdates.join(', ')
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
