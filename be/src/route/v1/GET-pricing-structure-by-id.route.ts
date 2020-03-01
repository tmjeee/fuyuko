import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import { param } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT, ROLE_VIEW} from "../../model/role.model";
import {doInDbConnection, QueryA} from "../../db";
import {Connection} from "mariadb";
import {PricingStructure} from "../../model/pricing-structure.model";

const httpActions: any[] = [
    [
        param(`pricingStructureId`).exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const pricingStructureId: number = Number(req.params.pricingStructureId);

        await doInDbConnection(async (conn: Connection) => {

            const q: QueryA = await conn.query(`
                SELECT 
                    ID,
                    VIEW_ID,
                    NAME,
                    DESCRIPTION,
                    STATUS,
                    CREATION_DATE,
                    LAST_UPDATE
                FROM 
                    TBL_PRICING_STRUCTURE
                WHERE
                    ID = ? 
            `, [pricingStructureId]);

            if (q.length > 0) {
                const pricingStructure: PricingStructure = {
                   id: q[0].ID,
                   name: q[0].NAME,
                   viewId: q[0].VIEW_ID,
                   description: q[0].DESCRIPTION
                };
                res.status(200).json(pricingStructure);
            } else {
                res.status(200).json(null);
            }
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructure/:pricingStructureId`;
    registry.addItem(`GET`, p);
    router.get(p, ...httpActions);
};

export default reg;
