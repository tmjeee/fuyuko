import {Connection} from 'mariadb';
import {PricingStructureItemWithPrice} from '@fuyuko-common/model/pricing-structure.model';
import {doInDbConnection, QueryA, QueryI, QueryResponse} from '../db';
import {LoggingCallback, newLoggingCallback} from './job-log.service';
import {CountryCurrencyUnits} from '@fuyuko-common/model/unit.model';
import {
    AddItemToPricingStructureEvent,
    fireEvent,
    GetPricingStructureItemEvent,
    SetPricesEvent
} from './event/event.service';


class PricingStructureItemService {

    /**
     *  ====================================
     *  === setPrices ===
     *  ====================================
     */
    async setPrices(priceDataItems: {pricingStructureId: number, item: {itemId: number, price: number, country: CountryCurrencyUnits}}[],
                                    loggingCallback: LoggingCallback = newLoggingCallback()): Promise<string[]> {
        const errors: string[] = [];
        for (const priceDataItem of priceDataItems) {
            const pricingStructureId: number = priceDataItem.pricingStructureId;
            const itemId: number = priceDataItem.item.itemId;
            const price: number = priceDataItem.item.price;
            const country: string = priceDataItem.item.country;

            const q: QueryResponse =  await this._setPrice(pricingStructureId, itemId, price, country);
            if (q && q.affectedRows <= 0) {
                errors.push(`Failed to set price for item id ${itemId} in pricing structure id ${pricingStructureId} with price ${price}${country}`);
            }
        }
        fireEvent({
            type: "SetPricesEvent",
            priceDataItems: priceDataItems,
        } as SetPricesEvent);
        return errors;
    }
    async setPricesB(pricingStructureId: number, pricingStructureItems: {itemId: number, price: number,
        country: CountryCurrencyUnits}[], loggingCallback: LoggingCallback = newLoggingCallback()): Promise<string[]> {
        const errors: string[] = [];
        for (const pricingStructureItem of pricingStructureItems) {
            const itemId: number = pricingStructureItem.itemId;
            const price: number = pricingStructureItem.price;
            const country: string = pricingStructureItem.country;

            const q: QueryResponse = await this._setPrice(pricingStructureId, itemId, price, country);
            if (q && q.affectedRows <= 0) {
                errors.push(`Failed to set price for item id ${itemId} in pricing structure id ${pricingStructureId} with price ${price}${country}`);
            }
        }
        fireEvent({
            type: "SetPricesEvent",
            priceDataItems:
                pricingStructureItems.map((p: {itemId: number, price: number, country: CountryCurrencyUnits}) => ({
                    pricingStructureId,
                    item: {
                        itemId: p.itemId,
                        price: p.price,
                        country: p.country
                    }
                }))
        } as SetPricesEvent);
        return errors;
    }


