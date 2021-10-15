import {Service} from "typedi";
import {Arg, Field, InputType, ObjectType, Resolver} from "type-graphql";
import {invocation} from '../../route/v1/DELETE-remove-item-from-category.route';
import {createGqlResponseClass} from "../util/gql-utils";

@InputType()
export class DeleteItemFromCategoryInput {
    @Field() viewId!: number;
    @Field() categoryId!: number;
    @Field() itemId!: number;
}

@ObjectType()
export class DeleteItemFromCategoryOutputPayload {

}

@ObjectType()
export class DeleteItemFromCategoryOutput extends createGqlResponseClass(DeleteItemFromCategoryOutputPayload){

}


@Service()
@Resolver()
export class DeleteItemFromCategoryResolver {

    async deleteItemFromCategory(@Arg('input') input: DeleteItemFromCategoryInput): Promise<DeleteItemFromCategoryOutput> {
       const apiResponse = await invocation(input.viewId, input.categoryId, input.itemId);
       return {
          messages: apiResponse.messages,
          payload: undefined,
       }
    }

}
