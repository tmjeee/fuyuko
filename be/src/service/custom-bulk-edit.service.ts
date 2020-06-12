import {CustomDataExport, ExportScript, ExportScriptInput} from "../model/custom-export.model";
import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";
import {CustomBulkEdit} from "../model/custom-bulk-edit.model";
import {getCustomBulkEditScriptByName} from "../custom-bulk-edit/custom-bulk-edit-executor";

export const getCustomBulkEditById = async (customBulkEditId: number): Promise<CustomDataExport> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE FROM TBL_CUSTOM_BULK_EDIT`, [customBulkEditId]);
        if (q.length > 0) {
            const a: CustomDataExport = await p(q[0]);
            return a;
        } else {
            return null;
        }
    });
};



export const getAllCustomBulkEdits = async (): Promise<CustomBulkEdit[]> => {
    const r: CustomBulkEdit[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE FROM TBL_CUSTOM_BULK_EDIT`);
        const r: CustomBulkEdit[] = [];
        for (const i of q) {
            const a: CustomBulkEdit = await p(i);
            r.push(a);
        }
        return r;
    });
    return r;
}

const p = async (i: QueryI): Promise<CustomBulkEdit> => {
    const s: ExportScript = await getCustomBulkEditScriptByName(i.NAME);
    const inputs: ExportScriptInput[] = s.inputs();
    const a: CustomBulkEdit = {
        id: i.ID,
        name: i.NAME,
        description: i.DESCRIPTION,
        creationDate: i.CREATION_DATE,
        lastUpdate: i.LAST_UPDATE,
        inputs
    };
    return a;
}
