import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {DataExportArtifact} from "../model/data-export.model";
import {View} from "../model/view.model";
import {BinaryContent} from "../model/binary-content.model";
import {
    DeleteExportArtifactByIdEvent,
    fireEvent,
    GetAllExportArtifactsEvent,
    GetExportArtifactContentEvent
} from "./event/event.service";

export class ExportArtifactService {
    /**
     * ===================================
     * === getExportArtifactContent() ===
     * ===================================
     */
    async getExportArtifactContent(dataExportId: number): Promise<BinaryContent> {
        const binaryContent: BinaryContent = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT 
                    ID, DATA_EXPORT_ID, NAME, MIME_TYPE, SIZE, CONTENT, CREATION_DATE, LAST_UPDATE
                FROM TBL_DATA_EXPORT_FILE 
                WHERE DATA_EXPORT_ID=?
            `, [dataExportId])

            if (q.length > 0) {
                return {
                    id: q[0].DATA_EXPORT_ID,
                    name: q[0].NAME,
                    mimeType: q[0].MIME_TYPE,
                    size: q[0].SIZE,
                    content: q[0].CONTENT
                } as BinaryContent
            }
            return null;
        });

        fireEvent({
            type: "GetExportArtifactContentEvent",
            dataExportId,
            content: binaryContent
        } as GetExportArtifactContentEvent);

        return binaryContent;
    }


    /**
     * ===================================
     * === deleteExportArtifactById() ===
     * ===================================
     */
    async deleteExportArtifactById(dataExportArtifactId: number): Promise<boolean> {
        const b: boolean = await doInDbConnection(async (conn: Connection) => {
            const q: QueryResponse = await conn.query(`
                DELETE FROM TBL_DATA_EXPORT WHERE ID=?
            `, [dataExportArtifactId]);
            return (q.affectedRows > 0);
        });
        fireEvent({
            type: "DeleteExportArtifactByIdEvent",
            dataExportArtifactId,
            result: b
        } as DeleteExportArtifactByIdEvent);
        return b;
    };



    /**
     * ===================================
     * === getAllExportArtifacts() =======
     * ===================================
     */
    async getAllExportArtifacts(): Promise<DataExportArtifact[]> {
        const dataExportArtifacts: DataExportArtifact[] =  await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT 
                    E.ID AS E_ID,
                    E.VIEW_ID AS E_VIEW_ID,
                    E.NAME AS E_NAME,
                    E.TYPE AS E_TYPE,
                    E.CREATION_DATE AS E_CREATION_DATE,
                    E.LAST_UPDATE AS E_LAST_UPDATE,
                    
                    V.ID AS V_ID,
                    V.NAME AS V_NAME,
                    V.DESCRIPTION AS V_DESCRIPTION,
                    V.STATUS AS V_STATUS,
                    V.CREATION_DATE AS V_CREATION_DATE,
                    V.LAST_UPDATE AS V_LAST_UPDATE,
                    
                    F.ID AS F_ID,
                    F.NAME AS F_NAME,
                    F.MIME_TYPE AS F_MIME_TYPE,
                    F.SIZE AS F_SIZE
                    
                FROM TBL_DATA_EXPORT AS E
                LEFT JOIN TBL_VIEW AS V ON V.ID = E.VIEW_ID
                LEFT JOIN TBL_DATA_EXPORT_FILE AS F ON F.DATA_EXPORT_ID = E.ID
                ORDER BY E.LAST_UPDATE DESC
            `);

            return q.reduce((acc: DataExportArtifact[], i: QueryI) => {
                const a = {
                    view: {} as View
                } as DataExportArtifact;
                a.id = i.E_ID;
                a.name = i.E_NAME;
                a.type = i.E_TYPE;
                a.creationDate = i.E_CREATION_DATE;
                a.lastUpdate = i.E_LAST_UPDATE;
                a.view.id = i.V_ID;
                a.view.name = i.V_NAME;
                a.view.description = i.V_DESCRIPTION;
                a.view.creationDate = i.V_CREATION_DATE;
                a.view.lastUpdate = i.V_LAST_UPDATE;
                a.fileName = i.F_NAME;
                a.mimeType = i.F_MIME_TYPE;
                a.size = i.F_SIZE;
                acc.push(a);
                return acc;
            }, []);
        });

        fireEvent({
            type: "GetAllExportArtifactsEvent",
            dataExportArtifacts
        } as GetAllExportArtifactsEvent);

        return dataExportArtifacts;
    };
}

const s = new ExportArtifactService()
export const
    getExportArtifactContent = s.getExportArtifactContent.bind(s),
    deleteExportArtifactById = s.deleteExportArtifactById.bind(s),
    getAllExportArtifacts = s.getAllExportArtifacts.bind(s);