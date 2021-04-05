import {doInDbConnection, QueryA, QueryI, QueryResponse} from '../db';
import { Connection } from 'mariadb';
import {
    WorkflowDefinition,
    WorkflowInstanceAction,
    Workflow,
    WorkflowInstanceType,
    WorkflowInstanceComment,
    WorkflowForAttributeValue,
    WorkflowInstanceTask,
    WorkflowInstanceTaskStatus,
} from '@fuyuko-common/model/workflow.model';
import {e} from '../logger';
import {ENABLED, Status} from '@fuyuko-common/model/status.model';
import {AttributeType} from '@fuyuko-common/model/attribute.model';
import {LimitOffset} from '@fuyuko-common/model/limit-offset.model';
import {LIMIT_OFFSET, toLimitOffset} from '../util/utils';

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
                AT.ID AS AT_ID,
                AT.NAME AS AT_NAME,
                AT.TYPE AS AT_TYPE,
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
            LEFT JOIN TBL_WORKFLOW_ATTRIBUTE AS A ON A.WORKFLOW_ID = W.ID
            LEFT JOIN TBL_VIEW_ATTRIBUTE AS AT ON AT.ID = A.ATTRIBUTE_ID
            WHERE V.ID = ? AND W.STATUS = ?
`;

const q2 = `${q1} AND W.ACTION = ? AND W.TYPE = ? `;

const q3 = `
           SELECT 
               T.ID AS T_ID,
               T.NAME AS T_NAME,
               T.WORKFLOW_INSTANCE_ID AS T_WORKFLOW_INSTANCE_ID,
               T.TASK_TITLE AS T_TASK_TITLE,
               T.TASK_DESCRIPTION AS T_TASK_DESCRIPTION,
               T.POSSIBLE_APPROVAL_STAGES AS T_POSSIBLE_APPROVAL_STAGES,
               T.TASK_OLD_VALUE AS T_TASK_OLD_VALUE,
               T.TASK_NEW_VALUE AS T_TASK_NEW_VALUE,
               T.WORKFLOW_STATE AS T_WORKFLOW_STATE,
               T.APPROVAL_STAGE AS T_APPROVAL_STAGE,
               T.APPROVER_USER_ID AS T_APPROVER_USER_ID,
               T.STATUS AS T_STATUS,
               T.CREATION_DATE AS T_CREATION_DATE,
               T.LAST_UPDATE AS T_LAST_UPDATE,
               A.ID AS A_ID,
               A.USERNAME AS A_USERNAME,
               A.FIRSTNAME AS A_FIRSTNAME,
               A.LASTNAME AS A_LASTNAME,
               A.EMAIL AS A_EMAIL,
               I.ID AS I_ID,
               I.NAME AS I_NAME,
               I.WORKFLOW_ID AS I_WORKFLOW_ID,
               I.FUNCTION_INPUTS AS I_FUNCTION_INPUTS,
               I.CURRENT_WORKFLOW_STATE AS I_CURRENT_WORKFLOW_STATE,
               I.ENGINE_STATUS AS I_ENGINE_STATUS,
               I.OLD_VALUE AS I_OLD_VALUE,
               I.NEW_VALUE AS I_NEW_VALUE,
               I.DATA AS I_DATA,
               I.CREATOR_USER_ID AS I_CREATOR_USER_ID,
               I.CREATION_DATE AS I_CREATION_DATE,
               I.LAST_UPDATE AS I_LAST_UPDATE,
               C.ID AS C_ID,
               C.USERNAME AS C_USERNAME,
               C.FIRSTNAME AS A_FIRSTNAME,
               C.LASTNAME AS A_LASTNAME,
               C.EMAIL AS A_EMAIL
           FROM TBL_WORKFLOW_INSTANCE_TASK AS T
           LEFT JOIN TBL_USER AS A ON A.ID = T.APPROVER_USER_ID
           LEFT JOIN TBL_WORKFLOW_INSTANCE AS I ON I.ID = T.WORKFLOW_INSTANCE_ID
           LEFT JOIN TBL_USER AS C ON C.ID = I.CREATOR_USER_ID
