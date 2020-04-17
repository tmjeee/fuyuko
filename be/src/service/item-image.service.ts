import fileType from "file-type";
import {doInDbConnection, QueryA, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {BinaryContent} from "../model/binary-content.model";
import {ClientError} from "../route/v1/common-middleware";


export const getItemPrimaryImage = async (itemId: number): Promise<BinaryContent> => {
    return await doInDbConnection(async (conn: Connection) => {

        const q: QueryA = await conn.query(`
                SELECT 
                    ID,
                    ITEM_ID,
                    \`PRIMARY\`,
                    MIME_TYPE,
                    NAME,
                    SIZE,
                    CONTENT
                FROM TBL_ITEM_IMAGE WHERE ITEM_ID = ?
            `, [itemId]);

        if (q.length <= 0) {

            const q1: QueryA = await conn.query(`
                    SELECT
                        ID, TAG, NAME, MIME_TYPE, SIZE, CONTENT 
                    FROM TBL_GLOBAL_IMAGE WHERE TAG = ?
                `, ['no-item-image']);


            if (q1.length <= 0) {
                throw new ClientError(`No Item image for item id ${itemId}`);
            }

            const id: number = q1[0].ID;
            const name: string = q1[0].NAME;
            const contentLength: number = q1[0].SIZE;
            const contentType: string = q1[0].MIME_TYPE;
            const buffer: Buffer = q1[0].CONTENT;

            return {
                id,
                name,
                mimeType: contentType,
                size: contentLength,
                content: buffer
            } as BinaryContent;
        }

        const id: number = q[0].ID;
        const name: string = q[0].NAME;
        const contentLength: number = q[0].SIZE;
        const contentType: string = q[0].MIME_TYPE;
        const buffer: Buffer = q[0].CONTENT;

        return {
            id,
            name,
            mimeType: contentType,
            size: contentLength,
            content: buffer
        } as BinaryContent;
    });
};

export const getItemImageContent = async (itemImageId: number): Promise<BinaryContent> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`
                SELECT 
                    ID, 
                    ITEM_ID,
                    \`PRIMARY\`,
                    MIME_TYPE,
                    NAME,
                    SIZE,
                    CONTENT
                FROM TBL_ITEM_IMAGE WHERE ID = ?
            `, [itemImageId]);

        if (q.length <= 0) {
            const q1: QueryA = await conn.query(`
                    SELECT
                        ID, TAG, NAME, MIME_TYPE, SIZE, CONTENT 
                    FROM TBL_GLOBAL_IMAGE WHERE TAG = ?
                `, ['no-item-image']);


            if (q1.length <= 0) {
                throw new ClientError(`No Item image for item image id ${itemImageId}`);
            }

            const id: number = q1[0].ID;
            const name: string = q1[0].NAME;
            const contentLength: number = q1[0].SIZE;
            const contentType: string = q1[0].MIME_TYPE;
            const buffer: Buffer = q1[0].CONTENT;

            return {
               id,
               name,
               mimeType: contentType,
               size: contentLength,
               content: buffer
            } as BinaryContent;
        }

        const id: number = q[0].ID;
        const name: string = q[0].NAME;
        const contentLength: number = q[0].SIZE;
        const contentType: string = q[0].MIME_TYPE;
        const buffer: Buffer = q[0].CONTENT;

        return {
           id,
           name,
           size: contentLength,
           mimeType: contentType,
           content: buffer
        } as BinaryContent;
    });
}

export const addItemImage = async (itemId: number, fileName: string, image: Buffer, primaryImage?: boolean ): Promise<boolean> => {

    const ft: fileType.FileTypeResult = fileType(image);

    const q: QueryResponse = await doInDbConnection(async (conn: Connection) => {
        return await conn.query(`
                INSERT INTO TBL_ITEM_IMAGE (ITEM_ID, \`PRIMARY\`, MIME_TYPE, NAME, SIZE, CONTENT) VALUES (?,?,?,?,?,?)
            `, [itemId, primaryImage ? primaryImage : false, ft.mime, fileName,  image.length, image]);
    });

    return (q.affectedRows > 0);
};

export const deleteItemImage = async (itemId: number, itemImageId: number): Promise<boolean> => {
    const q: QueryResponse = await doInDbConnection(async (conn: Connection) => {
        return await conn.query(`
               DELETE FROM TBL_ITEM_IMAGE WHERE ITEM_ID=? AND ID=?
            `, [itemId, itemImageId]);
    });
    return (q.affectedRows > 0);
}