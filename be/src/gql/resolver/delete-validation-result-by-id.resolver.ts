import 'reflect-metadata';
import {Service} from "typedi";
import {Arg, Field, InputType, Int, Mutation, ObjectType, Resolver} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";
import {invocation} from '../../route/v1/DELETE-validation-result-by-id.route';

@InputType()
export class DeleteValidationResultByIdInput {
    @Field(_ => Int) viewId!: number;
    @Field(_ => Int) validationId!: number;
}


@ObjectType()
export class DeleteValidationResultByIdOutput extends createGqlResponseClass(){
}


@Service()
@Resolver()
export class DeleteValidationResultByIdResolver {

    @Mutation(_ => DeleteValidationResultByIdOutput)
    async deleteValidationResultById(@Arg('input') input: DeleteValidationResultByIdInput): Promise<DeleteValidationResultByIdOutput> {
        const apiResponse = await invocation(input.viewId, input.validationId);
        return {
            messages: apiResponse.messages,
            payload: undefined
        };
    }

}
