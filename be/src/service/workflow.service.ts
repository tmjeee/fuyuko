import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import { Connection } from "mariadb";
import {WorkflowDefinition, WorkflowInstanceAction, Workflow, WorkflowInstanceType} from "../model/workflow.model";
import {Argument, Engine, EngineResponse, State} from "../wf";
import * as Path from 'path';
import {WorkflowScript} from "../server-side-model/server-side.model";
import {InternalEngine, InternalState} from "../wf/engine-impl";

const q1: string = `
            SELECT 
                W.ID AS M_ID,
                W_VIEW_ID AS M_VIEW_ID,
                W.WORKFLOW_DEFINITION_ID AS M_WORKFLOW_DEFINITION_ID,
                W.TYPE AS M_TYPE,
                W.ACTION AS M_ACTION,
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
`;

const q2: string = `
            SELECT 
                W.ID AS M_ID,
                W_VIEW_ID AS M_VIEW_ID,
                W.WORKFLOW_DEFINITION_ID AS M_WORKFLOW_DEFINITION_ID,
                W.TYPE AS M_TYPE,
                W.ACTION AS M_ACTION,
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
            WHERE W.ID = ?
`;

const q3: string = `
            SELECT 
                W.ID AS M_ID,
                W_VIEW_ID AS M_VIEW_ID,
                W.WORKFLOW_DEFINITION_ID AS M_WORKFLOW_DEFINITION_ID,
                W.TYPE AS M_TYPE,
                W.ACTION AS M_ACTION,
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
            WHERE W.ID = (SELECT WORKFLOW_ID FROM TBL_WORKFLOW_INSTANCE WHERE ID =? )
`;

const q4: string = `
    SELECT 
        W.ID AS M_ID,
        W_VIEW_ID AS M_VIEW_ID,
        W.WORKFLOW_DEFINITION_ID AS M_WORKFLOW_DEFINITION_ID,
        W.TYPE AS M_TYPE,
        W.ACTION AS M_ACTION,
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
    WHERE W.VIEW_ID = ? AND W.ACTION = ? AND W.TYPE = ?
`;


class WorkflowService {

