import {PricingStructure} from "../model/pricing-structure.model";
import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";


export const getPricingStructureById = async (pricingStructureId: number): Promise<PricingStructure> => {
    const pricingStructure: PricingStructure = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`
                SELECT 
                    ID, VIEW_ID, NAME, DESCRIPTION, STATUS, CREATION_DATE, LAST_UPDATE
                FROM TBL_PRICING_STRUCTURE WHERE ID=? 
            `, [pricingStructureId]);

        return q.reduce((acc: PricingStructure, i: QueryI) => {
            acc.id = i.ID;
            acc.viewId = i.VIEW_ID;
            acc.name = i.NAME;
            acc.description = i.DESCRIPTION;
            acc.creationDate = i.CREATION_DATE;
            acc.lastUpdate = i.LAST_UPDATE;
            return acc;
        }, {} as PricingStructure);
    });
    return pricingStructure;
}
