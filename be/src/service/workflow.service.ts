import {doInDbConnection, QueryA, QueryI, QueryResponse} from "../db";
import { Connection } from "mariadb";
import {Workflow, WorkflowInstanceAction, WorkflowMapping} from "../model/workflow.model";
import {View} from "../model/view.model";
import {Argument, Engine, EngineResponse} from "../wf";
import * as Path from 'path';
import {WorkflowScript} from "../server-side-model/server-side.model";

const q1: string = `
            SELECT 
                M.ID AS M_ID,
                M_VIEW_ID AS M_VIEW_ID,
                M.WORKFLOW_ID AS M_WORKFLOW_ID,
                M.TYPE AS M_TYPE,
                M.ACTION AS M_ACTION,
                M.CREATION_DATE AS M_CREATION_DATE,
                M.LAST_UPDATE AS M_LAST_UPDATE,
                W.ID AS W_ID,
                W.NAME AS W_NAME,
                W.DESCRIPTION AS W_DESCRIPTION,
                W.CREATION_DATE AS W_CREATION_DATE,
                W.LAST_UPDATE AS W_LAST_UPDATE,
                V.ID AS V_ID,
                V.NAME AS V_NAME,
                V.DESCRIPTION AS V_DESCRIPTION,
                V.STATUS AS V_STATUS,
                V.CREATION_DATE AS V_CREATION_DATE,
                V.LAST_UPDATE AS V_LAST_UPDATE
            FROM TBL_WORKFLOW_MAPPING AS M
            LEFT JOIN TBL_WORKFLOW AS W ON W.ID = M.WORKFLOW_ID
            LEFT JOIN TBL_VIEW AS V ON V.ID = M.VIEW_ID
`;

const q2: string = `
            SELECT 
                M.ID AS M_ID,
                M_VIEW_ID AS M_VIEW_ID,
                M.WORKFLOW_ID AS M_WORKFLOW_ID,
                M.TYPE AS M_TYPE,
                M.ACTION AS M_ACTION,
                M.CREATION_DATE AS M_CREATION_DATE,
                M.LAST_UPDATE AS M_LAST_UPDATE,
                W.ID AS W_ID,
                W.NAME AS W_NAME,
                W.DESCRIPTION AS W_DESCRIPTION,
                W.CREATION_DATE AS W_CREATION_DATE,
                W.LAST_UPDATE AS W_LAST_UPDATE,
                V.ID AS V_ID,
                V.NAME AS V_NAME,
                V.DESCRIPTION AS V_DESCRIPTION,
                V.STATUS AS V_STATUS,
                V.CREATION_DATE AS V_CREATION_DATE,
                V.LAST_UPDATE AS V_LAST_UPDATE
            FROM TBL_WORKFLOW_MAPPING AS M
            LEFT JOIN TBL_WORKFLOW AS W ON W.ID = M.WORKFLOW_ID
            LEFT JOIN TBL_VIEW AS V ON V.ID = M.VIEW_ID
            WHERE M.ID = ?
`;

const q3: string = `
            SELECT 
                M.ID AS M_ID,
                M_VIEW_ID AS M_VIEW_ID,
                M.WORKFLOW_ID AS M_WORKFLOW_ID,
                M.TYPE AS M_TYPE,
                M.ACTION AS M_ACTION,
                M.CREATION_DATE AS M_CREATION_DATE,
                M.LAST_UPDATE AS M_LAST_UPDATE,
                W.ID AS W_ID,
                W.NAME AS W_NAME,
                W.DESCRIPTION AS W_DESCRIPTION,
                W.CREATION_DATE AS W_CREATION_DATE,
                W.LAST_UPDATE AS W_LAST_UPDATE,
                V.ID AS V_ID,
                V.NAME AS V_NAME,
                V.DESCRIPTION AS V_DESCRIPTION,
                V.STATUS AS V_STATUS,
                V.CREATION_DATE AS V_CREATION_DATE,
                V.LAST_UPDATE AS V_LAST_UPDATE
            FROM TBL_WORKFLOW_MAPPING AS M
            LEFT JOIN TBL_WORKFLOW AS W ON W.ID = M.WORKFLOW_ID
            LEFT JOIN TBL_VIEW AS V ON V.ID = M.VIEW_ID
            WHERE M.ID = (SELECT WORKFLOW_MAPPING_ID FROM TBL_WORKFLOW_INSTANCE WHERE ID =? )
`;

/**
 * =========================
 * === getAllWorkflows =====
 * =========================
 */
const getAllWorkflows = async (): Promise<Workflow[]> => {
   return await doInDbConnection(async (conn: Connection) => {
      return (await conn.query(`SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE FROM TBL_WORKFLOW `))
         .reduce((acc: Workflow[], i: QueryI) => {
             const w: Workflow = {
                id: i.ID,
                name: i.NAME,
                description: i.DESCRIPTION,
                creationDate: i.CREATION_DATE,
                lastUpdate: i.LAST_UPDATE 
             } as Workflow;
             acc.push(w);
             return acc;
         }, []);
   });
};


/**
 * ================================
 * === getWorkflowMappingByView ===
 * ================================
 */
