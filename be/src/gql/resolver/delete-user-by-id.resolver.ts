import {Service} from "typedi";
import {Arg, Field, InputType, Mutation, ObjectType, Resolver} from "type-graphql";
import {invocation} from '../../route/v1/DELETE-user-by-id.route';
import {createGqlResponseClass} from "../util/gql-utils";

@InputType()
export class DeleteUserByIdInput {
   @Field() userId!: number;
}

@ObjectType()
export class DeleteUserByIdOutputPayload {}

@ObjectType()
export class DeleteUserByIdOutput extends createGqlResponseClass(DeleteUserByIdOutputPayload){
}


@Service()
@Resolver()
export class DeleteUserByIdResolver {

    @Mutation()
    async deleteUserById(@Arg('input') input: DeleteUserByIdInput): Promise<DeleteUserByIdOutput> {
        const apiResponse = await invocation(input.userId);
        return {
            messages: apiResponse.messages,
            payload: undefined,
        };
    }

}
