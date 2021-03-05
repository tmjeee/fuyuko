import {View} from "./view.model";
import {Status} from './status.model';

export const WORKFLOW_INSTANCE_ACTION = ['Create', 'Edit', 'Delete'] as const;
export const WORKFLOW_INSTANCE_TYPE = ['Attribute', 'AttributeValue', 'Item', 'Price', 'Rule', 'User', 'Category'] as const;
export type WorkflowInstanceAction = typeof WORKFLOW_INSTANCE_ACTION[number];
export type WorkflowInstanceType = typeof WORKFLOW_INSTANCE_TYPE[number];

// === WorkflowInstanceTask
export type WorkflowInstanceTaskStatus = 'PENDING' | 'ACTIONED' | 'EXPIRED';
export interface WorkflowInstanceTasks {
    pending: WorkflowInstanceTask[],
    actioned: WorkflowInstanceTask[],
    expired: WorkflowInstanceTask[],
}

export interface WorkflowInstanceTask {
    id: number,
    workflowInstanceId: number,
    creationDate: Date,
    lastUpdate: Date,
    workflowState: string,
    approvalStage: string,
    approverUserId: number,
    status: WorkflowInstanceTaskStatus
}


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
