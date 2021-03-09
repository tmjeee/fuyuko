import {WorkflowInstanceAction, WorkflowInstanceType} from '@fuyuko-common/model/workflow.model';
import {doInDbConnection, QueryA, QueryResponse} from '../db';
import * as Path from 'path';
import {WorkflowScript} from '../server-side-model/server-side.model';
import {Argument, EngineStatus} from '@fuyuko-workflow/index';
import {Attribute} from '@fuyuko-common/model/attribute.model';
import {InternalEngine} from "@fuyuko-workflow/engine-impl";
import * as u from './workflow-scripts-utils.service'
import {StateLike} from './workflow-scripts-utils.service';
import {e} from '../logger';
import {ENABLED} from "@fuyuko-common/model/status.model";
import {v4 as uuid} from 'uuid';
import {getAttributesInView, getThreadLocalStore} from './';

/**
 * Contains functions to assist
 *      ** Workflow Engine **
 * to manage and advance it's state
 */

export const ENGINE_WORKFLOW_ID = `WORKFLOW_ID`;
export const ENGINE_WORKFLOW_DEFINITION_ID = `WORKFLOW_DEFINITION_ID`;
export const ENGINE_WORKFLOW_INSTANCE_ID = `WORKFLOW_INSTANCE_ID`;


// === WorkflowTriggerResult
export type WorkflowTriggerResult = NoWorkflowConfigured | WorkflowInstanceCreated | WorkflowTriggerError;
export interface NoWorkflowConfigured {
    type: 'no-workflow-configured';
}
export interface WorkflowInstanceCreated {
    type: 'workflow-instance-created'
    workflowInstanceId: number;
}
export interface WorkflowTriggerError {
    type: 'workflow-trigger-error',
    message: string
}

// === ContinueWorkflowResult
export type ContinueWorkflowResult = WorkflowInstanceNotFound | WorkflowDefinitionForWorkflowNotFound | WorkflowContinuationError | WorkflowContinuationDone;
export interface WorkflowInstanceNotFound {
    type: 'workflow-instance-not-found',
    workflowInstanceId: number,
}
export interface WorkflowDefinitionForWorkflowNotFound {
    type: 'workflow-definition-for-workflow-not-found',
    workflowId: number,
}
export interface WorkflowContinuationError {
    type: 'workflow-continuation-error',
    message: string
}
export interface WorkflowContinuationDone {
    type: 'workflow-continuation-done',
    workflowInstanceId: number,
    oldState: string,
    newState: string,
    status: EngineStatus,
}

// === CurrentWorkflowResult
export type CurrentWorkflowStateResult = CurrentWorkflowStateFound
export interface CurrentWorkflowStateFound {
    type: 'workflow-state-found',
    workflowInstanceId: number,
    state: string,
    status: EngineStatus,
    title: string,
    description: string,
    possibleApprovalStages: string[],
}

class WorkflowTriggerService {
    // === TRIGGER Workflow
    async triggerAttributeWorkflow(attributes: Attribute[], workflowDefinitionId: number, action: WorkflowInstanceAction, args?: Argument) {
        const viewIdAttMap = await attributes.reduce(async (acc: Promise<Map<number /* viewId */, Attribute[]>>, att: Attribute) => {
            const map = await acc;
            await doInDbConnection(async (conn) => {
                // group the passed in attribute by view
                const q: QueryA = await conn.query(`SELECT VIEW_ID FROM TBL_VIEW_ATTRIBUTE WHERE ID = ?`, [att.id])
                if (q.length) {
                    const viewId = q[0].VIEW_ID;
                    if (!map.get(viewId)) {
                        map.set(viewId, [att]);
                    } else {
                        map.get(viewId).push(att);
                    }
                }
            })
            return acc;
        }, Promise.resolve(new Map()));

        for ( const [viewId, attributes] of viewIdAttMap.entries()) {
            const oldAttributes = await getAttributesInView(viewId, attributes.map(a => a.id), {limit: Number.MAX_SAFE_INTEGER, offset:0});
            const newAttributes = [...attributes];

            await this.triggerWorkflow(
               viewId, workflowDefinitionId, action, 'Attribute',
               JSON.stringify(oldAttributes), JSON.stringify(newAttributes),
               attributes, args);
        }
    }

