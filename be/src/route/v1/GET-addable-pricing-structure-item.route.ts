import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response } from "express";
import { param } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_EDIT, ROLE_VIEW} from "../../model/role.model";
import {doInDbConnection, QueryA} from "../../db";
import {Connection, ConnectionConfig} from "mariadb";
import {PricingStructureItem} from "../../model/pricing-structure.model";

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
                    PARENT_ID,
                    VIEW_ID,
                    NAME,
                    DESCRIPTION,
                    STATUS,
                    CREATION_DATE,
                    LAST_UPDATE
                FROM TBL_ITEM AS I 
                WHERE I.STATUS <> 'DELETED' AND 
                I.VIEW_ID IN ( SELECT VIEW_ID FROM TBL_PRICING_STRUCTURE WHERE ID = ?) AND
                I.ID NOT IN (SELECT ITEM_ID FROM TBL_PRICING_STRUCTURE_ITEM WHERE PRICING_STRUCTURE_ID = ?) 
            `,[pricingStructureId, pricingStructureId]);

            const r: PricingStructureItem[] = [];
            for (const qi of q) {
                r.push({
                    id: null,
                    itemId: qi.ITEM_ID,
                    itemName: qi.NAME,
                    itemDescription: qi.DESCRIPTION
                });
            }
            res.status(200).json(r);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructure/:pricingStructureId/addable-items`;
    registry.addItem(`GET`, p);
    router.get(p, ...httpActions);
};

export default reg;
