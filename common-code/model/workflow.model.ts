import {View} from "./view.model";

export type WorkflowInstanceAction = 'Create' | 'Edit' | 'Delete';
export type WorkflowInstanceType = 'Attribute' | 'Item' | 'Price' | 'Rule' | 'User' | 'Category';

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