import 'reflect-metadata';
import {Field, ObjectType, ClassType} from "type-graphql";
import {ResponseStatus} from "@fuyuko-common/model/api-response-status.model";
import {ApiResponse, PaginableApiResponse} from "@fuyuko-common/model/api-response.model";
import {ResponseStatusScalar} from "../custom-types/custom-types";

@ObjectType()
class GqlResponseMessage {
    @Field(_ => ResponseStatusScalar) status!: ResponseStatus;
    @Field() message?: string;
};

export const createGqlResponseClass = <P>(cls: ClassType<P>): ClassType<ApiResponse<P>> => {


    @ObjectType({ isAbstract: true })
    class GqlApiResponse implements ApiResponse<P> {
        @Field(of => [GqlResponseMessage])
        messages!: GqlResponseMessage[]

        @Field(type => cls)
        payload?: P;
    }

    return GqlApiResponse;
}

export const createPaginableGqlResponseClass = <P>(cls: ClassType<P>): ClassType<PaginableApiResponse<P>> => {

    @ObjectType({isAbstract: true})
    class PaginableGqlApiResponse implements PaginableApiResponse<P> {
        @Field(_ => [GqlResponseMessage])
        messages!: GqlResponseMessage[];
        @Field()
        limit!: number;
        @Field()
        offset!: number;
        @Field()
        total!: number;
        @Field(type => cls)
        payload?: P;
    }
    return PaginableGqlApiResponse;
}

