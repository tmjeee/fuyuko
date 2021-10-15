import {Service} from "typedi";
import {Arg, Field, InputType, Mutation, ObjectType, Resolver} from "type-graphql";
import {invocation} from '../../route/v1/DELETE-user-from-group.route';
import {createGqlResponseClass} from "../util/gql-utils";


@InputType()
export class DeleteUserFromGroupInput {
    @Field() userId!: number;
    @Field() groupId!: number;
}

@ObjectType()
export class DeleteUserFromGroupOutputPayload {

}

@ObjectType()
export class DeleteUserFromGroupOutput extends createGqlResponseClass(DeleteUserFromGroupOutputPayload) {

}

@Service()
@Resolver()
export class DeleteUserFromGroupResolver {

    @Mutation()
    async deleteUserFromGroup(@Arg('input') input: DeleteUserFromGroupInput): Promise<DeleteUserFromGroupOutput> {
        const apiResponse = await invocation(input.userId, input.groupId);
        return {
           messages: apiResponse.messages,
           payload: undefined,
        };
    }

}