    async triggerWorkflow(viewId: number, workflowDefinitionId: number, action: WorkflowInstanceAction,
                          type: WorkflowInstanceType, oldValue: string, newValue: string,
                          functionInputs: any[], args?: Argument): Promise<WorkflowTriggerResult> {
        const userId = (getThreadLocalStore().jwtPayload?.user?.id ?? null);
        const {workflowInstanceId, engine, workflowScript} = await doInDbConnection(async (conn) => {
            // find workflow
            const qr1: QueryA = await conn.query(`
               SELECT 
                    ID, NAME, VIEW_ID, WORKFLOW_DEFINITION_ID, ACTION, TYPE, CREATION_DATE, LAST_UPDATE 
               FROM 
                    TBL_WORKFLOW 
               WHERE 
                    VIEW_ID=? AND WORKFLOW_DEFINITION_ID = ? AND ACTION = ? AND TYPE = ?  
            `, [viewId, workflowDefinitionId, action, type]);
            if (qr1.length <= 0) {
                // no workflow configured
                const r: NoWorkflowConfigured = {
                    type: 'no-workflow-configured',
                };
                return r;
            }
            const workflowId = qr1[0].ID;
            const workflowName = qr1[0].NAME;

            // find workflow definition for workflow
            const qr0: QueryA = await conn.query(`
                SELECT 
                    ID, NAME, DESCRIPTION, CREATION_DATE, LAST_UPDATE 
                FROM 
                    TBL_WORKFLOW_DEFINITION WHERE ID = ?
            `, [workflowDefinitionId]);
            if (qr0.length <= 0) {
                const r: WorkflowTriggerError = {
                    type: "workflow-trigger-error",
                    message: `Unable to find workflow definition id ${workflowDefinitionId}`
                }
                return r;
            }


            // create workflow instance for workflow
            const functionInputsAsJSON = JSON.stringify(functionInputs);
            const workflowDefinitionName = qr0[0].NAME;
            const workflowInstanceName = `${workflowName}-${uuid()}`;

            const workflowDefinitionFileFullPath = Path.join(__dirname, '../custom-workflow/workflows/', workflowDefinitionName);
            const workflowScript: WorkflowScript = await import(`${workflowDefinitionFileFullPath}`);
            console.log('******************** ', workflowDefinitionFileFullPath)
            console.log(workflowScript);
            console.log(workflowScript.buildEngine);
            const engine = workflowScript.buildEngine();
            engine.args[ENGINE_WORKFLOW_DEFINITION_ID] = workflowDefinitionId;
            engine.args[ENGINE_WORKFLOW_ID] = workflowId;

            const qr2: QueryResponse = await conn.query(`
                INSERT INTO TBL_WORKFLOW_INSTANCE 
                    (WORKFLOW_ID, NAME, DATA, FUNCTION_INPUTS, CURRENT_WORKFLOW_STATE, ENGINE_STATUS, OLD_VALUE, NEW_VALUE, CREATOR_USER_ID) 
                VALUES (?,?,?,?,?,?,?,?,?)
            `, [workflowId, workflowInstanceName, null, functionInputsAsJSON, (engine.currentState?.name ?? null),
                engine.status, oldValue, newValue, userId]);
            if (qr2.affectedRows == 0) {
                // todo: failed to insert row
                e(`Failed to insert row in TBL_WORKFLOW_INSTANCE`);
                const r: WorkflowTriggerError = {
                    type: "workflow-trigger-error",
                    message: `Failed to insert row in TBL_WORKFLOW_INSTANCE`
                }
                return r;
            }
            const workflowInstanceId = qr2.insertId;
            return {workflowInstanceId, engine, workflowScript}
        });

        return await doInDbConnection(async (conn) => {
            engine.args[ENGINE_WORKFLOW_INSTANCE_ID] = workflowInstanceId;
            workflowScript.initEngine(engine, {}, undefined); // init new engine, no state to recover from
            const currentState = engine.currentState;
            const data = engine.serializeData();
            const engineStatus = engine.status;

            const qr3: QueryResponse = await conn.query(`
                UPDATE TBL_WORKFLOW_INSTANCE SET 
                    DATA = ?,
                    CURRENT_WORKFLOW_STATE = ?,
                    ENGINE_STATUS = ?
                WHERE ID = ?
            `, [data, currentState.name , engineStatus, workflowInstanceId]);
            if (qr3.affectedRows == 0) {
               // todo: failed to update row
               e(`Failed to update row in TBL_WORKFLOW_INSTANCE`);
                const r: WorkflowTriggerError = {
                    type: "workflow-trigger-error",
                    message: `Failed to update row in TBL_WORKFLOW_INSTANCE`
                }
                return r;
            }

            const r: WorkflowInstanceCreated = {
                type: "workflow-instance-created",
                workflowInstanceId
            };
            return r;
        });
    }

