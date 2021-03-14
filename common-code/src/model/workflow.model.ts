import {View} from "./view.model";
import {Status} from './status.model';
import {EngineStatus} from '@fuyuko-workflow/index';
import {UserWithoutGroupAndTheme} from './user.model';

export const WORKFLOW_INSTANCE_ACTION = ['Create', 'Edit', 'Delete'] as const;
export const WORKFLOW_INSTANCE_TYPE = ['Attribute', 'AttributeValue', 'Item', 'Price', 'Rule', 'User', 'Category'] as const;
export type WorkflowInstanceAction = typeof WORKFLOW_INSTANCE_ACTION[number];
export type WorkflowInstanceType = typeof WORKFLOW_INSTANCE_TYPE[number];


// === WorkflowDefinition

export interface WorkflowDefinition {
    id: number,
    name: string,
    description: string,
    creationDate: Date,
    lastUpdate: Date,
};

// === Workflow
export type Workflow = WorkflowForAttribute | WorkflowForAttributeValue | WorkflowForItem | WorkflowForPrice | WorkflowForRule |
    WorkflowForUser | WorkflowForCategory;

export interface WorkflowForAttribute {
    id: number;
    name: string;
    workflowDefinition: WorkflowDefinition;
    view: View;
    type: 'Attribute',
    action: WorkflowInstanceAction,
    status: Status,
    creationDate: Date,
    lastUpdate: Date
};

export interface WorkflowForAttributeValue {
    id: number;
    name: string;
    workflowDefinition: WorkflowDefinition;
    view: View;
    type: 'AttributeValue',
    action: WorkflowInstanceAction,
    status: Status,
    attributeIds: number[],
    creationDate: Date,
    lastUpdate: Date
};

export interface WorkflowForItem {
    id: number;
    name: string;
    workflowDefinition: WorkflowDefinition;
    view: View;
    type: 'Item',
    action: WorkflowInstanceAction,
    status: Status,
    creationDate: Date,
    lastUpdate: Date
};

export interface WorkflowForPrice {
    id: number;
    name: string;
    workflowDefinition: WorkflowDefinition;
    view: View;
    type: 'Price',
    action: WorkflowInstanceAction,
    status: Status,
    creationDate: Date,
    lastUpdate: Date
};

export interface WorkflowForRule {
    id: number;
    name: string;
    workflowDefinition: WorkflowDefinition;
    view: View;
    type: 'Rule',
    action: WorkflowInstanceAction,
    status: Status,
    creationDate: Date,
    lastUpdate: Date
};

export interface WorkflowForUser {
    id: number;
    name: string;
    workflowDefinition: WorkflowDefinition;
    view: View;
    type: 'User',
    action: WorkflowInstanceAction,
    status: Status,
    creationDate: Date,
    lastUpdate: Date
};

export interface WorkflowForCategory {
    id: number;
    name: string;
    workflowDefinition: WorkflowDefinition;
    view: View;
    type: 'Category',
    action: WorkflowInstanceAction,
    status: Status,
    creationDate: Date,
    lastUpdate: Date
};




// === WorkflowInstance
export interface WorkflowInstance {
    id: number;
    name: string;
    workflowId: number;
    functionInputs: string;
    currentWorkflowState: string;
    engineStatus: EngineStatus;
    data: string;
    creator: UserWithoutGroupAndTheme,
    creationDate: Date;
    lastUpdate: Date;
}


export interface WorkflowInstanceComment {
    id: number;
    workflowInstanceId: number;
    comment: string;
    creator: UserWithoutGroupAndTheme,
    creationDate: Date;
    lastUpdate: Date;
}

// === WorkflowTask
export type WorkflowInstanceTaskStatus = 'PENDING' | 'ACTIONED' | 'EXPIRED'
export interface WorkflowInstanceTask {
    id: number;
    name: string;
    workflowInstance: WorkflowInstance;
    taskTitle: string;
    taskDescription: string;
    workflowState:string;
    approvalStage: string;
    approver: UserWithoutGroupAndTheme,
    status: WorkflowInstanceTaskStatus,
    creationDate: Date;
    lastUpdate: Date;
}

