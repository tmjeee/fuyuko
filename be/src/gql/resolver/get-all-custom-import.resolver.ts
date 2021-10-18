import {Service} from "typedi";
import {Field, ObjectType, Query, Resolver} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";
import {invocation} from '../../route/v1/GET-all-custom-import.route';
import {isApiResponseSuccess} from "../../../../fe/projects/fuyuko/src/app/service/common.service";
import {CustomDataImport} from "@fuyuko-common/model/custom-import.model";
import {GqlCustomDataImport} from "../custom-types/common-gql-classes";

@ObjectType()
export class GetAllCustomImportOutputPayload {
    @Field(_ => [GqlCustomDataImport]) customDataImports!: CustomDataImport[];
}

@ObjectType()
export class GetAllCustomImportOutput extends  createGqlResponseClass(GetAllCustomImportOutputPayload) {
}

@Service()
@Resolver()
export class GetAllCustomImportResolver {

    @Query(_ => GetAllCustomImportOutput)
    async getAllCustomImport(): Promise<GetAllCustomImportOutput> {
        const apiResponse = await invocation();

        return {
            messages: apiResponse.messages,
            payload: {
                customDataImports: apiResponse.payload ?? []
            }
        }
    }
}
