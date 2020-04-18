import {
    PricingStructure,
    PricingStructureItemWithPrice,
    PricingStructureWithItems
} from "../model/pricing-structure.model";
import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";
import {ApiResponse, PaginableApiResponse} from "../model/api-response.model";
import {LIMIT_OFFSET} from "../util/utils";
import {getChildrenWithConn} from "./pricing-structure-item.service";
import {LimitOffset} from "../model/limit-offset.model";
import {ROLE_PARTNER} from "../model/role.model";


export const getPricingStructuresByView = async (viewId: number): Promise<PricingStructure[]> => {
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
    return pricingStructures;
};

export const getPartnerPricingStructures = async (userId: number): Promise<PricingStructure[]> => {

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

    return pricingStructures;
}

export const getAllPricingStructureItemsWithPriceCount = async(pricingStructureId: number): Promise<number> => {
    return await doInDbConnection(async (conn: Connection) => {
        const qq: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT 
                FROM TBL_ITEM AS I 
                WHERE I.STATUS = 'ENABLED' AND I.PARENT_ID IS NULL AND I.VIEW_ID = (
                    SELECT VIEW_ID FROM TBL_PRICING_STRUCTURE WHERE ID = ?
                )
            `, [pricingStructureId]);
        const total = qq[0].COUNT;
        return total;
    });
}

export const getAllPricingStructureItemsWithPrice = async (pricingStructureId: number, limitOffset?: LimitOffset): Promise<PricingStructureItemWithPrice[]> => {
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
                    PS.CREATION_DATE AS PS_CREATION_DATE,
                    PS.LAST_UPDATE AS PS_LAST_UPDATE,
                    
                    PSI.ID AS PSI_ID,
                    PSI.ITEM_ID AS PSI_ITEM_ID,
                    PSI.PRICING_STRUCTURE_ID AS PSI_PRICING_STRUCTURE_ID,
                    PSI.PRICE AS PSI_PRICE,
                    PSI.COUNTRY AS PSI_COUNTRY,
                    PSI.CREATION_DATE AS PSI_CREATION_DATE,
                    PSI.LAST_UPDATE AS PSI_LAST_UPDATE
                
                FROM TBL_ITEM AS I
                LEFT JOIN TBL_PRICING_STRUCTURE AS PS ON PS.VIEW_ID = I.VIEW_ID
                LEFT JOIN TBL_PRICING_STRUCTURE_ITEM AS PSI ON PSI.PRICING_STRUCTURE_ID = PS.ID AND PSI.ITEM_ID = I.ID
                WHERE PS.ID=? AND I.PARENT_ID IS NULL AND I.STATUS = 'ENABLED' AND PS.STATUS <> 'DELETED'
                ${LIMIT_OFFSET(limitOffset)}
            `, [pricingStructureId]);

        const mItemMap: Map<string /* itemId */, PricingStructureItemWithPrice> = new Map();
        for (const i of q) {
            const itemId: number = i.I_ID;
            const mItemMapKey: string = `${itemId}`;

            if (!mItemMap.has(mItemMapKey)) {
                const item: PricingStructureItemWithPrice = {
                    id: i.PSI_ID,
                    itemId: itemId,
                    itemName: i.I_NAME,
                    itemDescription: i.I_DESCRIPTION,
                    parentId: i.I_PARENT_ID,
                    country: i.PSI_COUNTRY,
                    price: i.PSI_PRICE,
                    creationDate: i.PSI_CREATION_DATE,
                    lastUpdate: i.PSI_LAST_UPDATE,
                    children: await getChildrenWithConn(conn, pricingStructureId, itemId)
                } as PricingStructureItemWithPrice;
                mItemMap.set(mItemMapKey, item);
            }
        }
        return [...mItemMap.values()];
    });
}



export const getAllPricingStructures = async (): Promise<PricingStructure[]> => {
    return await doInDbConnection(async (conn: Connection) => {

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

        return pricingStructures;
    });
};



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
