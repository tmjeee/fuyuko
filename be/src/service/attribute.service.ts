import {Attribute2} from "../route/model/server-side.model";
import {Attribute} from "../model/attribute.model";
import {convert, revert} from "./conversion-attribute.service";
import {doInDbConnection, QueryResponse} from "../db";
import {PoolConnection} from "mariadb";


export const saveAttribute2s = async (attrs2: Attribute2[]) => {
    await doInDbConnection(async (conn: PoolConnection) => {
        for (const att2 of attrs2) {

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

export const saveAttributes = (att: Attribute[]) => {
    const att2s: Attribute2[] = revert(att);
    saveAttribute2s(att2s);
}