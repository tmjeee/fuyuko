import {View} from "./view.model";

export const WORKFLOW_INSTANCE_ACTION = ['Create', 'Edit', 'Delete'];
export const WORKFLOW_INSTANCE_TYPE = ['Attribute', 'Item', 'Price', 'Rule', 'User', 'Category'];
export type WorkflowInstanceAction = typeof WORKFLOW_INSTANCE_ACTION[number];
export type WorkflowInstanceType = typeof WORKFLOW_INSTANCE_TYPE[number];

export interface WorkflowDefinition {
    id: number,
    name: string,
    description: string,
    creationDate: Date,
    lastUpdate: Date,
};

export interface Workflow {
    id: number;
    workflowDefinition: WorkflowDefinition;
    view: View;
    type: WorkflowInstanceType,
    action: WorkflowInstanceAction,
    creationDate: Date,
    lastUpdate: Date
};

export interface WorkflowInstance {
    id: number;
    workflowId: number;
    params: WorkflowInstanceParam[],
    progress: 'IN_PROGRESS' | 'ENDED',
    engineData: string,
};

export interface WorkflowInstanceParam {
    id: number;
    name: string;
    value: string;
    type: 'string' | 'number';
};