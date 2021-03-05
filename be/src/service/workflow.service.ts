import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import { Connection } from "mariadb";
import {WorkflowDefinition, WorkflowInstanceAction, Workflow, WorkflowInstanceType} from "../model/workflow.model";
import {Argument, Engine, EngineResponse, State} from "../wf";
import * as Path from 'path';
import {WorkflowScript} from "../server-side-model/server-side.model";
import {InternalEngine, InternalState} from "../wf/engine-impl";
import {e} from "../logger";
import {STATUS_CODES} from 'http';
import {ENABLED} from '../model/status.model';

const q1: string = `
            SELECT 
                W.ID AS M_ID,
                W.NAME AS M_NAME,
                W.VIEW_ID AS M_VIEW_ID,
                W.WORKFLOW_DEFINITION_ID AS M_WORKFLOW_DEFINITION_ID,
                W.TYPE AS M_TYPE,
                W.ACTION AS M_ACTION,
                W.STATUS AS M_STATUS,
                W.CREATION_DATE AS M_CREATION_DATE,
                W.LAST_UPDATE AS M_LAST_UPDATE,
                WD.ID AS W_ID,
                WD.NAME AS W_NAME,
                WD.DESCRIPTION AS W_DESCRIPTION,
                WD.CREATION_DATE AS W_CREATION_DATE,
                WD.LAST_UPDATE AS W_LAST_UPDATE,
                V.ID AS V_ID,
                V.NAME AS V_NAME,
                V.DESCRIPTION AS V_DESCRIPTION,
                V.STATUS AS V_STATUS,
                V.CREATION_DATE AS V_CREATION_DATE,
                V.LAST_UPDATE AS V_LAST_UPDATE
            FROM TBL_WORKFLOW AS W
            LEFT JOIN TBL_WORKFLOW_DEFINITION AS WD ON WD.ID = W.WORKFLOW_DEFINITION_ID
            LEFT JOIN TBL_VIEW AS V ON V.ID = W.VIEW_ID
            WHERE V.ID = ? AND W.STATUS = ?
`;

const q2 = `${q1} AND W.ACTION = ? AND W.TYPE = ? `;






class WorkflowService {

    /**
     * ===================================
     * === getAllWorkflowDefinitions =====
     * ===================================
     */
    async getAllWorkflowDefinitions(): Promise<WorkflowDefinition[]> {
        return await doInDbConnection(async (conn: Connection) => {
            return (await conn.query(`SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE FROM TBL_WORKFLOW_DEFINITION `))
                .reduce((acc: WorkflowDefinition[], i: QueryI) => {
                    const w: WorkflowDefinition = {
                        id: i.ID,
                        name: i.NAME,
                        description: i.DESCRIPTION,
                        creationDate: i.CREATION_DATE,
                        lastUpdate: i.LAST_UPDATE
                    };
                    acc.push(w);
                    return acc;
                }, []);
        });
    };

