import {Service} from "typedi";
import {Field, ObjectType, Query, Resolver} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";
import {invocation} from '../../route/v1/GET-all-custom-export.route';
import {CustomDataExport} from "@fuyuko-common/model/custom-export.model";
import {GqlCustomDataExport} from "../custom-types/common-gql-classes";


@ObjectType()
export class GetAllCustomExportOutputPayload {
    @Field(_ => [GqlCustomDataExport]) customDataExports!: CustomDataExport[];
}

@ObjectType()
export class GetAllCustomExportOutput extends createGqlResponseClass(GetAllCustomExportOutputPayload){
}


@Service()
@Resolver()
export class GetAllCustomExportResolver {

    @Query(_ => GetAllCustomExportOutput)
    async getAllCustomExport(): Promise<GetAllCustomExportOutput> {
        const apiResponse = await invocation();
        return  {
            messages: apiResponse.messages,
            payload: {
                customDataExports: apiResponse.payload ?? []
            }
        }
    }

}
