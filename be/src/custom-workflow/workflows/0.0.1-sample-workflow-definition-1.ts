import {WorkflowScript} from "../../server-side-model/server-side.model";
import {Argument, createEngine, createState, Engine, State} from "@fuyuko-workflow/index";
import * as u  from '../../service/workflow-scripts-utils.service';
import _ from 'lodash';
import {StateLike} from "../../service/workflow-scripts-utils.service";

/**
 * Simple 3 step approval process, following is the flow diagram
 *
 *   +-->--------------+
 *   | (e1)            V
 *   |   +-------------------------------+
 *   |   | First Stage Approval (START)  |  Rejected (r)
 *   +-<-| Approval required (AND) :     |---------->-------+
 *       |    - tmjee                    |                  |
 *       |    - admin1                   |                  |
 *       +-------------------------------+                  |
 *                     |                                    v
 *  +--->--------------|   Approved (e2)                    |
 *  |(e2)              V                                    |
 *  |     +-------------------------------+                 |
 *  |    | Second Stage Approval         |  Rejected (r)    |
 *  +-<--| Approval required (OR) :      |---------->-------+
 *       |    - tmjee                    |                  |
 *       |    - admin2                   |                  |
 *       +-------------------------------+                  v
 *                     |                                    |
 *  +--->--------------|  Approval (e3)                     |
 *  |(e3)              V                                    |
 *  |    +-------------------------------+                  |
 *  |    | Third Stage Approval          | Rejected (r)     |
 *  +-<--| Approval required (OR) :      |---------->-------|
 *       |    - tmjee                    |                  |
 *       |    - admin3                   |                  |
 *       +-------------------------------+                  v
 *                     |                                    |
 *                     |  Approve (e)                       |
 *                     v                                    v
 *              +-----------------+                   +--------------------+
 *              |  Approved (END) |                   |   REJECTED (END)   |
 *              +-----------------+                   +--------------------+
 *
 */

// first stage of approval
const state1 = createState('state1',
    {
        initFn: async (args) => {
            const s: StateLike  = { state: state1, args };
            u.setTitle(s, 'Approval state1');
            u.setDescription(s, 'This workflow instance is in State1 Approval stage, you will need both tmjee and admin1\'s approval');
            await u.setApprovalUserNamesAndCreateInstanceTasks(s, 'tmjee', 'admin1');
            u.setPossibleApprovalStages(s, 'Approve', 'Reject')
        },
        processFn: async (prevState, args) => {
            const s = { state: state1, args };
            if (prevState && prevState.name !== state1.name) { // we have advance in our workflow state
                await u.markWorkflowInstanceTaskAsExpred(s, prevState.name);
            }
            const inputApprovalUserName = u.getInputArg(s, 'inputApprovalUserName');
            const inputApprovalStage = u.getInputArg(s, 'inputApprovalStage');
            if(inputApprovalStage === 'Approve') {
                await u.setApprovalStage(s, inputApprovalUserName, 'Approve');
            } else if (inputApprovalStage === 'Reject') {
                await u.setApprovalStage(s, inputApprovalUserName, 'Reject');
            }

            // Condition:
            // - both 'tmjee' AND 'admn1' MUST approve  to get pass this stage
            // - either 'tmjee' or 'admin1' to reject to end this stage
            const approversUsernameForStage = await u.getApproverUsernamesForStage(s, 'Approve');
            const rejectersUsernameForStage = await u.getApproverUsernamesForStage(s, 'Reject');
            if (approversUsernameForStage.includes('tmjee') && approversUsernameForStage.includes('admin1')) {
                return 'e2';
            } else if (rejectersUsernameForStage.includes('tmjee') || rejectersUsernameForStage.includes('admin1')) {
                return 'r';
            }
            return 'e1';
        }
    }
);

// second stage of approval
const state2 = createState('state1', {
        initFn: async (args) => {
            const s = {state: state2, args};
            u.setTitle(s, 'Approval state2');
            u.setDescription(s, 'This workflow instance is in State2 Approval stage, you will need either tmjee and admin2\'s approval');
            await u.setApprovalUserNamesAndCreateInstanceTasks(s, 'tmjee', 'admin2');
            u.setPossibleApprovalStages(s, 'Approve', 'Reject')
        },
        processFn: async (prevState: State | undefined, args) => {
            const s = {state: state2, args};
            if (prevState && prevState.name !== state2.name) { // we have advance in our workflow state
                await u.markWorkflowInstanceTaskAsExpred(s, prevState.name);
            }
            const inputApprovalUserName = u.getInputArg(s, 'inputApprovalUserName');
            const inputApprovalStage = u.getInputArg(s, 'inputApprovalStage');
            if (inputApprovalStage === 'Approve') {
                await u.setApprovalStage(s, inputApprovalUserName, 'Approve');
            } else if (inputApprovalStage === 'Reject') {
                await u.setApprovalStage(s, inputApprovalUserName, 'Reject');
            }

            // Condition:
            // - both 'tmjee' OR 'admn2' MUST approve  to get pass this stage
            // - either 'tmjee' or 'admin2' to reject to end this stage
            const approversUsernameForStage = await u.getApproverUsernamesForStage(s, 'Approve');
            const rejectersUsernameForStage = await u.getApproverUsernamesForStage(s, 'Reject');
            if (approversUsernameForStage.includes('tmjee') || approversUsernameForStage.includes('admin2')) {
                return 'e3';
            } else if (rejectersUsernameForStage.includes('tmjee') || rejectersUsernameForStage.includes('admin2')) {
                return 'r';
            }
            return 'e2';
        },
    }
);

