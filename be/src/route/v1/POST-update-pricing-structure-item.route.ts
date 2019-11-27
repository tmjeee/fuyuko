import {Registry} from "../../registry";
import {Router, Request, Response, NextFunction} from "express";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {param, body} from 'express-validator';
import {PricingStructureItem, PricingStructureItemWithPrice} from "../../model/pricing-structure.model";
import {doInDbConnection, QueryA, QueryResponse} from "../../db";
import {PoolConnection} from "mariadb";
import {ApiResponse} from "../../model/response.model";

const httpAction: any[] = [
    [
        param('pricingStructureId').exists().isNumeric(),
        body('pricingStructureItems').isArray(),
        body('pricingStructureItems.*.id').exists().isNumeric(),
        body('pricingStructureItems.*.itemId').exists().isNumeric(),
        body('pricingStructureItems.*.price').exists().isNumeric()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const pricingStructureId: number = Number(req.params.pricingStructureId);
        const pricingStructureItems: PricingStructureItemWithPrice[] =  req.body.pricingStructureItems;

        for (const pricingStructureItem of pricingStructureItems) {
            await doInDbConnection(async (conn: PoolConnection) => {

                const qc: QueryA = await conn.query(`
                    SELECT COUNT(*) AS COUNT 
                    FROM TBL_PRICING_STRUCTURE_ITEM AS I 
                    INNER JOIN TBL_PRICING_STRUCTURE AS P ON P.ID = I.PRICING_STRUCTURE_ID
                    WHERE I.ITEM_ID=? AND I.PRICING_STRUCTURE_ID=?;
                `, [pricingStructureItem.itemId, pricingStructureId]);

                if (qc.length <= 0 || qc[0].COUNT <= 0) { // insert
                    await conn.query(`
                        INSERT INTO TBL_PRICING_STRUCTURE_ITEM (ITEM_ID, PRICING_STRUCTURE_ID, PRICE) VALUES (?,?,?)
                    `, [pricingStructureItem.itemId, pricingStructureId, pricingStructureItem.price]);

                } else { // update
                    await conn.query(`
                        UPDATE TBL_PRICING_STRUCTURE_ITEM SET PRICE=? WHERE ITEM_ID=? AND PRICING_STRUCTURE_ID=?
                    `, [pricingStructureItem.price, pricingStructureItem.itemId, pricingStructureId]);
                }
            });
        }

        res.status(200).json({
           status: "SUCCESS",
           message: `Pricing updated`
        } as ApiResponse);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructure/:pricingStructureId/item`;
    router.post(p, ...httpAction);
}

export default reg;