    private async _setPrice(pricingStructureId: number, itemId: number, price: number, country: string, loggingCallback: LoggingCallback = newLoggingCallback()): Promise<QueryResponse> {
        const q: QueryResponse = await doInDbConnection(async (conn: Connection) => {

            const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_PRICING_STRUCTURE WHERE ID = ? `, [pricingStructureId]);
            if (qq[0].COUNT < 0) {  // pricing structure doesn't exists
                loggingCallback(`WARN`, `pricing structure with id ${pricingStructureId} does not exists`);
                return null;
            }


            const qc: QueryA = await conn.query(`
                    SELECT COUNT(*) AS COUNT 
                    FROM TBL_PRICING_STRUCTURE_ITEM AS I 
                    INNER JOIN TBL_PRICING_STRUCTURE AS P ON P.ID = I.PRICING_STRUCTURE_ID
                    WHERE I.ITEM_ID=? AND I.PRICING_STRUCTURE_ID=?;
                `, [itemId, pricingStructureId]);

            if (qc.length <= 0 || qc[0].COUNT <= 0) { // insert
                const q: QueryResponse = await conn.query(`
                        INSERT INTO TBL_PRICING_STRUCTURE_ITEM (ITEM_ID, PRICING_STRUCTURE_ID, PRICE, COUNTRY) VALUES (?,?,?,?)
                    `, [itemId, pricingStructureId, price, country]);
                loggingCallback(`INFO`, `inserting price ${price} ${country} for item ${itemId} in pricing structure ${pricingStructureId}`);
                return q;
            } else { // update
                const q: QueryResponse = await conn.query(`
                        UPDATE TBL_PRICING_STRUCTURE_ITEM SET PRICE=?, COUNTRY=? WHERE ITEM_ID=? AND PRICING_STRUCTURE_ID=?
                    `, [price, country, itemId, pricingStructureId]);
                loggingCallback(`INFO`, `updating price ${price} ${country} for item ${itemId} in pricing structure ${pricingStructureId}`);
                return q;
            }
        });
        return q;
    }


    /**
     * ===================================
     * === addItemToPricingStructure ===
     * ===================================
     */
    async addItemToPricingStructure(viewId: number, pricingStructureId: number, itemId: number): Promise<boolean> {
        const result: boolean = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(
                `SELECT COUNT(*) AS COUNT 
                    FROM TBL_PRICING_STRUCTURE_ITEM AS I 
                    LEFT JOIN TBL_PRICING_STRUCTURE AS P ON P.ID = I.PRICING_STRUCTURE_ID
                    WHERE I.ITEM_ID=? AND I.PRICING_STRUCTURE_ID=? AND P.VIEW_ID=?`,
                [itemId, pricingStructureId, viewId]);
            if (q && q.length > 0 && q[0].COUNT > 0) { // item already in pricing structure
                return false;
            } else { // item not yet in this pricing structure
                await conn.query(`INSERT INTO TBL_PRICING_STRUCTURE_ITEM (ITEM_ID, PRICING_STRUCTURE_ID, COUNTRY, PRICE) VALUES (?,?,?,?)`,
                    [itemId, pricingStructureId, null, null])
                return true;
            }
        });
        fireEvent({
            type: "AddItemToPricingStructureEvent",
            viewId, pricingStructureId, itemId, result
        } as AddItemToPricingStructureEvent);
        return result;
    }


    /**
     * ===================================
     * === addItemToPricingStructure ===
     * ===================================
     */
    async removeItemFromPricingStructure(pricingStructureId: number, itemId: number): Promise<boolean> {
        const result: boolean = await doInDbConnection(async (conn: Connection) => {
            const q: QueryResponse = await conn.query(`
                DELETE FROM TBL_PRICING_STRUCTURE_ITEM WHERE TBL_PRICING_STRUCTURE_ID = ? AND ITEM_ID = ?
            `, [pricingStructureId, itemId]);
            return !!q.affectedRows;
        });
        return result;
    }





    /**
     *  ===============================
     *  === getPricingStructureItem ===
     *  ===============================
     */
    async getPricingStructureItem(viewId: number, pricingStructureId: number, itemId: number): Promise<PricingStructureItemWithPrice> {
        const pricingStructureItemWithPrice: PricingStructureItemWithPrice = await doInDbConnection(async (conn: Connection) => {
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
                    PSI.COUNTRY AS PSI_COUNTRY,
                    PSI.PRICING_STRUCTURE_ID AS PSI_PRICING_STRUCTURE_ID,
                    PSI.PRICE AS PSI_PRICE,
                    PSI.CREATION_DATE AS PSI_CREATION_DATE,
                    PSI.LAST_UPDATE AS PSI_LAST_UPDATE
                
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
                creationDate: q[0].PSI_CREATION_DATE,
                lastUpdate: q[0].PSI_LAST_UPDATE,
                children: await getChildrenWithConn(conn, pricingStructureId, itemId)
            } as PricingStructureItemWithPrice : null;
        });
        fireEvent({
            type: "GetPricingStructureItemEvent",
            viewId, pricingStructureId, itemId, pricingStructureItemWithPrice
        } as GetPricingStructureItemEvent);
        return pricingStructureItemWithPrice;
    }

    async getChildrenWithConn(conn: Connection, pricingStructureId: number, parentItemId: number): Promise<PricingStructureItemWithPrice[]> {
        return await this._getChildrenWithConn(conn, pricingStructureId, parentItemId, new Map<string /* itemId */, PricingStructureItemWithPrice>());
    }
    private async _getChildrenWithConn(conn: Connection, pricingStructureId: number, parentItemId: number, m: Map<string /* itemId */, PricingStructureItemWithPrice>): Promise<PricingStructureItemWithPrice[]> {

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
                    creationDate: i.PSI_CREATION_DATE,
                    lastUpdate: i.PSI_LAST_UPDATE,
                    children: await getChildrenWithConn(conn, pricingStructureId, itemId),
                } as PricingStructureItemWithPrice;
                acc.push(a);
            }
        }
        return acc;
    }
}

const s = new PricingStructureItemService();
export const
    setPrices = s.setPrices.bind(s),
    setPricesB = s.setPricesB.bind(s),
    addItemToPricingStructure = s.addItemToPricingStructure.bind(s),
    getPricingStructureItem = s.getPricingStructureItem.bind(s),
    removeItemFromPricingStructure = s.removeItemFromPricingStructure.bind(s),
    getChildrenWithConn = s.getChildrenWithConn.bind(s);
