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
                    ID, VIEW_ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE 
                FROM TBL_PRICING_STRUCTURE WHERE STATUS <> 'DELETED'
            `, []);

            const pricingStructures: PricingStructure[] = q.reduce((acc: PricingStructure[], i: QueryI) => {

                const pricingStructure: PricingStructure = {
                    id: i.ID,
                    name: i.NAME,
                    viewId: i.VIEW_ID,
                    description: i.DESCRIPTION,
                    creationDate: i.CREATION_DATE,
                    lastUpdate: i.LAST_UPDATE
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
