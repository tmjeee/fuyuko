import {Service} from "typedi";
import {Field, ObjectType, Query, Resolver} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";
import {invocation} from '../../route/v1/GET-all-data-export-artifacts.route';
import {DataExportArtifact} from "@fuyuko-common/model/data-export.model";
import {GqlDataExportArtifact} from "../custom-types/common-gql-classes";


@ObjectType()
export class GetAllDataExportArtifactsOutputPayload {
   @Field(_ => [GqlDataExportArtifact]) dataExportArtifacts!: DataExportArtifact[];
}

@ObjectType()
export class GetAllDataExportArtifactsOutput extends createGqlResponseClass(GetAllDataExportArtifactsOutputPayload){
}


@Service()
@Resolver()
export class GetAllDataExportArtifactsResolver {

    @Query(_ => GetAllDataExportArtifactsOutput)
    async getAllDataExportArtifacts(): Promise<GetAllDataExportArtifactsOutput> {

        const apiResponse = await invocation();
        return {
            messages: apiResponse.messages,
            payload: {
                dataExportArtifacts: apiResponse.payload ?? []
            }
        }

    }
}
