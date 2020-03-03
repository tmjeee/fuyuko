import {Connection} from "mariadb";
import {PricingStructureItemWithPrice} from "../model/pricing-structure.model";
import {doInDbConnection, QueryA, QueryResponse} from "../db";
import {LoggingCallback, newLoggingCallback} from "./job-log.service";
import {i} from "../logger";

export const setPrices = async (pricingStructureId: number, pricingStructureItems: PricingStructureItemWithPrice[], loggingCallback: LoggingCallback = newLoggingCallback()) => {
    let totalUpdates = 0;
    for (const pricingStructureItem of pricingStructureItems) {
        const q: QueryResponse = await doInDbConnection(async (conn: Connection) => {
            const qc: QueryA = await conn.query(`
                    SELECT COUNT(*) AS COUNT 
                    FROM TBL_PRICING_STRUCTURE_ITEM AS I 
                    INNER JOIN TBL_PRICING_STRUCTURE AS P ON P.ID = I.PRICING_STRUCTURE_ID
                    WHERE I.ITEM_ID=? AND I.PRICING_STRUCTURE_ID=?;
                `, [pricingStructureItem.itemId, pricingStructureId]);

            if (qc.length <= 0 || qc[0].COUNT <= 0) { // insert
                const q: QueryResponse = await conn.query(`
                        INSERT INTO TBL_PRICING_STRUCTURE_ITEM (ITEM_ID, PRICING_STRUCTURE_ID, PRICE, COUNTRY) VALUES (?,?,?,?)
                    `, [pricingStructureItem.itemId, pricingStructureId, pricingStructureItem.price, pricingStructureItem.country]);
                loggingCallback(`INFO`, `inserting price ${pricingStructureItem.price} ${pricingStructureItem.country} for item ${pricingStructureItem.itemId}`);
                return q;
            } else { // update
                const q: QueryResponse = await conn.query(`
                        UPDATE TBL_PRICING_STRUCTURE_ITEM SET PRICE=?, COUNTRY=? WHERE ITEM_ID=? AND PRICING_STRUCTURE_ID=?
                    `, [pricingStructureItem.price, pricingStructureItem.country, pricingStructureItem.itemId, pricingStructureId]);
                loggingCallback(`INFO`, `updating price ${pricingStructureItem.price} ${pricingStructureItem.country} for item ${pricingStructureItem.itemId}`);
                return q;
            }
        });
        if (q.affectedRows > 0) {
            totalUpdates++;
        }
    }
    return totalUpdates;
}

export const addItemToPricingStructure = async (viewId: number, pricingStructureId: number, itemId: number): Promise<boolean> => {
   return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(
            `SELECT COUNT(*) AS COUNT 
                    FROM TBL_PRICING_STRUCTURE_ITEM AS I 
                    LEFT JOIN TBL_PRICING_STRUCTURE AS P ON P.ID = I.PRICING_STRUCTURE_ID
                    WHERE I.ITEM_ID=? AND I.PRICING_STRUCTURE_ID=? AND P.VIEW_ID=?`,
            [itemId, pricingStructureId, viewId]);
        if (q && q.length > 0) { // item already in pricing structure
            return false;
        } else { // item not yet in this pricing structure
            await conn.query(`INSERT INTO TBL_PRICING_STRUCTURE_ITEM (ITEM_ID, PRICING_STRUCTURE_ID, COUNTRY, PRICE) VALUES (?,?,?,?)`,
                [itemId, pricingStructureId, null, null])
            return true;
        }
   });
}


export const getPricingStructureItem = async (viewId: number, pricingStructureId: number, itemId: number): Promise<PricingStructureItemWithPrice> => {
    return await doInDbConnection(async (conn: Connection) => {
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
                    PSI.COUNTRY AS PSI_COUNTRY,
                    PSI.PRICING_STRUCTURE_ID AS PSI_PRICING_STRUCTURE_ID,
                    PSI.PRICE AS PSI_PRICE
                
                FROM TBL_ITEM AS I
                LEFT JOIN TBL_PRICING_STRUCTURE AS PS ON PS.VIEW_ID = I.VIEW_ID
                LEFT JOIN TBL_PRICING_STRUCTURE_ITEM AS PSI ON PSI.ITEM_ID = I.ID
                WHERE PS.ID = ? AND I.ID = ? AND I.VIEW_ID=? AND I.STATUS = 'ENABLED'
    `, [pricingStructureId, itemId, viewId]);

        return q && q[0] ? {
            id: q[0].PSI_ID,
            itemId: itemId,
            itemName: q[0].I_NAME,
            itemDescription: q[0].I_DESCRIPTION,
            country: q[0].PSI_COUNTRY,
            parentId: q[0].I_PARENT_ID,
            price: q[0].PSI_PRICE,
            children: await getChildrenWithConn(conn, pricingStructureId, itemId)
        } as PricingStructureItemWithPrice : null;
    });
}

export const getChildrenWithConn = async (conn: Connection, pricingStructureId: number, parentItemId: number): Promise<PricingStructureItemWithPrice[]> => {
    return await _getChildrenWithConn(conn, pricingStructureId, parentItemId, new Map<string /* itemId */, PricingStructureItemWithPrice>());
}
export const _getChildrenWithConn = async (conn: Connection, pricingStructureId: number, parentItemId: number, m: Map<string /* itemId */, PricingStructureItemWithPrice>): Promise<PricingStructureItemWithPrice[]> => {

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
                    PSI.PRICE AS PSI_PRICE,
                    PSI.COUNTRY AS PSI_COUNTRY
                
                FROM TBL_ITEM AS I
                LEFT JOIN TBL_PRICING_STRUCTURE AS PS ON PS.VIEW_ID = I.VIEW_ID
                LEFT JOIN TBL_PRICING_STRUCTURE_ITEM AS PSI ON PSI.PRICING_STRUCTURE_ID = PS.ID AND PSI.ITEM_ID = I.ID
                WHERE PS.ID = ? AND I.PARENT_ID = ? AND I.STATUS = 'ENABLED'
    `, [pricingStructureId, parentItemId]);


    const acc: PricingStructureItemWithPrice[] = [];
    for (const i of q) {
        const itemId: number = i.I_ID;
        if (!m.has(`${itemId}`)) {
            const a: PricingStructureItemWithPrice = {
                id: i.PSI_ID,
                itemId: itemId,
                itemName: i.I_NAME,
                itemDescription: i.I_DESCRIPTION,
                price: i.PSI_PRICE,
                country: i.PSI_COUNTRY,
                parentId: i.I_PARENT_ID,
                children: await getChildrenWithConn(conn, pricingStructureId, itemId),
            } as PricingStructureItemWithPrice;
            acc.push(a);
        }
    }
    return acc;
}

