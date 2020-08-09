import {Validation, ValidationError, ValidationLog, ValidationResult} from "../../model/validation.model";
import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../../db";
import {Connection} from "mariadb";
import {
    DeleteValidationResultEvent,
    fireEvent,
    GetAllViewValidationsEvent, GetValidationByViewIdAndValidationIdEvent, GetValidationsByViewIdEvent,
    GetViewValidationResultEvent
} from "../event/event.service";

const SQL_1 = `
                SELECT 
                    ID, VIEW_ID, NAME, DESCRIPTION, PROGRESS, CREATION_DATE, LAST_UPDATE                
                FROM TBL_VIEW_VALIDATION WHERE VIEW_ID=?
`;

const SQL_2 = `${SQL_1} AND ID=?`




/**
 *  ===============================
 *  === getViewValidationResult ===
 *  ===============================
 */
export const getViewValidationResult = async (viewId: number, validationId: number): Promise<ValidationResult> => {

    const m_validationResult: Map<string /* validationId */, ValidationResult> = new Map();
    const m_validationError: Map<string /* validationErrorId */, ValidationError> = new Map();
    const m_validationLog: Map<string /* validationLogId */, ValidationLog> = new Map();
    const validationResults: ValidationResult[] = [];

    await doInDbConnection(async (conn: Connection) => {
        const q1: QueryA = (await conn.query(`
                SELECT 
                    V.ID AS V_ID,
                    V.VIEW_ID AS V_VIEW_ID,
                    V.NAME AS V_NAME,
                    V.DESCRIPTION AS V_DESCRIPTION,
                    V.PROGRESS AS V_PROGRESS,
                    V.CREATION_DATE AS V_CREATION_DATE,
                    V.LAST_UPDATE AS V_LAST_UPDATE
                FROM TBL_VIEW_VALIDATION AS V
                WHERE V.ID = ? AND V.VIEW_ID = ?
            `, [validationId, viewId]));

        for (const qq1 of q1) {
            const m_validationResult_key = `${qq1.V_ID}`;
            if (!m_validationResult.has(m_validationResult_key)) {
                const validationResult: ValidationResult = {
                    id : qq1.V_ID,
                    viewId : qq1.V_VIEW_ID,
                    name : qq1.V_NAME,
                    description : qq1.V_DESCRIPTION,
                    progress : qq1.V_PROGRESS,
                    creationDate : qq1.V_CREATION_DATE,
                    lastUpdate : qq1.V_LAST_UPDATE,
                    logs: [],
                    errors: []
                };
                m_validationResult.set(m_validationResult_key, validationResult);
                validationResults.push(validationResult);

                // error of this validation
                const q2: QueryA = (await conn.query(`
                        SELECT 
                            E.ID AS E_ID,
                            E.VIEW_VALIDATION_ID AS E_VIEW_VALIDATION_ID,
                            E.RULE_ID AS E_RULE_ID,
                            E.ITEM_ID AS E_ITEM_ID,
                            E.MESSAGE AS E_MESSAGE,
                            E.VIEW_ATTRIBUTE_ID AS E_VIEW_ATTRIBUTE_ID,
                            E.LEVEL AS E_LEVEL,
                            E.CREATION_DATE AS E_CREATION_DATE,
                            E.LAST_UPDATE AS E_LAST_UPDATE
                        FROM TBL_VIEW_VALIDATION_ERROR AS E 
                        WHERE E.VIEW_VALIDATION_ID = ? 
                    `, [validationId]));

                for (const q of q2) {
                    const m_validationError_key = `${q.E_ID}`;
                    if (!m_validationError.has(m_validationError_key)) {
                        const validationError: ValidationError = {
                            id: q.E_ID,
                            level: q.E_LEVEL,
                            itemId: q.E_ITEM_ID,
                            ruleId: q.E_RULE_ID,
                            attributeId: q.E_VIEW_ATTRIBUTE_ID,
                            message: q.E_MESSAGE,
                        };
                        m_validationError.set(m_validationError_key, validationError);
                        m_validationResult.get(m_validationResult_key).errors.push(validationError);
                    }
                }


                // logs of this validation
                const q3: QueryA = (await conn.query(`
                        SELECT 
                            L.ID AS L_ID,
                            L.VIEW_VALIDATION_ID AS L_VIEW_VALIDATION_ID,
                            L.LEVEL AS L_LEVEL,
                            L.MESSAGE AS L_MESSAGE,
                            L.CREATION_DATE AS L_CREATION_DATE,
                            L.LAST_UPDATE AS L_LAST_UPDATE
                        FROM TBL_VIEW_VALIDATION_LOG AS L 
                        WHERE L.VIEW_VALIDATION_ID = ?
                    `, [validationId]));

                for (const q of q3) {
                    const m_validationLog_key = `${q.L_ID}`;
                    if (!m_validationLog.has(m_validationLog_key)) {
                        const validationLog: ValidationLog = {
                            id: q.L_ID,
                            level: q.L_LEVEL,
                            message: q.L_MESSAGE,
                            creationDate: q.L_CREATION_DATE
                        }
                        m_validationLog.set(m_validationLog_key, validationLog);
                        m_validationResult.get(m_validationResult_key).logs.push(validationLog);
                    }
                }
            }
        }
    });

    const r: ValidationResult[] = validationResults;
    const _r: ValidationResult = (r && r.length ? r[0] : null);
    fireEvent({
       type: "GetViewValidationResultEvent",
       viewId, validationId, result: _r
    } as GetViewValidationResultEvent);
    return _r;
};

