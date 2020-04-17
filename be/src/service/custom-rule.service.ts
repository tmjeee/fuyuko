import {CustomRule, CustomRuleForView} from "../model/custom-rule.model";
import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import {Connection} from "mariadb";


export const getAllCustomRules = async (): Promise<CustomRule[]> => {
    const r: CustomRule[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`
                SELECT ID, NAME, DESCRIPTION FROM TBL_CUSTOM_RULE
            `);
        return q.reduce((customRules: CustomRule[], qi: QueryI) => {
            const r: CustomRule = {
                id: qi.ID,
                name: qi.NAME,
                description: qi.DESCRIPTION
            };
            customRules.push(r);
            return customRules;
        }, []);
    });
    return r;
}

export const deleteCustomRules = async (viewId: number, customRuleIds: number[]): Promise<string[]> => {
    const errors: string[] = [];
    await doInDbConnection(async (conn: Connection) => {
        for (const customRuleId of customRuleIds) {
            const q: QueryResponse = await conn.query(`
                    DELETE FROM TBL_CUSTOM_RULE_VIEW WHERE CUSTOM_RULE_ID=? AND VIEW_ID=?
                `, [customRuleId, viewId]);
            if (q.affectedRows <= 0) {
                errors.push(`Failed to delete custom rule id ${customRuleId} in view id ${viewId}`);
            }
        }
    });
    return errors;
}



export const getAllCustomRulesForView: (viewId: number) => Promise<CustomRuleForView[]> = async (viewId: number) => {
    const r: CustomRuleForView[] = await doInDbConnection(async (conn: Connection) => {
        return (await conn.query(`
                SELECT 
                    R.ID AS R_ID,
                    R.NAME AS R_NAME,
                    R.DESCRIPTION AS R_DESCRIPTION,
                    V.ID AS V_ID,
                    V.CUSTOM_RULE_ID AS V_CUSTOM_RULE_ID,
                    V.STATUS AS V_STATUS,
                    V.VIEW_ID AS V_VIEW_ID,
                    V.CREATION_DATE AS V_CREATION_DATE,
                    V.LAST_UPDATE AS V_LAST_UPDATE
                FROM TBL_CUSTOM_RULE_VIEW AS V
                INNER JOIN TBL_CUSTOM_RULE AS R ON R.ID = V.CUSTOM_RULE_ID
                WHERE V.VIEW_ID = ?
            `, viewId) as QueryA).reduce((acc: CustomRuleForView[], i: QueryI) => {
            const r: CustomRuleForView = {
                id: i.R_ID,
                name: i.R_NAME,
                description: i.R_DESCRIPTION,
                status: i.V_STATUS,
                customRuleViewId: i.V_ID,
                viewId: i.V_VIEW_ID
            };
            acc.push(r);
            return acc;
        }, []);
    });
    return r;
}
