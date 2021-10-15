import {Service} from "typedi";
import {Arg, Field, InputType, Int, Mutation, ObjectType, Resolver} from "type-graphql";
import {invocation} from '../../route/v1/DELETE-favourite-items.route';
import {createGqlResponseClass} from "../util/gql-utils";


@InputType()
export class DeleteFavouriteItemsInput {
   @Field() viewId!: number;
   @Field() userId!: number;
   @Field(_ => [Int]) itemIds!: number[];
}

@ObjectType()
export class DeleteFavouriteItemOutputPayload {}

@ObjectType()
export class DeleteFavouriteItemsOutput extends createGqlResponseClass(DeleteFavouriteItemOutputPayload){
}

@Service()
@Resolver()
export class DeleteFavouriteItemsResolver {

    @Mutation()
    async deleteFavouriteItems(@Arg('input') input: DeleteFavouriteItemsInput): Promise<DeleteFavouriteItemsOutput> {
       const apiResponse = await invocation(input.viewId, input.userId, input.itemIds);
       return {
           messages: apiResponse.messages,
           payload: undefined
       };
    }

}
