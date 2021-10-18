import 'reflect-metadata';
import {Service} from "typedi";
import {Arg, Field, InputType, Int, Mutation, ObjectType, Resolver} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";
import {invocation} from '../../route/v1/DELETE-role-from-group.route';

@InputType()
export class DeleteRoleFromGroupInput {
    @Field(_ => Int) groupId!: number;
    @Field() roleName!: string;
}

@ObjectType()
export class DeleteRoleFromGroupOutput extends createGqlResponseClass() {
}


@Service()
@Resolver()
export class DeleteRoleFromGroupResolver {

    @Mutation(_ => DeleteRoleFromGroupOutput)
    async deleteRoleFromGroup(@Arg('input') input: DeleteRoleFromGroupInput): Promise<DeleteRoleFromGroupOutput> {
        const apiResponse = await invocation(input.groupId, input.roleName);
        return {
            messages: apiResponse.messages,
            payload: undefined
        };
    }

}
