import {Service} from "typedi";
import {Arg, Field, Int, ObjectType, Query, Resolver} from "type-graphql";
import {invocation} from '../../route/v1/GET-all-favourite-items.route';
import {LimitOffset} from "@fuyuko-common/model/limit-offset.model";
import {GqlItem, GqlLimitOffset} from "../custom-types/common-gql-classes";
import {createGqlResponseClass} from "../util/gql-utils";
import {Item} from "@fuyuko-common/model/item.model";


@ObjectType()
export class GetAllFavouriteItemsInput {
    @Field(_ => Int) viewId!: number;
    @Field(_ => Int) userId!: number;
    @Field(_ => GqlLimitOffset) limitOffset?: LimitOffset;

}

@ObjectType()
export class GetAllFavouriteItemsOutputPayload {
    @Field(_ => [GqlItem]) items!: Item[]
}

@ObjectType()
export class GetAllFavouriteItemsOutput extends createGqlResponseClass(GetAllFavouriteItemsOutputPayload){

}


@Service()
@Resolver()
export class GetAllFavouriteItemsResolver {

    @Query(_ => GetAllFavouriteItemsOutput)
    async getAllFavouriteItems(@Arg('input') input: GetAllFavouriteItemsInput): Promise<GetAllFavouriteItemsOutput> {
       const apiResponse = await invocation(input.viewId, input.userId, input.limitOffset);
       return {
           messages: apiResponse.messages,
           payload: {
               items: apiResponse.payload ?? []
           }
       }
    }

}
