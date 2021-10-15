import {createUnionType} from "type-graphql";
import {GqlNoWorkflowConfigured, GqlWorkflowInstanceCreated, GqlWorkflowTriggerError} from './common-gql-classes';
import {GraphQLScalarType, Kind} from "graphql";
import { ResponseStatus } from "@fuyuko-common/model/api-response-status.model";
import {AttributeType} from "@fuyuko-common/model/attribute.model";

// === scalars
export const ResponseStatusScalar = new GraphQLScalarType({
    name: 'ResponseStatus',
    description: 'ResponseStatus scalar type',
    serialize(value): string {
        return value;
    },
    parseValue(value): ResponseStatus {
        return value;
    },
    parseLiteral(ast): ResponseStatus {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`ResponseStatus can only be parse String values`);
        }
        return ast.value as ResponseStatus;
    }
});

export const AttributeTypeScalar = new GraphQLScalarType({
    name: 'AttributeType',
    description: 'AttributeType scalar types',
    serialize(value): string {
        return value;
    },
    parseValue(value): AttributeType {
        return value;
    },
    parseLiteral(ast): AttributeType {
        if (ast.kind !== Kind.STRING) {
            throw new Error(`AttributeType can only be parse String values`);
        }
        return ast.value as AttributeType;
    }
})



// === unions

export const WorkflowTriggerResultUnion = createUnionType({
    name: 'WorkflowTriggerResultUnion',
    types: () => [GqlNoWorkflowConfigured, GqlWorkflowInstanceCreated, GqlWorkflowTriggerError] as const,
    resolveType: value => {
        switch(value.type) {
            case 'no-workflow-configured':
                return GqlNoWorkflowConfigured;
            case 'workflow-trigger-error':
                return GqlWorkflowTriggerError;
            case 'workflow-instance-created':
                return GqlWorkflowInstanceCreated;
            default:
                return undefined;
        }
    }
});
