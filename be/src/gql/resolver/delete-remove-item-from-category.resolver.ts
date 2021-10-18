import 'reflect-metadata';
import {Service} from "typedi";
import {Arg, Field, InputType, Mutation, ObjectType, Resolver} from "type-graphql";
import {invocation} from '../../route/v1/DELETE-remove-item-from-category.route';
import {createGqlResponseClass} from "../util/gql-utils";

@InputType()
export class DeleteItemFromCategoryInput {
    @Field() viewId!: number;
    @Field() categoryId!: number;
    @Field() itemId!: number;
}

@ObjectType()
export class DeleteItemFromCategoryOutput extends createGqlResponseClass(){
}


@Service()
@Resolver()
export class DeleteItemFromCategoryResolver {

    @Mutation(_ => DeleteItemFromCategoryOutput)
    async deleteItemFromCategory(@Arg('input') input: DeleteItemFromCategoryInput): Promise<DeleteItemFromCategoryOutput> {
       const apiResponse = await invocation(input.viewId, input.categoryId, input.itemId);
       return {
          messages: apiResponse.messages,
          payload: undefined,
       }
    }

}
