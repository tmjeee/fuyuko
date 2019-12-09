import {Attribute2} from "../route/model/server-side.model";
import {Attribute} from "../model/attribute.model";
import {convert, revert} from "./conversion-attribute.service";
import {doInDbConnection, QueryResponse} from "../db";
import {PoolConnection} from "mariadb";
import {LoggingCallback} from "./job-log.service";


export const saveAttribute2s = async (attrs2: Attribute2[], loggingCallback?: LoggingCallback) => {
    await doInDbConnection(async (conn: PoolConnection) => {
        for (const att2 of attrs2) {

            loggingCallback('INFO', `adding attribute ${att2.name}`);

            const qAtt: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE (TYPE, NAME, DESCRPTION, STATUS) VALUES (?,?,?, 'ENABLED') `, [att2.type, att2.name, att2.description]);
            const attrbuteId: number = qAtt.insertId;

            for (const meta of att2.metadatas) {

                const qMeta: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA (VIEW_ATTRIBUTE_ID, NAME) VALUES (?,?)`, [attrbuteId, meta.name]);
                const metaId: number = qMeta.insertId;

                for (const entry of meta.entries) {
                    await conn.query(`INSERT INTO TBL_VIEW_ATTRIBUTE_METADATA_ENTRY (VIEW_ATTRIBUTE_METADATA_ID, KEY, VALUE) VALUES (?,?,?)`, [metaId, entry.key, entry.value]);
                }
            }
        }
    });
}

export const saveAttributes = async (att: Attribute[], loggingCallback?: LoggingCallback) => {
    loggingCallback('INFO', `converting attribute to attribute2`);
    const att2s: Attribute2[] = revert(att);
    loggingCallback('INFO', `converted attribute to attribute2`)
    await saveAttribute2s(att2s, loggingCallback);
}
