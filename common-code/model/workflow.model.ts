import {View} from "./view.model";

export type WorkflowInstanceAction = 'Create' | 'Edit' | 'Delete';
export type WorkflowInstanceType = 'Attribute' | 'Item' | 'Price' | 'Rule' | 'User' | 'Category';

export interface Workflow {
    id: number,
    name: string,
    description: string,
    creationDate: Date,
    lastUpdate: Date,
};

export interface WorkflowMapping {
    id: number;
    workflow: Workflow;
    view: View;
    type: WorkflowInstanceType,
    action: WorkflowInstanceAction,
    creationDate: Date,
    lastUpdate: Date
};

export interface WorkflowInstance {
    id: number;
    workflowMappingId: number;
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