import 'reflect-metadata';
import {Service} from "typedi";
import {Arg, Field, InputType, Int, Mutation, NonEmptyArray, ObjectType, Resolver, UseMiddleware} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";
import {invocation} from '../../route/v1/DELETE-category.route';
import {WorkflowTriggerResult} from "@fuyuko-common/model/workflow.model";
import {WorkflowTriggerResultUnion} from "../custom-types/custom-types";
import {isWorkflow} from "../../route/v1/aid.";

@InputType()
export class DeleteCategoryInput {
    @Field(_ => Int) viewId!: number;
    @Field(_ => Int) categoryId!: number;
}

@ObjectType()
export class DeleteCategoryOutputPayload {
   @Field() isWorkflow!: boolean;
   @Field(_ => [WorkflowTriggerResultUnion]) workflows?: WorkflowTriggerResult[];
}

@ObjectType()
export class DeleteCategoryOutput extends createGqlResponseClass(DeleteCategoryOutputPayload) {}


@Service()
@Resolver()
export class DeleteCategoryResolver {

    @Mutation(_ => DeleteCategoryOutput)
    @UseMiddleware([])
    async deleteCategory(@Arg('input') input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
        const apiResponse = await invocation(input.viewId, input.categoryId);
        return {
            messages: apiResponse.messages,
            payload:  {
                isWorkflow: isWorkflow(apiResponse),
                workflows: isWorkflow(apiResponse) ? apiResponse.payload : undefined,
            }
        }
    }

}