    // === CONTINUE Workflow
    async continueWorkflow(workflowInstanceId: number, args?: Argument): Promise<ContinueWorkflowResult> {``
        return await doInDbConnection(async (conn) => {
           const q1: QueryA = await conn.query(`
                SELECT ID, WORKFLOW_ID, DATA, CREATION_DATE, LAST_UPDATE FROM TBL_WORKFLOW_INSTANCE WHERE ID = ?
           `, [workflowInstanceId]);
           if (!q1.length) {
               const r: WorkflowInstanceNotFound = {
                   type: "workflow-instance-not-found",
                   workflowInstanceId
               };
               return r;
           }
           const workflowId = q1[0].WORKFLOW_ID;
           const data = q1[0].DATA;

           const q2:QueryA = await conn.query(`
                SELECT 
                    WD.ID AS WD_ID, 
                    WD.NAME AS WD_NAME, 
                    WD.DESCRIPTION AS WD_DESCRIPTION, 
                    WD.CREATION_DATE AS WD_CREATION_DATE, 
                    WD.LAST_UPDATE AS WD_LAST_UPDATE 
                FROM TBL_WORKFLOW_DEFINITION AS WD 
                INNER JOIN TBL_WORKFLOW AS W ON W.WORKFLOW_DEFINITION_ID = WD.ID 
                WHERE W.ID = ?
           `, [workflowId]);
           if (!q2.length) {
               const r: WorkflowDefinitionForWorkflowNotFound = {
                   type: "workflow-definition-for-workflow-not-found",
                   workflowId,
               };
               return r;
           }
           const workflowDefinitionName = q2[0].WD_NAME;

            const workflowDefinitionFileFullPath = Path.join(__dirname, '../custom-workflow/workflows/', workflowDefinitionName);
            const workflowScript: WorkflowScript = await import(`${workflowDefinitionFileFullPath}`);
            const engine = workflowScript.buildEngine();
            workflowScript.initEngine(engine, {}, data);
            const oldStateName = (engine as InternalEngine).currentState.name;
            await engine.next(args);
            const currentState = engine.currentState;
            const engineStatus = engine.status;
            const _data = engine.serializeData();
            const dataAsJSON = JSON.stringify(_data);

            const q3: QueryResponse = await conn.query(`
                UPDATE TBL_WORKFLOW_INSTANCE SET 
                    DATA = ?, 
                    CURRENT_WORKFLOW_STATE = ?,
                    ENGINE_STATUS = ?
                WHERE ID = ?
            `, [_data, currentState.name, engineStatus, workflowInstanceId]);
            if (!q3.affectedRows) {
                const r: WorkflowContinuationError = {
                   type: "workflow-continuation-error",
                   message: 'Failed to update workflow instance in db'
                };
                return r;
            }
            const rst: WorkflowContinuationDone = {
                type: "workflow-continuation-done",
                workflowInstanceId,
                oldState: oldStateName,
                newState: (engine as InternalEngine).currentState.name,
                status: (engine as InternalEngine).status
            };
            return rst;
        })
    }


