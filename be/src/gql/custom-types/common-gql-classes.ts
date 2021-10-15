import 'reflect-metadata';
import {NoWorkflowConfigured, WorkflowInstanceCreated, WorkflowTriggerError} from "@fuyuko-common/model/workflow.model";
import {Field, ObjectType} from "type-graphql";
import {LimitOffset} from "@fuyuko-common/model/limit-offset.model";
import {Attribute, AttributeType, Pair1, Pair2} from "@fuyuko-common/model/attribute.model";
import {AttributeTypeScalar} from "./custom-types";

@ObjectType()
export class GqlAttribute implements Attribute {
    @Field() creationDate!: Date;
    @Field() description!: string;
    @Field() id!: number;
    @Field() lastUpdate!: Date;
    @Field() name!: string;
    @Field(_ => AttributeTypeScalar) type!: AttributeType;

    @Field() format?: string;
    @Field() showCurrencyCountry?: boolean;
    @Field(_ => [GqlPair1]) pair1?: Pair1[];
    @Field(_ => [GqlPair2]) pair2?: Pair2[];
}

@ObjectType()
export class GqlPair1 implements Pair1 {
    @Field() id!: number;
    @Field() key!: string;
    @Field() value!: string;
}

@ObjectType()
export class GqlPair2 implements Pair2 {
    @Field() id!: number;
    @Field() key1!: string;
    @Field() key2!: string;
    @Field() value!: string;
}

@ObjectType()
export class GqlLimitOffset implements LimitOffset {
    @Field() limit!: number;
    @Field() offset!: number;
}


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
