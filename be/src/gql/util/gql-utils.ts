import 'reflect-metadata';
import {Field, ObjectType, ClassType} from "type-graphql";
import {ResponseStatus} from "@fuyuko-common/model/api-response-status.model";
import {ApiResponse, PaginableApiResponse} from "@fuyuko-common/model/api-response.model";
import {ResponseStatusScalar} from "../custom-types/custom-types";
// import {GqlItem} from "../custom-types/common-gql-classes";
import {Item, ItemImage, Value} from "@fuyuko-common/model/item.model";

// export const toGqlItem = (items: Item[]): GqlItem[] => {
//     return items.map(i => {
//         return {
//             id: i.id,
//             name: i.name,
//             description: i.description,
//             images: i.images,
//             parentId?: i.parentId,
//             creationDate: i.creationDate,
//             lastUpdate: i.lastUpdate,
//             values: i.
//             children: Item[];
//         }
//     });
// }
//
// const toValues = (item: Item) => {
//     for (const i in item) {
//         if (i)
//     }
//
// }

@ObjectType()
class GqlResponseMessage {
    @Field(_ => ResponseStatusScalar) status!: ResponseStatus;
    @Field() message?: string;
};

export const createGqlResponseClass = <P>(cls?: ClassType<P>): ClassType<ApiResponse<P>> => {
    if (cls) {
        @ObjectType({ isAbstract: true })
        class GqlApiResponse implements ApiResponse<P> {
            @Field(of => [GqlResponseMessage])
            messages!: GqlResponseMessage[]

            @Field(type => cls)
            payload?: P;
        }

        return GqlApiResponse;
    } else {
        @ObjectType({ isAbstract: true })
        class GqlApiResponse implements ApiResponse<void> {
            @Field(of => [GqlResponseMessage])
            messages!: GqlResponseMessage[]

        }

        return GqlApiResponse;
    }
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

