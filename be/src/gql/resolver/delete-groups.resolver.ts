import {Service} from "typedi";
import {Arg, Field, InputType, Int, ObjectType, Resolver} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";
import {invocation} from '../../route/v1/DELETE-groups.route';

@InputType()
export class DeleteGroupsInput {
    @Field(_ => [Int]) groupIds!: number[];
}

@ObjectType()
export class DeleteGroupsOutputPayload {

}

@ObjectType()
export class DeleteGroupsOutput extends createGqlResponseClass(DeleteGroupsOutputPayload){

}

@Service()
@Resolver()
export class DeleteGroupsResolver {

    async deleteGroups(@Arg('input') input: DeleteGroupsInput): Promise<DeleteGroupsOutput> {
        const groupIds = input.groupIds;
        const apiResponse = await invocation(groupIds);
        return {
            messages: apiResponse.messages,
            payload: undefined
        };
    }
}
