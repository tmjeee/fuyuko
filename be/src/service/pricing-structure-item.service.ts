import {PoolConnection} from "mariadb";
import {PricingStructureItemWithPrice} from "../model/pricing-structure.model";
import {doInDbConnection, QueryA} from "../db";

export const setPrices = async (pricingStructureId: number, pricingStructureItems: PricingStructureItemWithPrice[]) => {
    for (const pricingStructureItem of pricingStructureItems) {
        await doInDbConnection(async (conn: PoolConnection) => {

            const qc: QueryA = await conn.query(`
                    SELECT COUNT(*) AS COUNT 
                    FROM TBL_PRICING_STRUCTURE_ITEM AS I 
                    INNER JOIN TBL_PRICING_STRUCTURE AS P ON P.ID = I.PRICING_STRUCTURE_ID
                    WHERE I.ITEM_ID=? AND I.PRICING_STRUCTURE_ID=?;
                `, [pricingStructureItem.itemId, pricingStructureId]);

            if (qc.length <= 0 || qc[0].COUNT <= 0) { // insert
                await conn.query(`
                        INSERT INTO TBL_PRICING_STRUCTURE_ITEM (ITEM_ID, PRICING_STRUCTURE_ID, PRICE) VALUES (?,?,?)
                    `, [pricingStructureItem.itemId, pricingStructureId, pricingStructureItem.price]);

            } else { // update
                await conn.query(`
                        UPDATE TBL_PRICING_STRUCTURE_ITEM SET PRICE=? WHERE ITEM_ID=? AND PRICING_STRUCTURE_ID=?
                    `, [pricingStructureItem.price, pricingStructureItem.itemId, pricingStructureId]);
            }
        });
    }
}


export const getPricingStructureItem = async (pricingStructureId: number, itemId: number): Promise<PricingStructureItemWithPrice> => {
    return await doInDbConnection(async (conn: PoolConnection) => {
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
                    PSI_COUNTRY AS PSI_COUNTRY,
                    PSI.PRICING_STRUCTURE_ID AS PSI_PRICING_STRUCTURE_ID,
                    PSI.PRICE AS PSI_PRICE
                
                FROM TBL_ITEM AS I
                LEFT JOIN TBL_PRICING_STRUCTURE AS PS ON PS.VIEW_ID = I.VIEW_ID
                LEFT JOIN TBL_PRICING_STRUCTURE_ITEM AS PSI ON PSI.ITEM_ID = I.ID
                WHERE PS.ID = ? AND I.ID = ? AND I.STATUS = 'ENABLED'
    `, [pricingStructureId, itemId]);

        return {
            id: q[0].PSI_ID,
            itemId: itemId,
            itemName: q[0].I_NAME,
            itemDescription: q[0].I_DESCRIPTION,
            country: q[0].PSI_COUNTRY,
            parentId: q[0].I_PARENT_ID,
            price: q[0].PSI_PRICE,
            children: await getChildrenWithConn(conn, pricingStructureId, itemId)
        } as PricingStructureItemWithPrice;
    });
}

export const getChildrenWithConn = async (conn: PoolConnection, pricingStructureId: number, parentItemId: number): Promise<PricingStructureItemWithPrice[]> => {

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
                WHERE PS.ID = ? AND I.PARENT_ID = ? AND I.STATUS = 'ENABLED'
    `, [pricingStructureId, parentItemId]);


    const acc: PricingStructureItemWithPrice[] = [];
    for (const i of q) {
        const itemId: number = i.I_ID;
        const a: PricingStructureItemWithPrice = {
            id: i.PSI_ID,
            itemId: itemId,
            itemName: i.I_NAME,
            itemDescription: i.I_DESCRIPTION,
            price: i.PSI_PRICE,
            country: '',
            parentId: i.I_PARENT_ID,
            children: await getChildrenWithConn(conn, pricingStructureId, itemId),
        } as PricingStructureItemWithPrice;
        acc.push(a);
    }
    return acc;
}