// third stage of approval
const state3 = createState('state1', {
        initFn: async (args) => {
            const s = {state: state3, args};
            u.setTitle(s, 'Approval state3');
            u.setDescription(s, 'This workflow is in State3 Approval stage, you will need either tmjee and admin3\'s approval');
            await u.setApprovalUserNamesAndCreateInstanceTasks(s, 'tmjee', 'admin3');
            u.setPossibleApprovalStages(s, 'Approve', 'Reject')
        },
        processFn: async (prevState: State | undefined, args) => {
            const s = {state: state3, args};
            if (prevState && prevState.name !== state3.name) { // we have advance in our workflow state
                await u.markWorkflowInstanceTaskAsExpred(s, prevState.name);
            }
            const inputApprovalUserName = u.getInputArg(s, 'inputApprovalUserName');
            const inputApprovalStage = u.getInputArg(s, 'inputApprovalStage');
            if (inputApprovalStage === 'Approve') {
                await u.setApprovalStage(s, inputApprovalUserName, 'Approve');
            } else if (inputApprovalStage === 'Reject') {
                await u.setApprovalStage(s, inputApprovalUserName, 'Reject');
            }

            // Condition:
            // - both 'tmjee' OR 'admn3' MUST approve  to get pass this stage
            // - either 'tmjee' or 'admin3' to reject to end this stage
            const approversUsernameForStage = await u.getApproverUsernamesForStage(s, 'Approve');
            const rejectersUsernameForStage = await u.getApproverUsernamesForStage(s, 'Reject');
            if (approversUsernameForStage.includes('tmjee') || approversUsernameForStage.includes('admin3')) {
                return 'e';
            } else if (rejectersUsernameForStage.includes('tmjee') || rejectersUsernameForStage.includes('admin3')) {
                return 'r';
            }
            return 'e3';
        },
    }
);

const approved = createState('approved', {
        initFn: async (args) => {
            const s = {state: approved, args};
            u.setTitle(s, 'Approved');
            u.setDescription(s, 'You are in APPROVED state');
            u.setApprovalUserNamesAndCreateInstanceTasks(s, 'tmjee', 'admin3');
            u.setPossibleApprovalStages(s, 'Approve', 'Reject')
        },
        processFn: async (prevState, args) => {
            const s = {state: approved, args};
            if (prevState && prevState.name !== approved.name) { // we have advance in our workflow state
                await u.markWorkflowInstanceTaskAsExpred(s, prevState.name);
            }
            return '*';
        },
    }
);

const rejected = createState('rejected', {
        initFn: async (args) => {
            const s = {state: rejected, args};
        },
        processFn: async (prevState, args) => {
            const s = {state: rejected, args};
            if (prevState && prevState.name !== rejected.name) { // we have advance in our workflow state
                await u.markWorkflowInstanceTaskAsExpred(s, prevState.name);
            }
            return '*';
        }
    }
);

state1.on('e1').to(state1);
state1.on('e2').to(state2);
state1.on('r').to(rejected);
state2.on('e2').to(state2);
state2.on('e3').to(state3);
state2.on('r').to(rejected);
state3.on('e3').to(state3);
state3.on('e').to(approved);
state3.on('r').to(rejected);
approved.on('*').to(approved);
rejected.on('*').to(rejected);

const _buildEngine = (): Engine => {
    return createEngine()
            .startsWith(state1)
            .register(state2)
            .endsWith(state3);
};

const _initEngine = (engine: Engine, args: Argument, serializedData?: string): Engine => {
    return engine.init({...args}, serializedData);
}

const workflowScript: WorkflowScript = {
    description: 'Workflow Scritp Definition #1 description',
    buildEngine: _buildEngine,
    initEngine: _initEngine,
};
export default workflowScript;
export const buildEngine = workflowScript.buildEngine.bind(workflowScript);
export const initEngine = workflowScript.initEngine.bind(workflowScript);
export const description = workflowScript.description;

