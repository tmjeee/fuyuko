import {Service} from "typedi";
import {Arg, Field, InputType, Mutation, ObjectType, Resolver} from "type-graphql";
import {invocation} from '../../route/v1/DELETE-self-registration.route';
import {createGqlResponseClass} from "../util/gql-utils";

@InputType()
export class DeleteSelfRegistrationInput {
    @Field() selfRegistrationId!: number;
}

@ObjectType()
export class DeleteSelfRegistrationOutputPayload {

}

@ObjectType()
export class DeleteSelfRegistrationOutput extends createGqlResponseClass(DeleteSelfRegistrationOutputPayload){

}


@Service()
@Resolver()
export class DeleteSelfRegistrationResolver {

    @Mutation()
    async deleteSelfRegister(@Arg('input') input: DeleteSelfRegistrationInput): Promise<DeleteSelfRegistrationOutput> {

        const apiResponse = await invocation(input.selfRegistrationId);
        return {
           messages: apiResponse.messages,
           payload: undefined
        };
    }

}
