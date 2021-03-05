import {WorkflowScript} from "../../server-side-model/server-side.model";
import {Argument, Engine} from "../../wf";
import {InternalEngine} from "../../wf/engine-impl";

const engine: Engine = new InternalEngine();

const workflowScript: WorkflowScript = {
    description: 'Workflow Scritp Definition #2 description',
    buildEngine(args?: Argument): Engine {
        return engine;
    }
}
export default workflowScript;
export const buildEngine = workflowScript.buildEngine.bind(workflowScript);
export const description = workflowScript.description;
