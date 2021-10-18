import 'reflect-metadata';
import {Service} from "typedi";
import {Arg, Field, InputType, Int, Mutation, ObjectType, Resolver} from "type-graphql";
import {invocation} from '../../route/v1/DELETE-favourite-items.route';
import {createGqlResponseClass} from "../util/gql-utils";


@InputType()
export class DeleteFavouriteItemsInput {
   @Field(_ => Int) viewId!: number;
   @Field(_ => Int) userId!: number;
   @Field(_ => [Int]) itemIds!: number[];
}

@ObjectType()
export class DeleteFavouriteItemsOutput extends createGqlResponseClass(){
}

@Service()
@Resolver()
export class DeleteFavouriteItemsResolver {

    @Mutation(_ => DeleteFavouriteItemsOutput)
    async deleteFavouriteItems(@Arg('input') input: DeleteFavouriteItemsInput): Promise<DeleteFavouriteItemsOutput> {
       const apiResponse = await invocation(input.viewId, input.userId, input.itemIds);
       return {
           messages: apiResponse.messages,
           payload: undefined
       };
    }

}
