import 'reflect-metadata';
import {Service} from "typedi";
import {Arg, Field, InputType, Int, Mutation, ObjectType, Resolver} from "type-graphql";
import {invocation} from '../../route/v1/DELETE-self-registration.route';
import {createGqlResponseClass} from "../util/gql-utils";

@InputType()
export class DeleteSelfRegistrationInput {
    @Field(_ => Int) selfRegistrationId!: number;
}

@ObjectType()
export class DeleteSelfRegistrationOutput extends createGqlResponseClass(){
}


@Service()
@Resolver()
export class DeleteSelfRegistrationResolver {

    @Mutation(_ => DeleteSelfRegistrationOutput)
    async deleteSelfRegister(@Arg('input') input: DeleteSelfRegistrationInput): Promise<DeleteSelfRegistrationOutput> {

        const apiResponse = await invocation(input.selfRegistrationId);
        return {
           messages: apiResponse.messages,
           payload: undefined
        };
    }

}
