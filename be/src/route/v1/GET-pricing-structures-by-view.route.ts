import {Registry} from "../../registry";
import {Router, NextFunction, Request, Response} from "express";
import { param } from "express-validator";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {PricingStructure} from "../../model/pricing-structure.model";
import {ApiResponse} from "../../model/api-response.model";

const httpAction: any[] = [
   [
       param(`viewId`).exists().isNumeric()
   ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const pricingStructures: PricingStructure[] = await doInDbConnection(async (conn: Connection) => {
            const query: QueryA = await conn.query(`
                SELECT
                    PS.ID AS PS_ID, 
                    PS.VIEW_ID AS PS_VIEW_ID, 
                    PS.NAME AS PS_NAME, 
                    V.NAME AS V_NAME,
                    PS.DESCRIPTION AS PS_DESCRIPTION, 
                    PS.STATUS AS PS_STATUS, 
                    PS.CREATION_DATE AS PS_CREATION_DATE, 
                    PS.LAST_UPDATE AS PS_LAST_UPDATE
                FROM TBL_PRICING_STRUCTURE AS PS
                LEFT JOIN TBL_VIEW AS V ON V.ID = PS.VIEW_ID
                WHERE PS.VIEW_ID=? AND PS.STATUS = 'ENABLED' AND V.STATUS='ENABLED'
            `, [viewId]);

            return query.reduce((pricingStructures: PricingStructure[], i: QueryI) => {
                const pricingStructure: PricingStructure = {
                    id: i.PS_ID,
                    viewId: i.PS_VIEW_ID,
                    name: i.PS_NAME,
                    viewName: i.V_NAME,
                    lastUpdate: i.PS_LAST_UPDATE,
                    description: i.PS_DESCRIPTION,
                    creationDate: i.PS_CREATION_DATE,
                };
                pricingStructures.push(pricingStructure);
                return pricingStructures;
            }, []);
        });
        res.status(200).json( {
            status: 'SUCCESS',
            message: `Pricing Structures retrieved`,
            payload: pricingStructures
        } as ApiResponse<PricingStructure[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/pricingStructures`;
    router.get(p, ...httpAction);
    registry.addItem('GET', p);
};

export default reg;