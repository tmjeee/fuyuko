import {Service} from "typedi";
import {Arg, Field, Int, ObjectType, Query, Resolver} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";
import {invocation} from '../../route/v1/GET-all-favourite-item-ids.route';

@ObjectType()
export class GetAllFavouriteItemIdsInput {
    @Field(_ => Int) viewId!: number;
    @Field(_ => Int) userId!: number;

}

@ObjectType()
export class GetAllFavouriteItemIdsOutputPayload {
    @Field(_ => [Int]) favouriteItemIds!: number[];
}

@ObjectType()
export class GetAllFavouriteItemIdsOutput extends createGqlResponseClass(GetAllFavouriteItemIdsOutputPayload){

}


@Service()
@Resolver()
export class GetAllFavouriteItemIdsResolver {


    @Query(_ => GetAllFavouriteItemIdsOutput)
    async getAllFavouriteItemIds(@Arg('input') input: GetAllFavouriteItemIdsInput): Promise<GetAllFavouriteItemIdsOutput> {

        const apiResponse = await invocation(input.viewId, input.userId);
        return {
            messages: apiResponse.messages,
            payload: {
                favouriteItemIds: apiResponse.payload ?? []
            }
        }

    }

}
