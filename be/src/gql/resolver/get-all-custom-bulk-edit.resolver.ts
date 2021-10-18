import {Service} from "typedi";
import {Field, ObjectType, Query, Resolver} from "type-graphql";
import {CustomBulkEdit} from "@fuyuko-common/model/custom-bulk-edit.model";
import {ApiResponse} from "@fuyuko-common/model/api-response.model";
import {invocation} from '../../route/v1/GET-all-custom-bulk-edit.route';
import {createGqlResponseClass} from "../util/gql-utils";
import {GqlCustomBulkEdit} from "../custom-types/common-gql-classes";

@ObjectType()
export class GetAllCustomBulkEditOutputPayload {
    @Field(_ => [GqlCustomBulkEdit])
    customBulkEdits!: CustomBulkEdit[]
}

@ObjectType()
export class GetAllCustomBulkEditOutput extends createGqlResponseClass(GetAllCustomBulkEditOutputPayload){
}


@Service()
@Resolver()
export class GetAllCustomBulkEditResolver {

    @Query(_ => GetAllCustomBulkEditOutput)
    async getAllCustomBulkEdits(): Promise<GetAllCustomBulkEditOutput> {
        const apiResponse = await invocation();
        return {
            messages: apiResponse.messages,
            payload: {
                customBulkEdits: apiResponse.payload ?? []
            }
        }

    }

}
