import fileType from "file-type";
import {doInDbConnection, QueryResponse} from "../db";
import {Connection} from "mariadb";


export const addItemImage = async (itemId: number, fileName: string, image: Buffer, primaryImage?: boolean ): Promise<boolean> => {

    const ft: fileType.FileTypeResult = fileType(image);

    const q: QueryResponse = await doInDbConnection(async (conn: Connection) => {
        return await conn.query(`
                INSERT INTO TBL_ITEM_IMAGE (ITEM_ID, \`PRIMARY\`, MIME_TYPE, NAME, SIZE, CONTENT) VALUES (?,?,?,?,?,?)
            `, [itemId, primaryImage ? primaryImage : false, ft.mime, fileName,  image.length, image]);
    });

    return (q.affectedRows > 0);
}