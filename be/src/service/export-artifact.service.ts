import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";
import {DataExportArtifact} from "../model/data-export.model";
import {View} from "../model/view.model";
import {BinaryContent} from "../model/binary-content.model";


export const getExportArtifactContent = async (dataExportId: number): Promise<BinaryContent> => {
    return await doInDbConnection(async (conn: Connection) => {
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
}

export const deleteExportArtifactById = async (dataExportArtifactId: number) => {
    await doInDbConnection(async (conn: Connection) => {
        await conn.query(`
                DELETE FROM TBL_DATA_EXPORT WHERE ID=?
            `, [dataExportArtifactId]);
    });
};

export const getAllExportArtifacts = async (): Promise<DataExportArtifact[]> => {
    const dataExportArtifact: DataExportArtifact[] =  await doInDbConnection(async (conn: Connection) => {
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

    return dataExportArtifact;
};