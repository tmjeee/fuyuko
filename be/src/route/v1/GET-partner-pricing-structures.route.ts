import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {param} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import { Connection } from "mariadb";
import {ROLE_PARTNER, ROLE_VIEW} from "../../model/role.model";
import {PricingStructure} from "../../model/pricing-structure.model";
import {ApiResponse} from "../../model/api-response.model";


// CHECKED

const httpAction: any[] = [
    param('userId').exists().isNumeric(),
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_PARTNER])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const userId: number = Number(req.params.userId);

        const q: QueryA = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
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
                WHERE PS.ID IN (
                    SELECT PS.ID
                    FROM TBL_LOOKUP_USER_GROUP AS UG
                    LEFT JOIN TBL_LOOKUP_GROUP_ROLE AS GR ON GR.GROUP_ID = UG.GROUP_ID
                    LEFT JOIN TBL_ROLE AS R ON R.ID = GR.ROLE_ID
                    LEFT JOIN TBL_LOOKUP_PRICING_STRUCTURE_GROUP AS PSG ON PSG.GROUP_ID = UG.GROUP_ID
                    LEFT JOIN TBL_PRICING_STRUCTURE AS PS ON PS.ID = PSG.PRICING_STRUCTURE_ID
                    WHERE UG.USER_ID = ? AND R.NAME = ? AND PS.STATUS = 'ENABLED'
                ) AND PS.STATUS = 'ENABLED' AND V.STATUS = 'ENABLED'
            `, [userId, ROLE_PARTNER]);

            return q;
        });

        const pricingStructures: PricingStructure[] = q.reduce((acc: PricingStructure[], curr: QueryI) => {
            const v: PricingStructure = {
                id: curr.PS_ID,
                name: curr.PS_NAME,
                viewId: curr.PS_VIEW_ID,
                viewName: curr.V_NAME,
                description: curr.PS_DESCRIPTION,
                creationDate: curr.PS_CREATION_DATE,
                lastUpdate: curr.PS_LAST_UPDATE
            };
            acc.push(v);
            return acc;
        }, []);

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Pricing structure retrieved',
            payload: pricingStructures
        } as ApiResponse<PricingStructure[]>);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/user/:userId/partner-pricing-structures`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
