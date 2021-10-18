import 'reflect-metadata';
import {Service} from "typedi";
import {Arg, Field, InputType, Int, Mutation, ObjectType, Resolver} from "type-graphql";
import {invocation} from '../../route/v1/DELETE-data-export-artifact-by-id.route';
import {createGqlResponseClass} from "../util/gql-utils";


@InputType()
export class DeleteDataExportArtifactInput {
    @Field(_ => Int) dataExportArtifactId!: number;
}

@ObjectType()
export class DeleteDataExportArtifactOutput extends createGqlResponseClass(){
}

@Service()
@Resolver()
export class DeleteDataExportArtifactByIdResolver {

    @Mutation(_ => DeleteDataExportArtifactOutput)
    async deleteDataExportArtifact(@Arg('input') input: DeleteDataExportArtifactInput): Promise<DeleteDataExportArtifactOutput> {
        const apiResponse = await invocation(input.dataExportArtifactId);
        return {
            messages: apiResponse.messages,
            payload: undefined,
        }
    }

}