`;

const q4 = `${q3} WHERE T.ID = ? `;
const SQL_WORKFLOW_INSTANCE_TASKS_FOR_USER = (limitOffset?: LimitOffset) => `${q3} WHERE A.ID = ? AND T.STATUS = ? ${LIMIT_OFFSET(limitOffset)}`;
const SQL_WORKFLOW_INSTANCE_TASKS_FOR_USER_COUNT = `
    SELECT COUNT(*) AS COUNT 
    FROM TBL_WORKFLOW_INSTANCE_TASK AS T
    LEFT JOIN TBL_WORKFLOW_INSTANCE AS I ON I.ID = T.WORKFLOW_INSTANCE_ID
    LEFT JOIN TBL_USER AS A ON A.ID = T.APPROVER_USER_ID
    WHERE A.ID = ? AND T.STATUS = ?
`;
const SQL_WORKFLOW_INSTANCE_PENDING_TASKS_FOR_USER = (limitOffset?: LimitOffset) =>
    `${q3} WHERE A.ID = ? AND I.CURRENT_WORKFLOW_STATE = T.WORKFLOW_STATE AND T.STATUS = ? ${LIMIT_OFFSET(limitOffset)}`;
const SQL_WORKFLOW_INSTANCE_PENDING_TASKS_FOR_USER_COUNT = `
    SELECT COUNT(*) AS COUNT 
    FROM TBL_WORKFLOW_INSTANCE_TASK AS T
    LEFT JOIN TBL_WORKFLOW_INSTANCE AS I ON I.ID = T.WORKFLOW_INSTANCE_ID
    LEFT JOIN TBL_USER AS A ON A.ID = T.APPROVER_USER_ID
    WHERE A.ID = ? AND I.CURRENT_WORKFLOW_STATE = T.WORKFLOW_STATE AND T.STATUS = ?
