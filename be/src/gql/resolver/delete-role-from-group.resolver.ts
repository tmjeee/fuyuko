import {Service} from "typedi";
import {Arg, Field, InputType, Mutation, ObjectType, Resolver} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";
import {invocation} from '../../route/v1/DELETE-role-from-group.route';

@InputType()
export class DeleteRoleFromGroupInput {
    @Field() groupId!: number;
    @Field() roleName!: string;
}

@ObjectType()
export class DeleteRoleFromGroupOutputPayload {

}

@ObjectType()
export class DeleteRoleFromGroupOutput extends createGqlResponseClass(DeleteRoleFromGroupOutputPayload) {

}


@Service()
@Resolver()
export class DeleteRoleFromGroupResolver {

    @Mutation()
    async deleteRoleFromGroup(@Arg('input') input: DeleteRoleFromGroupInput): Promise<DeleteRoleFromGroupOutput> {
        const apiResponse = await invocation(input.groupId, input.roleName);
        return {
            messages: apiResponse.messages,
            payload: undefined
        };
    }

}
