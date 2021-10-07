import {PriceDataImport} from '@fuyuko-common/model/data-import.model';
import {CsvPrice} from '../../server-side-model/server-side.model';
import {readCsv} from './import-csv.service';
import {Message, Messages} from '@fuyuko-common/model/notification-listing.model';
import {PriceDataItem, PricingStructure, PricingStructureItemWithPrice} from '@fuyuko-common/model/pricing-structure.model';
import {addItemToPricingStructure, getPricingStructureItem} from '../pricing-structure-item.service';
import {doInDbConnection, QueryA, QueryResponse} from '../../db';
import {Connection} from 'mariadb';
import * as util from 'util';
import {getViewById} from '../view.service';
import {View} from '@fuyuko-common/model/view.model';
import {File} from 'formidable';
import * as fs from 'fs';
import {CountryCurrencyUnits} from '@fuyuko-common/model/unit.model';
import {fireEvent, ImportPricePreviewEvent} from '../event/event.service';
const uuid = require('uuid');
const detectCsv = require('detect-csv');


/**
 * =================
 * == preview ===
 * =================
 */
export interface ImportPricePreviewResult { errors: string[], priceDataImport: PriceDataImport};
export const preview = async (viewId: number, priceDataCsvFile: File): Promise<ImportPricePreviewResult> => {
    return await doInDbConnection(async (conn: Connection) => {
        const errors: string[] = [];

        const name: string = `price-data-import-${uuid()}`;
        const q: QueryResponse = await conn.query(`INSERT INTO TBL_DATA_IMPORT (VIEW_ID, NAME, TYPE) VALUES (?,?,'PRICE')`, [viewId, name]);
        const dataImportId: number = q.insertId;

        const content: Buffer  = await util.promisify(fs.readFile)(priceDataCsvFile.path);

        let mimeType = undefined;
        if (detectCsv(content)) {
            mimeType = 'text/csv';
        } else {
            errors.push(`Only support csv import`);
            return;
        }

        await conn.query(`INSERT INTO TBL_DATA_IMPORT_FILE (DATA_IMPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?)`,
            [dataImportId, priceDataCsvFile.name, mimeType, content.length, content]);

        const priceDataImport: PriceDataImport = await _preview(viewId, dataImportId, content);
        const r: ImportPricePreviewResult = {
            errors, priceDataImport
        }
        fireEvent({
           type: "ImportPricePreviewEvent",
           previewResult: r
        } as ImportPricePreviewEvent);
        return r;
    });
};

