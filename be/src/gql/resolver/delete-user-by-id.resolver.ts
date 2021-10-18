import 'reflect-metadata';
import {Service} from "typedi";
import {Arg, Field, InputType, Int, Mutation, ObjectType, Resolver} from "type-graphql";
import {invocation} from '../../route/v1/DELETE-user-by-id.route';
import {createGqlResponseClass} from "../util/gql-utils";

@InputType()
export class DeleteUserByIdInput {
   @Field(_ => Int) userId!: number;
}

@ObjectType()
export class DeleteUserByIdOutput extends createGqlResponseClass(){
}


@Service()
@Resolver()
export class DeleteUserByIdResolver {

    @Mutation(_ => DeleteUserByIdOutput)
    async deleteUserById(@Arg('input') input: DeleteUserByIdInput): Promise<DeleteUserByIdOutput> {
        const apiResponse = await invocation(input.userId);
        return {
            messages: apiResponse.messages,
            payload: undefined,
        };
    }

}
