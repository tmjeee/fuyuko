import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import { param, body } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT} from "../../model/role.model";
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {makeApiError, makeApiErrorObj} from "../../util";

const httpActions: any[] = [
    [
        param(`pricingStructureId`).exists().isNumeric(),
        body('itemId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_EDIT])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const pricingStructureId: number = Number(req.params.pricingSTructureId);
        const itemId: number = Number(req.params.itemId);

        await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_ITEM WHERE ID=? AND STATUS <> 'DELETED'`, [itemId]);
            if (q[0].COUNT > 0) {
                await conn.query(`
                    INSERT INTO TBL_PRICING_STRUCTURE_ITEM (ITEM_ID, PRICING_STRUCTURE_ID, PRICE) VALUES (?, ?, ?)
                `, [pricingStructureId, itemId, 0]);

                res.status(200).json(true);
            } else {
                res.status(400).json(
                    makeApiErrorObj(
                        makeApiError(`Item id ${itemId} do not exists anymore`, `itemId`, `${itemId}`, `API`)
                    )
                )
            }
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructure/:pricingStructureId/add-items`;
    registry.addItem(`POST`, p);
    router.post(p, ...httpActions);
};

export default reg;