const _preview = async (viewId: number, dataImportId: number, content: Buffer): Promise<PriceDataImport> => {

    const csvPrices: CsvPrice[]  = await readCsv<CsvPrice>(content);
    const errors: Message[] = [];
    const infos: Message[] = [];
    const warnings: Message[] = [];

    const items: (PriceDataItem | null)[] = (await Promise.all(csvPrices.map(async (c: CsvPrice) => {

        const pricingStructureFormat: string = c.pricingStructureFormat ? c.pricingStructureFormat.trim() : c.pricingStructureFormat;
        const itemFormat: string = c.itemFormat ? c.itemFormat.trim() : c.itemFormat;


        let ps: PricingStructure | undefined = undefined;
        let psViewId: number | undefined = undefined;
        if (pricingStructureFormat) {
            const token: string[] = pricingStructureFormat.split('=');
            if (token.length == 2) {
                const identifier: string = token[0];
                const val: string = token[1];
                switch(identifier) {
                    case 'id': // pricing structure id
                        await doInDbConnection(async (conn: Connection) => {
                            const q: QueryA = await conn.query(`SELECT ID, VIEW_ID, NAME, DESCRIPTION, STATUS, CREATION_DATE, LAST_UPDATE FROM TBL_PRICING_STRUCTURE WHERE ID=? AND STATUS = 'ENABLED'`, [Number(val)]);
                            if (q.length) {
                               psViewId = q[0].VIEW_ID;
                               ps = {
                                  id: q[0].ID,
                                  name: q[0].NAME,
                                  viewId: q[0].VIEW_ID,
                                  description: q[0].DESCRIPTION,
                                  creationDate: q[0].CREATION_DATE,
                                  lastUpdate: q[0].LAST_UPDATE
                               } as PricingStructure;
                            }
                        });
                        break;
                    case 'name': // pricing structure name
                        await doInDbConnection(async (conn: Connection) => {
                            const q: QueryA = await conn.query(`
                                SELECT 
                                    PS.ID AS PS_ID, 
                                    PS.VIEW_ID AS PS_VIEW_ID, 
                                    V.NAME AS V_NAME,
                                    PS.NAME AS PS_NAME, 
                                    PS.DESCRIPTION AS PS_DESCRIPTION, 
                                    PS.STATUS AS PS_STATUS, 
                                    PS.CREATION_DATE AS PS_CREATION_DATE, 
                                    PS.LAST_UPDATE AS PS_LAST_UPDATE 
                                FROM TBL_PRICING_STRUCTURE AS PS
                                LEFT JOIN TBL_VIEW AS V ON V.ID = PS.VIEW_ID
                                WHERE PS.NAME=? AND PS.VIEW_ID=? AND PS.STATUS = 'ENABLED'`,
                                [val, viewId]);
                            if (q.length) {
                                psViewId = q[0].PS_VIEW_ID;
                                ps = {
                                    id: q[0].PS_ID,
                                    name: q[0].PS_NAME,
                                    viewName: q[0].V_NAME,
                                    viewId: q[0].PS_VIEW_ID,
                                    description: q[0].PS_DESCRIPTION,
                                    creationDate: q[0].PS_CREATION_DATE,
                                    lastUpdate: q[0].PS_LAST_UPDATE
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

        if (psViewId !== viewId) {
            errors.push({
                title: `Pricing structure does not belongs to view`,
                messsage: `Pricing structure ${ps!.id} does not belong to the view with id ${viewId}`
            } as Message);
            return null;
        }

        const pricingStructureId: number = ps!.id;
        const pricingStructureName: string = ps!.name;


        let itemId: number | undefined = undefined;
        let itemViewId: number | undefined = undefined;
        if (itemFormat) {
            const token: string[] = itemFormat.split('=');
            if (token.length == 2) {
                const identifier: string = token[0];
                const val: string = token[1];
                switch(identifier) {
                    case 'id': {// item id
                        const q: QueryA = await doInDbConnection(async (conn: Connection) => {
                            return await conn.query(`SELECT ID, VIEW_ID FROM TBL_ITEM WHERE ID=? AND VIEW_ID=?`, [Number(val), viewId]);
                        });
                        if (q && q.length > 0) {
                            itemId = q[0].ID;
                            itemViewId = q[0].VIEW_ID;
                        }
                        break;
                    }
                    case 'name': { // item name
                        const q: QueryA = await doInDbConnection(async (conn: Connection) => {
                            return await conn.query(`SELECT ID, VIEW_ID FROM TBL_ITEM WHERE NAME=? AND VIEW_ID=?`, [val, viewId]);
                        });
                        if (q && q.length > 0) {
                            itemId = q[0].ID;
                            itemViewId = q[0].VIEW_ID;
                        }
                        break;
                    }
                }
            }
        }

        if (!!!itemId) {
            errors.push({
                title: `Unfound Item`,
                messsage: `Unable to find Item for item format ${itemFormat} in view ${viewId}`
            } as Message);
            return null;
        }

        if (itemViewId !== viewId) {
            errors.push({
               title: `Item do not belong to view`,
               messsage: `Item id ${itemId} do not belong to view id ${viewId}, price info cannot be imported`
            } as Message);
            return null;
        }


        let p: PricingStructureItemWithPrice = await getPricingStructureItem(viewId, pricingStructureId, itemId);
        if (p) {
            p.price = c.price;
            p.country = c.country as CountryCurrencyUnits;
        } else {
            if (c.addToPricingStructureIfItemNotAlreadyAdded) {
                const added: boolean = await addItemToPricingStructure(viewId, pricingStructureId, itemId);
                if (added) {
                    p = await getPricingStructureItem(viewId, pricingStructureId, itemId);
                } else {
                    errors.push({
                       title: `Item failed to be added to pricing structure`,
                       messsage: `Failed to add item ${itemId} to pricing structure with id ${pricingStructureId} (viewId ${viewId})`
                    } as Message);
                    return null;
                }
            } else {
                errors.push({
                    title: `Item not found in pricing structure`,
                    messsage: `Failed to find item with id ${itemId} in pricing structure id ${pricingStructureId} to add pricing info (view Id ${viewId})`
                } as Message);
                return null;
            }
        }

        const view: View = await getViewById(ps!.viewId);

        return {
            pricingStructureId,
            pricingStructureName,
            viewId: view.id,
            viewName: view.name,
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
