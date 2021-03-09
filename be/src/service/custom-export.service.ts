import {CustomDataExport, ExportScript, ExportScriptInput} from '@fuyuko-common/model/custom-export.model';
import {doInDbConnection, QueryA, QueryI} from '../db';
import {Connection} from 'mariadb';
import {getExportScriptByName} from '../custom-export';
import {fireEvent, GetAllCustomExportsEvent, GetCustomExportByIdEvent} from './event/event.service';


class CustomExportService {
    /**
     *  =============================
     *  === getCustomExportById() ===
     *  =============================
     */
    async getCustomExportById(customExportId: number): Promise<CustomDataExport> {
        const customDataExport: CustomDataExport = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE FROM TBL_CUSTOM_DATA_EXPORT`, [customExportId]);
            if (q.length > 0) {
                const a: CustomDataExport = await this.p(q[0]);
                return a;
            } else {
                return null;
            }
        });

        fireEvent({
            type: "GetCustomExportByIdEvent",
            customExportId,
            customDataExport
        } as GetCustomExportByIdEvent);

        return customDataExport;
    };


    /**
     *  =============================
     *  === getAllCustomExports() ===
     *  =============================
     */
    async getAllCustomExports ():Promise<CustomDataExport[]> {
        const r: CustomDataExport[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE FROM TBL_CUSTOM_DATA_EXPORT`);
            const r: CustomDataExport[] = [];
            for (const i of q) {
                const a: CustomDataExport = await this.p(i);
                r.push(a);
            }
            return r;
        });

        fireEvent({
            type: 'GetAllCustomExportsEvent',
            customDataExports: r
        } as GetAllCustomExportsEvent);

        return r;
    }


    // === utils ===
    async p(i: QueryI): Promise<CustomDataExport> {
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
}

const s = new CustomExportService()
export const
    getCustomExportById = s.getCustomExportById.bind(s),
    getAllCustomExports = s.getAllCustomExports.bind(s);