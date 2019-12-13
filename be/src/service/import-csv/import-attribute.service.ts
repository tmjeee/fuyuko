import {AttributeDataImport} from "../../model/data-import.model";
import {readCsv, readPair1Csv, readPair2Csv} from './import-csv.service';
import {CsvAttribute} from "../../route/model/server-side.model";
import {Messages, Message} from "../../model/notification-listing.model";
import {Attribute, Pair1, Pair2} from "../../model/attribute.model";
import {doInDbConnection, QueryA} from "../../db";
import {PoolConnection} from "mariadb";
import parse from 'csv-parse';

const toPair1 = async (pair1: string): Promise<Pair1[]> => {
    return await readPair1Csv(pair1);
}

const toPair2 = async (pair2: string): Promise<Pair2[]> => {
    return await readPair2Csv(pair2);
}

export const preview = async (viewId: number, dataImportId: number, content: Buffer): Promise<AttributeDataImport> => {

    const csvAttributes: CsvAttribute[]  = await readCsv<CsvAttribute>(content);
    const errors: Message[] = [];
    const infos: Message[] = [];
    const warnings: Message[] = [];

    const attributes: Attribute[] = await
        Promise.all(
            csvAttributes.map(async (c: CsvAttribute) => ({
                id: -1,
                name: c.name,
                description: c.description,
                format: c.format,
                showCurrencyCountry: !!c.showCurrencyCountry,
                type: c.type,
                pair1: await toPair1(c.pair1),
                pair2: await toPair2(c.pair2)
            } as Attribute)));

    const result: Attribute[] = [];

    for(const attribute of attributes) {
        const q: QueryA = await doInDbConnection(async (conn: PoolConnection) => {
            await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_VIEW_ATTRIBUTE WHERE NAME=?
            `, [attribute.name]);
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
