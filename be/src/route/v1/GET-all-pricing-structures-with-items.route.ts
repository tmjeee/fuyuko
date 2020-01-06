import {NextFunction, Router, Request, Response} from "express";
import {Registry} from "../../registry";
import {validateJwtMiddlewareFn, validateMiddlewareFn} from "./common-middleware";
import {check} from 'express-validator';
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {
    PricingStructureItemWithPrice,
    PricingStructureWithItems
} from "../../model/pricing-structure.model";
import {getChildrenWithConn} from "../../service/pricing-structure-item.service";



const httpAction: any[] = [
    [
        check('pricingStructureId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const pricingStructureId: number = Number(req.params.pricingStructureId);

        await doInDbConnection(async (conn: Connection) => {

            const q: QueryA = await conn.query(`
                SELECT
                    I.ID AS I_ID,
                    I.PARENT_ID AS I_PARENT_ID,
                    I.VIEW_ID AS I_VIEW_ID,
                    I.NAME AS I_NAME,
                    I.DESCRIPTION AS I_DESCRIPTION,
                    I.STATUS AS I_STATUS,
                    
                    PS.ID AS PS_ID,
                    PS.VIEW_ID AS PS_VIEW_ID,
                    PS.NAME AS PS_NAME,
                    PS.DESCRIPTION AS PS_DESCRIPTION,
                    
                    PSI.ID AS PSI_ID,
                    PSI.ITEM_ID AS PSI_ITEM_ID,
                    PSI.PRICING_STRUCTURE_ID AS PSI_PRICING_STRUCTURE_ID,
                    PSI.PRICE AS PSI_PRICE
                
                FROM TBL_ITEM AS I
                LEFT JOIN TBL_PRICING_STRUCTURE AS PS ON PS.VIEW_ID = I.VIEW_ID
                LEFT JOIN TBL_PRICING_STRUCTURE_ITEM AS PSI ON PSI.ITEM_ID = I.ID
                WHERE PS.ID=? AND I.PARENT_ID IS NULL AND I.STATUS = 'ENABLED' AND PS.STATUS <> 'DELETED'
            `, [pricingStructureId]);

            let pricingStructureWithItems: PricingStructureWithItems = null;
            for (const i of q) {
               const mItemMap: Map<string /* itemId */, PricingStructureItemWithPrice> = new Map();

               if (!!!pricingStructureWithItems) {
                   pricingStructureWithItems = {
                       id: i.PS_ID,
                       name: i.PS_NAME,
                       viewId: i.PS_VIEW_ID,
                       description: i.PS_DESCRIPTION,
                       items: []
                   } as PricingStructureWithItems;

               }

               const itemId: number = i.I_ID;
               const mItemMapKey: string = `${itemId}`;


               if (!mItemMap.has(mItemMapKey)) {
                   const item: PricingStructureItemWithPrice = {
                       id: itemId,
                       itemId: itemId,
                       itemName: i.I_NAME,
                       itemDescription: i.I_DESCRIPTION,
                       parentId: i.I_PARENT_ID,
                       country: '',
                       price: i.PSI_PRICE,
                       children: await getChildrenWithConn(conn, pricingStructureId, itemId)
                   } as PricingStructureItemWithPrice;
                   mItemMap.set(mItemMapKey, item);
                   pricingStructureWithItems.items.push(item);
               }
           }

           res.status(200).json(pricingStructureWithItems);
        });
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/pricingStructuresWithItems/:pricingStructureId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
