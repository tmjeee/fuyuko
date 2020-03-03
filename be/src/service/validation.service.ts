import {Validation} from "../model/validation.model";
import {doInDbConnection, QueryA, QueryI} from "../db";
import {Connection} from "mariadb";

const SQL_1 = `
                SELECT 
                    ID, VIEW_ID, NAME, DESCRIPTION, PROGRESS, CREATION_DATE, LAST_UPDATE                
                FROM TBL_VIEW_VALIDATION WHERE VIEW_ID=?
`;

const SQL_2 = `${SQL_1} AND ID=?`


export const getValidationsByViewId = async (viewId: number): Promise<Validation[]> => {
    const v: Validation[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_1, [viewId]);
        const v: Validation[] = p(q);
        return v;
    });
    return v;
}

// export const getCustomValidationByViewId = async (viewId: number, validationId: number): Promise<CustomRu>

export const getValidationByViewIdAndValidationId = async (viewId: number, validationId: number): Promise<Validation> => {
   const v: Validation = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_2, [viewId, validationId]);
        const v: Validation[] = p(q);
        return v && v.length > 0 ? v[0] : null;
   });
   return v;
}


const p = (q: QueryA): Validation[] => {
    return q.reduce((acc: Validation[], i: QueryI) => {
        const val: Validation = {
            id: i.ID,
            name: i.NAME,
            description: i.DESCRIPTION,
            progress: i.PROGRESS,
            viewId: i.VIEW_ID,
            creationDate: i.CREATION_DATE,
            lastUpdate: i.LAST_UPDATE
        };
        acc.push(val);
        return acc;
    }, []);
}
