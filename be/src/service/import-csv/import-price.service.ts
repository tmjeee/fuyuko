import {PriceDataImport} from "../../model/data-import.model";
import {CsvPrice} from "../../route/model/server-side.model";
import {readCsv} from "./import-csv.service";
import {Message, Messages} from "../../model/notification-listing.model";
import {PriceDataItem, PricingStructure, PricingStructureItemWithPrice} from "../../model/pricing-structure.model";
import {getPricingStructureItem} from "../pricing-structure-item.service";
import {doInDbConnection, QueryA} from "../../db";
import {PoolConnection} from "mariadb";

export const preview = async (viewId: number, dataImportId: number, content: Buffer): Promise<PriceDataImport> => {

    const csvPrices: CsvPrice[]  = await readCsv<CsvPrice>(content);
    const errors: Message[] = [];
    const infos: Message[] = [];
    const warnings: Message[] = [];

    const items: PriceDataItem[] = (await Promise.all(csvPrices.map(async (c: CsvPrice) => {

        const pricingStructureFormat: string = c.pricingStructureFormat ? c.pricingStructureFormat.trim() : c.pricingStructureFormat;
        const itemFormat: string = c.itemFormat ? c.itemFormat.trim() : c.itemFormat;


        let ps: PricingStructure = null;
        if (pricingStructureFormat) {
            const token: string[] = pricingStructureFormat.split('=');
            if (token.length == 2) {
                const identifier: string = token[0];
                const val: string = token[1];
                switch(identifier) {
                    case 'id': // pricing structure id
                        await doInDbConnection(async (conn: PoolConnection) => {
                            const q: QueryA = await conn.query(`SELECT ID, VIEW_ID, NAME, DESCRIPTION, STATUS FROM TBL_PRICING_STRUCTURE WHERE ID=? AND STATUS = 'ENABLED'`, [Number(val)]);
                            if (q.length) {
                               ps = {
                                  id: q[0].ID,
                                  name: q[0].NAME,
                                  description: q[0].DESCRIPTION
                               } as PricingStructure;
                            }
                        });
                        break;
                    case 'name': // pricing structure name
                        await doInDbConnection(async (conn: PoolConnection) => {
                            const q: QueryA = await conn.query(`SELECT ID, VIEW_ID, NAME, DESCRIPTION, STATUS FROM TBL_PRICING_STRUCTURE WHERE NAME=? AND STATUS = 'ENABLED'`, [(val)]);
                            if (q.length) {
                                ps = {
                                    id: q[0].ID,
                                    name: q[0].NAME,
                                    description: q[0].DESCRIPTION
                                } as PricingStructure;
                            }
                        });
                        break;
                }
            }
        }
        if (!ps) {
           errors.push({
              title: `Unfound Pricing Structure`,
              messsage: `Unable to find pricing structure for pricing structure format ${pricingStructureFormat}`
           } as Message);
           return null;
        }

        const pricingStructureId: number = ps.id;
        const pricingStructureName: string = ps.name;


        let itemId: number = null;
        if (itemFormat) {
            const token: string[] = itemFormat.split('=');
            if (token.length == 2) {
                const identifier: string = token[0];
                const val: string = token[1];
                switch(identifier) {
                    case 'id': {// item id
                        const q: QueryA = await doInDbConnection(async (conn: PoolConnection) => {
                            await conn.query(`SELECT ID FROM TBL_ITEM WHERE ID=?`, [Number(val)]);
                        });
                        if (q.length > 0) {
                            itemId = q[0].ID;
                        }
                        break;
                    }
                    case 'name': { // item name
                        const q: QueryA = await doInDbConnection(async (conn: PoolConnection) => {
                            await conn.query(`SELECT ID FROM TBL_ITEM WHERE ID=?`, [Number(val)]);
                        });
                        if (q.length > 0) {
                            itemId = q[0].ID;
                        }
                        break;
                    }
                }
            }
        }

        if (!!itemId) {
            errors.push({
                title: `Unfound Item`,
                messsage: `Unable to find Item for item format ${itemFormat}`
            } as Message);
            return null;
        }


        const p: PricingStructureItemWithPrice = await getPricingStructureItem(pricingStructureId, itemId);
        p.price = c.price;
        p.country = c.country;

        return {
            pricingStructureId,
            pricingStructureName,
            item: p
        } as PriceDataItem;
    }))).filter((i) => !!i);


    return {
        type: 'PRICE',
        dataImportId,
        messages: {
            infos,
            warnings,
            errors
        } as Messages,
        items
    } as PriceDataImport;
}
