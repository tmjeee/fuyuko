import {CustomDataImport, ExportScript, ImportScriptInput} from "../model/custom-import.model";
import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";
import {getImportScriptByName} from "../custom-import/custom-import-executor";


export const getCustomImportById = async (customImportId: number): Promise<CustomDataImport> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE FROM TBL_CUSTOM_DATA_IMPORT`, [customImportId]);
        if (q.length > 0) {
            const a: CustomDataImport = await p(q[0]);
            return a;
        } else {
           return null;
        }
    });
};


export const getAllCustomImports = async (): Promise<CustomDataImport[]> => {
    const r: CustomDataImport[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE FROM TBL_CUSTOM_DATA_IMPORT`);
        const r: CustomDataImport[] = [];
        for (const i of q) {
            const a: CustomDataImport = await p(i);
            r.push(a);
        }
        return r;
    });
    return r;
}

const p = async (i: QueryI): Promise<CustomDataImport> => {
    const s: ExportScript = await getImportScriptByName(i.NAME);
    const inputs: ImportScriptInput[] = s.inputs();
    const a: CustomDataImport = {
        id: i.ID,
        name: i.NAME,
        description: i.DESCRIPTION,
        creationDate: i.CREATION_DATE,
        lastUpdate: i.LAST_UPDATE,
        inputs
    };
    return a;
}