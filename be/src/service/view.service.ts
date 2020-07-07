import {View} from "../model/view.model";
import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";
import {
    AddOrUpdateViewsEvent,
    DeleteViewEvent,
    fireEvent,
    GetAllViewsEvent,
    GetViewByIdEvent, GetViewByNameEvent
} from "./event/event.service";

const SQL_1 = `
   SELECT 
        ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE
   FROM TBL_VIEW WHERE STATUS = 'ENABLED'
`;

const SQL_2 = `${SQL_1} AND ID=?`;

const SQL_3 = `${SQL_1} AND NAME=?`;



/**
 *  ==================================
 *  === deleteView ===
 *  ==================================
 */
export const deleteView = async (viewId: number): Promise<boolean> => {
    const result: boolean = await doInDbConnection(async (conn: Connection) => {
        const q: QueryResponse = await conn.query(`UPDATE TBL_VIEW SET STATUS='DELETED' WHERE ID=?`,[viewId]);
        return q.affectedRows;
    });
    fireEvent({
       type: "DeleteViewEvent",
       viewId, result
    } as DeleteViewEvent);
    return result;
};

/**
 *  ==================================
 *  === addOrUpdateViews ===
 *  ==================================
 */
export type AddOrUpdateViewsInput = AddOrUpdateViewsInputView[];
export interface AddOrUpdateViewsInputView { id: number, name: string, description: string};
export const addOrUpdateViews = async (views: AddOrUpdateViewsInput): Promise<string[]> => {
    const badUpdates: string[] = [];
    for (const view of views) {
        await doInDbConnection(async (conn: Connection) => {
            const id = view.id;
            const name = view.name;
            const descrption = view.description;

            if (!!!id || id <= 0) { // create new copy
                const qq: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_VIEW WHERE NAME = ?`, [name]);
                if (qq[0].COUNT > 0) { // view with name already exists
                    badUpdates.push(`View name ${view.name} already exists`);
                } else {
                    const q: QueryResponse = await conn.query(`INSERT INTO TBL_VIEW (NAME, DESCRIPTION, STATUS) VALUES (?, ?, 'ENABLED')`, [name, descrption]);
                    if (q.affectedRows == 0) {
                        badUpdates.push(`View name ${view.name} not persisted`);
                    }
                }
            } else { // update
                const q: QueryResponse = await conn.query(`UPDATE TBL_VIEW SET NAME=?, DESCRIPTION=? WHERE ID=? AND STATUS='ENABLED'`, [name, descrption, id]);
                if (q.affectedRows == 0) {
                    badUpdates.push(`View id ${view.id} not updated`);
                }
            }
        });
    }
    fireEvent({
       type: "AddOrUpdateViewsEvent",
       input: views, errors: badUpdates
    } as AddOrUpdateViewsEvent)
    return badUpdates;
}

/**
 *  ==================================
 *  === getAllViews ===
 *  ==================================
 */
export const getAllViews = async (): Promise<View[]> => {
    const views: View[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_1);
        const views: View[] =  p(q);
        return views;
    });
    fireEvent({
       type: "GetAllViewsEvent",
       views
    } as GetAllViewsEvent);
    return views;
}


/**
 *  ==================================
 *  === getViewById ===
 *  ==================================
 */
export const getViewById = async (viewId: number): Promise<View> => {
    const view: View = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_2, [viewId]);
        const views: View[] =  p(q);
        return (views && views.length ? views[0] : null);
    });
    fireEvent({
        type: "GetViewByIdEvent",
        viewId, view
    } as GetViewByIdEvent);
    return view;
};


/**
 *  ==================================
 *  === getViewByName ===
 *  ==================================
 */
export const getViewByName = async (viewName: string): Promise<View> => {
    const view: View = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_3, [viewName]);
        const views: View[] = p(q);
        return (views && views.length ? views[0]: null);
    });
    fireEvent({
       type: "GetViewByNameEvent",
       viewName, view
    } as GetViewByNameEvent);
    return view;
};


// ===== helper functions =====
const p = (q: QueryA) => {
    const views: View[] = q.map((i: QueryI) => {
        return {
            id: i.ID,
            name: i.NAME,
            description: i.DESCRIPTION,
            creationDate: i.CREATION_DATE,
            lastUpdate: i.LAST_UPDATE
        } as View
    });
    return views;
}