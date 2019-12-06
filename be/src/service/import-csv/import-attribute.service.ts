import {AttributeDataImport, DataImport} from "../../model/data-import.model";
import {readCsv} from './import-csv.service';
import {CsvAttribute} from "../../route/model/server-side.model";
import {Messages, Message} from "../../model/notification-listing.model";
import {Attribute, Pair1, Pair2} from "../../model/attribute.model";
import {doInDbConnection, QueryA} from "../../db";
import {PoolConnection} from "mariadb";

const toPair1 = (pair1: string): Pair1[] => {
    return null;
}

const toPair2 = (pair2: string): Pair2[] => {
    return null;
}

export const previewAttributeDataImport = async (viewId: number, content: Buffer): Promise<AttributeDataImport> => {

    const csvAttributes: CsvAttribute[]  = await readCsv<CsvAttribute>(content);
    const errors: Message[] = [];
    const infos: Message[] = [];
    const warnings: Message[] = [];

    const attributes: Attribute[] = csvAttributes.map((c: CsvAttribute) => ({
        id: -1,
        name: c.name,
        description: c.description,
        format: c.format,
        showCurrencyCountry: !!c.showCurrencyCountry,
        type: c.type,
        pair1: toPair1(c.pair1),
        pair2: toPair2(c.pair2)
    } as Attribute));

    for(const attribute of attributes) {
        const q: QueryA = await doInDbConnection(async (conn: PoolConnection) => {
            await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_VIEW_ATTRIBUTE WHERE NAME=?
            `, [attribute.name]);
        });
        if (q[0].COUNT > 0) {

        }
    }

    return {
        type: "ATTRIBUTE",
        messages: {
           errors: [],
           infos: [],
           warnings: []
        } as Messages,
        attributes
    } as AttributeDataImport;
}
