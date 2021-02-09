import {CustomDataImport, ImportScript, ImportScriptInput} from "../model/custom-import.model";
import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";
import {getImportScriptByName} from "../custom-import/custom-import-executor";
import {fireEvent, GetAllCustomImportsEvent, GetCustomImportByIdEvent} from "./event/event.service";

class CustomImportService {

    /**
     *  =======================================
     *  === GetCustomImportById ===
     *  =======================================
     */
    async getCustomImportById(customImportId: number): Promise<CustomDataImport> {
        const customDataImport: CustomDataImport = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE FROM TBL_CUSTOM_DATA_IMPORT`, [customImportId]);
            if (q.length > 0) {
                const a: CustomDataImport = await this.p(q[0]);
                return a;
            } else {
                return null;
            }
        });

        fireEvent({
            type: "GetCustomImportByIdEvent",
            customImportId, customDataImport
        } as GetCustomImportByIdEvent);

        return customDataImport;
    };


    /**
     *  =======================================
     *  === GetAllCustomImports ===
     *  =======================================
     */
    async getAllCustomImports(): Promise<CustomDataImport[]> {
        const r: CustomDataImport[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE FROM TBL_CUSTOM_DATA_IMPORT`);
            const r: CustomDataImport[] = [];
            for (const i of q) {
                const a: CustomDataImport = await this.p(i);
                r.push(a);
            }
            return r;
        });

        fireEvent({
            type: 'GetAllCustomImportsEvent',
            customDataImports: r
        } as GetAllCustomImportsEvent);

        return r;
    }


    // === utils ===
    async p(i: QueryI): Promise<CustomDataImport> {
        const s: ImportScript = await getImportScriptByName(i.NAME);
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
}

const s = new CustomImportService()
export const
    getCustomImportById = s.getCustomImportById.bind(s),
    getAllCustomImports = s.getAllCustomImports.bind(s);