const getWorkflowMappingByView = async (viewId: number): Promise<WorkflowMapping[]> => {
    return await doInDbConnection(async (conn: Connection) => {
        return (await conn.query(q1)).reduce((acc: WorkflowMapping[], i: QueryI)=> {
            const workflowMapping: WorkflowMapping = {
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
               } as View,
               workflow: {
                  id: i.W_ID,
                  name: i.W_NAME,
                  description: i.W_DESCRIPTION,
                  creationDate: i.W_CREATION_DATE,
                  lastUpdate: i.W_LAST_UPDATE
               } as Workflow
            } as WorkflowMapping;
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
const getWorkflowById = async (workflowId: number): Promise<Workflow> => {
    return doInDbConnection(async (conn: Connection) => {
       const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE FROM TBL_WORKFLOW WHERE ID=?`, [workflowId])
       if (q.length) {
           const workflow: Workflow = {
              id: q[0].ID,
              name: q[0].NAME,
              description: q[0].DESCRIPTION,
              creationDate: q[0].CREATION_DATE,
              lastUpdate: q[0].LAST_UPDATE
           } as Workflow;
           return workflow;
       }
       return null;
    });
};


/**
 * ===============================
 * === getWorkflowMappingById ===
 * ===============================
 */
const getWorkflowMappingById = async (workflowMappingId: number): Promise<WorkflowMapping> => {
    return doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(q2, [workflowMappingId])
        if (q.length) {
            const i: QueryI = q[0];
            const workflowMapping: WorkflowMapping = {
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
                } as View,
                workflow: {
                    id: i.W_ID,
                    name: i.W_NAME,
                    description: i.W_DESCRIPTION,
                    creationDate: i.W_CREATION_DATE,
                    lastUpdate: i.W_LAST_UPDATE
                } as Workflow
            } as WorkflowMapping;
            return workflowMapping;
        }
        return null;
    });
};

/**
 * =====================================
 * == getWorkflowMappingByInstanceId ===
 * =====================================
 */
const getWorkflowMappingByInstanceId = async (workflowInstanceId: number): Promise<WorkflowMapping> => {
    return doInDbConnection(async (conn: Connection) => {
        const q: QueryA = await conn.query(q3, [workflowInstanceId]);
        if (q.length) {
            const i: QueryI = q[0];
            const workflowMapping: WorkflowMapping = {
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
                } as View,
                workflow: {
                    id: i.W_ID,
                    name: i.W_NAME,
                    description: i.W_DESCRIPTION,
                    creationDate: i.W_CREATION_DATE,
                    lastUpdate: i.W_LAST_UPDATE
                } as Workflow
            } as WorkflowMapping;
            return workflowMapping;
        }
        return null;
    });
};


/**
 * ==============================
 * === startWorkflow ====
 * ========================
 */
const startWorkflow = async (workflowMappingId: number, args: Argument): Promise<{workflowInstanceId: number, engineResponse: EngineResponse, errors: string[]}> => {
    const errors: string[] = [];
    const workflowMapping: WorkflowMapping = await getWorkflowMappingById(workflowMappingId);
    let workflowInstanceId: number = null;
    let engineResponse: EngineResponse = null;

    if (workflowMapping && workflowMapping.workflow) {
        const workflowScriptFullPath: string = Path.join(__dirname, '../custom-workflow/workflows/', workflowMapping.workflow.name);
        const workflowScript: WorkflowScript = await import(workflowScriptFullPath);
        const engine: Engine = workflowScript.createEngine(args);
        engineResponse = await engine.next();
        const data: string = engine.serialize();

        const qr: QueryResponse = await doInDbConnection(async (conn: Connection) => {
           await conn.query(`INSERT INTO TBL_WORKFLOW_INSTANCE (WORKFLOW_MAPPING_ID, DATA) VALUES (?,?)`, [workflowMappingId, data]);
        });
        workflowInstanceId = qr.insertId;

    } else {
        errors.push(`workflow mapping with id ${workflowMappingId} is not found`);
    }
    return {
        engineResponse,
        workflowInstanceId,
        errors
    };
};

/**
 * =======================
 * === continueWorkflow ===
 * =======================
 */

const continueWorkflow = async (workflowInstanceId: number): Promise<{engineResponse: EngineResponse, errors: string[]}> =>  {
    const errors: string[] = [];
    const workflowMapping: WorkflowMapping = await getWorkflowMappingByInstanceId(workflowInstanceId);
    let engineResponse: EngineResponse = null;

    if (workflowMapping && workflowMapping.workflow) {
        const workflowScriptFullPath: string = Path.join(__dirname, '../custom-workflow/workflows/', workflowMapping.workflow.name);
        const workflowScript: WorkflowScript = await import(workflowScriptFullPath);
        const engine: Engine = workflowScript.createEngine();

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
        engineResponse = await engine.next();
        const newData: string = engine.serialize();

        await doInDbConnection(async (conn: Connection) => {
            await conn.query(`INSERT INTO TBL_WORKFLOW_INSTANCE (WORKFLOW_MAPPING_ID, DATA) VALUES (?,?)`, [workflowMapping.id, newData]);
        });

    } else {
        errors.push(`workflow mapping for workflow instance with id ${workflowInstanceId} is not found`);
    }
    return {
        engineResponse,
        errors
    };
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
const createArgsForItem = (action: WorkflowInstanceAction): Argument => {
    return {};
};

const createArgsForAttribute = (): Argument => {
    return {};
};

const createArgsForPrice = (): Argument => {
    return {};
};

const createArgsForRule = (): Argument => {
    return {};
};

const createArgsForUser = (): Argument => {
    return {};
};

const createArgsForCategory = (): Argument => {
    return {};
};



