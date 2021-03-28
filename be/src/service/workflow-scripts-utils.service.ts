import {Argument} from '@fuyuko-workflow/index';
import {doInDbConnection, QueryA, QueryResponse} from '../db';
import {ENGINE_WORKFLOW_INSTANCE_ID} from './workflow-trigger.service';
import {e} from '../logger';

/**
 * Contains functions to assist with
 *      ** Workflow Engine's Custom States (those in /workflow-definition/ directory) **
 * with its logics
 */

export interface StateLike { state: { name : string; }, args: Argument }
export interface MessageLike {
    type: 'error' | 'info' | 'warn' | 'success',
    message: string
};

class WorkflowScriptsUtilsService {

    setTitle(state: StateLike, title: string) {
        state.args[`${state.state.name}_TITLE`] = title;
    }

    setDescription(state: StateLike, description: string) {
        state.args[`${state.state.name}_DESCRIPTION`] = description;
    }

    setPossibleApprovalStages(state: StateLike, ...stages: string[]) {
        state.args[`${state.state.name}_APPROVAL_STAGES`] = [...stages];
    }

    getInputArg(state: StateLike, key: string): string {
        const _key = `${state.state.name}_INPUT_${key}`;
        return state.args[_key];
    }

    getMessages(state: StateLike): MessageLike[] {
        const _key = `${state.state.name}_MESSAGE`;
        if (!state.args[_key]) {
            state.args[_key] = [];
        }
        return state.args[_key];
    }

    clearMessage(state: StateLike) {
        const _key = `${state.state.name}_MESSAGE`;
        state.args[_key] = [];
    }

    async setApprovalsUserNamesAndCreateInstanceTasks(state: StateLike, ...usernames: string[]) {
        state.args[`${state.state.name}_APPROVAL_USER_NAMES`] = [...usernames];
        const workflowInstanceId = Number(state.args[ENGINE_WORKFLOW_INSTANCE_ID]);
        const workflowInstanceStateName = state.state.name;
        const taskTitle = this.getTitle(state);
        const taskDescription = this.getDescription(state);
        const possibleApprovalStages = JSON.stringify(this.getPossibleApprovalStages(state));
        const taskOldValue: null = null; // todo: not used
        const taskNewValue: null = null; // todo: not used
        console.log('**************** workflow-scripts-utils, setApprovalUserNamesAndCreateInstanceTasks workflowInstanceId', workflowInstanceId);
        await doInDbConnection(async (conn) => {
            for (const username of usernames) {
                const q0: QueryA = await conn.query(`
                    SELECT NAME FROM TBL_WORKFLOW_INSTANCE WHERE ID = ?
                `, [workflowInstanceId]);
                console.log('***** q0.length, q0[0]', q0.length, q0[0]);
                const workflowInstanceName = q0[0].NAME;
                const workflowInstanceTaskName = `${workflowInstanceName}-task-${username}-${workflowInstanceStateName}`;
                if (q0.length) {
                    const q1: QueryA = await conn.query(`
                    SELECT ID FROM TBL_USER WHERE USERNAME = ?
                `, [username]);
                    if (q1.length) {
                        const approverUserId = q1[0].ID;
                        await conn.query(`
                        INSERT INTO TBL_WORKFLOW_INSTANCE_TASK (
                            WORKFLOW_INSTANCE_ID, 
                            TASK_TITLE,
                            TASK_DESCRIPTION,
                            POSSIBLE_APPROVAL_STAGES,
                            TASK_OLD_VALUE,
                            TASK_NEW_VALUE,
                            NAME, 
                            WORKFLOW_STATE, 
                            APPROVAL_STAGE, 
                            APPROVER_USER_ID, 
                            STATUS
                        ) VALUES (?,?,?,?,?,?,?,?,?,?,?);
                    `, [workflowInstanceId, taskTitle, taskDescription, possibleApprovalStages, taskOldValue,
                            taskNewValue, workflowInstanceTaskName, workflowInstanceStateName, null, approverUserId,
                            'PENDING']);
                    } else {
                        // todo:
                        e(`Failed to find approval username ${username} in db`);
                    }
                } else {
                    // todo:
                    e(`Failed to find workflow instance with id ${workflowInstanceId} in db`);
                }
            }
        });
    }

