import {createUnionType} from "type-graphql";
import {GqlNoWorkflowConfigured, GqlWorkflowInstanceCreated, GqlWorkflowTriggerError} from './common-gql-classes';
import {GraphQLScalarType, Kind} from "graphql";
import { ResponseStatus } from "@fuyuko-common/model/api-response-status.model";

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