    /**
     * =========================
     * === getAllWorkflows =====
     * =========================
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
     * === getWorkflowByView ===
     * ================================
     */
    async getWorkflowByView(viewId: number): Promise<Workflow[]> {
        return await doInDbConnection(async (conn: Connection) => {
            return (await conn.query(q1)).reduce((acc: Workflow[], i: QueryI)=> {
                const workflowMapping: Workflow = {
                    id: i.M_ID,
                    action: i.M_ACTION,
                    type: i.M_TYPE,
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
            }, []);
        });
    };

    /**
     * ==============================
     * === getWorkflowById
     * ==============================
     */
    async getWorkflowDefinitionById(workflowDefinitionId: number): Promise<WorkflowDefinition> {
        return doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE FROM TBL_WORKFLOW_DEFINITION WHERE ID=?`, [workflowDefinitionId])
            if (q.length) {
                const workflow: WorkflowDefinition = {
                    id: q[0].ID,
                    name: q[0].NAME,
                    description: q[0].DESCRIPTION,
                    creationDate: q[0].CREATION_DATE,
                    lastUpdate: q[0].LAST_UPDATE
                };
                return workflow;
            }
            return null;
        });
    };


    /**
     * ===============================
     * === getWorkflowById ===
     * ===============================
     */
    async getWorkflowById(workflowMappingId: number): Promise<Workflow> {
        return doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(q2, [workflowMappingId])
            if (q.length) {
                const i: QueryI = q[0];
                const workflowMapping: Workflow = {
                    id: i.M_ID,
                    action: i.M_ACTION,
                    type: i.M_TYPE,
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
                return workflowMapping;
            }
            return null;
        });
    };

    /**
     * =====================================
     * == getWorkflowByInstanceId ===
     * =====================================
     */
    async getWorkflowByInstanceId(workflowInstanceId: number): Promise<Workflow> {
        return doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(q3, [workflowInstanceId]);
            if (q.length) {
                const i: QueryI = q[0];
                const workflow: Workflow = {
                    id: i.M_ID,
                    action: i.M_ACTION,
                    type: i.M_TYPE,
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
                return workflow;
            }
            return null;
        });
    };

    /**
     * ============================
     * === getWorkflow ============
     * ============================
     */
    async getWorkflow(viewId: number, action: WorkflowInstanceAction, type: WorkflowInstanceType): Promise<Workflow> {
        return doInDbConnection(async (conn) => {
            const q: QueryA = await conn.query(q4, [viewId, action, type]);
            if (q.length) {
                const i: QueryI = q[0];
                const workflow: Workflow = {
                    id: i.M_ID,
                    action: i.M_ACTION,
                    type: i.M_TYPE,
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
                }
                return workflow;
            }
            return null;
        });
    }


    /**
     * ==============================
     * === startWorkflow ====
     * ========================
     */
    async startWorkflow(workflowId: number, args: Argument):
        Promise<{
            workflowInstanceId: number,
            engineResponse: EngineResponse,
            errors: string[],
            args: Argument
        }> {
        const errors: string[] = [];
        const workflowMapping: Workflow = await this.getWorkflowById(workflowId);
        let workflowInstanceId: number = null;
        let engine: Engine;
        let engineResponse: EngineResponse = null;

        if (workflowMapping && workflowMapping.workflowDefinition) {
            const workflowScriptFullPath: string = Path.join(__dirname, '../custom-workflow/workflows/', workflowMapping.workflowDefinition.name);
            const workflowScript: WorkflowScript = await import(workflowScriptFullPath);
            engine = workflowScript.createEngine(args);
            engineResponse = await engine.next();
            const data: string = engine.serialize();

            const qr: QueryResponse = await doInDbConnection(async (conn: Connection) => {
                await conn.query(`INSERT INTO TBL_WORKFLOW_INSTANCE (WORKFLOW_MAPPING_ID, DATA) VALUES (?,?)`, [workflowId, data]);
            });
            workflowInstanceId = qr.insertId;

        } else {
            errors.push(`workflow mapping with id ${workflowId} is not found`);
        }
        return {
            engineResponse,
            workflowInstanceId,
            errors,
            args: engine.args
        };
    };

    /**
     * ======================
     * === currentWorkflwo ===
     * ======================
     */
    async currentWorkflow(workflowInstanceId: number):
        Promise<{
            errors: string[],
            args: Argument
        }>{

        const errors: string[] = [];
        const workflow: Workflow = await this.getWorkflowByInstanceId(workflowInstanceId);
        let engine: Engine;

        if (workflow && workflow.workflowDefinition) {
            const workflowScriptFullPath: string = Path.join(__dirname, '../custom-workflow/workflows/', workflow.workflowDefinition.name);
            const workflowScript: WorkflowScript = await import(workflowScriptFullPath);
            engine = workflowScript.createEngine();

            const data: string = await doInDbConnection(async (conn: Connection) => {
                const q: QueryA = await conn.query(`SELECT DATA FROM TBL_WORKFLOW_INSTANCE WHERE ID = ?`, [workflowInstanceId]);
                if (q.length) {
                    return q[0].DATA;
                } else {
                    errors.push(`Failed to find workflow instance with id ${workflowInstanceId}`);
                    return null;
                }
            });

            engine.deserialize(data);
        } else {
            errors.push(`workflow for workflow instance with id ${workflowInstanceId} is not found`);
        }
        return {
            errors,
            args: engine.args,
        };
    }


    /**
     * =======================
     * === continueWorkflow ===
     * =======================
     */
    async continueWorkflow(workflowInstanceId: number, inputArgs: Argument):
        Promise<{
            engineResponse: EngineResponse,
            errors: string[],
            args: Argument
        }> {
        const errors: string[] = [];
        const workflow: Workflow = await this.getWorkflowByInstanceId(workflowInstanceId);
        let engine: Engine;
        let engineResponse: EngineResponse = null;

        if (workflow && workflow.workflowDefinition) {
            const workflowScriptFullPath: string = Path.join(__dirname, '../custom-workflow/workflows/', workflow.workflowDefinition.name);
            const workflowScript: WorkflowScript = await import(workflowScriptFullPath);
            engine = workflowScript.createEngine();

            const data: string = await doInDbConnection(async (conn: Connection) => {
                const q: QueryA = await conn.query(`SELECT DATA FROM TBL_WORKFLOW_INSTANCE WHERE ID = ?`, [workflowInstanceId]);
                if (q.length) {
                    return q[0].DATA;
                } else {
                    errors.push(`Failed to find workflow instance with id ${workflowInstanceId}`);
                    return null;
                }
            });

            engine.deserialize(data);
            engineResponse = await engine.next(inputArgs);
            const newData: string = engine.serialize();

            await doInDbConnection(async (conn: Connection) => {
                await conn.query(`INSERT INTO TBL_WORKFLOW_INSTANCE (WORKFLOW_MAPPING_ID, DATA) VALUES (?,?)`, [workflow.id, newData]);
            });

        } else {
            errors.push(`workflow for workflow instance with id ${workflowInstanceId} is not found`);
        }
        return {
            engineResponse,
            errors,
            args: engine.args,
        }
    };

    // ===============
    /**
     *  - Item
     *  - Attribute
     *  - Price
     *  - Rule
     *  - User
     *  - Category
     */
    createArgsForItem(action: WorkflowInstanceAction): Argument {
        return {};
    };

    createArgsForAttribute(): Argument {
        return {};
    };

    createArgsForPrice(): Argument {
        return {};
    };

    createArgsForRule(): Argument {
        return {};
    };

    createArgsForUser(): Argument {
        return {};
    };

    createArgsForCategory(): Argument {
        return {};
    };
}

const s = new WorkflowService();
export const
    getAllWorkflowDefinition = s.getAllWorkflowDefinitions.bind(s),
    getWorkflowDefinitionById = s.getWorkflowDefinitionById.bind(s),
    getWorkflowByView = s.getWorkflowByView.bind(s),
    getWorkflowById = s.getWorkflowById.bind(s),
    getWorkflowByInstanceId = s.getWorkflowByInstanceId.bind(s),
    startWorkflow = s.startWorkflow.bind(s),
    continueWorkflow = s.continueWorkflow.bind(s),
    createArgsForItem = s.createArgsForAttribute.bind(s),
    createArgsForAttribute = s.createArgsForAttribute.bind(s),
    createArgsForPrice = s.createArgsForPrice.bind(s),
    createArgsForRule = s.createArgsForRule.bind(s),
    createArgsForUser = s.createArgsForUser.bind(s),
    createArgsForCategory = s.createArgsForCategory.bind(s);