`;


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
            const m: Map<number /* workflowId */, Workflow> = (await conn.query(q1, [viewId, ENABLED]))
                .reduce(this.reduceQueryToWorkflow.bind(this), new Map<number /* workflowId */, Workflow>());
            return [...m.values()];
        });
    };

    /**
     * ===============================
     * === getWorkflowByViewActionAndType
     * ===============================
     */
    async getWorkflowByViewActionAndType(viewId: number, action: WorkflowInstanceAction, type: WorkflowInstanceType): Promise<Workflow[]> {
        return await doInDbConnection(async (conn: Connection) => {
            const m: Map<number /* workflowId */, Workflow> = (await conn.query(q2, [viewId, ENABLED, action, type]))
                .reduce(this.reduceQueryToWorkflow.bind(this), new Map<number /* workflowId */, Workflow>());
            return [...m.values()];
        });
    }


    /**
     * ===============================
     * === getWorkflowInstanceTaskById
     * ===============================
     */
    async getWorkflowInstanceTasksById(userId: number, workflowInstanceTaskId: number): Promise<WorkflowInstanceTask> {
        return await doInDbConnection(async conn => {
            const q: QueryA = await conn.query(q4, [workflowInstanceTaskId]);
            const t =  q.reduce(this.reduceQueryToWorkflowInstanceTask(userId).bind(this), []);
            return (t && t.length ? t[0] : undefined);
        });
    }


    /**
     * ===============================
     * === getWorkflowInstanceTasksForUser
     * ===============================
     */
    async getWorkflowInstanceTasksForUser(userId: number, status: WorkflowInstanceTaskStatus, limitOffset?: LimitOffset):
        Promise<WorkflowInstanceTask[]> {
        return await doInDbConnection(async conn => {
            const q: QueryA = status === 'PENDING' ?
                await conn.query(SQL_WORKFLOW_INSTANCE_PENDING_TASKS_FOR_USER(limitOffset), [userId, status]) :
                await conn.query(SQL_WORKFLOW_INSTANCE_TASKS_FOR_USER(limitOffset), [userId, status]);
            return q.reduce(this.reduceQueryToWorkflowInstanceTask(userId).bind(this), []);
        });
    }
    async getWorkflowInstanceTasksForUserCount(userId: number, status: WorkflowInstanceTaskStatus):
        Promise<number> {
        return await doInDbConnection(async conn => {
            const q: QueryA = status == 'PENDING' ?
                await conn.query(SQL_WORKFLOW_INSTANCE_PENDING_TASKS_FOR_USER_COUNT, [userId, status]) :
                await conn.query(SQL_WORKFLOW_INSTANCE_TASKS_FOR_USER_COUNT, [userId, status]);
            return q[0].COUNT;
        });
    }

    /**
     * =================================
     * === getWorkflowInstanceComments
     * =================================
     */
    async getWorkflowInstanceCommentsCount(workflowInstanceId: number): Promise<number> {
        return await doInDbConnection(async conn => {
            const q: QueryA = await conn.query(`
                SELECT COUNT(*) AS COUNT FROM TBL_WORKFLOW_INSTANCE_COMMENT WHERE WORKFLOW_INSTANCE_ID = ? 
            `, [workflowInstanceId]);
            return q[0].COUNT;
        });
    }
    async getWorkflowInstanceComments(workflowInstanceId: number, limitOffset?: LimitOffset): Promise<WorkflowInstanceComment[]> {
        return await doInDbConnection(async conn => {
            const q: QueryA = await conn.query(`
                SELECT 
                    C.ID AS C_ID,
                    C.WORKFLOW_INSTANCE_ID AS C_WORKFLOW_INSTANCE_ID,
                    C.COMMENT AS C_COMMENT,
                    C.USER_ID AS C_USER_ID,
                    C.CREATION_DATE AS C_CREATION_DATE,
                    C.LAST_UPDATE AS C_LAST_UPDATE,
                    U.ID AS U_ID,
                    U.USERNAME AS U_USERNAME,
                    U.FIRSTNAME AS U_FIRSTNAME,
                    U.LASTNAME U_LASTNAME,
                    U.EMAIL AS U_EMAIL
                FROM TBL_WORKFLOW_INSTANCE_COMMENT AS C
                LEFT JOIN TBL_USER AS U ON U.ID = C.USER_ID
                WHERE C.WORKFLOW_INSTANCE_ID = ?
                ORDER BY C.CREATION_DATE DESC
                ${LIMIT_OFFSET(limitOffset)}
            `, [workflowInstanceId]);

            return q.reduce((acc: WorkflowInstanceComment[], i: QueryI) => {
               const c: WorkflowInstanceComment = {
                   id: i.C_ID,
                   lastUpdate: i.C_LAST_UPDATE,
                   creationDate: i.C_CREATION_DATE,
                   comment: i.C_COMMENT,
                   workflowInstanceId: i.C_WORKFLOW_INSTANCE_ID,
                   creator: {
                     id: i.U_ID,
                     username: i.U_USERNAME,
                     firstName: i.U_FIRSTNAME,
                     lastName: i.U_LASTNAME,
                     email: i.U_EMAIL,
                   }
               };
               acc.push(c);
               return acc;
            }, []);
        });
    }

    /**
     * ===================================
     * === postWorkflowInstanceComment
     * ===================================
     */
    async postWorkflowInstanceComment(workflowInstanceId: number, userId: number, comment: string): Promise<string[]> {
        return await doInDbConnection(async conn => {
            const errors = [];
            const q: QueryResponse = await conn.query(`
                INSERT INTO TBL_WORKFLOW_INSTANCE_COMMENT (WORKFLOW_INSTANCE_ID, COMMENT, USER_ID) VALUES (?,?,?)
            `, [workflowInstanceId, comment, userId]);
            if (!q.affectedRows) {
                errors.push(`Failed to add comment for workflow instance id ${workflowInstanceId}`);
            }
            return errors;
        });
    }

    /**
     * ===================================
     * === updateWorkflowStatus
     * ===================================
     */
    async updateWorkflowStatus(workflowId: number, status: Status): Promise<string[]> {
        return await doInDbConnection(async conn => {
            const errors = [];
            const q: QueryResponse = await conn.query(`UPDATE TBL_WORKFLOW SET STATUS = ? WHERE ID = ?`, [status, workflowId]);
            if (!q.affectedRows) {
                errors.push(`Failed to update status for workflow id ${workflowId}`);
            }
            return errors;
        });
    }



    // ===== private functions
    private reduceQueryToWorkflowInstanceTask(userId: number) : (acc: WorkflowInstanceTask[], i: QueryI) => WorkflowInstanceTask[] {
        const isUserAllowToActionOnTask = (userId: number, approverUserId: number, status: WorkflowInstanceTaskStatus): boolean => {
            return (userId === approverUserId && status === 'PENDING');
        };
        const possibleUserActions = (possibleApprovalStages: string): string[] => {
            return JSON.parse(possibleApprovalStages);  // poissibleApprovalStages - will be array in JSON stringify format
        };
        return (acc: WorkflowInstanceTask[], i: QueryI): WorkflowInstanceTask[] => {
            const w: WorkflowInstanceTask = {
                id: i.T_ID,
                name: i.T_NAME,
                taskTitle: i.T_TASK_TITLE,
                taskDescription: i.T_TASK_DESCRIPTION,
                approvalStage: i.T_APPROVAL_STAGE,
                status: i.T_STATUS,
                workflowState: i.T_WORKFLOW_STATE,
                creationDate: i.T_CREATION_DATE,
                lastUpdate: i.T_LAST_UPDATE,
                isUserAllowedToActionOnTask: isUserAllowToActionOnTask(userId, i.T_APPROVER_USER_ID, i.T_STATUS, ) ,
                possibleUserActions: possibleUserActions(i.T_POSSIBLE_APPROVAL_STAGES),
                approver: {
                    id: i.A_ID,
                    username: i.A_USERNAME,
                    firstName: i.A_FIRSTNAME,
                    lastName: i.A_LASTNAME,
                    email: i.A_EMAIL,
                },
                workflowInstance: {
                    id: i.I_ID,
                    name: i.I_NAME,
                    workflowId: i.I_WORKFLOW_ID,
                    functionInputs: i.I_FUNCTION_INPUTS,
                    engineStatus: i.I_ENGINE_STATUS,
                    data: i.I_DATA,
                    currentWorkflowState: i.I_CURRENT_WORKFLOW_STATE,
                    lastUpdate: i.I_LAST_UPDATE,
                    creationDate: i.I_CREATION_DATE,
                    creator: {
                        id: i.C_ID,
                        username: i.C_USERNAME,
                        firstName: i.A_FIRSTNAME,
                        lastName: i.A_LASTNAME,
                        email: i.A_EMAIL,
                    },
                }
            };
            acc.push(w);
            return acc;
        }
    }

    private reduceQueryToWorkflow(acc: Map<number /* workflowId */, Workflow>, i: QueryI): Map<number /* workflowId */, Workflow> {
       const workflowId: number = i.M_ID;
       const workflowType: WorkflowInstanceType = i.M_TYPE;
       const workflow: Workflow = acc.get(workflowId) || {
           id: workflowId,
           name: i.M_NAME,
           action: i.M_ACTION,
           type: workflowType as any,
           status: i.M_STATUS,
           creationDate: i.M_CREATION_DATE,
           lastUpdate: i.M_LAST_UPDATE,
           attributeIds: [],
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
       acc.set(workflowId, workflow);

       const attributeId: number = i.AT_ID;
       const attributeName: string = i.AT_NAME;
       const attributeType: AttributeType = i.AT_TYPE;
       if (workflowType === 'AttributeValue' &&  attributeId) {
           (acc.get(workflowId) as WorkflowForAttributeValue).attributeIds.push(attributeId);
       }

       return acc;
    }
}

const s = new WorkflowService();
export const
    addWorkflow = s.addWorkflow.bind(s),
    getAllWorkflowDefinition = s.getAllWorkflowDefinitions.bind(s),
    getWorkflowByView = s.getWorkflowByView.bind(s),
    getWorkflowByViewActionAndType = s.getWorkflowByViewActionAndType.bind(s),
    getWorkflowInstanceTasksById = s.getWorkflowInstanceTasksById.bind(s),
    getWorkflowInstanceTasksForUser = s.getWorkflowInstanceTasksForUser.bind(s),
    getWorkflowInstanceTasksForUserCount = s.getWorkflowInstanceTasksForUserCount.bind(s),
    getWorkflowInstanceComments = s.getWorkflowInstanceComments.bind(s),
    getWorkflowInstanceCommentsCount = s.getWorkflowInstanceCommentsCount.bind(s),
    postWorkflowInstanceComment = s.postWorkflowInstanceComment.bind(s),
    updateWorkflowStatus = s.updateWorkflowStatus.bind(s)