    async markWorkflowInstanceTaskAsExpired(s: StateLike, prevStateName: string) {
        const workflowInstanceId = s.args[ENGINE_WORKFLOW_INSTANCE_ID];
        await doInDbConnection(async (conn) => {
            await conn.query(`
                UPDATE TBL_WORKFLOW_INSTANCE_TASK
                SET STATUS = ? 
                WHERE WORKFLOW_INSTANCE_ID = ? AND WORKFLOW_STATE = ? AND STATUS = 'PENDING'        
            `, ['EXPIRED', workflowInstanceId, prevStateName]);
        });
    }

    /////////////////////

    getTitle(state: StateLike): string {
        return state.args[`${state.state.name}_TITLE`];
    }

    getDescription(state: StateLike): string {
        return state.args[`${state.state.name}_DESCRIPTION`];
    }

    getPossibleApprovalStages(state: StateLike): string[] {
        return state.args[`${state.state.name}_APPROVAL_STAGES`];
    }

    addMessage(state: StateLike, message: MessageLike) {
        const _key = `${state.state.name}_MESSAGE`;
        if (!state.args[_key]) {
            state.args[_key] = [];
        }
        state.args[_key].push(message);
    }

    setInputArg(state: StateLike, key: string, value: string) {
        state.args[`${state.state.name}_INPUT_${key}`] = value;
    }

    async setApprovalStage(state: StateLike, approvalUserName: string, approvalStage: string) {
        this.clearMessage(state);
        // todo:
        const workflowInstanceId = Number(state.args[ENGINE_WORKFLOW_INSTANCE_ID]);
        await doInDbConnection(async (conn) => {
            const q1: QueryA = await conn.query(`
                    SELECT ID FROM TBL_USER WHERE USERNAME = ?
                `, [approvalUserName]);
            if (q1.length) {
                const approverUserId = q1[0].ID;
                const qr1: QueryResponse = await conn.query(`
                    UPDATE 
                        TBL_WORKFLOW_INSTANCE_TASK 
                    SET 
                        APPROVAL_STAGE = ?, 
                        STATUS = ?
                    WHERE 
                        WORKFLOW_INSTANCE_ID = ? AND WORKFLOW_STATE = ? AND APPROVER_USER_ID = ?
                `, [approvalStage, 'ACTIONED', workflowInstanceId, state.state.name, approverUserId]);
                if (qr1.affectedRows == 0) {
                    // todo:
                    e(`Failed to update TBL_WORKFLOW_INSTANCE with APPROVAL_STAGE ${approvalStage} where WORKFLOW_INSTANCE_ID ${workflowInstanceId}, WORKFLOW_STATE ${state.state.name}, APPROVER_USER_ID ${approverUserId}`)
                }
            } else {
                // todo:
                e(`Failed to find approval username ${approvalUserName} in db`);
            }
        });
    }

    async getApproverUsernamesForStage(state: StateLike, approvalStage: string): Promise<string[]> {
        // todo:
        return await doInDbConnection(async (conn) => {
            const workflowInstanceId = state.args[ENGINE_WORKFLOW_INSTANCE_ID];
            const q1: QueryA = await conn.query(`
                SELECT DISTINCT 
                   U.USERNAME AS USERNAME
                FROM TBL_WORKFLOW_INSTANCE_TASK AS S
                INNER JOIN TBL_USER AS U ON U.ID = S.APPROVER_USER_ID
                WHERE S.APPROVAL_STAGE = ? AND S.WORKFLOW_STATE = ? AND S.WORKFLOW_INSTANCE_ID = ? 
            `, [approvalStage, state.state.name, workflowInstanceId])
            return q1.reduce((acc, i) => {
                acc.push(i.USERNAME);
                return acc;
            }, []);
        });
    }
}


const s = new WorkflowScriptsUtilsService()
export const
    setTitle = s.setTitle.bind(s),
    getTitle = s.getTitle.bind(s),
    setDescription = s.setDescription.bind(s),
    getDescription = s.getDescription.bind(s),
    setApprovalUserNamesAndCreateInstanceTasks = s.setApprovalsUserNamesAndCreateInstanceTasks.bind(s),
    setPossibleApprovalStages = s.setPossibleApprovalStages.bind(s),
    getPossibleApprovalStages = s.getPossibleApprovalStages.bind(s),
    setInputArg = s.setInputArg.bind(s),
    getInputArg = s.getInputArg.bind(s),
    setApprovalStage = s.setApprovalStage.bind(s),
    getApproverUsernamesForStage = s.getApproverUsernamesForStage.bind(s),
    markWorkflowInstanceTaskAsExpired = s.markWorkflowInstanceTaskAsExpired.bind(s)
;

