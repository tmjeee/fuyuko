import 'reflect-metadata';
import {Service} from "typedi";
import {NonEmptyArray, ObjectType, Query, Resolver, UseMiddleware} from "type-graphql";
import {createGqlResponseClass} from "../util/gql-utils";

export const resolvers = (): NonEmptyArray<Function> => [
    VersionResolver
];

@ObjectType()
export class VersionOutputPayload {
}

@ObjectType()
export class VersionOutput extends createGqlResponseClass(VersionOutputPayload){}

@Service()
@Resolver()
export class VersionResolver {

    @Query(_ => VersionOutput)
    @UseMiddleware([])
    async version(): Promise<VersionOutput> {
        return new VersionOutput();
    }

}