    /**
     * ================================
     * === addWorkflow  ===============
     * ================================
     */
    async addWorkflow(workflowName: string, viewId: number, workflowDefinitionId: number, action: WorkflowInstanceAction,
                      type: WorkflowInstanceType, workflowAttributeIds: number[] /* only used when type = 'AttributeValue */): Promise<string[]> {
        return await doInDbConnection(async conn => {
            const errors = [];
            const r: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_WORKFLOW WHERE NAME = ? `, [workflowName])
            if (r[0].COUNT > 0) {
                const err = `Workflow with name ${workflowName} already exists`;
                errors.push(err);
            } else {
                const qr: QueryResponse = await conn.query(`
                    INSERT INTO TBL_WORKFLOW (NAME, VIEW_ID, WORKFLOW_DEFINITION_ID, TYPE, ACTION, STATUS) VALUES (?,?,?,?,?,?)
                `, [workflowName, viewId, workflowDefinitionId, type, action, ENABLED])
                if (qr.affectedRows == 0) {
                    const err = `Unable to add workflow entry viewId=${viewId}, workflowDefinitionId=${workflowDefinitionId}, type=${type}, action=${action}`;
                    e(err);
                    errors.push(err);
                }
                const workflowId = qr.insertId;
                if (type === 'AttributeValue') {
                    for (const workflowAttributeId of workflowAttributeIds) {
                        const qr2: QueryResponse = await conn.query(`INSERT INTO TBL_WORKFLOW_ATTRIBUTE (WORKFLOW_ID, ATTRIBUTE_ID) VALUES (?,?)`,
                            [workflowId, workflowAttributeId])
                        if (qr2.affectedRows === 0) {
                           const err = `Unable to add workflow attribute entry into db for viewId=${viewId}, workflowId=${workflowId}, attributeId=${workflowAttributeId}`;
                           e(err);
                           errors.push(err);
                        }
                    }
                }
            }
            return errors;
        });
    }

    /**
     * ================================
     * === getWorkflowByView ===
     * ================================
     */
    async getWorkflowByView(viewId: number): Promise<Workflow[]> {
        return await doInDbConnection(async (conn: Connection) => {
            return (await conn.query(q1, [viewId, ENABLED]))
                .reduce(this.reduceQueryToWorkflow.bind(this), []);
        });
    };

    /**
     * ===============================
     * === getWorkflowByViewActionAndType
     * ===============================
     */
    async getWorkflowByViewActionAndType(viewId: number, action: WorkflowInstanceAction, type: WorkflowInstanceType): Promise<Workflow[]> {
        return await doInDbConnection(async (conn: Connection) => {
            return (await conn.query(q2, [viewId, ENABLED, action, type]))
                .reduce(this.reduceQueryToWorkflow.bind(this), []);
        });
    }


    /**
     * ===============================
     * === getWorkflowUserTasks
     * ===============================
     */





    private reduceQueryToWorkflow(acc: Workflow[], i: QueryI): Workflow[] {
        const workflowMapping: Workflow = {
            id: i.M_ID,
            name: i.M_NAME,
            action: i.M_ACTION,
            type: i.M_TYPE,
            status: i.M_STATUS,
            creationDate: i.M_CREATION_DATE,
            lastUpdate: i.M_LAST_UPDATE,
            view: {
                id: i.V_ID,
                name: i.V_NAME,
                description: i.V_DESCRIPTION,
                creationDate: i.V_CREATION_DATE,
                lastUpdate: i.V_LAST_UPDATE,
            },
            workflowDefinition: {
                id: i.W_ID,
                name: i.W_NAME,
                description: i.W_DESCRIPTION,
                creationDate: i.W_CREATION_DATE,
                lastUpdate: i.W_LAST_UPDATE
            }
        };
        acc.push(workflowMapping);
        return acc;
    }
}

const s = new WorkflowService();
export const
    addWorkflow = s.addWorkflow.bind(s),
    getAllWorkflowDefinition = s.getAllWorkflowDefinitions.bind(s),
    getWorkflowByView = s.getWorkflowByView.bind(s),
    getWorkflowByViewActionAndType = s.getWorkflowByViewActionAndType.bind(s)
    // getWorkflowById = s.getWorkflowById.bind(s),
    // getWorkflowByInstanceId = s.getWorkflowByInstanceId.bind(s),
    // startWorkflow = s.startWorkflow.bind(s),
    // continueWorkflow = s.continueWorkflow.bind(s),
    // createArgsForItem = s.createArgsForAttribute.bind(s),
    // createArgsForAttribute = s.createArgsForAttribute.bind(s),
    // createArgsForPrice = s.createArgsForPrice.bind(s),
    // createArgsForRule = s.createArgsForRule.bind(s),
    // createArgsForUser = s.createArgsForUser.bind(s),
    // createArgsForCategory = s.createArgsForCategory.bind(s);
