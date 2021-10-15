import {Service} from "typedi";
import {Arg, Field, InputType, Mutation, ObjectType, Resolver} from "type-graphql";
import {invocation} from '../../route/v1/DELETE-data-export-artifact-by-id.route';
import {createGqlResponseClass} from "../util/gql-utils";


@InputType()
export class DeleteDataExportArtifactInput {
    @Field() dataExportArtifactId!: number;
}

@ObjectType()
export class DeleteDataExportArtifactOutputPayload {
}

@ObjectType()
export class DeleteDataExportArtifactOutput extends createGqlResponseClass(DeleteDataExportArtifactOutputPayload){
}

@Service()
@Resolver()
export class DeleteDataExportArtifactByIdResolver {

    @Mutation()
    async deleteDataExportArtifact(@Arg('input') input: DeleteDataExportArtifactInput): Promise<DeleteDataExportArtifactOutput> {
        const apiResponse = await invocation(input.dataExportArtifactId);
        return {
            messages: apiResponse.messages,
            payload: undefined,
        }
    }

}
