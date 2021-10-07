import 'reflect-metadata';
import {NoWorkflowConfigured, WorkflowInstanceCreated, WorkflowTriggerError} from "@fuyuko-common/model/workflow.model";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
export class GqlNoWorkflowConfigured implements NoWorkflowConfigured {
    @Field() type!: "no-workflow-configured";
}

@ObjectType()
export class GqlWorkflowInstanceCreated implements WorkflowInstanceCreated {
    @Field() type!: "workflow-instance-created";
    @Field() workflowInstanceId!: number;
}

@ObjectType()
export class GqlWorkflowTriggerError implements WorkflowTriggerError {
    @Field() message!: string;
    @Field() type!: "workflow-trigger-error";
}
