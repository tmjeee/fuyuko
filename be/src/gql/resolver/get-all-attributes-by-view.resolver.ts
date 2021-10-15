import {Arg, Field, InputType, ObjectType, Query, Resolver} from "type-graphql";
import {Service} from "typedi";
import {invocation} from '../../route/v1/GET-all-attributes-by-view.route';
import {LimitOffset} from "@fuyuko-common/model/limit-offset.model";
import {createGqlResponseClass, createPaginableGqlResponseClass} from "../util/gql-utils";
import {GqlAttribute, GqlLimitOffset} from "../custom-types/common-gql-classes";
import {Attribute} from "@fuyuko-common/model/attribute.model";
import {AttributeTypeScalar} from "../custom-types/custom-types";


@InputType()
export class GetAllAttributesByViewInput {
   @Field() viewId!: number;
   @Field(_ => GqlLimitOffset) limitOffset?: LimitOffset;
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

    @Query()
    async getAllAttributesByView(@Arg('input') input: GetAllAttributesByViewInput): Promise<GetAllAttributesByViewOutput> {
        const apiResponse = await invocation(input.viewId, input.limitOffset);
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
