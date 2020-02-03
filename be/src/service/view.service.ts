import {View} from "../model/view.model";
import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";

const SQL_1 = `
   SELECT 
        ID, NAME, DESCRIPTION
   FROM TBL_VIEW WHERE STATUS = 'ENABLED'
`;

const SQL_2 = `${SQL_1} AND ID=?`;


export const getAllViews = async (): Promise<View[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_1);
        const views: View[] =  p(q);
        return views;
    });
}


export const getViewById = async (viewId: number): Promise<View> => {
    return await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_2, [viewId]);
        const views: View[] =  p(q);
        return (views && views.length ? views[0] : null);
    });

};

const p = (q: QueryA) => {
    const views: View[] = q.map((i: QueryI) => {
        return {
            id: i.ID,
            name: i.NAME,
            description: i.DESCRIPTION
        } as View
    });
    return views;
}