    // CURRENT Workflow State
    currentWorkflowInstanceState = async (workflowInstanceId: number): Promise<CurrentWorkflowStateResult> => {
        // todo:
        return await doInDbConnection(async (conn) => {
            const q1: QueryA = await conn.query(`
                SELECT ID, WORKFLOW_ID, DATA, CREATION_DATE, LAST_UPDATE FROM TBL_WORKFLOW_INSTANCE WHERE ID = ?
           `, [workflowInstanceId]);
            if (!q1.length) {
                const r: WorkflowInstanceNotFound = {
                    type: "workflow-instance-not-found",
                    workflowInstanceId
                };
                return r;
            }
            const workflowId = q1[0].WORKFLOW_ID;
            const data = q1[0].DATA;

            const q2: QueryA = await conn.query(`
                SELECT 
                    WD.ID AS WD_ID, 
                    WD.NAME AS WD_NAME, 
                    WD.DESCRIPTION AS WD_DESCRIPTION, 
                    WD.CREATION_DATE AS WD_CREATION_DATE, 
                    WD.LAST_UPDATE AS WD_LAST_UPDATE 
                FROM TBL_WORKFLOW_DEFINITION AS WD 
                INNER JOIN TBL_WORKFLOW AS W ON W.WORKFLOW_DEFINITION_ID = WD.ID 
                WHERE W.ID = ?
           `, [workflowId]);
            if (!q2.length) {
                const r: WorkflowDefinitionForWorkflowNotFound = {
                    type: "workflow-definition-for-workflow-not-found",
                    workflowId,
                };
                return r;
            }
            const workflowDefinitionName = q2[0].WD_NAME;

            const workflowDefinitionFileFullPath = Path.join(__dirname, '../custom-workflow/workflows/', workflowDefinitionName);
            const workflowScript: WorkflowScript = await import(`${workflowDefinitionFileFullPath}`);
            const engine = workflowScript.buildEngine();
            workflowScript.initEngine(engine, {}, data);
            const currentState = engine.currentState;

            const s: StateLike = { state: currentState, args: engine.args }
            const r: CurrentWorkflowStateFound = {
                type: "workflow-state-found",
                workflowInstanceId,
                state: engine.currentState.name,
                status: engine.status,
                title: u.getTitle(s),
                description: u.getDescription(s),
                possibleApprovalStages: u.getPossibleApprovalStages(s),
            };
            return r;
        });
    }


    // can user action on workflow instance
    async canUserActionOnWorkflowInstance(workflowInstanceId: number, username: string): Promise<boolean> {
        return await doInDbConnection(async (conn) => {
            const q1: QueryA = await conn.query(`
                            SELECT CURRENT_WORKFLOW_STATE FROM TBL_WORKFLOW_INSTANCE WHERE ID = ?
                        `, [workflowInstanceId]);
            if (q1.length) {
                const currentWorkflowState = q1[0].CURRENT_WORKFLOW_STATE;

                const q2: QueryA = await conn.query(`
                                SELECT 
                                    COUNT(*) AS COUNT
                                FROM TBL_WORKFLOW_INSTANCE_STATE AS S
                                INNER JOIN TBL_USER AS U ON U.ID = S.APPROVER_USER_ID
                                WHERE S.WORKFLOW_INSTANCE_ID = ? AND S.WORKFLOW_STATE = ? AND U.USERNAME = ? AND S.APPROVAL_STAGE IS NOT NULL
                            `, [workflowInstanceId, currentWorkflowState, username]);
                // user with this username has already vote in
                if (q2[0].COUNT > 0) {
                    return false;
                }
                return true;
            } else {
                // todo:
                e(`Workflow instance state for workflowInstanceId ${workflowInstanceId} is not found.`);
            }
        })
    }

    async hasWorkflow(action: WorkflowInstanceAction, type: WorkflowInstanceType): Promise<boolean> {
        return await doInDbConnection(async conn => {
            const q: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_WORKFLOW WHERE STATUS = ? AND ACTION = ? AND TYPE = ? 
            `, [ENABLED, action, type]);
            return (q[0].COUNT > 0);
        });
    }
}

const s = new WorkflowTriggerService();
export const
    hasWorkflow = s.hasWorkflow.bind(s),
    triggerWorkflow = s.triggerWorkflow.bind(s),
    triggerAttributeWorkflow = s.triggerAttributeWorkflow.bind(s),
    continueWorkflow = s.continueWorkflow.bind(s),
    currentWorkflowInstanceState = s.currentWorkflowInstanceState.bind(s),
    canUserActionOnWorkflowInstance = s.canUserActionOnWorkflowInstance.bind(s)
;
