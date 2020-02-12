import {Registry} from "../../registry";
import {NextFunction, Router, Request, Response} from "express";
import {aFnAnyTrue, v, validateJwtMiddlewareFn, validateMiddlewareFn, vFnHasAnyUserRoles} from "./common-middleware";
import {ROLE_VIEW} from "../../model/role.model";
import { param } from "express-validator";
import {doInDbConnection, QueryA, QueryI} from "../../db";
import {Connection} from "mariadb";
import {ValidationError, ValidationLog, ValidationResult} from "../../model/validation.model";
import {ItemMetadata2, ItemValue2} from "../model/server-side.model";

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric(),
        param('validationId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const viewId: number = Number(req.params.viewId);
        const validationId: number = Number(req.params.validationId);


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
        res.status(200).json(r && r.length ? r[0] : null);
    }
];

const reg = (router: Router, registry: Registry) => {
    const p = `/view/:viewId/validation/:validationId`;
    registry.addItem('GET', p);
    router.get(p, ...httpAction);
}

export default reg;
