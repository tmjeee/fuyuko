import 'reflect-metadata';
import {Service} from "typedi";
import {Arg, Field, InputType, Int, Mutation, ObjectType, Resolver} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";
import {invocation} from '../../route/v1/DELETE-groups.route';

@InputType()
export class DeleteGroupsInput {
    @Field(_ => [Int]) groupIds!: number[];
}

@ObjectType()
export class DeleteGroupsOutput extends createGqlResponseClass(){
}

@Service()
@Resolver()
export class DeleteGroupsResolver {

    @Mutation(_ => DeleteGroupsOutput)
    async deleteGroups(@Arg('input') input: DeleteGroupsInput): Promise<DeleteGroupsOutput> {
        const groupIds = input.groupIds;
        const apiResponse = await invocation(groupIds);
        return {
            messages: apiResponse.messages,
            payload: undefined
        };
    }
}
