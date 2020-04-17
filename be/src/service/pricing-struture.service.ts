import {PricingStructure} from "../model/pricing-structure.model";
import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";


export const getPricingStructureById = async (pricingStructureId: number): Promise<PricingStructure> => {
    const pricingStructure: PricingStructure = await doInDbConnection(async (conn: Connection) => {
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
                WHERE PS.ID=? 
            `, [pricingStructureId]);

        return q.reduce((acc: PricingStructure, i: QueryI) => {
            acc.id = i.PS_ID;
            acc.viewId = i.PS_VIEW_ID;
            acc.name = i.PS_NAME;
            acc.viewName = i.V_NAME;
            acc.description = i.PS_DESCRIPTION;
            acc.creationDate = i.PS_CREATION_DATE;
            acc.lastUpdate = i.PS_LAST_UPDATE;
            return acc;
        }, {} as PricingStructure);
    });
    return pricingStructure;
}
