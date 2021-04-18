import {WorkflowScript} from '../../server-side-model/server-side.model';
import {Argument, Engine, serializeArgument} from '@fuyuko-workflow/index';
import {InternalEngine} from '@fuyuko-workflow/engine-impl';

const workflowScript: WorkflowScript = {
    description: 'Workflow Scritp Definition #2 description',
    buildEngine(): Engine {
        return new InternalEngine();
    },
    initEngine(engine , args, serializedData) {
        return engine.init({...args}, serializedData);
    },
}
export default workflowScript;
export const buildEngine = workflowScript.buildEngine.bind(workflowScript);
export const description = workflowScript.description;
