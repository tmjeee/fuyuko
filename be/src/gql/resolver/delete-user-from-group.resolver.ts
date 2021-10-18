import 'reflect-metadata';
import {Service} from "typedi";
import {Arg, Field, InputType, Int, Mutation, ObjectType, Resolver} from "type-graphql";
import {invocation} from '../../route/v1/DELETE-user-from-group.route';
import {createGqlResponseClass} from "../util/gql-utils";


@InputType()
export class DeleteUserFromGroupInput {
    @Field(_ => Int) userId!: number;
    @Field(_ => Int) groupId!: number;
}

@ObjectType()
export class DeleteUserFromGroupOutput extends createGqlResponseClass() {
}

@Service()
@Resolver()
export class DeleteUserFromGroupResolver {

    @Mutation(_ => DeleteUserFromGroupOutput)
    async deleteUserFromGroup(@Arg('input') input: DeleteUserFromGroupInput): Promise<DeleteUserFromGroupOutput> {
        const apiResponse = await invocation(input.userId, input.groupId);
        return {
           messages: apiResponse.messages,
           payload: undefined,
        };
    }

}
