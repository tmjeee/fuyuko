import {AttributeDataImport} from '@fuyuko-common/model/data-import.model';
import {readCsv, readPair1Csv, readPair2Csv} from './import-csv.service';
import {CsvAttribute} from "../../server-side-model/server-side.model";
import {Messages, Message} from '@fuyuko-common/model/notification-listing.model';
import {Attribute, Pair1, Pair2} from '@fuyuko-common/model/attribute.model';
import {doInDbConnection, QueryA, QueryResponse} from '../../db';
import {Connection} from 'mariadb';
import {File} from 'formidable';
import * as util from 'util';
import * as fs from 'fs';
import {v4 as uuid} from 'uuid';
import {fireEvent, ImportAttributePreviewEvent} from '../event/event.service';
const detectCsv = require('detect-csv');


/**
 * ===================
 * === preview ===
 * ===================
 */
export interface ImportAttributePreviewResult { errors: string[], attributeDataImport: AttributeDataImport };
export const preview = async (viewId: number, attributeDataCsvFile: File): Promise<ImportAttributePreviewResult> => {
    return await doInDbConnection(async (conn: Connection) => {
        
        const errors: string[] = [];

        const name: string = `attribute-data-import-${uuid()}`;
        const content: Buffer = await util.promisify(fs.readFile)(attributeDataCsvFile.path);

        const q: QueryResponse = await conn.query(`INSERT INTO TBL_DATA_IMPORT (VIEW_ID, NAME, TYPE) VALUES (?,?,'ATTRIBUTE')`, [viewId, name]);
        const dataImportId: number = q.insertId;

        let mimeType = undefined;
        if (detectCsv(content)) {
            mimeType = 'text/csv';
        } else {
            errors.push(`Only support csv import`, `attributeDataCsvFile`);
            return {
                errors,
                attributeDataImport: null
            };
        }

        await conn.query(`INSERT INTO TBL_DATA_IMPORT_FILE (DATA_IMPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT) VALUES (?,?,?,?,?)`,
            [dataImportId, attributeDataCsvFile.name, mimeType, content.length, content]);

        const attributeDataImport: AttributeDataImport = await _preview(viewId, dataImportId, content);

        const r: ImportAttributePreviewResult  ={
            errors,
            attributeDataImport
        };
        
        fireEvent({
           type: "ImportAttributePreviewEvent",
           previewResult: r 
        } as ImportAttributePreviewEvent);
        
        return r;
    });
};

const _preview = async (viewId: number, dataImportId: number, content: Buffer): Promise<AttributeDataImport> => {

    const csvAttributes: CsvAttribute[]  = await readCsv<CsvAttribute>(content);
    const errors: Message[] = [];
    const infos: Message[] = [];
    const warnings: Message[] = [];

    const attributes: Attribute[] = await
        Promise.all(
            csvAttributes.map(async (c: CsvAttribute) => {
                return {
                    id: -1,
                    name: c.name,
                    description: c.description,
                    format: c.format,
                    showCurrencyCountry: !!c.showCurrencyCountry,
                    type: c.type,
                    creationDate: new Date(),
                    lastUpdate: new Date(),
                    pair1: await toPair1(c.pair1),
                    pair2: await toPair2(c.pair2)
                } as Attribute;
            })
        );

    const result: Attribute[] = [];

    for(const attribute of attributes) {
        const q: QueryA = await doInDbConnection(async (conn: Connection) => {
            return await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_VIEW_ATTRIBUTE WHERE NAME=? AND VIEW_ID=?
            `, [attribute.name, viewId]);
        });
        if (q[0].COUNT > 0) {
            errors.push({
               title: `Attribute already exists`,
               messsage: `Attribute ${attribute.name} already exists`
            } as Message);
        } else {
            result.push(attribute);
        }
    }

    return {
        type: "ATTRIBUTE",
        dataImportId,
        messages: {
           errors,
           infos,
           warnings
        } as Messages,
        attributes: result
    } as AttributeDataImport;
}

const toPair1 = async (pair1: string | undefined): Promise<Pair1[]> => {
    const o: Pair1[] = pair1 ? await readPair1Csv(pair1) : [];
    return o;
}

const toPair2 = async (pair2: string | undefined): Promise<Pair2[]> => {
    return pair2 ? await readPair2Csv(pair2) : [];
}

