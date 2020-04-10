import {CustomDataExport, ExportScript, ExportScriptInput} from "../model/custom-export.model";
import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";
import {getExportScriptByName} from "../custom-export/custom-export-executor";


export const getCustomExportById = async (customExportId: number): Promise<CustomDataExport> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE FROM TBL_CUSTOM_DATA_EXPORT`, [customExportId]);
        if (q.length > 0) {
            const a: CustomDataExport = await p(q[0]);
            return a;
        } else {
            return null;
        }
    });
};


export const getAllCustomExports = async (): Promise<CustomDataExport[]> => {
    const r: CustomDataExport[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE FROM TBL_CUSTOM_DATA_EXPORT`);
        const r: CustomDataExport[] = [];
        for (const i of q) {
            const a: CustomDataExport = await p(i);
            r.push(a);
        }
        return r;
    });
    return r;
}

const p = async (i: QueryI): Promise<CustomDataExport> => {
    const s: ExportScript = await getExportScriptByName(i.NAME);
    const inputs: ExportScriptInput[] = s.inputs();
    const a: CustomDataExport = {
        id: i.ID,
        name: i.NAME,
        description: i.DESCRIPTION,
        creationDate: i.CREATION_DATE,
        lastUpdate: i.LAST_UPDATE,
        inputs
    };
    return a;
}
