import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "./common-middleware";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {PricingStructure} from "../../model/pricing-structure.model";
import {ROLE_VIEW} from "../../model/role.model";
import {ApiResponse} from "../../model/api-response.model";

// CHECKED
const httpAction: any[] = [
    [
    ],
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);


        await doInDbConnection(async (conn: Connection) => {

            const q: QueryA = await conn.query(`
                SELECT 
                    PS.ID AS PS_ID, 
                    PS.VIEW_ID AS PS_VIEW_ID, 
                    PS.NAME AS PS_NAME, 
                    V.NAME AS V_NAME,
                    PS.DESCRIPTION AS PS_DESCRIPTION, 
                    PS.CREATION_DATE AS PS_CREATION_DATE, 
                    PS.LAST_UPDATE AS PS_LAST_UPDATE
                FROM TBL_PRICING_STRUCTURE AS PS
                LEFT JOIN TBL_VIEW AS V ON V.ID = PS.VIEW_ID 
                WHERE PS.STATUS <> 'DELETED' AND V.STATUS = 'ENABLED' 
            `, []);

            const pricingStructures: PricingStructure[] = q.reduce((acc: PricingStructure[], i: QueryI) => {

                const pricingStructure: PricingStructure = {
                    id: i.PS_ID,
                    name: i.PS_NAME,
                    viewName: i.V_NAME,
                    viewId: i.PS_VIEW_ID,
                    description: i.PS_DESCRIPTION,
                    creationDate: i.PS_CREATION_DATE,
                    lastUpdate: i.PS_LAST_UPDATE
                } as PricingStructure;
                acc.push(pricingStructure);

                return acc;
            }, []);

            res.status(200).json( {
                status: 'SUCCESS',
                message: `Pricing structures received successfully`,
                payload: pricingStructures
            } as ApiResponse<PricingStructure[]>);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructures`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
