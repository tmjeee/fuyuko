import 'reflect-metadata';
import {Service} from "typedi";
import {Arg, Field, InputType, Int, Mutation, ObjectType, Resolver} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";
import {invocation} from '../../route/v1/DELETE-views.route';

@InputType()
export class DeleteViewsByIdInput {
    @Field(_ => [Int]) viewIds!: number[];
}

@ObjectType()
export class DeleteViewsByIdOutput extends createGqlResponseClass() {
}

@Service()
@Resolver()
export class DeleteViewsByIdResolver {

    @Mutation(_ => DeleteViewsByIdOutput)
    async deleteViewsById(@Arg('input') input: DeleteViewsByIdInput): Promise<DeleteViewsByIdOutput> {
        const apiResponse = await invocation(input.viewIds);
        return {
            messages: apiResponse.messages,
            payload: undefined
        };
    }

}
