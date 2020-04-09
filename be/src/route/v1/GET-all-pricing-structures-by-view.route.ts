import {NextFunction, Request, Response, Router} from "express";
import {Registry} from "../../registry";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import { param } from "express-validator";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {PricingStructure} from "../../model/pricing-structure.model";
import {ApiResponse} from "../../model/api-response.model";

// CHECKED: UNUSED
const httpAction: any[] = [
    [
       param('viewId').exists().isNumeric()
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);

        const ps: PricingStructure[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT 
                    ID,
                    VIEW_ID,
                    NAME,
                    DESCRIPTION,
                    STATUS,
                    CREATION_DATE,
                    LAST_UPDATE
                FROM TBL_PRICING_STRUCTURE WHERE VIEW_ID=?
            `, [viewId]);

            return q.reduce((acc: PricingStructure[], i: QueryI) => {
                const p: PricingStructure = {
                   id: i.ID,
                   viewId: i.VIEW_ID,
                   name: i.NAME,
                   description: i.DESCRIPTION,
                   creationDate: i.CREATION_DATE,
                   lastUpdate: i.LAST_UPDATE,
                } as PricingStructure;
                acc.push(p);
                return acc;
            }, []);
        });

        res.status(200).json({
            status: 'SUCCESS',
            message: `Pricing structures retrieved successfully`,
            payload: ps
        } as ApiResponse<PricingStructure[]>);
    }
];


const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructures/view/:viewId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
