import {Service} from "typedi";
import {Arg, Field, InputType, Mutation, ObjectType, Resolver} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";
import {invocation} from '../../route/v1/DELETE-validation-result-by-id.route';

@InputType()
export class DeleteValidationResultByIdInput {
    @Field() viewId!: number;
    @Field() validationId!: number;
}

@ObjectType()
export class DeleteValidationResultByIdOutputPayload {

}

@ObjectType()
export class DeleteValidationResultByIdOutput extends createGqlResponseClass(DeleteValidationResultByIdOutputPayload){

}


@Service()
@Resolver()
export class DeleteValidationResultByIdResolver {

    @Mutation()
    async deleteValidationResultById(@Arg('input') input: DeleteValidationResultByIdInput): Promise<DeleteValidationResultByIdOutput> {
        const apiResponse = await invocation(input.viewId, input.validationId);
        return {
            messages: apiResponse.messages,
            payload: undefined
        };
    }

}
