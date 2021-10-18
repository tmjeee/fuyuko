import 'reflect-metadata';
import {Arg, Field, InputType, Int, ObjectType, Query, Resolver} from "type-graphql";
import {Service} from "typedi";
import {invocation} from '../../route/v1/GET-all-attributes-by-view.route';
import {LimitOffset} from "@fuyuko-common/model/limit-offset.model";
import {createPaginableGqlResponseClass} from "../util/gql-utils";
import {GqlAttribute, GqlLimitOffset} from "../custom-types/common-gql-classes";
import {Attribute} from "@fuyuko-common/model/attribute.model";
import {isLimit} from "../../util/utils";


@InputType()
export class GetAllAttributesByViewInput {
   @Field(_ => Int) viewId!: number;
   @Field(_ => GqlLimitOffset, {nullable: true}) limitOffset?: LimitOffset;
}

@ObjectType()
export class GetAllAttributesByViewOutputPayload {
    @Field(_ => [GqlAttribute]) attributes?: Attribute[];
}

@ObjectType()
export class GetAllAttributesByViewOutput extends createPaginableGqlResponseClass(GetAllAttributesByViewOutputPayload){
}

@Service()
@Resolver()
export class GetAllAttributesByViewResolver {

    @Query(_ => GetAllAttributesByViewOutput)
    async getAllAttributesByView(@Arg('input') input: GetAllAttributesByViewInput): Promise<GetAllAttributesByViewOutput> {
        const apiResponse = await invocation(input.viewId, input.limitOffset); // input.limitOffset);
        return {
            limit: apiResponse.limit,
            offset: apiResponse.offset,
            total: apiResponse.total,
            messages: apiResponse.messages,
            payload: {
                attributes: apiResponse.payload
            }
        };
    }

}
