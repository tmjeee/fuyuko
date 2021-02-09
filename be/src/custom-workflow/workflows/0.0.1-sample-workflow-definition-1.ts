import {WorkflowScript} from "../../server-side-model/server-side.model";
import {Argument, createEngine, createState, Engine} from "../../wf";
import {InternalEngine} from "../../wf/engine-impl";

// first stage of approval
const state1 = createState('state1', async (args) => {
    args[`FFF_state1_title`] = 'Stage 1 Approval';
    args[`FFF_state1_text`] = 'Stage 1 Approval requires a few approvals';
    args[`FFF_state1_approvalUserIds`] = '1 OR 2 OR 3';
    args[`FFF_state1_buttons`] = 'Approve | Reject';
    return 'e1';
});

// second stage of approval
const state2 = createState('state1', async (args) => {
    return 'e2';
});

// third stage of approval
const state3 = createState('state1', async (args) => {
    return 'e3';
});

let engine: Engine | undefined  = undefined
const getEngine = (args: Argument): Engine => {
    engine = engine ? engine :
        createEngine()
            .startsWith(state1)
            .register(state2)
            .endsWith(state3)
            .init({
                ...args,

            });
    return engine;
}

const workflowScript: WorkflowScript = {
    description: 'Workflow Scritp Definition #1 description',
    createEngine: getEngine,
}

export default workflowScript;