/**
 *  =============================
 *  === getAllViewValidations ===
 *  =============================
 */
export const getAllViewValidations = async (viewId: number): Promise<Validation[]> => {
    const v: Validation[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(`
                SELECT 
                    ID, VIEW_ID, NAME, DESCRIPTION, PROGRESS, CREATION_DATE, LAST_UPDATE                
                FROM TBL_VIEW_VALIDATION WHERE VIEW_ID=?
            `, [viewId]);

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
    });
    fireEvent({
       type: "GetAllViewValidationsEvent",
       viewId, result: v
    } as GetAllViewValidationsEvent);
    return v;
};

/**
 * ===============================
 * === deleteValidationResult ===
 * ===============================
 */
export const deleteValidationResult = async (viewId: number, validationId: number): Promise<boolean> => {
    const result: boolean = await doInDbConnection(async (conn: Connection) => {
        const q: QueryResponse =  await conn.query(`DELETE FROM TBL_VIEW_VALIDATION WHERE ID=? AND VIEW_ID=?`, [validationId, viewId])
        return (q.affectedRows);
    });
    fireEvent({
       type: "DeleteValidationResultEvent",
       viewId, validationId, result
    } as DeleteValidationResultEvent);
    return result;
};


/**
 * ===============================
 * === getValidationsByViewId ===
 * ===============================
 */
export const getValidationsByViewId = async (viewId: number): Promise<Validation[]> => {
    const v: Validation[] = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_1, [viewId]);
        const v: Validation[] = p(q);
        return v;
    });
    fireEvent({
       type: 'GetValidationsByViewIdEvent',
       viewId, result: v
    } as GetValidationsByViewIdEvent);
    return v;
}

/**
 * ============================================
 * === getValidationByViewIdAndValidationId ===
 * ============================================
 */
export const getValidationByViewIdAndValidationId = async (viewId: number, validationId: number): Promise<Validation> => {
   const v: Validation = await doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(SQL_2, [viewId, validationId]);
        const v: Validation[] = p(q);
        return v && v.length > 0 ? v[0] : null;
   });
   fireEvent({
      type: "GetValidationByViewIdAndValidationIdEvent",
      viewId, validationId, result: v
   } as GetValidationByViewIdAndValidationIdEvent);
   return v;
}

// ========== helpers ====

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
